const { createClient } = require('@supabase/supabase-js');

// Configura Supabase con le credenziali del tuo progetto
const supabaseUrl = 'https://prsnvsqujosylkmnizdw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByc252c3F1am9zeWxrbW5pemR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTQxNTQsImV4cCI6MjA2NDA5MDE1NH0.x-Iu6GUCcYdTL3vyf9plr_CQz5-7W7xF6ovdPZ8Ccm0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addBiscoffCheesecake() {
  try {
    console.log('🍰 Aggiungendo Biscoff Baked Cheesecake...');
    
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: 'Biscoff Baked Cheesecake',
          description: 'Una deliziosa cheesecake cotta al forno con il sapore inconfondibile dei biscotti Lotus Biscoff. Base croccante di biscotti speziati e cremosa farcitura al formaggio con swirl di crema Biscoff. Un dessert che unisce la tradizione della cheesecake americana con il gusto unico dei biscotti belgi.',
          price: 15.00,
          image_url: '/images/products/lotus.png',
          category: 'cheesecake',
          available_quantity: 10,
          min_order_quantity: 1,
          max_order_quantity: 5,
          is_available: true,
          allergens: ['glutine', 'latticini', 'uova'],
          ingredients: 'Formaggio cremoso, biscotti Lotus Biscoff, burro, zucchero, uova, crema Biscoff, vaniglia',
          weight_grams: 800,
          preparation_time_hours: 48
        }
      ])
      .select();

    if (error) {
      console.error('❌ Errore nell\'inserimento:', error);
      return;
    }

    console.log('✅ Biscoff Baked Cheesecake aggiunto con successo!');
    console.log('📄 Dettagli prodotto:', data);
    
  } catch (err) {
    console.error('❌ Errore:', err.message);
  }
}

// Esegui la funzione
addBiscoffCheesecake();
