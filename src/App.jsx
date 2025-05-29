import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
// import DatabaseSetup from './components/DatabaseSetup'; // Let's comment this out for now if not actively used
// import DatabaseTest from './components/DatabaseTest'; // Let's comment this out for now if not actively used
import { PreorderProvider } from './context/PreorderContext'; // Import PreorderProvider

// Explicitly import components for routes
const HomePageComponent = HomePage;
const ProductsPageComponent = ProductsPage;
const CartPageComponent = CartPage;
// const DatabaseSetupComponent = DatabaseSetup;
// const DatabaseTestComponent = DatabaseTest;


function App() {
  return (
    <PreorderProvider> {/* Wrap Router with PreorderProvider */}
      <Router>
        <div className="flex flex-col min-h-screen bg-secondary font-sans text-gray-800">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePageComponent />} />
              <Route path="/products" element={<ProductsPageComponent />} />
              <Route path="/cart" element={<CartPageComponent />} />
              {/* <Route path="/setup" element={<DatabaseSetupComponent />} /> */}
              {/* <Route path="/test" element={<DatabaseTestComponent />} /> */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </PreorderProvider>
  );
}

export default App;