import React from 'react';
import { Link } from 'react-router-dom'; // Added Link import
import ProductCard from '../components/ProductCard';

const sampleProducts = [
    {
        id: 1,
        name: 'Torta al Cioccolato',
        description: 'Una torta al cioccolato deliziosamente ricca con una glassa cremosa e praline.',
        price: '25.99',
        imageUrl: 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Torta+Cioccolato',
        availableQuantity: 10, // Added
    },
    {
        id: 2,
        name: 'Crostatina alle Fragole',
        description: 'Fragole fresche su una leggera base di crema pasticcera con una pasta frolla burrosa.',
        price: '18.50',
        imageUrl: 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Crostatina+Fragole',
        availableQuantity: 15, // Added
    },
    {
        id: 3,
        name: 'Assortimento di Macarons',
        description: 'Una deliziosa selezione di macarons colorati con vari ripieni.',
        price: '15.00',
        imageUrl: 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Macarons',
        availableQuantity: 0, // Set to SOLD OUT
    },
    {
        id: 4,
        name: 'Cupcake Delizia',
        description: 'Soffici cupcake alla vaniglia con frosting rosa al burro.',
        price: '3.50',
        imageUrl: 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Cupcake',
        availableQuantity: 30, // Added
    },
    {
        id: 5,
        name: 'Biscotti Limonata Rosa',
        description: 'Biscotti aciduli e dolci con una glassa alla limonata rosa.',
        price: '12.00',
        imageUrl: 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Biscotti',
        availableQuantity: 20, // Added
    },
    {
        id: 6,
        name: 'Lecca-lecca alla Rosa',
        description: 'Eleganti lecca-lecca con un delicato sapore di rosa, perfetti per regali.',
        price: '8.75',
        imageUrl: 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Lecca-lecca',
        availableQuantity: 18, // Added
    },
];

const HomePage = () => {
    return (
        <div className="bg-white text-gray-800"> {/* Changed default text color from text-pink-600 */}
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center py-32 md:py-48"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }} // Brownie image
            >
                <div className="absolute inset-0 bg-black opacity-30"></div> {/* Overlay */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-secondary mb-4 tracking-tight font-cursive"> {/* text-secondary for white */}
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
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl font-semibold text-primary text-center mb-12"> {/* Changed text-red-600 to text-primary */}
                        Prodotti in Evidenza
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                        {sampleProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
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
                            className="block text-lg text-red-600 hover:text-red-700 transition-colors duration-300 ease-in-out" /* Changed text color to red and hover to a darker red, removed underline on hover */
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