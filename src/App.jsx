import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import MapView from './components/MapView'
import { lugares as fallbackLugares, CATEGORIAS, CATEGORIA_FALLBACK } from './data/lugares'
import { TIPOS_TRANSPORTE, COSTOS_TRANSPORTE } from './data/transporte'
import { obtenerLugares } from './services/lugares'
import { construirRutaTP } from './services/transporte'
import useLocation from './hooks/useLocation'

async function fetchRutaOSRM(paradas, modo) {
  const perfil = modo === 'car' ? 'car' : 'foot'
  const coords = paradas.map(p => `${p.lng},${p.lat}`).join(';')
  const url = `https://router.project-osrm.org/route/v1/${perfil}/${coords}?overview=full&geometries=geojson&steps=false`
  const res = await fetch(url)
  if (!res.ok) throw new Error('OSRM no disponible')
  const data = await res.json()
  if (data.code !== 'Ok') throw new Error('Sin ruta disponible')
  return {
    geom: data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    distanciaKm: (data.routes[0].distance / 1000).toFixed(1),
    duracionMin: Math.ceil(data.routes[0].duration / 60),
  }
}

export default function App() {
  const userLocation = useLocation()

  const [allLugares, setAllLugares]     = useState(fallbackLugares)
  const [categoriasActivas, setCategoriasActivas] = useState(Object.keys(CATEGORIAS))
  const [horas, setHoras]               = useState(4)
  const [presupuesto, setPresupuesto]   = useState(500)
  const [modoTransporte, setModoTransporte] = useState('foot')
  const [modoRuta, setModoRuta]         = useState('auto')
  const [lugaresSeleccionados, setLugaresSeleccionados] = useState([])

  const [ruta, setRuta]             = useState(null)
  const [rutaGeom, setRutaGeom]     = useState(null)
  const [rutaSegmentos, setRutaSegmentos] = useState(null) // para transporte público
  const [rutaInfo, setRutaInfo]     = useState(null)
  const [cargandoRuta, setCargandoRuta] = useState(false)
  const [error, setError]           = useState(null)
  const [lugarActivo, setLugarActivo] = useState(null)
  const [supabaseVivo, setSupabaseVivo] = useState(false)

  useEffect(() => {
    async function cargarLugares() {
      try {
        const data = await obtenerLugares()
        setAllLugares(data)
        setSupabaseVivo(true)
      } catch (err) {
        console.error(err)
        setSupabaseVivo(false)
        setAllLugares(fallbackLugares)
      }
    }
    cargarLugares()
  }, [])

  // Recalcular al cambiar modo de transporte
  useEffect(() => {
    if (ruta?.ruta?.length > 1) calcularGeometria(ruta.ruta, modoTransporte)
  }, [modoTransporte])

  async function calcularGeometria(paradasRuta, modo) {
    const tipo = TIPOS_TRANSPORTE[modo]
    const puntosConOrigen = userLocation
      ? [{ lat: userLocation.lat, lng: userLocation.lng }, ...paradasRuta]
      : paradasRuta

    // Transporte público simulado
    if (tipo?.estaciones?.length > 0) {
      try {
        const resultado = await construirRutaTP(puntosConOrigen, tipo.estaciones)
        setRutaSegmentos(resultado.segmentos)
        setRutaGeom(null)
        setRutaInfo({ distanciaKm: resultado.distanciaTotal, duracionMin: resultado.duracionTotal })
      } catch {
        setRutaSegmentos(null)
        setRutaGeom(puntosConOrigen.map(p => [p.lat, p.lng]))
      }
      return
    }

    // A pie / coche (OSRM)
    setRutaSegmentos(null)
    try {
      const { geom, distanciaKm, duracionMin } = await fetchRutaOSRM(puntosConOrigen, modo)
      setRutaGeom(geom)
      setRutaInfo({ distanciaKm, duracionMin })
    } catch {
      setRutaGeom(puntosConOrigen.map(p => [p.lat, p.lng]))
    }
  }

  const categoriasConocidas = Object.keys(CATEGORIAS)
  const lugaresFiltrados = allLugares.filter(l =>
    categoriasActivas.includes(l.categoria) || !categoriasConocidas.includes(l.categoria)
  )
  const lugaresParaMostrar = ruta ? ruta.ruta : lugaresFiltrados

  function toggleSeleccion(lugar) {
    setLugaresSeleccionados(prev =>
      prev.some(l => l.id === lugar.id) ? prev.filter(l => l.id !== lugar.id) : [...prev, lugar]
    )
  }

  async function generarRuta() {
    const pool = modoRuta === 'manual' ? lugaresSeleccionados : lugaresFiltrados
    if (modoRuta === 'auto' && categoriasActivas.length === 0) { setError('Selecciona al menos una categoría.'); return }
    if (modoRuta === 'manual' && lugaresSeleccionados.length < 2) { setError('Selecciona al menos 2 lugares.'); return }

    setError(null)
    setCargandoRuta(true)
    setRuta(null); setRutaGeom(null); setRutaSegmentos(null); setRutaInfo(null)

    try {
      const rutaLocal = modoRuta === 'manual'
        ? construirRutaLocal(pool, Infinity, Infinity, userLocation)
        : construirRutaLocal(pool, horas * 60, presupuesto, userLocation)

      const costoLugares = rutaLocal.reduce((s, l) => s + (l.costo ?? 0), 0)
      const costoTransporte = COSTOS_TRANSPORTE[modoTransporte] ?? 0
      const nuevaRuta = {
        ruta: rutaLocal,
        resumen: {
          lugares: rutaLocal.length,
          tiempoTotal: rutaLocal.reduce((s, l) => s + l.duracion, 0),
          costoTotal: costoLugares + costoTransporte,
          costoLugares,
          costoTransporte,
        },
      }
      setRuta(nuevaRuta)
      await calcularGeometria(rutaLocal, modoTransporte)
    } catch (e) {
      setError(e.message || 'Error al generar la ruta.')
    } finally {
      setCargandoRuta(false)
    }
  }

  function limpiarRuta() {
    setRuta(null); setRutaGeom(null); setRutaSegmentos(null); setRutaInfo(null)
    setLugarActivo(null); setLugaresSeleccionados([])
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-3 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🚇</span>
          <div>
            <h1 className="text-xl font-bold leading-tight">CDMX Smart Route</h1>
            <p className="text-blue-200 text-xs">Rutas inteligentes por la ciudad</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`w-2 h-2 rounded-full ${supabaseVivo ? 'bg-green-400' : 'bg-yellow-400'}`} />
          <span className="text-blue-100">{supabaseVivo ? 'Supabase conectado' : 'Sin conexión'}</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          categorias={CATEGORIAS}
          categoriasActivas={categoriasActivas}
          setCategoriasActivas={setCategoriasActivas}
          horas={horas} setHoras={setHoras}
          presupuesto={presupuesto} setPresupuesto={setPresupuesto}
          modoTransporte={modoTransporte} setModoTransporte={setModoTransporte}
          modoRuta={modoRuta} setModoRuta={setModoRuta}
          lugaresSeleccionados={lugaresSeleccionados} toggleSeleccion={toggleSeleccion}
          ruta={ruta} rutaInfo={rutaInfo} rutaSegmentos={rutaSegmentos}
          lugarActivo={lugarActivo} setLugarActivo={setLugarActivo}
          onGenerarRuta={generarRuta} onLimpiarRuta={limpiarRuta}
          cargandoRuta={cargandoRuta} error={error}
          lugaresFiltrados={lugaresFiltrados}
        />
        <main className="flex-1 relative">
          <MapView
            lugares={lugaresParaMostrar}
            categorias={CATEGORIAS}
            ruta={ruta} rutaGeom={rutaGeom} rutaSegmentos={rutaSegmentos}
            modoTransporte={modoTransporte}
            lugarActivo={lugarActivo} setLugarActivo={setLugarActivo}
            userLocation={userLocation}
            modoRuta={modoRuta}
            lugaresSeleccionados={lugaresSeleccionados} toggleSeleccion={toggleSeleccion}
          />
        </main>
      </div>
    </div>
  )
}

function haversine(a, b) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const h = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1-h))
}

function construirRutaLocal(pool, tiempoMin, presupuesto, ubicacionInicial) {
  const seleccionados = []
  let tr = tiempoMin, pr = presupuesto
  let actual = ubicacionInicial || { lat: 19.4326, lng: -99.1332 }
  const disponibles = [...pool]
  while (disponibles.length > 0) {
    const candidatos = disponibles
      .filter(l => l.duracion <= tr && (l.costo === null || l.costo <= pr))
      .map(l => ({ lugar: l, dist: haversine(actual, l) }))
      .sort((a, b) => a.dist - b.dist)
    if (!candidatos.length) break
    const elegido = candidatos[0].lugar
    seleccionados.push(elegido)
    tr -= elegido.duracion; pr -= elegido.costo
    actual = { lat: elegido.lat, lng: elegido.lng }
    disponibles.splice(disponibles.indexOf(elegido), 1)
  }
  return seleccionados
}
