import { supabase } from '../lib/supabase';
import { productService } from './productService'; // Import productService

// =====================================================
// SERVIZIO GESTIONE ORDINI - VERSIONE MIGLIORATA
// =====================================================

export const orderService = {
  // Crea un nuovo ordine completo
  async createOrder(orderData) {
    try {
      // Calcola gli importi
      const totalAmount = orderData.items.reduce((sum, item) => 
        sum + (parseFloat(item.price) * item.quantity), 0
      );
      const taxAmount = totalAmount * 0.22; // IVA 22%
      const finalAmount = totalAmount + taxAmount - (orderData.discountAmount || 0);

      const { data, error } = await supabase
        .from('orders')
        .insert([{
          user_id: orderData.userId || null,
          customer_name: orderData.name,
          customer_email: orderData.email,
          customer_phone: orderData.phone,
          pickup_date: orderData.pickupDate,
          pickup_time: orderData.pickupTime || null,
          delivery_address: orderData.deliveryAddress || null,
          delivery_type: orderData.deliveryType || 'pickup',
          notes: orderData.notes,
          total_amount: totalAmount,
          discount_amount: orderData.discountAmount || 0,
          tax_amount: taxAmount,
          final_amount: finalAmount,
          status: 'pending',
          payment_method: orderData.paymentMethod || null,
          special_requests: orderData.specialRequests || null
        }])
        .select()
      
      if (error) {
        console.error('Error creating order:', error)
        throw error
      }
      
      // Aggiungi gli items all'ordine
      if (orderData.items && orderData.items.length > 0) {
        const itemsResult = await this.addOrderItems(data[0].id, orderData.items);
        if (!itemsResult) {
          // Consider rolling back order creation or logging a critical error
          throw new Error('Failed to add order items');
        }

        // Decrease product quantities
        for (const item of orderData.items) {
          const product = await productService.getProductById(item.id);
          if (product) {
            const newQuantity = product.available_quantity - item.quantity;
            await productService.updateProductQuantity(item.id, newQuantity);
          } else {
            // Handle case where product is not found, though this should ideally not happen if cart is synced
            console.warn(`Product with ID ${item.id} not found when trying to update quantity.`);
          }
        }
      }
      
      return data[0]
    } catch (error) {
      console.error('Error in createOrder:', error)
      return null
    }
  },
  // Aggiungi items all'ordine
  async addOrderItems(orderId, items) {
    try {
      const orderItems = items.map(item => ({
        order_id: orderId,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: parseFloat(item.price),
        total_price: parseFloat(item.price) * item.quantity,
        special_instructions: item.specialInstructions || null
      }))

      const { data, error } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select()
      
      if (error) {
        console.error('Error adding order items:', error)
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Error in addOrderItems:', error)
      return null
    }
  },

  // Ottieni tutti gli ordini con filtri
  async getAllOrders(filters = {}) {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `);

      // Applica filtri
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.dateFrom) {
        query = query.gte('pickup_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('pickup_date', filters.dateTo);
      }
      if (filters.customerEmail) {
        query = query.eq('customer_email', filters.customerEmail);
      }
      if (filters.deliveryType) {
        query = query.eq('delivery_type', filters.deliveryType);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching orders:', error)
        throw error
      }
      
      return data || []
    } catch (error) {
      console.error('Error in getAllOrders:', error)
      return []
    }
  },

  // Ottieni ordine singolo per ID
  async getOrderById(orderId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('id', orderId)
        .single();
      
      if (error) {
        console.error('Error fetching order:', error)
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Error in getOrderById:', error)
      return null
    }
  },

  // Ottieni ordini per utente
  async getOrdersByUser(userEmail) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('customer_email', userEmail)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user orders:', error)
        throw error
      }
      
      return data || []
    } catch (error) {
      console.error('Error in getOrdersByUser:', error)
      return []
    }
  },
  // Aggiorna lo status di un ordine
  async updateOrderStatus(orderId, newStatus) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
      
      if (error) {
        console.error('Error updating order status:', error)
        throw error
      }
      
      return data[0]
    } catch (error) {
      console.error('Error in updateOrderStatus:', error)
      return null
    }
  },

  // Aggiorna status pagamento
  async updatePaymentStatus(orderId, paymentStatus, paymentMethod = null) {
    try {
      const updateData = { 
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      };
      
      if (paymentMethod) {
        updateData.payment_method = paymentMethod;
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
      
      if (error) {
        console.error('Error updating payment status:', error)
        throw error
      }
      
      return data[0]
    } catch (error) {
      console.error('Error in updatePaymentStatus:', error)
      return null
    }
  },

  // Aggiorna ordine completo
  async updateOrder(orderId, updateData) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
      
      if (error) {
        console.error('Error updating order:', error)
        throw error
      }
      
      return data[0]
    } catch (error) {
      console.error('Error in updateOrder:', error)
      return null
    }
  },

  // Cancella ordine
  async cancelOrder(orderId, reason = null) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled',
          notes: reason ? `${reason}` : 'Ordine cancellato',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
      
      if (error) {
        console.error('Error cancelling order:', error)
        throw error
      }
      
      return data[0]
    } catch (error) {
      console.error('Error in cancelOrder:', error)
      return null
    }
  },

  // Statistiche ordini
  async getOrderStats(dateFrom = null, dateTo = null) {
    try {
      let query = supabase.from('orders').select('*');
      
      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }
      if (dateTo) {
        query = query.lte('created_at', dateTo);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching order stats:', error)
        throw error
      }

      const stats = {
        total: data.length,
        pending: data.filter(o => o.status === 'pending').length,
        confirmed: data.filter(o => o.status === 'confirmed').length,
        preparing: data.filter(o => o.status === 'preparing').length,
        ready: data.filter(o => o.status === 'ready').length,
        completed: data.filter(o => o.status === 'completed').length,
        cancelled: data.filter(o => o.status === 'cancelled').length,
        totalRevenue: data
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + parseFloat(o.final_amount || 0), 0),
        avgOrderValue: 0
      };

      if (stats.total > 0) {
        stats.avgOrderValue = stats.totalRevenue / (stats.total - stats.cancelled);
      }

      return stats;
    } catch (error) {
      console.error('Error in getOrderStats:', error)
      return null
    }
  }
}
