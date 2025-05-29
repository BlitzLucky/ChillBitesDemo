-- Script completo per creare le tabelle nel database Supabase
-- Esegui questo script nel SQL Editor di Supabase Dashboard

-- ==============================================================================
-- TABELLA UTENTI
-- ==============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  date_of_birth DATE,
  is_admin BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- TABELLA PRODOTTI
-- ==============================================================================

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  category VARCHAR(100) DEFAULT 'dolci',
  available_quantity INTEGER DEFAULT 0 CHECK (available_quantity >= 0),
  min_order_quantity INTEGER DEFAULT 1,
  max_order_quantity INTEGER DEFAULT 50,
  is_available BOOLEAN DEFAULT TRUE,
  allergens TEXT[], -- Array per gli allergeni
  ingredients TEXT,
  weight_grams INTEGER,
  preparation_time_hours INTEGER DEFAULT 24,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- TABELLA ORDINI
-- ==============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  pickup_date DATE NOT NULL,
  pickup_time TIME,
  delivery_address TEXT,
  delivery_type VARCHAR(20) DEFAULT 'pickup' CHECK (delivery_type IN ('pickup', 'delivery')),
  notes TEXT,
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  discount_amount DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
  tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
  final_amount DECIMAL(10,2) NOT NULL CHECK (final_amount >= 0),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_method VARCHAR(50),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- TABELLA ELEMENTI ORDINE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- TABELLA CATEGORIE PRODOTTI (Opzionale)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS product_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- FUNZIONI E TRIGGER
-- ==============================================================================

-- Funzione per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Funzione per generare numero ordine
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'CB-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEW.id::text, 4, '0');
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per aggiornare updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger per generare numero ordine
CREATE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ==============================================================================
-- INDICI PER PERFORMANCE
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_pickup_date ON orders(pickup_date);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Abilita RLS per tutte le tabelle
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- POLICY DI SICUREZZA
-- ==============================================================================

-- Policy per utenti
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policy per prodotti (lettura pubblica)
CREATE POLICY "Allow public read access to products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Allow admin to manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

-- Policy per categorie (lettura pubblica)
CREATE POLICY "Allow public read access to categories" ON product_categories
  FOR SELECT USING (true);

-- Policy per ordini
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (
    user_id = auth.uid() OR 
    customer_email = auth.email() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

CREATE POLICY "Allow public insert access to orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin to manage orders" ON orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

-- Policy per elementi ordine
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR orders.customer_email = auth.email())
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

CREATE POLICY "Allow public insert access to order_items" ON order_items
  FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- INSERIMENTO CATEGORIE DI ESEMPIO
-- ==============================================================================

INSERT INTO product_categories (name, description, sort_order) VALUES
('Torte', 'Torte fresche e personalizzate', 1),
('Cupcakes', 'Dolci individuali perfetti per ogni occasione', 2),
('Biscotti', 'Biscotti artigianali con ingredienti di qualità', 3),
('Macarons', 'Eleganti macarons francesi', 4),
('Caramelle', 'Dolciumi e caramelle speciali', 5),
('Crostate', 'Crostate con frutta fresca di stagione', 6)
ON CONFLICT (name) DO NOTHING;

-- ==============================================================================
-- INSERIMENTO PRODOTTI DI ESEMPIO
-- ==============================================================================

INSERT INTO products (
  name, description, price, image_url, category, available_quantity, 
  allergens, ingredients, weight_grams, preparation_time_hours
) VALUES
(
  'Torta al Cioccolato Fondente',
  'Una torta al cioccolato deliziosamente ricca con una glassa cremosa e praline. Perfetta per compleanni e occasioni speciali.',
  25.99,
  'https://via.placeholder.com/400x300.png/8B4513/FFFFFF?text=Torta+Cioccolato',
  'Torte',
  10,
  ARRAY['glutine', 'uova', 'latte', 'frutta a guscio'],
  'Farina, cioccolato fondente, uova, burro, zucchero, latte, vaniglia',
  1200,
  48
),
(
  'Crostatina alle Fragole',
  'Fragole fresche su una leggera base di crema pasticcera con una pasta frolla burrosa. Un classico intramontabile.',
  18.50,
  'https://via.placeholder.com/400x300.png/FF69B4/FFFFFF?text=Crostatina+Fragole',
  'Crostate',
  15,
  ARRAY['glutine', 'uova', 'latte'],
  'Pasta frolla, crema pasticcera, fragole fresche, zucchero a velo',
  300,
  24
),
(
  'Assortimento di Macarons',
  'Una deliziosa selezione di macarons colorati con vari ripieni: vaniglia, cioccolato, lampone, pistacchio.',
  15.00,
  'https://via.placeholder.com/400x300.png/FFB6C1/FFFFFF?text=Macarons',
  'Macarons',
  0,
  ARRAY['uova', 'frutta a guscio'],
  'Mandorle, zucchero a velo, albume, coloranti naturali, vari ripieni',
  120,
  24
),
(
  'Cupcake Delizia Vaniglia',
  'Soffici cupcake alla vaniglia con frosting rosa al burro. Decorati a mano con perline di zucchero.',
  3.50,
  'https://via.placeholder.com/400x300.png/FFC0CB/FFFFFF?text=Cupcake',
  'Cupcakes',
  30,
  ARRAY['glutine', 'uova', 'latte'],
  'Farina, uova, burro, zucchero, vaniglia, frosting al burro',
  80,
  6
),
(
  'Biscotti Limonata Rosa',
  'Biscotti aciduli e dolci con una glassa alla limonata rosa. Perfetti per il tè del pomeriggio.',
  12.00,
  'https://via.placeholder.com/400x300.png/FFFACD/FF69B4?text=Biscotti',
  'Biscotti',
  20,
  ARRAY['glutine', 'uova'],
  'Farina, burro, zucchero, limone, uova, glassa',
  200,
  12
),
(
  'Lecca-lecca alla Rosa',
  'Eleganti lecca-lecca con un delicato sapore di rosa, perfetti per regali e bomboniere.',
  8.75,
  'https://via.placeholder.com/400x300.png/FFB6C1/FFFFFF?text=Lecca-lecca',
  'Caramelle',
  18,
  ARRAY[],
  'Zucchero, sciroppo di glucosio, aroma naturale di rosa, colorante naturale',
  25,
  4
)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- INSERIMENTO UTENTE ADMIN DI ESEMPIO
-- ==============================================================================

INSERT INTO users (
  id, email, name, phone, is_admin, is_active
) VALUES (
  gen_random_uuid(),
  'admin@chillbites.com',
  'Amministratore Chill Bites',
  '+39 123 456 7890',
  true,
  true
) ON CONFLICT (email) DO NOTHING;

-- ==============================================================================
-- FINE SCRIPT
-- ==============================================================================

-- Messaggio di conferma
SELECT 'Database Chill Bites creato con successo! 🍰' as message;
