import { supabase } from '../lib/supabase'

// Servizio per gestire i prodotti
export const productService = {
  // Ottieni tutti i prodotti
  async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true })
      
      if (error) {
        console.error('Error fetching products:', error)
        throw error
      }
      
      return data || []
    } catch (error) {
      console.error('Error in getAllProducts:', error)
      return []
    }
  },

  // Ottieni un prodotto per ID
  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('Error fetching product:', error)
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Error in getProductById:', error)
      return null
    }
  },

  // Aggiorna la quantità disponibile di un prodotto
  async updateProductQuantity(id, newQuantity) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ available_quantity: newQuantity })
        .eq('id', id)
        .select()
      
      if (error) {
        console.error('Error updating product quantity:', error)
        throw error
      }
      
      return data[0]
    } catch (error) {
      console.error('Error in updateProductQuantity:', error)
      return null
    }
  },

  // Aggiungi un nuovo prodotto (per admin)
  async addProduct(productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
      
      if (error) {
        console.error('Error adding product:', error)
        throw error
      }
      
      return data[0]
    } catch (error) {
      console.error('Error in addProduct:', error)
      return null
    }
  }
}
