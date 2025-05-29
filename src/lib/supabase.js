import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://prsnvsqujosylkmnizdw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByc252c3F1am9zeWxrbW5pemR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTQxNTQsImV4cCI6MjA2NDA5MDE1NH0.x-Iu6GUCcYdTL3vyf9plr_CQz5-7W7xF6ovdPZ8Ccm0'

export const supabase = createClient(supabaseUrl, supabaseKey)
