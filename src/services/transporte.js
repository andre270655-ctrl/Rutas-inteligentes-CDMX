import { TODAS_LINEAS } from '../data/transporte'

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

async function segmentoOSRM(origen, destino) {
  try {
    const url = `https://router.project-osrm.org/route/v1/foot/${origen.lng},${origen.lat};${destino.lng},${destino.lat}?overview=full&geometries=geojson`
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

export async function construirRutaTP(paradas, estaciones) {
  const segmentos = []
  let duracionTotal = 0
  let distanciaTotal = 0

  for (let i = 0; i < paradas.length - 1; i++) {
    const origen  = paradas[i]
    const destino = paradas[i + 1]

    const estOrigen  = estacionMasCercana(origen,  estaciones)
    const estDestino = estacionMasCercana(destino, estaciones)

    const [seg1, seg2] = await Promise.all([
      segmentoOSRM(origen, estOrigen),
      segmentoOSRM(estDestino, destino),
    ])

    const lineaOrigen  = TODAS_LINEAS[estOrigen.linea]
    const lineaDestino = TODAS_LINEAS[estDestino.linea]
    const durTP = Math.ceil(distKm(estOrigen, estDestino) * 3)
    const dist  = (parseFloat(seg1?.distKm ?? 0) + distKm(estOrigen, estDestino) + parseFloat(seg2?.distKm ?? 0)).toFixed(1)

    segmentos.push({
      estOrigen, estDestino, lineaOrigen, lineaDestino,
      geomCaminata1:  seg1?.geom ?? [[origen.lat, origen.lng], [estOrigen.lat, estOrigen.lng]],
      geomTransporte: [[estOrigen.lat, estOrigen.lng], [estDestino.lat, estDestino.lng]],
      geomCaminata2:  seg2?.geom ?? [[estDestino.lat, estDestino.lng], [destino.lat, destino.lng]],
      durCaminata1: seg1?.durMin ?? 5,
      durTransporte: durTP,
      durCaminata2: seg2?.durMin ?? 5,
      distTotal: dist,
    })

    duracionTotal  += (seg1?.durMin ?? 5) + durTP + (seg2?.durMin ?? 5)
    distanciaTotal += parseFloat(dist)
  }

  return { segmentos, duracionTotal, distanciaTotal: distanciaTotal.toFixed(1) }
}
