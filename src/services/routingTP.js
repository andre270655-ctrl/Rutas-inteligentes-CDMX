/**
 * routingTP.js
 * Motor de rutas para transporte público de CDMX
 * Usa Dijkstra sobre un grafo de estaciones con transbordos
 */

import {
  TODAS_ESTACIONES, TODAS_LINEAS,
  ESTACIONES_METRO, ESTACIONES_METROBUS,
  ESTACIONES_TROLEBUS, ESTACIONES_CABLEBUS,
  ESTACIONES_TREN_LIGERO,
} from '../data/transporte'

// ── Constantes de tiempo (minutos) ───────────────────────────
const T_ENTRE_ESTACIONES = 2    // tiempo promedio entre estaciones contiguas
const T_TRANSBORDO       = 4    // penalización por cambiar de línea
const T_CAMINATA_KMH     = 5    // km/h caminando → 12 min/km

// ── Utilidad: distancia Haversine en km ─────────────────────
function distKm(a, b) {
  const R = 6371
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLng = (b.lng - a.lng) * Math.PI / 180
  const h = Math.sin(dLat/2)**2 +
    Math.cos(a.lat*Math.PI/180) * Math.cos(b.lat*Math.PI/180) * Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1-h))
}

function minCaminata(km) {
  return Math.ceil(km / T_CAMINATA_KMH * 60)
}

// ── Grafo: secuencias de estaciones por línea ────────────────
// Cada arreglo es la secuencia ordenada de IDs de estaciones en esa línea.
// Las estaciones que comparten coordenadas (transbordos) se conectan automáticamente.

const SECUENCIAS_LINEA = {
  // Metro
  L1: [
    'm_observatorio','m_tacubaya','m_juanacatlan','m_chapultepec',
    'm_sevilla','m_insurgentes_l1','m_cuauhtemoc','m_balderas',
    'm_salto_agua','m_isabel_cat','m_pino_suarez_l1','m_merced',
    'm_candelaria_l1','m_san_lazaro_l1','m_moctezuma','m_balbuena',
    'm_blvd_puerto_aereo','m_gomez_farías','m_zaragoza','m_pantitlan_l1',
  ],
  L2: [
    'm_cuatro_caminos','m_refineria','m_tacuba_l2','m_cuitlahuac',
    'm_popotla','m_colegio_militar','m_normal','m_san_cosme',
    'm_revolucion','m_hidalgo_l2','m_bellas_artes','m_allende',
    'm_zocalo','m_pino_suarez_l2','m_san_antonio_abad','m_chabacano_l2',
    'm_viaducto','m_xola','m_villa_de_cortes','m_nativitas',
    'm_portales','m_ermita','m_general_anaya','m_tasquena',
  ],
  L3: [
    'm_indios_verdes','m_deportivo_18_mar','m_potrero','m_la_raza',
    'm_tlatelolco','m_guerrero','m_hidalgo_l3','m_juarez',
    'm_balderas_l3','m_niños_heroes','m_hospital_general','m_centro_medico',
    'm_etiopia','m_eugenia','m_division_norte','m_zapata',
    'm_coyoacan','m_viveros','m_miguel_angel','m_copilco','m_universidad',
  ],
  L7: ['m_auditorio','m_polanco','m_san_joaquin','m_tacuba_l7'],
  L9: [
    'm_tacubaya_l9','m_patriotismo','m_chilpancingo',
    'm_centro_medico_l9','m_lazaro_cardenas','m_chabacano_l9',
  ],
  // Metrobús
  MB1: [
    'mb_insurgentes_sur','mb_sonora_norte','mb_hamburgo',
    'mb_reforma','mb_sonora','mb_alvaro_obregon',
    'mb_campeche','mb_iztaccalco',
  ],
  MB2: ['mb2_tacubaya','mb2_baja_california','mb2_sonora_mb2','mb2_heroes'],
  MB7: ['mb7_reforma_lomas','mb7_auditorio'],
  // Trolebús
  TR1: [
    'tr_chapultepec','tr_reforma','tr_hidalgo',
    'tr_bellas_artes','tr_correo_mayor','tr_pino_suarez',
  ],
  // Cablebús
  CB1: ['cb1_cuautepec','cb1_tlalpexco','cb1_la_presa','cb1_indios_verdes'],
  CB2: ['cb2_constitucion','cb2_aculco','cb2_iztapalapa'],
  // Tren Ligero
  TL: [
    'tl_tasquena','tl_xotepingo','tl_perisur',
    'tl_estadio_azteca','tl_huipulco','tl_tlalpan',
  ],
}

