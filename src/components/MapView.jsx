import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'leaflet-defaulticon-compatibility'
import { CATEGORIA_FALLBACK } from '../data/lugares'
import { TODAS_LINEAS } from '../data/transporte'

function FocusLugar({ lugar }) {
  const map = useMap()
  useEffect(() => {
    if (lugar) map.setView([lugar.lat, lugar.lng], 16, { animate: true })
  }, [lugar, map])
  return null
}

function makeIcon(emoji, activo = false, seleccionado = false) {
  const size = activo ? 36 : 28
  const bg = activo ? '#1D4ED8' : seleccionado ? '#4F46E5' : 'white'
  const border = activo ? '#1D4ED8' : seleccionado ? '#4F46E5' : '#CBD5E0'
  return L.divIcon({
    html: `<div style="font-size:${activo?'22px':'16px'};width:${size}px;height:${size}px;
      display:flex;align-items:center;justify-content:center;
      background:${bg};border:2px solid ${border};border-radius:50%;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);">${emoji}</div>`,
    className: '', iconSize: [size, size],
    iconAnchor: [size/2, size/2], popupAnchor: [0, -(size/2)-4],
  })
}

function makeNumIcon(num, emoji) {
  return L.divIcon({
    html: `<div style="position:relative;width:40px;height:40px">
      <div style="width:40px;height:40px;background:#1D4ED8;border:2px solid white;border-radius:50%;
        box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;">${emoji}</div>
      <div style="position:absolute;top:-6px;right:-6px;background:#EF4444;color:white;
        border-radius:50%;width:18px;height:18px;font-size:11px;font-weight:bold;
        display:flex;align-items:center;justify-content:center;border:1.5px solid white;">${num}</div>
    </div>`,
    className: '', iconSize: [40,40], iconAnchor: [20,20], popupAnchor: [0,-24],
  })
}

function makeEstacionIcon(linea) {
  const lineaData = TODAS_LINEAS[linea]
  const color = lineaData?.color ?? '#666'
  return L.divIcon({
    html: `<div style="width:10px;height:10px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
    className: '', iconSize: [10,10], iconAnchor: [5,5],
  })
}

export default function MapView({
  lugares, categorias, ruta, rutaGeom, rutaSegmentos, modoTransporte,
  lugarActivo, setLugarActivo, userLocation,
  modoRuta, lugaresSeleccionados, toggleSeleccion,
}) {
  return (
    <MapContainer center={[19.4326, -99.1332]} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FocusLugar lugar={lugarActivo} />

      {/* Ubicación actual */}
      {userLocation && (
        <CircleMarker center={[userLocation.lat, userLocation.lng]} radius={10}
          pathOptions={{ color: '#2563EB', fillColor: '#2563EB', fillOpacity: 1 }}>
          <Popup>📍 Tu ubicación actual</Popup>
        </CircleMarker>
      )}

      {/* Ruta OSRM (a pie / coche) */}
      {rutaGeom && rutaGeom.length > 1 && (
        <Polyline positions={rutaGeom}
          pathOptions={{ color: modoTransporte === 'car' ? '#1D4ED8' : '#16A34A', weight: 5, opacity: 0.85 }} />
      )}

      {/* Ruta de transporte público — segmentos con colores de línea */}
      {rutaSegmentos && rutaSegmentos.map((seg, i) => {
        const color = TODAS_LINEAS[seg.estOrigen.linea]?.color ?? '#666'
        return (
          <span key={i}>
            {/* Caminata 1 → estación origen */}
            <Polyline positions={seg.geomCaminata1}
              pathOptions={{ color: '#9CA3AF', weight: 3, opacity: 0.7, dashArray: '6 4' }} />
            {/* Segmento en transporte */}
            <Polyline positions={seg.geomTransporte}
              pathOptions={{ color, weight: 5, opacity: 0.9 }} />
            {/* Caminata 2 → destino */}
            <Polyline positions={seg.geomCaminata2}
              pathOptions={{ color: '#9CA3AF', weight: 3, opacity: 0.7, dashArray: '6 4' }} />
            {/* Marcadores de estaciones */}
            <Marker position={[seg.estOrigen.lat, seg.estOrigen.lng]} icon={makeEstacionIcon(seg.estOrigen.linea)}>
              <Popup><b>{seg.estOrigen.nombre}</b><br/><small>{TODAS_LINEAS[seg.estOrigen.linea]?.nombre}</small></Popup>
            </Marker>
            <Marker position={[seg.estDestino.lat, seg.estDestino.lng]} icon={makeEstacionIcon(seg.estDestino.linea)}>
              <Popup><b>{seg.estDestino.nombre}</b><br/><small>{TODAS_LINEAS[seg.estDestino.linea]?.nombre}</small></Popup>
            </Marker>
          </span>
        )
      })}

      {/* Marcadores de lugares */}
      {lugares.map((lugar, idx) => {
        const cat = categorias[lugar.categoria] ?? CATEGORIA_FALLBACK
        const activo = lugarActivo?.id === lugar.id
        const esRuta = !!ruta
        const seleccionado = lugaresSeleccionados?.some(l => l.id === lugar.id) ?? false
        const icon = esRuta ? makeNumIcon(idx+1, cat.emoji) : makeIcon(cat.emoji, activo, seleccionado)

        return (
          <Marker key={lugar.id} position={[lugar.lat, lugar.lng]} icon={icon}
            eventHandlers={{ click: () => {
              if (modoRuta === 'manual' && !esRuta) toggleSeleccion(lugar)
              else setLugarActivo(activo ? null : lugar)
            }}}>
            <Popup maxWidth={240}>
              <div className="min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{cat.emoji}</span>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm leading-tight">{lugar.nombre}</h3>
                    <span className={`text-xs font-medium ${cat.text}`}>{cat.label}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-2 leading-relaxed">{lugar.descripcion}</p>
                <div className="flex gap-3 text-xs text-gray-400 border-t pt-2">
                  <span>⏱ {lugar.duracion} min</span>
                  <span>{lugar.costo === null ? '💿 Precio variable' : lugar.costo === 0 ? '✅ Gratis' : `💰 $${lugar.costo}`}</span>
                </div>
                {modoRuta === 'manual' && !esRuta && (
                  <button onClick={() => toggleSeleccion(lugar)}
                    className={`w-full mt-3 py-1.5 rounded-lg text-xs font-medium transition
                      ${seleccionado ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                    {seleccionado ? '✕ Quitar de mi ruta' : '+ Agregar a mi ruta'}
                  </button>
                )}
                {esRuta && (
                  <div className="mt-2 bg-blue-50 rounded px-2 py-1 text-xs text-blue-700 font-medium">
                    Parada #{idx+1} de tu ruta
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
