import { CATEGORIA_FALLBACK } from '../data/lugares'
import { TIPOS_TRANSPORTE } from '../data/transporte'

export default function Sidebar({
  categorias, categoriasActivas, setCategoriasActivas,
  horas, setHoras, presupuesto, setPresupuesto,
  modoTransporte, setModoTransporte,
  modoRuta, setModoRuta,
  lugaresSeleccionados, toggleSeleccion,
  ruta, rutaInfo, rutaSegmentos,
  lugarActivo, setLugarActivo,
  onGenerarRuta, onLimpiarRuta,
  cargandoRuta, error, lugaresFiltrados,
}) {
  function toggleCategoria(cat) {
    setCategoriasActivas(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const puedeGenerar = modoRuta === 'auto'
    ? categoriasActivas.length > 0
    : lugaresSeleccionados.length >= 2

  const tipoTP = TIPOS_TRANSPORTE[modoTransporte]
  const esTP = tipoTP?.estaciones?.length > 0

  return (
    <aside className="w-80 bg-white border-r flex flex-col overflow-hidden shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        {/* ── Modo de ruta ── */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Modo</h2>
          <div className="grid grid-cols-2 gap-2">
            {[['auto','🤖 Automático','blue'],['manual','✏️ Personalizado','indigo']].map(([m,label,c]) => (
              <button key={m} onClick={() => { setModoRuta(m); onLimpiarRuta() }}
                className={`py-2 rounded-lg border text-sm font-medium transition-all
                  ${modoRuta === m
                    ? `bg-${c}-50 text-${c}-700 border-${c}-300`
                    : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'}`}>
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Modo automático ── */}
        {modoRuta === 'auto' && (
          <>
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Categorías</h2>
              <div className="space-y-1">
                {Object.entries(categorias).map(([key, cat]) => {
                  const activa = categoriasActivas.includes(key)
                  const count  = lugaresFiltrados.filter(l => l.categoria === key).length
                  return (
                    <button key={key} onClick={() => toggleCategoria(key)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-sm
                        ${activa ? `${cat.bg} ${cat.text} ${cat.border} font-medium` : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'}`}>
                      <span className="flex items-center gap-2"><span>{cat.emoji}</span><span>{cat.label}</span></span>
                      <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${activa ? 'bg-white/60' : 'bg-gray-200'}`}>
                        {activa ? count : '—'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Parámetros</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">⏱ Horas disponibles: <strong>{horas}h</strong></label>
                  <input type="range" min={1} max={12} value={horas} onChange={e => setHoras(Number(e.target.value))} className="w-full accent-blue-600" />
                  <div className="flex justify-between text-xs text-gray-300 mt-0.5"><span>1h</span><span>12h</span></div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">💰 Presupuesto: <strong>${presupuesto.toLocaleString()}</strong></label>
                  <input type="range" min={0} max={3000} step={50} value={presupuesto} onChange={e => setPresupuesto(Number(e.target.value))} className="w-full accent-blue-600" />
                  <div className="flex justify-between text-xs text-gray-300 mt-0.5"><span>$0</span><span>$3,000</span></div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── Modo manual ── */}
        {modoRuta === 'manual' && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Elige tus lugares</h2>
            <p className="text-xs text-gray-400 mb-3">Clic en el mapa o selecciona de la lista. Mínimo 2.</p>
            {lugaresSeleccionados.length > 0 && (
              <div className="mb-3 space-y-1">
                <p className="text-xs font-medium text-indigo-600 mb-1">{lugaresSeleccionados.length} seleccionados:</p>
                {lugaresSeleccionados.map(l => {
                  const cat = categorias[l.categoria] ?? CATEGORIA_FALLBACK
                  return (
                    <div key={l.id} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${cat.bg} ${cat.border} border text-sm`}>
                      <span>{cat.emoji}</span>
                      <span className={`flex-1 truncate text-xs font-medium ${cat.text}`}>{l.nombre}</span>
                      <button onClick={() => toggleSeleccion(l)} className="text-gray-400 hover:text-red-500 text-xs font-bold">✕</button>
                    </div>
                  )
                })}
              </div>
            )}
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {lugaresFiltrados.map(lugar => {
                const cat = categorias[lugar.categoria] ?? CATEGORIA_FALLBACK
                const sel = lugaresSeleccionados.some(l => l.id === lugar.id)
                return (
                  <button key={lugar.id} onClick={() => toggleSeleccion(lugar)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all border
                      ${sel ? `${cat.bg} ${cat.border} ${cat.text} font-medium` : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'}`}>
                    <span>{cat.emoji}</span>
                    <span className="flex-1 truncate">{lugar.nombre}</span>
                    <span className={`text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                      ${sel ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                      {sel ? '✓' : '+'}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Transporte ── */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Transporte</h2>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(TIPOS_TRANSPORTE).map(([key, tipo]) => (
              <button key={key} onClick={() => setModoTransporte(key)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border text-xs font-medium transition-all
                  ${modoTransporte === key
                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                    : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'}`}>
                <span>{tipo.emoji}</span>
                <span>{tipo.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg border border-red-200">⚠️ {error}</div>
        )}

        {/* ── Resumen de ruta ── */}
        {ruta && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Tu Ruta</h2>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-blue-700">{ruta.resumen.lugares}</div>
                <div className="text-xs text-blue-500">Lugares</div>
              </div>
              <div className="bg-green-50 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-green-700">
                  {Math.floor(ruta.resumen.tiempoTotal/60)}h{ruta.resumen.tiempoTotal%60>0?`${ruta.resumen.tiempoTotal%60}m`:''}
                </div>
                <div className="text-xs text-green-500">En sitios</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-orange-700">${ruta.resumen.costoTotal}</div>
                <div className="text-xs text-orange-500">Costo total</div>
              </div>
            </div>

            {/* Desglose de costo */}
            {(ruta.resumen.costoTransporte > 0 || ruta.resumen.costoLugares > 0) && (
              <div className="mb-2 px-3 py-2 bg-orange-50 rounded-lg text-xs space-y-1">
                {ruta.resumen.costoLugares > 0 && (
                  <div className="flex justify-between text-orange-700">
                    <span>🎟 Entradas</span>
                    <span className="font-medium">${ruta.resumen.costoLugares}</span>
                  </div>
                )}
                {ruta.resumen.costoTransporte > 0 && (
                  <div className="flex justify-between text-orange-700">
                    <span>{TIPOS_TRANSPORTE[modoTransporte]?.emoji} Transporte</span>
                    <span className="font-medium">${ruta.resumen.costoTransporte}</span>
                  </div>
                )}
                {ruta.ruta.some(l => l.costo === null) && (
                  <div className="text-gray-400 pt-1 border-t border-orange-100">
                    * Vinilos: precio variable no incluido
                  </div>
                )}
              </div>
            )}

            {rutaInfo && (
              <div className="flex gap-2 mb-3 px-3 py-2 rounded-lg text-xs font-medium bg-blue-50 text-blue-700">
                <span>{TIPOS_TRANSPORTE[modoTransporte]?.emoji}</span>
                <span>{rutaInfo.distanciaKm} km</span>
                <span>·</span>
                <span>~{rutaInfo.duracionMin} min en traslados</span>
              </div>
            )}

            {/* Segmentos de transporte público */}
            {rutaSegmentos && rutaSegmentos.length > 0 && (
              <div className="mb-3 space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cómo moverte</p>
                {rutaSegmentos.map((seg, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-2 text-xs space-y-1">
                    <div className="flex items-center gap-1">
                      <span>🚶</span>
                      <span className="text-gray-600">Camina {seg.durCaminata1} min a</span>
                      <span className="font-medium text-gray-800">{seg.estOrigen.nombre}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className="px-1.5 py-0.5 rounded text-white text-[10px] font-bold"
                        style={{ background: seg.lineaOrigen?.color ?? '#666' }}>
                        {seg.estOrigen.linea}
                      </span>
                      <span className="text-gray-600">hasta</span>
                      <span className="font-medium text-gray-800">{seg.estDestino.nombre}</span>
                      <span className="text-gray-400">~{seg.durTransporte} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🚶</span>
                      <span className="text-gray-600">Camina {seg.durCaminata2} min al destino</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <ol className="space-y-1">
              {ruta.ruta.map((lugar, i) => {
                const cat = categorias[lugar.categoria] ?? CATEGORIA_FALLBACK
                const activo = lugarActivo?.id === lugar.id
                return (
                  <li key={lugar.id}>
                    <button onClick={() => setLugarActivo(activo ? null : lugar)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all
                        ${activo ? `${cat.bg} ${cat.border} border` : 'hover:bg-gray-50'}`}>
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                      <span className="flex-1 truncate font-medium text-gray-700">{lugar.nombre}</span>
                      <span className="text-xs text-gray-400 flex-shrink-0">{lugar.duracion}m</span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </section>
        )}

        {/* ── Lista sin ruta (modo auto) ── */}
        {!ruta && modoRuta === 'auto' && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{lugaresFiltrados.length} lugares en el mapa</h2>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {lugaresFiltrados.map(lugar => {
                const cat = categorias[lugar.categoria] ?? CATEGORIA_FALLBACK
                const activo = lugarActivo?.id === lugar.id
                return (
                  <button key={lugar.id} onClick={() => setLugarActivo(activo ? null : lugar)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all
                      ${activo ? `${cat.bg} ${cat.border} border` : 'hover:bg-gray-50'}`}>
                    <span className="text-base">{cat.emoji}</span>
                    <span className="flex-1 truncate text-gray-700">{lugar.nombre}</span>
                    {lugar.costo === 0
                      ? <span className="text-xs text-green-600 font-medium">Gratis</span>
                      : <span className="text-xs text-gray-400">${lugar.costo}</span>}
                  </button>
                )
              })}
            </div>
          </section>
        )}
      </div>

      {/* ── CTA ── */}
      <div className="p-4 border-t bg-white">
        {ruta ? (
          <button onClick={onLimpiarRuta}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
            ✕ Nueva búsqueda
          </button>
        ) : (
          <button onClick={onGenerarRuta} disabled={cargandoRuta || !puedeGenerar}
            className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
            {cargandoRuta
              ? <><span className="animate-spin">⏳</span> Calculando…</>
              : modoRuta === 'manual'
                ? `🗺 Generar con ${lugaresSeleccionados.length} lugar${lugaresSeleccionados.length !== 1 ? 'es' : ''}`
                : '🗺 Generar Ruta'}
          </button>
        )}
      </div>
    </aside>
  )
}
