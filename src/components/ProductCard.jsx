import React, { useState } from 'react';
import Modal from './Modal'; // Import the Modal component for available products
import SoldOutModal from './SoldOutModal'; // Import the new SoldOutModal
import lotusImage from '../assets/images/lotus.jpg'; // Import the image directly
import newyorkImage from '../assets/images/newyork-cheesecake.jpg'; // Import the New York cheesecake image
import crinklesImage from '../assets/images/crinkles.jpg'; // Import the crinkles image

const ProductCard = ({ product }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSoldOutModalOpen, setIsSoldOutModalOpen] = useState(false);

    const handleOpenModal = () => {
        if (product.available_quantity > 0) {
            setIsModalOpen(true);
        } else {
            setIsSoldOutModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCloseSoldOutModal = () => {
        setIsSoldOutModalOpen(false);
    };

    // Costruisci il percorso completo dell'immagine
    const getImageUrl = () => {
        if (product.name === "Biscoff Baked Cheesecake") {
            return lotusImage;
        }
        if (product.name === "New York Baked Cheesecake") {
            return newyorkImage;
        }
        if (product.name === "Crinkles al cioccolato") {
            return crinklesImage;
        }
        // Prova anche con altri possibili nomi del prodotto
        if (product.name && product.name.toLowerCase().includes('biscoff')) {
            return lotusImage;
        }
        if (product.name && product.name.toLowerCase().includes('new york')) {
            return newyorkImage;
        }
        if (product.name && product.name.toLowerCase().includes('crinkles')) {
            return crinklesImage;
        }
        return product.image_url || 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Sweet';
    };

    return (
        <>
            <div
                className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 group h-full flex flex-col ${product.available_quantity > 0 ? 'hover:scale-105 cursor-pointer' : 'cursor-pointer'}`}
                onClick={handleOpenModal}
            >
                <div className="w-full h-48 flex-shrink-0">
                    <img
                        src={getImageUrl()}
                        alt={product.name}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className={`text-xl font-semibold text-red-500 hover:text-red-600 transition-colors duration-300 mb-2 font-cursive min-h-[3rem] flex items-center`}>{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 h-16 overflow-hidden flex-grow-0">{product.description}</p>
                    <div className="flex justify-between items-center mt-auto pt-4">
                        <p className="text-lg font-bold text-red-500">{product.price}€</p>
                        {product.available_quantity > 0 ? (
                            <p className="text-sm text-gray-500">Disponibili: {product.available_quantity || 'N/A'}</p>
                        ) : (
                            <p className="text-sm font-bold text-red-600">SOLD OUT</p>
                        )}
                    </div>
                </div>
            </div>
            {/* Modal for products (always rendered) */}
            <Modal product={product} isOpen={isModalOpen} onClose={handleCloseModal} />

            {/* Modal for sold out products */}
            <SoldOutModal isOpen={isSoldOutModalOpen} onClose={handleCloseSoldOutModal} />
        </>
    );
};

export default ProductCard;