// ── Estaciones de transporte público de CDMX ──────────────────
// Colores oficiales por línea

export const LINEAS_METRO = {
  L1:  { nombre: 'Línea 1',  color: '#E8008A', textColor: 'white' },
  L2:  { nombre: 'Línea 2',  color: '#005BA5', textColor: 'white' },
  L3:  { nombre: 'Línea 3',  color: '#91C02A', textColor: 'white' },
  L4:  { nombre: 'Línea 4',  color: '#8B4A9F', textColor: 'white' },
  L5:  { nombre: 'Línea 5',  color: '#F7A800', textColor: 'white' },
  L6:  { nombre: 'Línea 6',  color: '#DA0000', textColor: 'white' },
  L7:  { nombre: 'Línea 7',  color: '#E87722', textColor: 'white' },
  L8:  { nombre: 'Línea 8',  color: '#009D57', textColor: 'white' },
  L9:  { nombre: 'Línea 9',  color: '#4B3A2A', textColor: 'white' },
  LA:  { nombre: 'Línea A',  color: '#9F1F63', textColor: 'white' },
  LB:  { nombre: 'Línea B',  color: '#B5B5B5', textColor: 'black' },
  L12: { nombre: 'Línea 12', color: '#C8A400', textColor: 'black' },
}

export const ESTACIONES_METRO = [
  // Línea 1 (Observatorio ↔ Pantitlán)
  { id: 'm_observatorio',      nombre: 'Observatorio',       linea: 'L1', lat: 19.40105, lng: -99.20081 },
  { id: 'm_tacubaya',          nombre: 'Tacubaya',           linea: 'L1', lat: 19.40218, lng: -99.18431 },
  { id: 'm_juanacatlan',       nombre: 'Juanacatlán',        linea: 'L1', lat: 19.40832, lng: -99.17855 },
  { id: 'm_chapultepec',       nombre: 'Chapultepec',        linea: 'L1', lat: 19.41738, lng: -99.17698 },
  { id: 'm_sevilla',           nombre: 'Sevilla',            linea: 'L1', lat: 19.41946, lng: -99.16755 },
  { id: 'm_insurgentes_l1',    nombre: 'Insurgentes',        linea: 'L1', lat: 19.42267, lng: -99.15978 },
  { id: 'm_cuauhtemoc',        nombre: 'Cuauhtémoc',         linea: 'L1', lat: 19.43010, lng: -99.15281 },
  { id: 'm_balderas',          nombre: 'Balderas',           linea: 'L1', lat: 19.43184, lng: -99.14696 },
  { id: 'm_salto_agua',        nombre: 'Salto del Agua',     linea: 'L1', lat: 19.42774, lng: -99.14082 },
  { id: 'm_isabel_cat',        nombre: 'Isabel la Católica', linea: 'L1', lat: 19.43173, lng: -99.13519 },
  { id: 'm_pino_suarez_l1',    nombre: 'Pino Suárez',        linea: 'L1', lat: 19.42567, lng: -99.13168 },
  { id: 'm_merced',            nombre: 'Merced',             linea: 'L1', lat: 19.42470, lng: -99.12315 },
  { id: 'm_candelaria_l1',     nombre: 'Candelaria',         linea: 'L1', lat: 19.43114, lng: -99.11609 },
  { id: 'm_san_lazaro_l1',     nombre: 'San Lázaro',         linea: 'L1', lat: 19.43267, lng: -99.11148 },
  { id: 'm_moctezuma',         nombre: 'Moctezuma',          linea: 'L1', lat: 19.43167, lng: -99.09682 },
  { id: 'm_balbuena',          nombre: 'Balbuena',           linea: 'L1', lat: 19.43013, lng: -99.08760 },
  { id: 'm_blvd_puerto_aereo', nombre: 'Blvd. Puerto Aéreo', linea: 'L1', lat: 19.43088, lng: -99.07927 },
  { id: 'm_gomez_farías',      nombre: 'Gómez Farías',       linea: 'L1', lat: 19.41940, lng: -99.07349 },
  { id: 'm_zaragoza',          nombre: 'Zaragoza',           linea: 'L1', lat: 19.41448, lng: -99.06718 },
  { id: 'm_pantitlan_l1',      nombre: 'Pantitlán',          linea: 'L1', lat: 19.41553, lng: -99.05702 },

  // Línea 2 (Cuatro Caminos ↔ Tasqueña)
  { id: 'm_cuatro_caminos',    nombre: 'Cuatro Caminos',     linea: 'L2', lat: 19.48256, lng: -99.17882 },
  { id: 'm_refineria',         nombre: 'Refinería',          linea: 'L2', lat: 19.47614, lng: -99.17414 },
  { id: 'm_tacuba_l2',         nombre: 'Tacuba',             linea: 'L2', lat: 19.46256, lng: -99.17175 },
  { id: 'm_cuitlahuac',        nombre: 'Cuitláhuac',         linea: 'L2', lat: 19.46162, lng: -99.16413 },
  { id: 'm_popotla',           nombre: 'Popotla',            linea: 'L2', lat: 19.45566, lng: -99.15857 },
  { id: 'm_colegio_militar',   nombre: 'Colegio Militar',    linea: 'L2', lat: 19.45107, lng: -99.15322 },
  { id: 'm_normal',            nombre: 'Normal',             linea: 'L2', lat: 19.44678, lng: -99.15035 },
  { id: 'm_san_cosme',         nombre: 'San Cosme',          linea: 'L2', lat: 19.44322, lng: -99.15548 },
  { id: 'm_revolucion',        nombre: 'Revolución',         linea: 'L2', lat: 19.43920, lng: -99.15431 },
  { id: 'm_hidalgo_l2',        nombre: 'Hidalgo',            linea: 'L2', lat: 19.43779, lng: -99.14843 },
  { id: 'm_bellas_artes',      nombre: 'Bellas Artes',       linea: 'L2', lat: 19.43659, lng: -99.14140 },
  { id: 'm_allende',           nombre: 'Allende',            linea: 'L2', lat: 19.43585, lng: -99.13450 },
  { id: 'm_zocalo',            nombre: 'Zócalo',             linea: 'L2', lat: 19.43295, lng: -99.13279 },
  { id: 'm_pino_suarez_l2',    nombre: 'Pino Suárez',        linea: 'L2', lat: 19.42567, lng: -99.13168 },
  { id: 'm_san_antonio_abad',  nombre: 'San Antonio Abad',   linea: 'L2', lat: 19.41960, lng: -99.13163 },
  { id: 'm_chabacano_l2',      nombre: 'Chabacano',          linea: 'L2', lat: 19.41419, lng: -99.13425 },
  { id: 'm_viaducto',          nombre: 'Viaducto',           linea: 'L2', lat: 19.40322, lng: -99.13625 },
  { id: 'm_xola',              nombre: 'Xola',               linea: 'L2', lat: 19.39601, lng: -99.14010 },
  { id: 'm_villa_de_cortes',   nombre: 'Villa de Cortés',    linea: 'L2', lat: 19.38784, lng: -99.14348 },
  { id: 'm_nativitas',         nombre: 'Nativitas',          linea: 'L2', lat: 19.37963, lng: -99.14462 },
  { id: 'm_portales',          nombre: 'Portales',           linea: 'L2', lat: 19.37133, lng: -99.14546 },
  { id: 'm_ermita',            nombre: 'Ermita',             linea: 'L2', lat: 19.36275, lng: -99.14566 },
  { id: 'm_general_anaya',     nombre: 'General Anaya',      linea: 'L2', lat: 19.35417, lng: -99.15146 },
  { id: 'm_tasquena',          nombre: 'Tasqueña',           linea: 'L2', lat: 19.34599, lng: -99.15199 },

  // Línea 3 (Indios Verdes ↔ Universidad)
  { id: 'm_indios_verdes',     nombre: 'Indios Verdes',      linea: 'L3', lat: 19.50145, lng: -99.12567 },
  { id: 'm_deportivo_18_mar',  nombre: 'Deportivo 18 Marzo', linea: 'L3', lat: 19.48877, lng: -99.12567 },
  { id: 'm_potrero',           nombre: 'Potrero',            linea: 'L3', lat: 19.47602, lng: -99.12567 },
  { id: 'm_la_raza',           nombre: 'La Raza',            linea: 'L3', lat: 19.46640, lng: -99.12567 },
  { id: 'm_tlatelolco',        nombre: 'Tlatelolco',         linea: 'L3', lat: 19.45387, lng: -99.13753 },
  { id: 'm_guerrero',          nombre: 'Guerrero',           linea: 'L3', lat: 19.44658, lng: -99.14635 },
  { id: 'm_hidalgo_l3',        nombre: 'Hidalgo',            linea: 'L3', lat: 19.43779, lng: -99.14843 },
  { id: 'm_juarez',            nombre: 'Juárez',             linea: 'L3', lat: 19.43234, lng: -99.14571 },
  { id: 'm_balderas_l3',       nombre: 'Balderas',           linea: 'L3', lat: 19.43184, lng: -99.14696 },
  { id: 'm_niños_heroes',      nombre: 'Niños Héroes',       linea: 'L3', lat: 19.42377, lng: -99.14818 },
  { id: 'm_hospital_general',  nombre: 'Hospital General',   linea: 'L3', lat: 19.41623, lng: -99.15009 },
  { id: 'm_centro_medico',     nombre: 'Centro Médico',      linea: 'L3', lat: 19.40945, lng: -99.15282 },
  { id: 'm_etiopia',           nombre: 'Etiopía',            linea: 'L3', lat: 19.40287, lng: -99.15518 },
  { id: 'm_eugenia',           nombre: 'Eugenia',            linea: 'L3', lat: 19.39471, lng: -99.15718 },
  { id: 'm_division_norte',    nombre: 'División del Norte', linea: 'L3', lat: 19.38618, lng: -99.15898 },
  { id: 'm_zapata',            nombre: 'Zapata',             linea: 'L3', lat: 19.37652, lng: -99.16261 },
  { id: 'm_coyoacan',          nombre: 'Coyoacán',           linea: 'L3', lat: 19.36580, lng: -99.16524 },
  { id: 'm_viveros',           nombre: 'Viveros',            linea: 'L3', lat: 19.35603, lng: -99.16627 },
  { id: 'm_miguel_angel',      nombre: 'Miguel Ángel de Quevedo', linea: 'L3', lat: 19.34700, lng: -99.17073 },
  { id: 'm_copilco',           nombre: 'Copilco',            linea: 'L3', lat: 19.33684, lng: -99.17474 },
  { id: 'm_universidad',       nombre: 'Universidad',        linea: 'L3', lat: 19.32474, lng: -99.18123 },

  // Línea 7 (El Rosario ↔ Barranca del Muerto) — zona turística importante
  { id: 'm_auditorio',         nombre: 'Auditorio',          linea: 'L7', lat: 19.43026, lng: -99.19117 },
  { id: 'm_polanco',           nombre: 'Polanco',            linea: 'L7', lat: 19.43473, lng: -99.19617 },
  { id: 'm_san_joaquin',       nombre: 'San Joaquín',        linea: 'L7', lat: 19.44034, lng: -99.19870 },
  { id: 'm_tacuba_l7',         nombre: 'Tacuba',             linea: 'L7', lat: 19.46256, lng: -99.17175 },

  // Línea 9 (Tacubaya ↔ Pantitlán) — zona sur
  { id: 'm_tacubaya_l9',       nombre: 'Tacubaya',           linea: 'L9', lat: 19.40218, lng: -99.18431 },
  { id: 'm_patriotismo',       nombre: 'Patriotismo',        linea: 'L9', lat: 19.40316, lng: -99.17395 },
  { id: 'm_chilpancingo',      nombre: 'Chilpancingo',       linea: 'L9', lat: 19.40467, lng: -99.16479 },
  { id: 'm_centro_medico_l9',  nombre: 'Centro Médico',      linea: 'L9', lat: 19.40945, lng: -99.15282 },
  { id: 'm_lazaro_cardenas',   nombre: 'Lázaro Cárdenas',    linea: 'L9', lat: 19.41534, lng: -99.14262 },
  { id: 'm_chabacano_l9',      nombre: 'Chabacano',          linea: 'L9', lat: 19.41419, lng: -99.13425 },
]