// ── Transbordos explícitos (misma estación, distinta línea) ──
// Formato: [idA, idB] — se conectan en ambas direcciones sin costo de caminata
const TRANSBORDOS = [
  // Hidalgo L2 ↔ L3
  ['m_hidalgo_l2',       'm_hidalgo_l3'],
  // Balderas L1 ↔ L3
  ['m_balderas',         'm_balderas_l3'],
  // Pino Suárez L1 ↔ L2
  ['m_pino_suarez_l1',   'm_pino_suarez_l2'],
  // Chabacano L2 ↔ L9
  ['m_chabacano_l2',     'm_chabacano_l9'],
  // Centro Médico L3 ↔ L9
  ['m_centro_medico',    'm_centro_medico_l9'],
  // Tacubaya L1 ↔ L9
  ['m_tacubaya',         'm_tacubaya_l9'],
  // Tacuba L2 ↔ L7
  ['m_tacuba_l2',        'm_tacuba_l7'],
  // Indios Verdes L3 ↔ Cablebús L1
  ['m_indios_verdes',    'cb1_indios_verdes'],
  // Tasqueña L2 ↔ Tren Ligero
  ['m_tasquena',         'tl_tasquena'],
  // Auditorio L7 ↔ Metrobús L7
  ['m_auditorio',        'mb7_auditorio'],
  // Tacubaya L1/L9 ↔ Metrobús L2
  ['m_tacubaya',         'mb2_tacubaya'],
  // Insurgentes Metro ↔ Metrobús L1
  ['m_insurgentes_l1',   'mb_insurgentes_sur'],
  // Pino Suárez L1 ↔ Trolebús
  ['m_pino_suarez_l1',   'tr_pino_suarez'],
  ['m_pino_suarez_l2',   'tr_pino_suarez'],
  // Bellas Artes L2 ↔ Trolebús
  ['m_bellas_artes',     'tr_bellas_artes'],
  // Hidalgo L2/L3 ↔ Trolebús
  ['m_hidalgo_l2',       'tr_hidalgo'],
]

// ── Construir índice de estaciones ───────────────────────────
const estacionPorId = {}
for (const est of TODAS_ESTACIONES) {
  estacionPorId[est.id] = est
}

// ── Construir grafo ──────────────────────────────────────────
function construirGrafo() {
  const grafo = {} // grafo[id] = [{idVecino, costo, linea, tipo}]

  function agregarArista(idA, idB, costo, linea, tipo = 'transporte') {
    if (!grafo[idA]) grafo[idA] = []
    if (!grafo[idB]) grafo[idB] = []
    grafo[idA].push({ id: idB, costo, linea, tipo })
    grafo[idB].push({ id: idA, costo, linea, tipo })
  }

  // Conectar estaciones contiguas dentro de cada línea
  for (const [linea, secuencia] of Object.entries(SECUENCIAS_LINEA)) {
    for (let i = 0; i < secuencia.length - 1; i++) {
      const a = estacionPorId[secuencia[i]]
      const b = estacionPorId[secuencia[i+1]]
      if (!a || !b) continue
      const dist = distKm(a, b)
      // Costo = tiempo estimado entre estaciones (mínimo 1 min, proporcional a distancia)
      const costo = Math.max(1, Math.round(dist * 3)) // ~2 min/km en metro
      agregarArista(a.id, b.id, costo, linea, 'transporte')
    }
  }

  // Conectar transbordos (misma estación diferente línea)
  for (const [idA, idB] of TRANSBORDOS) {
    if (!estacionPorId[idA] || !estacionPorId[idB]) continue
    agregarArista(idA, idB, T_TRANSBORDO, 'transbordo', 'transbordo')
  }

  return grafo
}

