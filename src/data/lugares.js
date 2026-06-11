// Datos espejo del backend — se usan como fallback si la API no responde
export const lugares = [
  { id: 1,  nombre: 'Roma Records',                  categoria: 'vinilos',          lat: 19.41762, lng: -99.16421, duracion: 60,  costo: null,  descripcion: 'Gran selección de jazz, rock y electrónica en la Colonia Roma.' },
  { id: 2,  nombre: 'Retroactivo',                    categoria: 'vinilos',          lat: 19.41718, lng: -99.16106, duracion: 60,  costo: null,  descripcion: 'Rock clásico y punk. Ambiente vintage con buen precio.' },
  { id: 3,  nombre: 'Discos Chowell',                 categoria: 'vinilos',          lat: 19.42944, lng: -99.13942, duracion: 45,  costo: null,  descripcion: 'Tienda tradicional con vinilos de segunda mano a precio justo.' },
  { id: 4,  nombre: 'La Tienda de Discos',            categoria: 'vinilos',          lat: 19.41623, lng: -99.15492, duracion: 45,  costo: null,  descripcion: 'Variedad de géneros latinoamericanos y tropicales.' },
  { id: 5,  nombre: 'Revancha',                       categoria: 'vinilos',          lat: 19.42017, lng: -99.15756, duracion: 50,  costo: null,  descripcion: 'Selección curada de música independiente. Importaciones directas.' },
  { id: 6,  nombre: 'Georgetown Records',             categoria: 'vinilos',          lat: 19.42236, lng: -99.15415, duracion: 60,  costo: null,  descripcion: 'Jazz, soul y R&B. Eventos de escucha los domingos.' },
  { id: 7,  nombre: 'Venas Rotas Discos',             categoria: 'vinilos',          lat: 19.40215, lng: -99.16234, duracion: 45,  costo: null,  descripcion: 'Punk, metal y electrónica experimental. Precios accesibles.' },
  { id: 8,  nombre: 'Palacio de Bellas Artes',        categoria: 'museo',            lat: 19.43520, lng: -99.14120, duracion: 120, costo: 90,   descripcion: 'Muralismo mexicano de Diego Rivera, Orozco y Siqueiros.' },
  { id: 9,  nombre: 'Museo Nacional de Antropología', categoria: 'museo',            lat: 19.42596, lng: -99.18611, duracion: 180, costo: 85,   descripcion: 'El más importante museo arqueológico de México.' },
  { id: 10, nombre: 'Museo Frida Kahlo',              categoria: 'museo',            lat: 19.35517, lng: -99.16268, duracion: 90,  costo: 230,  descripcion: 'La Casa Azul donde vivió y creó Frida Kahlo.' },
  { id: 11, nombre: 'Museo Soumaya',                  categoria: 'museo',            lat: 19.44082, lng: -99.20276, duracion: 90,  costo: 0,    descripcion: 'Entrada gratuita. Arte europeo y latinoamericano.' },
  { id: 12, nombre: 'Museo del Templo Mayor',         categoria: 'museo',            lat: 19.43458, lng: -99.13185, duracion: 90,  costo: 85,   descripcion: 'Ruinas del centro ceremonial azteca en el Centro Histórico.' },
  { id: 13, nombre: 'Bosque de Chapultepec',          categoria: 'parque',           lat: 19.42040, lng: -99.18190, duracion: 120, costo: 0,    descripcion: 'El pulmón verde de la CDMX. Lagos, museos y zoológico.' },
  { id: 14, nombre: 'Parque México',                  categoria: 'parque',           lat: 19.41480, lng: -99.17280, duracion: 60,  costo: 0,    descripcion: 'Corazón de la Colonia Hipódromo. Ideal para caminar y ver gente.' },
  { id: 15, nombre: 'Parque de los Venados',          categoria: 'parque',           lat: 19.38700, lng: -99.15630, duracion: 60,  costo: 0,    descripcion: 'Parque familiar en la Del Valle. Zona deportiva amplia.' },
  { id: 16, nombre: 'Viveros de Coyoacán',            categoria: 'parque',           lat: 19.34880, lng: -99.16610, duracion: 90,  costo: 0,    descripcion: 'Oasis de tranquilidad. Pistas para correr entre árboles enormes.' },
  { id: 17, nombre: 'El Cardenal',                    categoria: 'restaurante',      lat: 19.43290, lng: -99.14020, duracion: 90,  costo: 350,  descripcion: 'Cocina mexicana tradicional en el Centro Histórico.' },
  { id: 18, nombre: 'Contramar',                      categoria: 'restaurante',      lat: 19.41580, lng: -99.16520, duracion: 90,  costo: 600,  descripcion: 'Mariscos de autor en la Roma. Tostada de atún icónica.' },
  { id: 19, nombre: 'Mercado Roma',                   categoria: 'restaurante',      lat: 19.41900, lng: -99.16000, duracion: 60,  costo: 250,  descripcion: 'Mercado gourmet con tacos, sushi, vino y café especial.' },
  { id: 20, nombre: 'Los Panchos',                    categoria: 'restaurante',      lat: 19.42600, lng: -99.15800, duracion: 60,  costo: 180,  descripcion: 'Tortas y tostadas desde 1945. Institución capitalina.' },
  { id: 21, nombre: 'Quintonil',                      categoria: 'restaurante',      lat: 19.43200, lng: -99.19800, duracion: 120, costo: 1200, descripcion: 'Alta cocina mexicana contemporánea. Top Latinoamérica.' },
  { id: 22, nombre: 'Antara Fashion Hall',            categoria: 'centro_comercial', lat: 19.44280, lng: -99.19780, duracion: 120, costo: 0,    descripcion: 'Centro comercial de lujo en Polanco con cine y marcas internacionales.' },
  { id: 23, nombre: 'Pabellón Polanco',               categoria: 'centro_comercial', lat: 19.43430, lng: -99.19670, duracion: 90,  costo: 0,    descripcion: 'Tiendas departamentales en el corazón de Polanco.' },
  { id: 24, nombre: 'Centro Comercial Perisur',       categoria: 'centro_comercial', lat: 19.30600, lng: -99.18200, duracion: 120, costo: 0,    descripcion: 'Uno de los más grandes del sur de la ciudad.' },
  { id: 25, nombre: 'Plaza Carso',                    categoria: 'centro_comercial', lat: 19.44020, lng: -99.20190, duracion: 90,  costo: 0,    descripcion: 'Complejo cultural y comercial junto al Museo Soumaya.' },
];

export const CATEGORIAS = {
  vinilos:          { label: 'Vinilos',             emoji: '🎵', color: '#E53E3E', bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200' },
  museo:            { label: 'Museos',              emoji: '🏛️', color: '#3182CE', bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  parque:           { label: 'Parques',             emoji: '🌳', color: '#38A169', bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
  restaurante:      { label: 'Restaurantes',        emoji: '🍽️', color: '#DD6B20', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  centro_comercial: { label: 'Centros Comerciales', emoji: '🛍️', color: '#805AD5', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  cafe:             { label: 'Cafés',               emoji: '☕', color: '#92400E', bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
};

// Categoría de respaldo para lugares con categoría desconocida
export const CATEGORIA_FALLBACK = {
  label: 'Otro', emoji: '📍', color: '#6B7280',
  bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200',
};
