import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// =====================================================
// HOOK PER GESTIONE CATEGORIE PRODOTTI
// =====================================================

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carica tutte le categorie
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Carica categorieall'avvio
  useEffect(() => {
    fetchCategories();
  }, []);

  // Aggiungi nuova categoria
  const addCategory = async (categoryData) => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .insert([{
          name: categoryData.name,
          description: categoryData.description,
          image_url: categoryData.image_url,
          sort_order: categoryData.sort_order || 0
        }])
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => [...prev, data].sort((a, b) => a.sort_order - b.sort_order));
      return { success: true, data };
    } catch (err) {
      console.error('Error adding category:', err);
      return { success: false, error: err.message };
    }
  };

  // Aggiorna categoria
  const updateCategory = async (categoryId, updateData) => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .update(updateData)
        .eq('id', categoryId)
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => 
        prev.map(cat => cat.id === categoryId ? data : cat)
           .sort((a, b) => a.sort_order - b.sort_order)
      );
      return { success: true, data };
    } catch (err) {
      console.error('Error updating category:', err);
      return { success: false, error: err.message };
    }
  };

  // Elimina categoria (soft delete)
  const deleteCategory = async (categoryId) => {
    try {
      const { error } = await supabase
        .from('product_categories')
        .update({ is_active: false })
        .eq('id', categoryId);

      if (error) throw error;

      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting category:', err);
      return { success: false, error: err.message };
    }
  };

  // Riordina categorie
  const reorderCategories = async (categoryIds) => {
    try {
      const updates = categoryIds.map((id, index) => ({
        id,
        sort_order: index + 1
      }));

      for (const update of updates) {
        await supabase
          .from('product_categories')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);
      }

      await fetchCategories(); // Ricarica per aggiornare l'ordine
      return { success: true };
    } catch (err) {
      console.error('Error reordering categories:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories
  };
};

export default useCategories;