export const LINEAS_METROBUS = {
  MB1: { nombre: 'Metrobús L1', color: '#C1282C', textColor: 'white' },
  MB2: { nombre: 'Metrobús L2', color: '#F7941E', textColor: 'white' },
  MB3: { nombre: 'Metrobús L3', color: '#6D398B', textColor: 'white' },
  MB4: { nombre: 'Metrobús L4', color: '#009A49', textColor: 'white' },
  MB7: { nombre: 'Metrobús L7', color: '#0070C0', textColor: 'white' },
}

export const ESTACIONES_METROBUS = [
  // L1 Insurgentes (Indios Verdes ↔ El Caminero) — estaciones clave
  { id: 'mb_insurgentes_sur',  nombre: 'Insurgentes Sur',    linea: 'MB1', lat: 19.42267, lng: -99.15978 },
  { id: 'mb_reforma',          nombre: 'Reforma',            linea: 'MB1', lat: 19.43413, lng: -99.15338 },
  { id: 'mb_hamburgo',         nombre: 'Hamburgo',           linea: 'MB1', lat: 19.42879, lng: -99.16122 },
  { id: 'mb_sonora',           nombre: 'Sonora',             linea: 'MB1', lat: 19.41918, lng: -99.16349 },
  { id: 'mb_alvaro_obregon',   nombre: 'Álvaro Obregón',     linea: 'MB1', lat: 19.41506, lng: -99.16527 },
  { id: 'mb_iztaccalco',       nombre: 'Iztaccalco',         linea: 'MB1', lat: 19.40944, lng: -99.16607 },
  { id: 'mb_campeche',         nombre: 'Campeche',           linea: 'MB1', lat: 19.41227, lng: -99.16412 },
  { id: 'mb_sonora_norte',     nombre: 'Sonora Norte',       linea: 'MB1', lat: 19.42140, lng: -99.16239 },
  // L2 Tacubaya ↔ Tepalcates
  { id: 'mb2_tacubaya',        nombre: 'Tacubaya',           linea: 'MB2', lat: 19.40218, lng: -99.18431 },
  { id: 'mb2_baja_california', nombre: 'Baja California',    linea: 'MB2', lat: 19.40456, lng: -99.15981 },
  { id: 'mb2_sonora_mb2',      nombre: 'Sonora',             linea: 'MB2', lat: 19.41918, lng: -99.16349 },
  { id: 'mb2_heroes',          nombre: 'Héroes',             linea: 'MB2', lat: 19.42900, lng: -99.13100 },
  // L7 Periferico ↔ Indios Verdes
  { id: 'mb7_auditorio',       nombre: 'Auditorio',          linea: 'MB7', lat: 19.43026, lng: -99.19117 },
  { id: 'mb7_reforma_lomas',   nombre: 'Reforma-Lomas',      linea: 'MB7', lat: 19.43800, lng: -99.20500 },
]

