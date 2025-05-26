import React from 'react';
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
    // Aggiungi altri prodotti qui se necessario
];

const ProductsPage = () => {
    return (
        <div className="bg-secondary py-12 md:py-16"> {/* Use secondary for white bg */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-semibold text-primary text-center mb-12">
                    La Nostra Dolce Collezione
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                    {sampleProducts.map(product => (
                        // Pass the entire product object as a prop
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;