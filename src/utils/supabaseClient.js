import { createClient } from '@supabase/supabase-js'
import { reactive } from 'vue'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(

supabaseUrl,

supabaseAnonKey

);

export const user = reactive({
  data: null,
})

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    user.data = session.user
  } else if (event === 'SIGNED_OUT') {
    user.data = null
  }
})
