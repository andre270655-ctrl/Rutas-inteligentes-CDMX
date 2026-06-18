import { TODAS_LINEAS, TIPOS_TRANSPORTE } from '../data/transporte'

function distKm(a, b) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const h = Math.sin(dLat/2)**2 +
    Math.cos(a.lat*Math.PI/180) * Math.cos(b.lat*Math.PI/180) * Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1-h))
}

export function estacionMasCercana(punto, estaciones) {
  if (!estaciones || estaciones.length === 0) return null
  return estaciones.reduce((closest, est) =>
    distKm(punto, est) < distKm(punto, closest) ? est : closest
  , estaciones[0])
}

async function segmentoOSRM(origen, destino, perfil = 'foot') {
  try {
    const url = `https://router.project-osrm.org/route/v1/${perfil}/${origen.lng},${origen.lat};${destino.lng},${destino.lat}?overview=full&geometries=geojson`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    if (data.code !== 'Ok') return null
    return {
      geom: data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]),
      distKm: (data.routes[0].distance / 1000).toFixed(2),
      durMin: Math.ceil(data.routes[0].duration / 60),
    }
  } catch { return null }
}

// Tipos de transporte público disponibles para evaluar automáticamente (excluye foot/car)
const MODOS_PUBLICOS = Object.entries(TIPOS_TRANSPORTE).filter(
  ([, t]) => t.estaciones?.length > 0
)

// Opción "caminando todo el tramo"
async function opcionCaminando(origen, destino) {
  const seg = await segmentoOSRM(origen, destino, 'foot')
  return {
    modo: 'foot',
    duracionMin: seg?.durMin ?? Math.ceil(distKm(origen, destino) * 12), // ~5km/h fallback
    distanciaKm: parseFloat(seg?.distKm ?? distKm(origen, destino).toFixed(2)),
    geom: seg?.geom ?? [[origen.lat, origen.lng], [destino.lat, destino.lng]],
    detalle: null,
  }
}

// Opción usando un transporte público específico
async function opcionTransportePublico(origen, destino, modoKey, estaciones) {
  const estOrigen  = estacionMasCercana(origen, estaciones)
  const estDestino = estacionMasCercana(destino, estaciones)
  if (!estOrigen || !estDestino || estOrigen.id === estDestino.id) return null

  const [seg1, seg2] = await Promise.all([
    segmentoOSRM(origen, estOrigen, 'foot'),
    segmentoOSRM(estDestino, destino, 'foot'),
  ])

  const lineaOrigen  = TODAS_LINEAS[estOrigen.linea]
  const lineaDestino = TODAS_LINEAS[estDestino.linea]
  const distTransporte = distKm(estOrigen, estDestino)
  const durTransporte = Math.ceil(distTransporte * 2.5) // ~24km/h promedio riel/confinado
  const durCaminata1 = seg1?.durMin ?? Math.ceil(distKm(origen, estOrigen) * 12)
  const durCaminata2 = seg2?.durMin ?? Math.ceil(distKm(estDestino, destino) * 12)
  const duracionMin = durCaminata1 + durTransporte + durCaminata2 + 3 // +3 min espera

  const distTotal = (
    parseFloat(seg1?.distKm ?? distKm(origen, estOrigen).toFixed(2)) +
    distTransporte +
    parseFloat(seg2?.distKm ?? distKm(estDestino, destino).toFixed(2))
  )

  return {
    modo: modoKey,
    duracionMin,
    distanciaKm: distTotal,
    detalle: {
      estOrigen, estDestino, lineaOrigen, lineaDestino,
      geomCaminata1:  seg1?.geom ?? [[origen.lat, origen.lng], [estOrigen.lat, estOrigen.lng]],
      geomTransporte: [[estOrigen.lat, estOrigen.lng], [estDestino.lat, estDestino.lng]],
      geomCaminata2:  seg2?.geom ?? [[estDestino.lat, estDestino.lng], [destino.lat, destino.lng]],
      durCaminata1, durTransporte, durCaminata2,
    },
  }
}

// Evalúa todas las opciones para un tramo y elige la más rápida
async function mejorOpcionTramo(origen, destino) {
  const distDirecta = distKm(origen, destino)

  // Tramos muy cortos (<600m): siempre caminar
  if (distDirecta < 0.6) {
    return opcionCaminando(origen, destino)
  }

  const opciones = await Promise.all([
    opcionCaminando(origen, destino),
    ...MODOS_PUBLICOS.map(([key, tipo]) =>
      opcionTransportePublico(origen, destino, key, tipo.estaciones)
    ),
  ])

  const validas = opciones.filter(Boolean)
  validas.sort((a, b) => a.duracionMin - b.duracionMin)
  return validas[0]
}

// Construye la ruta completa decidiendo automáticamente el transporte por tramo
export async function construirRutaAutomatica(paradas) {
  const tramos = []
  let duracionTotal = 0
  let distanciaTotal = 0
  const modosUsados = new Set()

  for (let i = 0; i < paradas.length - 1; i++) {
    const mejor = await mejorOpcionTramo(paradas[i], paradas[i + 1])
    tramos.push(mejor)
    duracionTotal += mejor.duracionMin
    distanciaTotal += mejor.distanciaKm
    modosUsados.add(mejor.modo)
  }

  return {
    tramos,
    duracionTotal: Math.round(duracionTotal),
    distanciaTotal: distanciaTotal.toFixed(1),
    modosUsados: Array.from(modosUsados),
  }
}
