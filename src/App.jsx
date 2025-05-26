import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import { PreorderProvider } from './context/PreorderContext'; // Import PreorderProvider

function App() {
  return (
    <PreorderProvider> {/* Wrap Router with PreorderProvider */}
      <Router>
        <div className="flex flex-col min-h-screen bg-secondary font-sans text-gray-800">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </PreorderProvider>
  );
}

export default App;