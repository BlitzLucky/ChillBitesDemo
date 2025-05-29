import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import ContactPage from './pages/ContactPage';
// import DatabaseTest from './components/DatabaseTest'; // Let's comment this out for now if not actively used
// import DatabaseSetup from './components/DatabaseSetup'; // Let's comment this out for now if not actively used
import { PreorderProvider } from './context/PreorderContext'; // Import PreorderProvider
import './index.css';

// Explicitly import components for routes
const HomePageComponent = HomePage;
const ProductsPageComponent = ProductsPage;
const CartPageComponent = CartPage;
const ContactPageComponent = ContactPage;
// const DatabaseSetupComponent = DatabaseSetup;
// const DatabaseTestComponent = DatabaseTest;


function App() {
  return (
    <PreorderProvider> {/* Wrap Router with PreorderProvider */}
      <Router basename="/ChillBitesDemo">
        <div className="flex flex-col min-h-screen bg-secondary font-sans text-gray-800">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePageComponent />} />
              <Route path="/products" element={<ProductsPageComponent />} />
              <Route path="/cart" element={<CartPageComponent />} />
              <Route path="/contact" element={<ContactPageComponent />} />
              {/* <Route path="/db-test" element={<DatabaseTestComponent />} /> */}
              {/* <Route path="/db-setup" element={<DatabaseSetupComponent />} /> */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </PreorderProvider>
  );
}

export default App;