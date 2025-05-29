-- Script per creare le tabelle nel database Supabase
-- Esegui questo script nel SQL Editor di Supabase

-- Tabella prodotti
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  available_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella ordini
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  pickup_date DATE,
  notes TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella elementi ordine
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserimento prodotti di esempio
INSERT INTO products (name, description, price, image_url, available_quantity) VALUES
('Torta al Cioccolato', 'Una torta al cioccolato deliziosamente ricca con una glassa cremosa e praline.', 25.99, 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Torta+Cioccolato', 10),
('Crostatina alle Fragole', 'Fragole fresche su una leggera base di crema pasticcera con una pasta frolla burrosa.', 18.50, 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Crostatina+Fragole', 15),
('Assortimento di Macarons', 'Una deliziosa selezione di macarons colorati con vari ripieni.', 15.00, 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Macarons', 0),
('Cupcake Delizia', 'Soffici cupcake alla vaniglia con frosting rosa al burro.', 3.50, 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Cupcake', 30),
('Biscotti Limonata Rosa', 'Biscotti aciduli e dolci con una glassa alla limonata rosa.', 12.00, 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Biscotti', 20),
('Lecca-lecca alla Rosa', 'Eleganti lecca-lecca con un delicato sapore di rosa, perfetti per regali.', 8.75, 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Lecca-lecca', 18);

-- Abilita Row Level Security (RLS) per sicurezza
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policy per permettere lettura pubblica dei prodotti
CREATE POLICY "Allow public read access to products" ON products
  FOR SELECT USING (true);

-- Policy per permettere inserimento pubblico degli ordini
CREATE POLICY "Allow public insert access to orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Policy per permettere inserimento pubblico degli elementi ordine
CREATE POLICY "Allow public insert access to order_items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Policy per permettere lettura pubblica degli ordini (per admin)
CREATE POLICY "Allow public read access to orders" ON orders
  FOR SELECT USING (true);

-- Policy per permettere lettura pubblica degli elementi ordine (per admin)
CREATE POLICY "Allow public read access to order_items" ON order_items
  FOR SELECT USING (true);

-- Trigger per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
