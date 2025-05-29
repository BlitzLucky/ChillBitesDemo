import { useState, useEffect } from 'react'
import { productService } from '../services/productService'

// Hook personalizzato per gestire i prodotti
export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productService.getAllProducts()
      setProducts(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateProductQuantity = async (productId, newQuantity) => {
    try {
      await productService.updateProductQuantity(productId, newQuantity)
      // Aggiorna lo stato locale
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId
            ? { ...product, available_quantity: newQuantity }
            : product
        )
      )
    } catch (err) {
      setError(err.message)
      console.error('Error updating product quantity:', err)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    updateProductQuantity
  }
}