const GRAFO = construirGrafo()

// ── Dijkstra ─────────────────────────────────────────────────
function dijkstra(idOrigen, idDestino) {
  const dist   = {}
  const prev   = {}
  const prevArista = {}
  const visitado = new Set()
  const cola   = [] // [{costo, id}] — min-heap simple

  for (const id of Object.keys(GRAFO)) {
    dist[id] = Infinity
  }
  dist[idOrigen] = 0
  cola.push({ costo: 0, id: idOrigen })

  while (cola.length > 0) {
    // Extraer el de menor costo
    cola.sort((a, b) => a.costo - b.costo)
    const { id: actual } = cola.shift()

    if (visitado.has(actual)) continue
    visitado.add(actual)

    if (actual === idDestino) break

    for (const arista of (GRAFO[actual] ?? [])) {
      const nuevoCosto = dist[actual] + arista.costo
      if (nuevoCosto < dist[arista.id]) {
        dist[arista.id] = nuevoCosto
        prev[arista.id] = actual
        prevArista[arista.id] = arista
        cola.push({ costo: nuevoCosto, id: arista.id })
      }
    }
  }

  if (dist[idDestino] === Infinity) return null

  // Reconstruir camino
  const camino = []
  let nodo = idDestino
  while (nodo) {
    camino.unshift({ id: nodo, arista: prevArista[nodo] ?? null })
    nodo = prev[nodo]
  }

  return { camino, costoTotal: dist[idDestino] }
}

// ── Encontrar estación más cercana a un punto ────────────────
function estacionMasCercana(punto, estaciones = TODAS_ESTACIONES) {
  let mejor = null
  let mejorDist = Infinity
  for (const est of estaciones) {
    const d = distKm(punto, est)
    if (d < mejorDist) { mejorDist = d; mejor = est }
  }
  return { estacion: mejor, distKm: mejorDist }
}

// ── Función principal: encontrar mejor ruta TP ───────────────
/**
 * Encuentra la mejor ruta de transporte público entre origen y destino.
 * Devuelve instrucciones paso a paso y geometría para el mapa.
 */
export async function encontrarRutaTP(origen, destino) {
  // 1. Encontrar estaciones más cercanas al origen y destino
  const { estacion: estOrigen, distKm: distOrigen } = estacionMasCercana(origen)
  const { estacion: estDestino, distKm: distDestino } = estacionMasCercana(destino)

  if (!estOrigen || !estDestino) throw new Error('No se encontraron estaciones cercanas')

  // 2. ¿Vale la pena el transporte? Si el destino está a <800m, mejor caminar
  const distDirecta = distKm(origen, destino)
  if (distDirecta < 0.8) {
    return construirRutaCaminata(origen, destino, distDirecta)
  }

  // 3. Ejecutar Dijkstra
  const resultado = dijkstra(estOrigen.id, estDestino.id)

  if (!resultado) {
    // Sin ruta en grafo → caminata
    return construirRutaCaminata(origen, destino, distDirecta)
  }

  // 4. Construir instrucciones desde el camino
  const instrucciones = construirInstrucciones(resultado.camino, origen, destino, estOrigen, estDestino, distOrigen, distDestino)

  return instrucciones
}

