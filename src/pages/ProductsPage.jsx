import React from 'react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts'; // Import the hook

const ProductsPage = () => {
    const { products, loading, error } = useProducts(); // Use the hook

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                <p className="ml-4 text-xl text-gray-700">Caricamento prodotti...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-semibold text-red-600 mb-4">Oops! Qualcosa è andato storto.</h2>
                <p className="text-red-500 mb-2">Non è stato possibile caricare i prodotti.</p>
                <p className="text-sm text-gray-600">Dettagli errore: {error}</p>
                <button 
                    onClick={() => window.location.reload()} // Simple refresh, or use refetch from useProducts if available
                    className="mt-6 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                >
                    Riprova
                </button>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Nessun prodotto trovato.</h2>
                <p className="text-gray-600">Sembra che non ci siano prodotti disponibili al momento. Riprova più tardi!</p>
            </div>
        );
    }

    return (
        <div className="bg-secondary py-12 md:py-16"> {/* Use secondary for white bg */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-semibold text-primary text-center mb-12">
                    La Nostra Dolce Collezione
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                    {products.map(product => (
                        // Pass the entire product object as a prop
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;