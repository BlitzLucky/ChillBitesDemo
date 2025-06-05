import React, { useState, useEffect } from 'react';
import { usePreorder } from '../context/PreorderContext'; // Changed import
import lotusImage from '../assets/images/lotus.jpg'; // Import the image directly
import newyorkImage from '../assets/images/newyork-cheesecake.jpg'; // Import the New York cheesecake image
import crinklesImage from '../assets/images/crinkles.jpg'; // Import the crinkles image

const Modal = ({ product, onClose, isOpen }) => {
    const { addItemToPreorder } = usePreorder(); // Changed to use the hook
    const [quantity, setQuantity] = useState(1);    useEffect(() => {
        // Reset quantity when product changes or modal opens
        if (isOpen) {
            setQuantity(1);
            // Blocca lo scroll del body quando il modal è aperto
            document.body.style.overflow = 'hidden';
        } else {
            // Ripristina lo scroll del body quando il modal è chiuso
            document.body.style.overflow = 'unset';
        }

        // Cleanup function per ripristinare lo scroll quando il componente viene smontato
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, product]);

    if (!isOpen || !product) {
        return null;
    }

    const handleReserve = () => {
        addItemToPreorder({ ...product, quantity });
        onClose(); // Close modal after reserving
        alert('Aggiunti ' + quantity + ' x ' + product.name + ' alla prenotazione!'); // Optional: User feedback
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        // Allow clearing the input or setting a valid number
        if (e.target.value === '' || (value > 0 && (!product.available_quantity || value <= product.available_quantity))) {
            setQuantity(e.target.value === '' ? '' : value);
        } else if (product.available_quantity && value > product.available_quantity) {
            setQuantity(product.available_quantity); // Cap at max available
        } else if (value <= 0) {
            setQuantity(1); // Reset to 1 if invalid
        }
    };    const currentQuantity = quantity === '' ? 0 : parseInt(quantity, 10);    // Costruisci il percorso completo dell'immagine
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
    };return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 rounded-lg shadow-xl max-w-sm w-full max-h-[90vh] overflow-y-auto">                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold text-red-500 hover:text-red-600 transition-colors duration-300 font-cursive">{product.name}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-900 text-2xl"
                        aria-label="Close modal"
                    >
                        &times;                    </button>                </div>
                <img
                    src={getImageUrl()}
                    alt={product.name}
                    className="w-full h-40 object-contain rounded-md mb-3 bg-gray-50"                />
                <p className="text-gray-700 mb-3 text-sm">{product.description}</p>
                <div className="mb-3">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantità:
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        max={product.available_quantity || undefined}
                        disabled={!product || product.available_quantity <= 0}
                        className="w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />                </div>                {product.available_quantity > 0 ? (
                    <p className="text-sm text-gray-600 mb-1">Disponibilità: {product.available_quantity}</p>
                ) : (
                    <p className="text-sm font-bold text-red-600 mb-1">SOLD OUT</p>
                )}
                <p className="text-lg font-semibold text-red-500 mb-4">Prezzo: {product.price}€</p>                <button
                    onClick={handleReserve}
                    disabled={!product || product.available_quantity <= 0 || currentQuantity <= 0 || currentQuantity > product.available_quantity}
                    className="w-full bg-red-500 text-white hover:bg-red-600 font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {product.available_quantity <= 0 ? 'Non Disponibile' : 'Prenota'}
                </button>
            </div>
        </div>
    );
};

export default Modal;
