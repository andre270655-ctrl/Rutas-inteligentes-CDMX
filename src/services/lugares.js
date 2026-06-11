import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export async function obtenerLugares() {
  const { data, error } = await supabase
    .from('lugares')
    .select('*')

  if (error) {
    console.error(error)
    throw error
  }

  return data
}