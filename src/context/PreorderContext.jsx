import React, { createContext, useState, useContext } from 'react';

const PreorderContext = createContext();

export const usePreorder = () => useContext(PreorderContext);

export const PreorderProvider = ({ children }) => {
    const [preorderItems, setPreorderItems] = useState([]);    const addItemToPreorder = (productToAdd) => {
        setPreorderItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === productToAdd.id);
            const quantityToAdd = productToAdd.quantity || 1; // Use the passed quantity or default to 1
            
            if (existingItem) {
                // Increase quantity by the amount specified
                return prevItems.map(item =>
                    item.id === productToAdd.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
                );
            }
            // Add new item with the specified quantity
            return [...prevItems, { ...productToAdd, quantity: quantityToAdd }];
        });
    };

    const removeItemFromPreorder = (productIdToRemove) => {
        setPreorderItems(prevItems => {
            return prevItems.filter(item => item.id !== productIdToRemove);
        });
    };

    const updateItemQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            // If quantity is 0 or less, remove the item
            removeItemFromPreorder(productId);
        } else {
            setPreorderItems(prevItems =>
                prevItems.map(item =>
                    item.id === productId ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };

    const clearPreorder = () => {
        setPreorderItems([]);
    };
    
    const getPreorderTotal = () => {
        return preorderItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
    };

    return (
        <PreorderContext.Provider value={{ preorderItems, addItemToPreorder, removeItemFromPreorder, updateItemQuantity, clearPreorder, getPreorderTotal }}>
            {children}
        </PreorderContext.Provider>
    );
};
