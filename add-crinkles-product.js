// Script per aggiungere il prodotto "Crinkles al cioccolato"
// Esegui con: node add-crinkles-product.js

import { createClient } from '@supabase/supabase-js'

// Configurazione Supabase
const supabaseUrl = 'https://prsnvsqujosylkmnizdw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByc252c3F1am9zeWxrbW5pemR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMTY1NjksImV4cCI6MjA0ODg5MjU2OX0.kL65Dq7R9Lqp52h7VbJOwlH5Ay8_F9-6awG2dkxXbVg'

const supabase = createClient(supabaseUrl, supabaseKey)

async function addCrinklesProduct() {
  console.log('🍪 Aggiungendo Crinkles al cioccolato...')
  
  try {
    const productData = {
      name: 'Crinkles al cioccolato',
      description: 'Deliziosi biscotti morbidi al cioccolato con superficie screpolata. Confezione da 8 pezzi, perfetti per la colazione o la merenda.',
      price: 5.00,
      image_url: 'crinkles.jpg',
      category: 'Biscotti',
      available_quantity: 25,
      allergens: ['glutine', 'uova', 'latte'],
      ingredients: 'Farina, cacao in polvere, cioccolato fondente, uova, burro, zucchero, lievito, vaniglia',
      weight_grams: 320,
      preparation_time_hours: 4
    }

    // Prova prima a vedere se il prodotto esiste già
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('id, name')
      .eq('name', productData.name)
      .single()

    if (existingProduct) {
      console.log(`⚠️  Il prodotto "${productData.name}" esiste già con ID: ${existingProduct.id}`)
      
      // Aggiorna il prodotto esistente
      const { data: updatedProduct, error: updateError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', existingProduct.id)
        .select()
        .single()

      if (updateError) {
        console.error('❌ Errore aggiornamento prodotto:', updateError)
        return
      }

      console.log('✅ Prodotto aggiornato con successo:', updatedProduct)
    } else {
      // Inserisci nuovo prodotto
      const { data: newProduct, error: insertError } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single()

      if (insertError) {
        console.error('❌ Errore inserimento prodotto:', insertError)
        return
      }

      console.log('✅ Nuovo prodotto inserito con successo:', newProduct)
    }

    // Verifica il risultato finale
    const { data: allProducts, error: listError } = await supabase
      .from('products')
      .select('id, name, price, available_quantity')
      .order('id')

    if (listError) {
      console.error('❌ Errore caricamento prodotti:', listError)
      return
    }

    console.log('\n📋 Tutti i prodotti nel database:')
    allProducts.forEach(product => {
      console.log(`  ${product.id}: ${product.name} - €${product.price} (Qty: ${product.available_quantity})`)
    })

  } catch (error) {
    console.error('❌ Errore generale:', error)
  }
}

// Esegui lo script
addCrinklesProduct()
