import React, { useEffect } from 'react';
import { usePreorder } from '../context/PreorderContext'; // Import the usePreorder hook
import { orderService } from '../services/orderService'; // Import orderService

const CartPage = () => {
    const { preorderItems, removeItemFromPreorder, updateItemQuantity, getPreorderTotal, clearPreorder } = usePreorder();

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const subtotal = getPreorderTotal();
    const totalPreorderValue = subtotal; // Assuming no additional fees for now

    const handleQuantityChange = (productId, newQuantity) => {
        updateItemQuantity(productId, parseInt(newQuantity, 10));
    };

    const handleFormSubmit = async (event) => { // Make the function async
        event.preventDefault();
        // Basic form data retrieval
        const formData = new FormData(event.target);
        const customerDetails = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            pickupDate: formData.get('pickup-date'),
            notes: formData.get('notes'),
        };

        const orderData = {
            ...customerDetails,
            items: preorderItems,
            // Add any other necessary order fields like discountAmount, paymentMethod etc.
            // For example:
            // discountAmount: 0, 
            // paymentMethod: 'cash_on_pickup', // or get from form
            // deliveryType: 'pickup', // or get from form
        };

        try {
            const createdOrder = await orderService.createOrder(orderData);
            if (createdOrder) {
                console.log("Preorder Confirmed and Saved:", createdOrder);
                alert("Prenotazione confermata e salvata! Riceverai i dettagli via email.");
                clearPreorder(); // Clear the cart after submission
                event.target.reset(); // Reset form fields
            } else {
                // Handle case where order creation failed but no error was thrown by the service
                console.error("Order creation failed silently.");
                alert("Si è verificato un errore durante il salvataggio della prenotazione. Riprova.");
            }
        } catch (error) {
            console.error("Error creating order:", error);
            alert(`Si è verificato un errore: ${error.message}. Controlla la console per i dettagli.`);
        }
    };


    return (
        <div className="bg-secondary py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-semibold text-red-500 text-center mb-12">
                    Riepilogo della Tua Prenotazione
                </h1>

                {preorderItems.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">La tua lista di prenotazioni è attualmente vuota.</p>
                ) : (
                    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-6 md:p-8">
                        <ul className="space-y-6 mb-8">
                            {preorderItems.map(item => (
                                <li key={item.id} className="flex items-center justify-between pb-4">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-gray-800 font-cursive">{item.name}</h2>
                                        <p className="text-sm text-red-500">Prezzo unitario: €{parseFloat(item.price).toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center space-x-4 min-w-0">
                                        <div className="flex items-center space-x-2">
                                            <label htmlFor={`quantity-${item.id}`} className="text-sm text-gray-600">Qtà:</label>
                                            <input
                                                type="number"
                                                id={`quantity-${item.id}`}
                                                name={`quantity-${item.id}`}
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                        <span className="text-lg font-semibold text-red-500 min-w-[80px] text-right">
                                            €{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => removeItemFromPreorder(item.id)}
                                            className="text-red-600 hover:text-red-800 font-medium text-sm whitespace-nowrap"
                                            aria-label={`Rimuovi ${item.name}`}
                                        >
                                            Rimuovi
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="pt-6">
                            {/* Add any other fees or discounts here if needed */}
                            <div className="flex justify-between items-center text-xl font-bold text-red-500 mt-4">
                                <p>Valore Totale Prenotazione:</p>
                                <p>€{totalPreorderValue.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Customer Details Form */}
                        <div className="mt-16 pt-12 border-t-2 border-gray-300">
                            <h2 className="text-2xl font-semibold text-red-500 mb-6">I Tuoi Dati per il Ritiro</h2>
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                                    <input type="text" name="name" id="name" autoComplete="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Indirizzo Email</label>
                                    <input type="email" name="email" id="email" autoComplete="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Numero di Telefono</label>
                                    <input type="tel" name="phone" id="phone" autoComplete="tel" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="pickup-date" className="block text-sm font-medium text-gray-700">Data di Ritiro Preferita</label>
                                    <input type="date" name="pickup-date" id="pickup-date" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Note Aggiuntive (opzionale)</label>
                                    <textarea name="notes" id="notes" rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-lg disabled:opacity-50"
                                    disabled={preorderItems.length === 0} // Disable button if cart is empty
                                >
                                    Conferma Prenotazione
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;