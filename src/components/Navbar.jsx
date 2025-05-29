import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleHomeClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Chiudi il menu mobile
    if (location.pathname === '/') {
      // Se siamo già sulla home, scroll verso l'alto
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Altrimenti naviga verso la home
      navigate('/');
    }
  };

  const handleProductsClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Chiudi il menu mobile
    if (location.pathname === '/') {
      // Se siamo già sulla home, scroll alla sezione prodotti
      const prodottiSection = document.getElementById('prodotti');
      if (prodottiSection) {
        prodottiSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Altrimenti naviga verso la home e poi scrolla ai prodotti
      navigate('/');
      // Usa setTimeout per aspettare che la navigazione sia completata
      setTimeout(() => {
        const prodottiSection = document.getElementById('prodotti');
        if (prodottiSection) {
          prodottiSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  return (
    <nav className="bg-secondary shadow-lg sticky top-0 z-50"> {/* White background, noticeable shadow, sticky */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* Responsive padding */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" onClick={handleHomeClick} className="text-3xl font-bold text-primary transition-colors duration-300 font-cursive"> {/* Removed hover:text-pink-700 */}
              Chill Bites
            </a>
          </div>
          <div className="hidden sm:block"> {/* Hide on small screens, show on sm and up */}
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="/" onClick={handleHomeClick} className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-md font-medium transition-colors duration-300">Home</a>
              <a href="#prodotti" onClick={handleProductsClick} className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-md font-medium transition-colors duration-300">Prodotti</a>
              <Link to="/cart" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-md font-medium transition-colors duration-300">Prenotazioni</Link>
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="-mr-2 flex sm:hidden">
            <button 
              type="button" 
              onClick={toggleMobileMenu}
              className="bg-secondary inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-pink-700 hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary" 
              aria-controls="mobile-menu" 
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Apri menu principale</span>
              {/* Icon when menu is closed */}
              <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon when menu is open */}
              <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 bg-secondary border-t border-pink-100">
          <a href="/" onClick={handleHomeClick} className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300">Home</a>
          <a href="#prodotti" onClick={handleProductsClick} className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300">Prodotti</a>
          <Link to="/cart" onClick={closeMobileMenu} className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300">Prenotazioni</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;