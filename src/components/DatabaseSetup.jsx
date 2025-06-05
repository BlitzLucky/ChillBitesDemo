import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DatabaseSetup = () => {
  const [status, setStatus] = useState('Checking database connection...');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setupDatabase();
  }, []);

  const setupDatabase = async () => {
    try {
      setStatus('🔍 Testing Supabase connection...');
      
      // Test basic connection
      const { data: testData, error: testError } = await supabase
        .from('products')
        .select('count', { count: 'exact', head: true });

      if (testError) {
        if (testError.code === '42P01') {
          // Table doesn't exist
          setStatus('📋 Database tables not found. Creating tables...');
          await createTables();
        } else {
          throw testError;
        }
      } else {
        setStatus('✅ Database connection successful!');
        await loadProducts();
      }
    } catch (err) {
      console.error('Database setup error:', err);
      setError(err.message);
      setStatus(`❌ Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  const createTables = async () => {
    try {
      setStatus('🏗️ Creating database tables...');
      setStatus('❌ Le tabelle devono essere create manualmente dal Dashboard Supabase.');
      setStatus('📋 Vai su https://supabase.com/dashboard/project/prsnvsqujosylkmnizdw/editor');
      setStatus('💡 Copia e incolla il contenuto del file complete-database-setup.sql');
      
      // Instead of trying to create tables directly, we'll just try to insert sample data
      setStatus('📦 Attempting to insert sample products...');
      await insertSampleProducts();
      
    } catch (err) {
      throw new Error(`Database setup needed: ${err.message}`);
    }
  };

  const insertSampleProducts = async () => {
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
    ];

    try {
      const { data, error } = await supabase
        .from('products')
        .insert(sampleProducts)
        .select();

      if (error) throw error;

      setProducts(data);
      setStatus(`✅ Database setup complete! Inserted ${data.length} products.`);
    } catch (err) {
      throw new Error(`Failed to insert sample products: ${err.message}`);
    }
  };

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id');

      if (error) throw error;

      setProducts(data);
      setStatus(`✅ Database ready! Found ${data.length} products.`);
    } catch (err) {
      throw new Error(`Failed to load products: ${err.message}`);
    }
  };

  const resetDatabase = async () => {
    if (!window.confirm('Are you sure you want to reset the database? This will delete all data.')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      setStatus('🗑️ Clearing existing data...');
      
      // Delete all products
      const { error } = await supabase
        .from('products')
        .delete()
        .neq('id', 0); // Delete all rows

      if (error) throw error;

      setStatus('📦 Inserting fresh sample data...');
      await insertSampleProducts();
    } catch (err) {
      setError(err.message);
      setStatus(`❌ Reset failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary mb-6">🍰 Chill Bites Database Setup</h2>
      
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          {isLoading && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>}
          <p className={`text-lg font-medium ${error ? 'text-red-600' : 'text-green-600'}`}>
            {status}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <h3 className="text-red-800 font-medium">Error Details:</h3>
            <pre className="text-red-700 text-sm mt-2 whitespace-pre-wrap">{error}</pre>
          </div>
        )}
      </div>

      {products.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📋 Products in Database:</h3>
          <div className="grid gap-3">
            {products.map(product => (
              <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-800">{product.name}</span>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-primary">€{product.price}</span>
                  <p className="text-sm text-gray-600">
                    Qty: {product.available_quantity}
                    {product.available_quantity === 0 && <span className="text-red-500 ml-1">(Sold Out)</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex space-x-4">        <button 
          onClick={setupDatabase}
          disabled={isLoading}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Setting up...' : '🔄 Refresh'}
        </button>
        
        <button 
          onClick={resetDatabase}
          disabled={isLoading}
          className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Resetting...' : '🗑️ Reset Database'}
        </button>
      </div>      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-blue-800 font-medium mb-2">🚀 Istruzioni per Setup Completo:</h4>
        <ol className="text-blue-700 text-sm space-y-2 list-decimal list-inside">
          <li>Vai al <a href="https://supabase.com/dashboard/project/prsnvsqujosylkmnizdw/editor" target="_blank" rel="noopener noreferrer" className="underline font-medium">SQL Editor di Supabase</a></li>
          <li>Copia il contenuto del file <code className="bg-blue-100 px-1 rounded">src/database/complete-database-setup.sql</code></li>
          <li>Incolla ed esegui lo script nel SQL Editor</li>
          <li>Questo creerà:
            <ul className="ml-4 mt-1 space-y-1 list-disc list-inside">
              <li><strong>Tabella users</strong> - Gestione utenti registrati</li>
              <li><strong>Tabella products</strong> - Catalogo prodotti migliorato</li>
              <li><strong>Tabella orders</strong> - Sistema ordini completo</li>
              <li><strong>Tabella order_items</strong> - Dettagli ordini</li>
              <li><strong>Tabella product_categories</strong> - Categorie prodotti</li>
              <li><strong>Policies di sicurezza</strong> - Row Level Security</li>
              <li><strong>Trigger automatici</strong> - Aggiornamenti timestamp</li>
              <li><strong>Dati di esempio</strong> - Prodotti e categorie iniziali</li>
            </ul>
          </li>
          <li>Torna qui e clicca "Refresh" per verificare la connessione</li>
        </ol>
      </div>
    </div>
  );
};

export default DatabaseSetup;
