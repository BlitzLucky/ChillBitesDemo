import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts'; // Import the useProducts hook

const HomePage = () => {
    const { products, loading, error } = useProducts(); // Use the hook

    return (
        <div className="bg-white text-gray-800">
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center py-32 md:py-48"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}
            >
                <div className="absolute inset-0 bg-black opacity-30"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-secondary mb-4 tracking-tight font-cursive">
                        Benvenuti da Chill Bites
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-cursive">
                        Scopri un mondo di dolci artigianali irresistibili. Prenota i tuoi preferiti oggi!
                    </p>
                    <Link
                        to="/products"
                        className="bg-primary text-white hover:text-red-600 font-semibold py-3 px-10 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 text-lg"
                    >
                        Esplora le Nostre Delizie
                    </Link>
                </div>
            </section>

            {/* Featured Products Section */}
            <section id="prodotti" className="py-16 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl font-semibold text-primary text-center mb-12">
                        Prodotti in Evidenza
                    </h2>
                    {loading && <p className="text-center text-lg">Caricamento prodotti...</p>}
                    {error && <p className="text-center text-lg text-red-500">Errore nel caricamento dei prodotti: {error}</p>}
                    {!loading && !error && products.length === 0 && (
                        <p className="text-center text-lg">Nessun prodotto disponibile al momento.</p>
                    )}
                    {!loading && !error && products.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Optional: Call to Action or About Us Snippet */}
            <section className="bg-pink-50 py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-2xl sm:text-3xl font-semibold text-primary mb-6">
                        Hai una Richiesta Speciale o un Evento?
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                        Amiamo creare ordini personalizzati per compleanni, matrimoni ed eventi aziendali. Contattaci per discutere le tue dolci idee!
                    </p>
                    <div className="space-y-3 md:flex md:flex-col md:items-center">
                        <p className="text-lg text-black">
                            trinah@gmail.com
                        </p>
                        <p className="text-lg text-black">
                            +39 392 134 5676
                        </p>
                        <a
                            href="https://www.instagram.com/chill.bitess/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-lg text-red-600 hover:text-red-700 transition-colors duration-300 ease-in-out"
                        >
                            Instagram
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;