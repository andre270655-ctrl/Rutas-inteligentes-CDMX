import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import MapView from './components/MapView'
import { lugares as fallbackLugares, CATEGORIAS, CATEGORIA_FALLBACK } from './data/lugares'
import { COSTOS_TRANSPORTE } from './data/transporte'
import { obtenerLugares } from './services/lugares'
import { construirRutaAutomatica } from './services/transporte'
import useLocation from './hooks/useLocation'

export default function App() {
  const userLocation = useLocation()

  const [allLugares, setAllLugares]     = useState(fallbackLugares)
  const [categoriasActivas, setCategoriasActivas] = useState(Object.keys(CATEGORIAS))
  const [horas, setHoras]               = useState(4)
  const [presupuesto, setPresupuesto]   = useState(500)
  const [modoRuta, setModoRuta]         = useState('auto')
  const [lugaresSeleccionados, setLugaresSeleccionados] = useState([])

  const [ruta, setRuta]             = useState(null)
  const [rutaTramos, setRutaTramos] = useState(null)   // tramos con modo de transporte decidido automáticamente
  const [rutaInfo, setRutaInfo]     = useState(null)
  const [cargandoRuta, setCargandoRuta] = useState(false)
  const [error, setError]           = useState(null)
  const [lugarActivo, setLugarActivo] = useState(null)
  const [supabaseVivo, setSupabaseVivo] = useState(false)

  // Mobile panel state: 'collapsed' | 'half' | 'full'
  const [panelState, setPanelState] = useState('half')

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
    setRuta(null); setRutaTramos(null); setRutaInfo(null)

    try {
      const rutaLocal = modoRuta === 'manual'
        ? construirRutaLocal(pool, Infinity, Infinity, userLocation)
        : construirRutaLocal(pool, horas * 60, presupuesto, userLocation)

      const costoLugares = rutaLocal.reduce((s, l) => s + (l.costo ?? 0), 0)

      // Paradas incluyendo el origen (ubicación del usuario) si está disponible
      const puntosRuta = userLocation
        ? [{ lat: userLocation.lat, lng: userLocation.lng }, ...rutaLocal]
        : rutaLocal

      // Decide automáticamente el mejor transporte para cada tramo
      const resultadoTransporte = puntosRuta.length > 1
        ? await construirRutaAutomatica(puntosRuta)
        : { tramos: [], duracionTotal: 0, distanciaTotal: '0.0', modosUsados: [] }

      // Costo de transporte: una sola vez por cada modo público distinto usado
      const costoTransporte = resultadoTransporte.modosUsados.reduce(
        (s, modo) => s + (COSTOS_TRANSPORTE[modo] ?? 0), 0
      )

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
      setRutaTramos(resultadoTransporte.tramos)
      setRutaInfo({
        distanciaKm: resultadoTransporte.distanciaTotal,
        duracionMin: resultadoTransporte.duracionTotal,
      })
      setPanelState('half')
    } catch (e) {
      setError(e.message || 'Error al generar la ruta.')
    } finally {
      setCargandoRuta(false)
    }
  }

  function limpiarRuta() {
    setRuta(null); setRutaTramos(null); setRutaInfo(null)
    setLugarActivo(null); setLugaresSeleccionados([])
  }

  // Panel height map for mobile
  const panelHeights = {
    collapsed: '90px',
    half: '52vh',
    full: '92vh',
  }

  function cyclePanelState() {
    setPanelState(prev =>
      prev === 'collapsed' ? 'half' : prev === 'half' ? 'full' : 'collapsed'
    )
  }

  const sidebarProps = {
    categorias: CATEGORIAS,
    categoriasActivas, setCategoriasActivas,
    horas, setHoras,
    presupuesto, setPresupuesto,
    modoRuta, setModoRuta,
    lugaresSeleccionados, toggleSeleccion,
    ruta, rutaInfo, rutaTramos,
    lugarActivo, setLugarActivo,
    onGenerarRuta: generarRuta,
    onLimpiarRuta: limpiarRuta,
    cargandoRuta, error,
    lugaresFiltrados,
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-4 py-2 shadow-lg flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚇</span>
          <div>
            <h1 className="text-base font-bold leading-tight">CDMX Smart Route</h1>
            <p className="text-blue-200 text-xs hidden sm:block">Rutas inteligentes por la ciudad</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`w-2 h-2 rounded-full ${supabaseVivo ? 'bg-green-400' : 'bg-yellow-400'}`} />
          <span className="text-blue-100 hidden sm:block">{supabaseVivo ? 'Conectado' : 'Sin conexión'}</span>
        </div>
      </header>

      {/* ── DESKTOP layout (md+) ── */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <Sidebar {...sidebarProps} />
        <main className="flex-1 relative">
          <MapView
            lugares={lugaresParaMostrar}
            categorias={CATEGORIAS}
            ruta={ruta} rutaTramos={rutaTramos}
            lugarActivo={lugarActivo} setLugarActivo={setLugarActivo}
            userLocation={userLocation}
            modoRuta={modoRuta}
            lugaresSeleccionados={lugaresSeleccionados} toggleSeleccion={toggleSeleccion}
          />
        </main>
      </div>

      {/* ── MOBILE layout ── */}
      <div className="flex md:hidden flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <MapView
            lugares={lugaresParaMostrar}
            categorias={CATEGORIAS}
            ruta={ruta} rutaTramos={rutaTramos}
            lugarActivo={lugarActivo} setLugarActivo={setLugarActivo}
            userLocation={userLocation}
            modoRuta={modoRuta}
            lugaresSeleccionados={lugaresSeleccionados} toggleSeleccion={toggleSeleccion}
          />
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-[1000] transition-all duration-300 ease-in-out"
          style={{ height: panelHeights[panelState] }}
        >
          <button
            onClick={cyclePanelState}
            className="flex justify-center pt-2 pb-1 w-full"
            aria-label="Expandir o colapsar panel"
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-white border-t z-10">
            {ruta ? (
              <button onClick={limpiarRuta}
                className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
                ✕ Nueva búsqueda
              </button>
            ) : (
              <button
                onClick={generarRuta}
                disabled={cargandoRuta || (modoRuta === 'auto' ? categoriasActivas.length === 0 : lugaresSeleccionados.length < 2)}
                className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
                {cargandoRuta
                  ? <><span className="animate-spin">⏳</span> Calculando…</>
                  : modoRuta === 'manual'
                    ? `🗺 Generar con ${lugaresSeleccionados.length} lugar${lugaresSeleccionados.length !== 1 ? 'es' : ''}`
                    : '🗺 Generar Ruta'}
              </button>
            )}
          </div>

          {panelState !== 'collapsed' && (
            <div className="overflow-y-auto" style={{ height: 'calc(100% - 32px - 72px)' }}>
              <Sidebar {...sidebarProps} mobile hideCta />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function haversine(a, b) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
    Math.cos((b.lat * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

function construirRutaLocal(pool, tiempoMin, presupuesto, origen) {
  const seleccionados = []
  let tiempoRestante = tiempoMin
  let dineroRestante = presupuesto
  let actual = origen ?? { lat: 19.4326, lng: -99.1332 }
  const disponibles = [...pool]

  while (disponibles.length > 0) {
    const candidatos = disponibles.filter(
      l => l.duracion <= tiempoRestante && (l.costo ?? 0) <= dineroRestante
    )
    if (candidatos.length === 0) break
    candidatos.sort((a, b) => haversine(actual, a) - haversine(actual, b))
    const elegido = candidatos[0]
    seleccionados.push(elegido)
    tiempoRestante -= elegido.duracion
    dineroRestante -= elegido.costo ?? 0
    actual = elegido
    disponibles.splice(disponibles.indexOf(elegido), 1)
  }
  return seleccionados
}
