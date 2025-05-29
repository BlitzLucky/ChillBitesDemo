// Test per verificare lo stato del database Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://prsnvsqujosylkmnizdw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByc252c3F1am9zeWxrbW5pemR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTQxNTQsImV4cCI6MjA2NDA5MDE1NH0.x-Iu6GUCcYdTL3vyf9plr_CQz5-7W7xF6ovdPZ8Ccm0'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabase() {
  console.log('🔍 Testing database connection...')
  
  try {
    // Test connessione generale
    console.log('1. Testing basic connection...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
    
    if (connectionError) {
      console.log('❌ Products table error:', connectionError.message)
      console.log('Error code:', connectionError.code)
      
      if (connectionError.code === '42P01') {
        console.log('💡 La tabella "products" non esiste!')
      }
    } else {
      console.log('✅ Products table exists, found:', connectionTest?.length || 0, 'items')
    }

    // Test altre tabelle
    const tables = ['users', 'orders', 'order_items', 'product_categories']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count', { count: 'exact', head: true })
        
        if (error) {
          console.log(`❌ Table "${table}": ${error.message}`)
        } else {
          console.log(`✅ Table "${table}": exists`)
        }
      } catch (err) {
        console.log(`❌ Table "${table}": ${err.message}`)
      }
    }

    // Test funzioni/procedure
    console.log('\n2. Testing if we can execute SQL...')
    const { data: sqlTest, error: sqlError } = await supabase.rpc('version')
    
    if (sqlError) {
      console.log('❌ Cannot execute SQL functions:', sqlError.message)
    } else {
      console.log('✅ SQL execution works')
    }

  } catch (error) {
    console.error('💥 General error:', error)
  }
}

testDatabase()
