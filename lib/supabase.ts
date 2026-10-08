import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vuwyevpfmmrmtajesbic.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_m9GcoKcqW70TtDNi64uxJw_5_87xcKf'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)