export const LINEAS_TROLEBUS = {
  TR1: { nombre: 'Trolebús L1', color: '#005EB8', textColor: 'white' },
}

export const ESTACIONES_TROLEBUS = [
  { id: 'tr_chapultepec',      nombre: 'Chapultepec',        linea: 'TR1', lat: 19.42616, lng: -99.17606 },
  { id: 'tr_reforma',          nombre: 'Reforma',            linea: 'TR1', lat: 19.43413, lng: -99.16000 },
  { id: 'tr_hidalgo',          nombre: 'Hidalgo',            linea: 'TR1', lat: 19.43779, lng: -99.14843 },
  { id: 'tr_bellas_artes',     nombre: 'Bellas Artes',       linea: 'TR1', lat: 19.43540, lng: -99.14140 },
  { id: 'tr_correo_mayor',     nombre: 'Correo Mayor',       linea: 'TR1', lat: 19.43200, lng: -99.13400 },
  { id: 'tr_pino_suarez',      nombre: 'Pino Suárez',        linea: 'TR1', lat: 19.42567, lng: -99.13168 },
]

export const LINEAS_CABLEBÚS = {
  CB1: { nombre: 'Cablebús L1', color: '#E8441A', textColor: 'white' },
  CB2: { nombre: 'Cablebús L2', color: '#00A651', textColor: 'white' },
}

