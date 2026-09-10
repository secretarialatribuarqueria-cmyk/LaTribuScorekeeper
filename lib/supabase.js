import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uxdyofzbtxqsoefqvokm.supabase.co'
const supabaseAnonKey = 'sb_publishable_D2mq5Emi_G9_bV_1JsVS_A_z9vVepH3'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)