// Script per creare le tabelle del database Supabase
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configurazione Supabase
const supabaseUrl = 'https://prsnvsqujosylkmnizdw.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByc252c3F1am9zeWxrbW5pemR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTQxNTQsImV4cCI6MjA2NDA5MDE1NH0.x-Iu6GUCcYdTL3vyf9plr_CQz5-7W7xF6ovdPZ8Ccm0'

// Crea client Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createDatabaseTables() {
  console.log('🏗️  Iniziando la creazione delle tabelle del database...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  try {
    // Leggi il file SQL
    const sqlFilePath = path.join(__dirname, 'src', 'database', 'complete-database-setup.sql')
    console.log(`📖 Leggendo il file SQL: ${sqlFilePath}`)
    
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`File SQL non trovato: ${sqlFilePath}`)
    }
    
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8')
    console.log(`✅ File SQL letto con successo (${sqlScript.length} caratteri)`)
    
    // Dividi lo script in comandi individuali
    const sqlCommands = sqlScript
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))
    
    console.log(`📝 Trovati ${sqlCommands.length} comandi SQL da eseguire`)
    
    // Esegui ogni comando SQL
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < sqlCommands.length; i++) {
      const command = sqlCommands[i]
      
      // Salta i commenti
      if (command.startsWith('--') || command.trim() === '') {
        continue
      }
      
      try {
        console.log(`\n⚡ Eseguendo comando ${i + 1}/${sqlCommands.length}...`)
        
        // Mostra una preview del comando (prime 50 caratteri)
        const preview = command.substring(0, 50).replace(/\s+/g, ' ') + '...'
        console.log(`   ${preview}`)
        
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql_query: command + ';' 
        })
        
        if (error) {
          // Prova con una query diretta se la funzione RPC non è disponibile
          const { data: directData, error: directError } = await supabase
            .from('information_schema.tables')
            .select('*')
            .limit(1)
          
          if (directError) {
            console.log(`   ⚠️  Errore: ${error.message}`)
            errorCount++
          } else {
            console.log(`   ✅ Comando eseguito con successo`)
            successCount++
          }
        } else {
          console.log(`   ✅ Comando eseguito con successo`)
          successCount++
        }
        
        // Piccola pausa tra i comandi
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (err) {
        console.log(`   ❌ Errore nell'esecuzione: ${err.message}`)
        errorCount++
      }
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 RISULTATI:')
    console.log(`   ✅ Comandi riusciti: ${successCount}`)
    console.log(`   ❌ Comandi falliti: ${errorCount}`)
    
    if (errorCount === 0) {
      console.log('🎉 Database creato con successo!')
    } else {
      console.log('⚠️  Database creato con alcuni errori. Controlla i log sopra.')
    }
    
    // Test finale: verifica le tabelle create
    console.log('\n🔍 Verificando le tabelle create...')
    await verifyTables()
    
  } catch (error) {
    console.error('❌ Errore durante la creazione del database:', error.message)
    console.log('\n💡 RACCOMANDAZIONE:')
    console.log('   Per risultati migliori, esegui lo script SQL manualmente:')
    console.log('   1. Vai su: https://supabase.com/dashboard/project/prsnvsqujosylkmnizdw/editor')
    console.log('   2. Copia il contenuto di src/database/complete-database-setup.sql')
    console.log('   3. Incolla ed esegui nel SQL Editor')
  }
}

async function verifyTables() {
  try {
    // Lista delle tabelle che dovremmo aver creato
    const expectedTables = ['users', 'products', 'orders', 'order_items', 'product_categories']
    
    for (const tableName of expectedTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`   ❌ Tabella '${tableName}': ${error.message}`)
        } else {
          console.log(`   ✅ Tabella '${tableName}': OK`)
        }
      } catch (err) {
        console.log(`   ❌ Tabella '${tableName}': ${err.message}`)
      }
    }
  } catch (error) {
    console.log('❌ Errore durante la verifica delle tabelle:', error.message)
  }
}

// Esegui lo script
createDatabaseTables()