export const ESTACIONES_CABLEBUS = [
  // L1 Cuautepec
  { id: 'cb1_cuautepec',       nombre: 'Cuautepec',          linea: 'CB1', lat: 19.53650, lng: -99.13050 },
  { id: 'cb1_tlalpexco',       nombre: 'Tlalpexco',          linea: 'CB1', lat: 19.52800, lng: -99.12900 },
  { id: 'cb1_la_presa',        nombre: 'La Presa',           linea: 'CB1', lat: 19.52000, lng: -99.12750 },
  { id: 'cb1_indios_verdes',   nombre: 'Indios Verdes',      linea: 'CB1', lat: 19.50145, lng: -99.12567 },
  // L2 Iztapalapa
  { id: 'cb2_constitucion',    nombre: 'Constitución 1917',  linea: 'CB2', lat: 19.36400, lng: -99.00600 },
  { id: 'cb2_aculco',          nombre: 'Aculco',             linea: 'CB2', lat: 19.37100, lng: -99.01300 },
  { id: 'cb2_iztapalapa',      nombre: 'Iztapalapa',         linea: 'CB2', lat: 19.37800, lng: -99.01900 },
]

export const LINEAS_TREN_LIGERO = {
  TL: { nombre: 'Tren Ligero', color: '#0067A5', textColor: 'white' },
}