// ── Construir instrucciones paso a paso ──────────────────────
function construirInstrucciones(camino, origen, destino, estOrigen, estDestino, distOrigen, distDestino) {
  const pasos = []
  let tiempoTotal = 0

  // Paso 1: caminar al origen del transporte
  const minOrigen = minCaminata(distOrigen)
  pasos.push({
    tipo: 'caminata',
    descripcion: `Camina ${minOrigen} min hasta ${estOrigen.nombre}`,
    distanciaKm: distOrigen.toFixed(2),
    duracionMin: minOrigen,
    desde: { lat: origen.lat, lng: origen.lng },
    hasta: { lat: estOrigen.lat, lng: estOrigen.lng },
    emoji: '🚶',
  })
  tiempoTotal += minOrigen

  // Agrupar camino por segmentos de misma línea
  let segmentoActual = null
  const segmentos = []

  for (let i = 1; i < camino.length; i++) {
    const { id, arista } = camino[i]
    const est = estacionPorId[id]
    if (!est || !arista) continue

    if (arista.tipo === 'transbordo') {
      // Cerrar segmento anterior
      if (segmentoActual) { segmentos.push(segmentoActual); segmentoActual = null }
      const estAnterior = estacionPorId[camino[i-1].id]
      pasos.push({
        tipo: 'transbordo',
        descripcion: `Transbordo en ${estAnterior?.nombre ?? ''}`,
        duracionMin: T_TRANSBORDO,
        desde: { lat: estAnterior?.lat, lng: estAnterior?.lng },
        hasta: { lat: est.lat, lng: est.lng },
        emoji: '🔄',
      })
      tiempoTotal += T_TRANSBORDO
      continue
    }

    if (!segmentoActual || segmentoActual.linea !== arista.linea) {
      if (segmentoActual) segmentos.push(segmentoActual)
      const estInicio = estacionPorId[camino[i-1].id]
      segmentoActual = {
        linea: arista.linea,
        lineaInfo: TODAS_LINEAS[arista.linea],
        estaciones: [estInicio, est],
        duracion: arista.costo,
      }
    } else {
      segmentoActual.estaciones.push(est)
      segmentoActual.duracion += arista.costo
    }
  }
  if (segmentoActual) segmentos.push(segmentoActual)

  // Convertir segmentos en pasos
  for (const seg of segmentos) {
    const primeraEst = seg.estaciones[0]
    const ultimaEst  = seg.estaciones[seg.estaciones.length - 1]
    const nParadas   = seg.estaciones.length - 1
    const linea      = seg.lineaInfo

    pasos.push({
      tipo: 'transporte',
      linea: seg.linea,
      lineaInfo: linea,
      descripcion: `Toma ${linea?.nombre ?? seg.linea} de ${primeraEst?.nombre} hasta ${ultimaEst?.nombre}`,
      detalle: `${nParadas} parada${nParadas !== 1 ? 's' : ''}`,
      duracionMin: seg.duracion,
      estaciones: seg.estaciones,
      geom: seg.estaciones.map(e => [e.lat, e.lng]),
      emoji: lineaEmoji(seg.linea),
      color: linea?.color ?? '#666',
    })
    tiempoTotal += seg.duracion
  }

  // Último paso: caminar al destino
  const minDestino = minCaminata(distDestino)
  pasos.push({
    tipo: 'caminata',
    descripcion: `Camina ${minDestino} min hasta tu destino`,
    distanciaKm: distDestino.toFixed(2),
    duracionMin: minDestino,
    desde: { lat: estDestino.lat, lng: estDestino.lng },
    hasta: { lat: destino.lat, lng: destino.lng },
    emoji: '🚶',
  })
  tiempoTotal += minDestino

  // Construir geometría completa para el mapa
  const geomTotal = construirGeom(pasos)

  return {
    pasos,
    tiempoTotal,
    distanciaKm: (distOrigen + distDestino).toFixed(1),
    estOrigen,
    estDestino,
    geom: geomTotal,
    esCaminata: false,
  }
}

// ── Ruta de caminata simple ──────────────────────────────────
function construirRutaCaminata(origen, destino, dist) {
  const duracion = minCaminata(dist)
  return {
    pasos: [{
      tipo: 'caminata',
      descripcion: `Camina ${duracion} min (${(dist*1000).toFixed(0)} m)`,
      distanciaKm: dist.toFixed(2),
      duracionMin: duracion,
      desde: origen,
      hasta: destino,
      emoji: '🚶',
    }],
    tiempoTotal: duracion,
    distanciaKm: dist.toFixed(2),
    geom: [[origen.lat, origen.lng], [destino.lat, destino.lng]],
    esCaminata: true,
  }
}

