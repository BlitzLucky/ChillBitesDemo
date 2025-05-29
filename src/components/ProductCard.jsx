import React, { useState } from 'react';
import Modal from './Modal'; // Import the Modal component for available products
import SoldOutModal from './SoldOutModal'; // Import the new SoldOutModal

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

    return (
        <>
            <div
                className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 group ${product.available_quantity > 0 ? 'hover:scale-105 cursor-pointer' : 'cursor-pointer'}`}
                onClick={handleOpenModal}
            >
                <div className="aspect-w-4 aspect-h-3">
                    <img
                        src={product.imageUrl || 'https://via.placeholder.com/400x300.png/FFC0CB/333333?text=Sweet'}
                        alt={product.name}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="p-5">
                    <h3 className={`text-2xl font-semibold text-primary mb-2 font-cursive group-hover:text-red-600`}>{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 h-16 overflow-hidden">{product.description}</p>
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-lg font-bold text-primary">{product.price}€</p>
                        {product.available_quantity > 0 ? (
                            <p className="text-sm text-gray-500">Disponibili: {product.available_quantity || 'N/A'}</p>
                        ) : (
                            <p className="text-sm font-bold text-red-600">SOLD OUT</p>
                        )}
                    </div>
                </div>
            </div>
            {/* Modal for available products */}
            {product.available_quantity > 0 && <Modal product={product} isOpen={isModalOpen} onClose={handleCloseModal} />}

            {/* Modal for sold out products */}
            <SoldOutModal isOpen={isSoldOutModalOpen} onClose={handleCloseSoldOutModal} />
        </>
    );
};

export default ProductCard;