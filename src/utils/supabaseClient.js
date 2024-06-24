import { createClient } from '@supabase/supabase-js'
import { reactive } from 'vue'

const supabaseUrl = 'https://anrakdaroezxddxvdpaw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFucmFrZGFyb2V6eGRkeHZkcGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc5NjIzNTEsImV4cCI6MjAyMzUzODM1MX0.zLZm6AI7gfZlzkseKNQNC6Ek_eDhruR6gnzl1Otk1F8'

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
