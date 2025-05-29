# 🍰 Chill Bites - Setup Database

Guida completa per configurare il database Supabase per l'applicazione Chill Bites.

## 📋 Tabelle Create

### 1. **users** - Gestione Utenti
- `id` (UUID) - Chiave primaria
- `email` (VARCHAR) - Email univoca
- `name` (VARCHAR) - Nome completo
- `phone` (VARCHAR) - Telefono
- `address`, `city`, `postal_code` - Indirizzo
- `date_of_birth` (DATE) - Data di nascita
- `is_admin` (BOOLEAN) - Flag amministratore
- `is_active` (BOOLEAN) - Utente attivo
- Timestamp di creazione e aggiornamento

### 2. **products** - Catalogo Prodotti
- `id` (SERIAL) - Chiave primaria
- `name` (VARCHAR) - Nome prodotto
- `description` (TEXT) - Descrizione dettagliata
- `price` (DECIMAL) - Prezzo
- `category` (VARCHAR) - Categoria
- `available_quantity` (INTEGER) - Quantità disponibile
- `allergens` (TEXT[]) - Array allergeni
- `ingredients` (TEXT) - Ingredienti
- `weight_grams` (INTEGER) - Peso in grammi
- `preparation_time_hours` (INTEGER) - Ore di preparazione
- Timestamp di creazione e aggiornamento

### 3. **orders** - Sistema Ordini
- `id` (SERIAL) - Chiave primaria
- `user_id` (UUID) - Riferimento utente
- `order_number` (VARCHAR) - Numero ordine univoco
- `customer_name`, `customer_email`, `customer_phone` - Dati cliente
- `pickup_date`, `pickup_time` - Data e ora ritiro
- `delivery_address`, `delivery_type` - Consegna
- `total_amount`, `discount_amount`, `tax_amount`, `final_amount` - Importi
- `status` - Stato ordine (pending, confirmed, preparing, ready, completed, cancelled)
- `payment_status` - Stato pagamento (pending, paid, refunded)
- `special_requests` - Richieste speciali
- Timestamp di creazione e aggiornamento

### 4. **order_items** - Dettagli Ordine
- `id` (SERIAL) - Chiave primaria
- `order_id` (INTEGER) - Riferimento ordine
- `product_id` (INTEGER) - Riferimento prodotto
- `quantity` (INTEGER) - Quantità
- `unit_price`, `total_price` (DECIMAL) - Prezzi
- `special_instructions` (TEXT) - Istruzioni speciali

### 5. **product_categories** - Categorie Prodotti
- `id` (SERIAL) - Chiave primaria
- `name` (VARCHAR) - Nome categoria
- `description` (TEXT) - Descrizione
- `image_url` (TEXT) - URL immagine
- `sort_order` (INTEGER) - Ordine visualizzazione
- `is_active` (BOOLEAN) - Categoria attiva

## 🚀 Istruzioni Setup

### 1. Accesso Dashboard Supabase
1. Vai su [Supabase Dashboard](https://supabase.com/dashboard)
2. Seleziona il progetto: `prsnvsqujosylkmnizdw`
3. Naviga in **SQL Editor**

### 2. Esecuzione Script
1. Apri il file `src/database/complete-database-setup.sql`
2. Copia tutto il contenuto
3. Incolla nel SQL Editor di Supabase
4. Clicca **RUN** per eseguire

### 3. Verifica Setup
1. Vai su **Table Editor** nel dashboard
2. Verifica che siano presenti le 5 tabelle
3. Controlla che ci siano prodotti di esempio nella tabella `products`

### 4. Test Applicazione
1. Avvia l'app con `npm start`
2. Vai su `http://localhost:3001/setup`
3. Verifica che la connessione sia funzionante
4. Rimuovi la route `/setup` da `App.jsx` quando tutto funziona

## 🔧 Funzionalità Incluse

### ✅ Gestione Prodotti
- Creazione, modifica, eliminazione
- Categorie e filtri
- Gestione stock e disponibilità
- Allergeni e ingredienti

### ✅ Sistema Ordini
- Ordini con numero progressivo automatico
- Stati multipli (pending → completed)
- Calcolo automatico tasse e sconti
- Supporto ritiro e consegna

### ✅ Gestione Utenti
- Registrazione clienti
- Profili utente completi
- Ruoli admin
- Storico ordini

### ✅ Sicurezza
- Row Level Security (RLS)
- Policy granulari per ogni tabella
- Accesso sicuro ai dati

### ✅ Performance
- Indici ottimizzati
- Trigger automatici
- Funzioni PostgreSQL

## 📱 Servizi Disponibili

### `userService.js`
```javascript
// Registrazione utente
await userService.registerUser(userData);

// Ricerca utente
await userService.getUserByEmail(email);

// Aggiornamento profilo
await userService.updateUserProfile(userId, data);
```

### `orderService.js` (Aggiornato)
```javascript
// Crea ordine completo
await orderService.createOrder(orderData);

// Filtri avanzati
await orderService.getAllOrders({ status: 'pending' });

// Statistiche
await orderService.getOrderStats();
```

### `useCategories.js`
```javascript
// Hook per categorie
const { categories, addCategory, updateCategory } = useCategories();
```

## 🎯 Prossimi Passi

1. **Esegui il setup del database**
2. **Testa la connessione**
3. **Personalizza i prodotti**
4. **Configura i metodi di pagamento**
5. **Implementa notifiche email**

## 🆘 Problemi Comuni

### Errore connessione
- Verifica URL e API key in `supabase.js`
- Controlla le policy RLS

### Tabelle non create
- Esegui manualmente lo script SQL
- Verifica permessi database

### Prodotti non caricati
- Controlla la tabella `products`
- Verifica policy di lettura

---

**Buon lavoro con Chill Bites! 🍰✨**
