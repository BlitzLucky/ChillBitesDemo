import { supabase } from '../lib/supabase';

// =====================================================
// SERVIZIO GESTIONE UTENTI
// =====================================================

export const userService = {
  // Registrazione nuovo utente
  async registerUser(userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          email: userData.email,
          name: userData.name,
          phone: userData.phone || null,
          address: userData.address || null,
          city: userData.city || null,
          postal_code: userData.postal_code || null,
          date_of_birth: userData.date_of_birth || null
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Errore registrazione utente:', error);
      return { success: false, error: error.message };
    }
  },

  // Ottieni utente per email
  async getUserByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return { success: true, data };
    } catch (error) {
      console.error('Errore recupero utente:', error);
      return { success: false, error: error.message };
    }
  },

  // Ottieni utente per ID
  async getUserById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Errore recupero utente:', error);
      return { success: false, error: error.message };
    }
  },

  // Aggiorna profilo utente
  async updateUserProfile(userId, updateData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          name: updateData.name,
          phone: updateData.phone,
          address: updateData.address,
          city: updateData.city,
          postal_code: updateData.postal_code,
          date_of_birth: updateData.date_of_birth,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Errore aggiornamento profilo:', error);
      return { success: false, error: error.message };
    }
  },

  // Disattiva utente (soft delete)
  async deactivateUser(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Errore disattivazione utente:', error);
      return { success: false, error: error.message };
    }
  },

  // Lista tutti gli utenti (solo admin)
  async getAllUsers(limit = 50, offset = 0) {
    try {
      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { success: true, data, total: count };
    } catch (error) {
      console.error('Errore recupero utenti:', error);
      return { success: false, error: error.message };
    }
  },

  // Cerca utenti per nome o email
  async searchUsers(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .eq('is_active', true)
        .order('name')
        .limit(20);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Errore ricerca utenti:', error);
      return { success: false, error: error.message };
    }
  },

  // Verifica se email è già registrata
  async checkEmailExists(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error && error.code === 'PGRST116') {
        return { success: true, exists: false };
      }
      if (error) throw error;
      
      return { success: true, exists: true };
    } catch (error) {
      console.error('Errore verifica email:', error);
      return { success: false, error: error.message };
    }
  },

  // Ottieni statistiche utenti
  async getUserStats() {
    try {
      const { data: totalUsers, error: totalError } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true);

      if (totalError) throw totalError;

      const { data: newUsers, error: newError } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (newError) throw newError;

      const { data: adminUsers, error: adminError } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq('is_admin', true);

      if (adminError) throw adminError;

      return {
        success: true,
        data: {
          total: totalUsers?.length || 0,
          newThisMonth: newUsers?.length || 0,
          admins: adminUsers?.length || 0
        }
      };
    } catch (error) {
      console.error('Errore statistiche utenti:', error);
      return { success: false, error: error.message };
    }
  }
};

export default userService;
