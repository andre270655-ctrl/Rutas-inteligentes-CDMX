export function guardarRuta(nombre, rutaData) {
  const rutas = JSON.parse(
    localStorage.getItem('rutasGuardadas') || '[]'
  )

  rutas.push({
    id: Date.now(),
    nombre,
    fecha: new Date().toISOString(),
    ...rutaData
  })

  localStorage.setItem(
    'rutasGuardadas',
    JSON.stringify(rutas)
  )
}

export function obtenerRutas() {
  return JSON.parse(
    localStorage.getItem('rutasGuardadas') || '[]'
  )
}

export function eliminarRuta(id) {
  const rutas = obtenerRutas().filter(
    r => r.id !== id
  )

  localStorage.setItem(
    'rutasGuardadas',
    JSON.stringify(rutas)
  )
}