import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-secondary shadow-lg sticky top-0 z-50"> {/* White background, noticeable shadow, sticky */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* Responsive padding */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-bold text-primary transition-colors duration-300 font-cursive"> {/* Removed hover:text-pink-700 */}
              Chill Bites
            </Link>
          </div>
          <div className="hidden sm:block"> {/* Hide on small screens, show on sm and up */}
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-md font-medium transition-colors duration-300">Home</Link>
              <Link to="/products" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-md font-medium transition-colors duration-300">Prodotti</Link>
              <Link to="/cart" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-md font-medium transition-colors duration-300">Prenotazioni</Link>
            </div>
          </div>
          {/* Mobile menu button (optional, for future enhancement) */}
          <div className="-mr-2 flex sm:hidden">
            <button type="button" className="bg-secondary inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-pink-700 hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary" aria-controls="mobile-menu" aria-expanded="false">
              <span className="sr-only">Apri menu principale</span>
              {/* Icon when menu is closed. */}
              {/* Heroicon name: outline/menu */}
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon when menu is open. */}
              {/* Heroicon name: outline/x */}
              <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state (optional, for future enhancement) */}
      {/* <div className="sm:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link to="/" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">Home</Link>
          <Link to="/products" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">Prodotti</Link>
          <Link to="/cart" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">Prenotazioni</Link>
        </div>
      </div> */}
    </nav>
  );
};

export default Navbar;