// ── Geometría para el mapa ───────────────────────────────────
function construirGeom(pasos) {
  const segmentos = []
  for (const paso of pasos) {
    if (paso.tipo === 'transporte' && paso.geom) {
      segmentos.push({ coords: paso.geom, color: paso.color, linea: paso.linea })
    } else if (paso.tipo === 'caminata' && paso.desde && paso.hasta) {
      segmentos.push({
        coords: [[paso.desde.lat, paso.desde.lng], [paso.hasta.lat, paso.hasta.lng]],
        color: '#888',
        dashArray: '6 6',
        linea: 'caminata',
      })
    } else if (paso.tipo === 'transbordo' && paso.desde && paso.hasta) {
      segmentos.push({
        coords: [[paso.desde.lat, paso.desde.lng], [paso.hasta.lat, paso.hasta.lng]],
        color: '#aaa',
        dashArray: '3 3',
        linea: 'transbordo',
      })
    }
  }
  return segmentos
}

// ── Emoji por tipo de línea ──────────────────────────────────
function lineaEmoji(linea) {
  if (linea?.startsWith('L'))  return '🚇'
  if (linea?.startsWith('MB')) return '🚌'
  if (linea?.startsWith('TR')) return '🚎'
  if (linea?.startsWith('CB')) return '🚡'
  if (linea?.startsWith('TL')) return '🚋'
  return '🚍'
}

// ── API de comparación: todas las opciones ───────────────────
/**
 * Compara ir a pie vs todas las líneas disponibles
 * y devuelve las mejores opciones ordenadas por tiempo.
 */
export function compararOpciones(origen, destino) {
  const distDirecta = distKm(origen, destino)
  const opciones = []

  // Caminata directa
  opciones.push({
    modo: 'foot',
    emoji: '🚶',
    label: 'A pie',
    duracionMin: minCaminata(distDirecta),
    distanciaKm: distDirecta.toFixed(2),
    costo: 0,
    descripcion: `${minCaminata(distDirecta)} min caminando`,
  })

  // Por cada tipo de transporte, calcular si vale la pena
  const tipos = [
    { key: 'metro',    emoji: '🚇', label: 'Metro',       costo: 5,  estaciones: ESTACIONES_METRO },
    { key: 'metrobus', emoji: '🚌', label: 'Metrobús',    costo: 6,  estaciones: ESTACIONES_METROBUS },
    { key: 'trolebus', emoji: '🚎', label: 'Trolebús',    costo: 5,  estaciones: ESTACIONES_TROLEBUS },
    { key: 'cablebus', emoji: '🚡', label: 'Cablebús',    costo: 7,  estaciones: ESTACIONES_CABLEBUS },
    { key: 'tren',     emoji: '🚋', label: 'Tren Ligero', costo: 5,  estaciones: ESTACIONES_TREN_LIGERO },
  ]

  for (const tipo of tipos) {
    const { estacion: eO, distKm: dO } = estacionMasCercana(origen, tipo.estaciones)
    const { estacion: eD, distKm: dD } = estacionMasCercana(destino, tipo.estaciones)
    if (!eO || !eD) continue

    const res = dijkstra(eO.id, eD.id)
    if (!res) continue

    const tiempoTransporte = res.costoTotal
    const tiempoCaminata   = minCaminata(dO) + minCaminata(dD)
    const tiempoTotal      = tiempoTransporte + tiempoCaminata

    // Solo sugerir si es más rápido que caminar
    if (tiempoTotal < minCaminata(distDirecta)) {
      opciones.push({
        modo: tipo.key,
        emoji: tipo.emoji,
        label: tipo.label,
        duracionMin: tiempoTotal,
        distanciaKm: distDirecta.toFixed(2),
        costo: tipo.costo,
        descripcion: `${tiempoTotal} min · $${tipo.costo}`,
        estOrigen: eO,
        estDestino: eD,
      })
    }
  }

  // Ordenar por tiempo
  opciones.sort((a, b) => a.duracionMin - b.duracionMin)
  return opciones
}
