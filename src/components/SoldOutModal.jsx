import React from 'react';

const SoldOutModal = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
                <h2 className="text-2xl font-semibold text-primary mb-4 font-cursive">Prodotto Esaurito</h2>
                <p className="text-gray-700 mb-6">
                    Siamo spiacenti, questo prodotto è momentaneamente esaurito.
                </p>
                <button
                    onClick={onClose}
                    className="bg-primary text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
                >
                    Capito
                </button>
            </div>
        </div>
    );
};

export default SoldOutModal;