export const ESTACIONES_TREN_LIGERO = [
  { id: 'tl_tasquena',         nombre: 'Tasqueña',           linea: 'TL', lat: 19.34599, lng: -99.15199 },
  { id: 'tl_xotepingo',        nombre: 'Xotepingo',          linea: 'TL', lat: 19.33400, lng: -99.15700 },
  { id: 'tl_perisur',          nombre: 'Perisur',            linea: 'TL', lat: 19.30600, lng: -99.18200 },
  { id: 'tl_estadio_azteca',   nombre: 'Estadio Azteca',     linea: 'TL', lat: 19.30300, lng: -99.15000 },
  { id: 'tl_huipulco',         nombre: 'Huipulco',           linea: 'TL', lat: 19.29700, lng: -99.15400 },
  { id: 'tl_tlalpan',          nombre: 'Tlalpan',            linea: 'TL', lat: 19.28500, lng: -99.16100 },
]

// ── Todas las estaciones unificadas ──────────────────────────
export const TODAS_ESTACIONES = [
  ...ESTACIONES_METRO,
  ...ESTACIONES_METROBUS,
  ...ESTACIONES_TROLEBUS,
  ...ESTACIONES_CABLEBUS,
  ...ESTACIONES_TREN_LIGERO,
]

// ── Catálogo unificado de líneas ──────────────────────────────
export const TODAS_LINEAS = {
  ...LINEAS_METRO,
  ...LINEAS_METROBUS,
  ...LINEAS_TROLEBUS,
  ...LINEAS_CABLEBÚS,
  ...LINEAS_TREN_LIGERO,
}

// ── Tipos de transporte para el selector ─────────────────────
export const TIPOS_TRANSPORTE = {
  foot: { label: 'A pie',         emoji: '🚶', estaciones: [] },
  car:  { label: 'En coche',      emoji: '🚗', estaciones: [] },
  metro:    { label: 'Metro',     emoji: '🚇', estaciones: ESTACIONES_METRO,       lineas: LINEAS_METRO },
  metrobus: { label: 'Metrobús',  emoji: '🚌', estaciones: ESTACIONES_METROBUS,    lineas: LINEAS_METROBUS },
  trolebus: { label: 'Trolebús',  emoji: '🚎', estaciones: ESTACIONES_TROLEBUS,    lineas: LINEAS_TROLEBUS },
  cablebus: { label: 'Cablebús',  emoji: '🚡', estaciones: ESTACIONES_CABLEBUS,    lineas: LINEAS_CABLEBÚS },
  tren:     { label: 'Tren Ligero',emoji: '🚋', estaciones: ESTACIONES_TREN_LIGERO, lineas: LINEAS_TREN_LIGERO },
}

// ── Costo por tipo de transporte (un solo cobro por tipo) ────
export const COSTOS_TRANSPORTE = {
  foot:     0,
  car:      0,
  metro:    5,
  metrobus: 6,
  trolebus: 5,
  cablebus: 7,
  tren:     5,
}
