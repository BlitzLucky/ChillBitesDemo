import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary text-secondary p-6 text-center mt-auto"> {/* Light pink background, white text, ensure it's at the bottom */}
      <p className="text-sm">&copy; {new Date().getFullYear()} <span className="font-cursive text-lg">Chill Bites</span>. Tutti i diritti riservati.</p>
      <div className="mt-3 space-x-4">
        <a href="https://www.instagram.com/chill.bitess/" target="_blank" rel="noopener noreferrer" className="hover:underline text-xs">Instagram</a>
        <a href="/privacy" className="hover:underline text-xs">Informativa sulla Privacy</a>
        <a href="/terms" className="hover:underline text-xs">Termini di Servizio</a>
        <a href="/contact" className="hover:underline text-xs">Contattaci</a>
      </div>
    </footer>
  );
};

export default Footer;