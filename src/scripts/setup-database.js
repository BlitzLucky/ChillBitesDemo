// Script per eseguire il setup del database
import { supabase } from '../lib/supabase.js'

async function setupDatabase() {
  console.log('🔄 Inizio setup database...')
  
  try {
    // Test connessione
    console.log('🔍 Test connessione Supabase...')
    const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true })
    
    if (error && error.code === 'PGRST116') {
      console.log('✅ Database vuoto - procedo con il setup...')
    } else if (error) {
      console.error('❌ Errore di connessione:', error)
      return
    } else {
      console.log('✅ Connessione riuscita! Prodotti esistenti:', data)
    }

    // Inserimento prodotti di esempio
    const sampleProducts = [
      {
        name: 'Torta al Cioccolato',
        description: 'Una torta al cioccolato deliziosamente ricca con una glassa cremosa e praline.',
        price: 25.99,
        image_url: 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Torta+Cioccolato',
        available_quantity: 10
      },
      {
        name: 'Crostatina alle Fragole',
        description: 'Fragole fresche su una leggera base di crema pasticcera con una pasta frolla burrosa.',
        price: 18.50,
        image_url: 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Crostatina+Fragole',
        available_quantity: 15
      },
      {
        name: 'Assortimento di Macarons',
        description: 'Una deliziosa selezione di macarons colorati con vari ripieni.',
        price: 15.00,
        image_url: 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Macarons',
        available_quantity: 0
      },
      {
        name: 'Cupcake Delizia',
        description: 'Soffici cupcake alla vaniglia con frosting rosa al burro.',
        price: 3.50,
        image_url: 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Cupcake',
        available_quantity: 30
      },
      {
        name: 'Biscotti Limonata Rosa',
        description: 'Biscotti aciduli e dolci con una glassa alla limonata rosa.',
        price: 12.00,
        image_url: 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Biscotti',
        available_quantity: 20
      },
      {
        name: 'Lecca-lecca alla Rosa',
        description: 'Eleganti lecca-lecca con un delicato sapore di rosa, perfetti per regali.',
        price: 8.75,
        image_url: 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Lecca-lecca',
        available_quantity: 18
      }
    ]

    console.log('📦 Inserimento prodotti...')
    const { data: insertedProducts, error: insertError } = await supabase
      .from('products')
      .insert(sampleProducts)
      .select()

    if (insertError) {
      console.error('❌ Errore inserimento prodotti:', insertError)
      return
    }

    console.log('✅ Prodotti inseriti con successo:', insertedProducts.length)
    console.log('🎉 Setup database completato!')
    
  } catch (error) {
    console.error('❌ Errore generale:', error)
  }
}

setupDatabase()
