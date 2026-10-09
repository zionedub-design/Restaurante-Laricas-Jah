import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Order, OrderStatus } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Supabase client init warning:', err);
  }
}

const STORAGE_KEY = 'laricas_jah_orders_v1';
const ORDER_COUNTER_KEY = 'laricas_jah_order_counter_v1';

/**
 * Gera o próximo número de pedido sequencial (ex: 042, 043...)
 */
export function getNextOrderNumber(): string {
  try {
    const current = parseInt(localStorage.getItem(ORDER_COUNTER_KEY) || '41', 10);
    const next = current >= 999 ? 1 : current + 1;
    localStorage.setItem(ORDER_COUNTER_KEY, next.toString());
    return next.toString().padStart(3, '0');
  } catch {
    return Math.floor(Math.random() * 900 + 100).toString();
  }
}

/**
 * Salva o pedido e os respectivos itens no Supabase
 * e mantém backup local persistente.
 */
export async function saveOrder(order: Order): Promise<{ success: boolean; id: string }> {
  // 1. Sempre salvar no armazenamento local do totem (garante funcionamento contínuo e KDS local)
  try {
    const existingStr = localStorage.getItem(STORAGE_KEY);
    const existingOrders: Order[] = existingStr ? JSON.parse(existingStr) : [];
    const updated = [order, ...existingOrders];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 100))); // guarda os últimos 100 pedidos
  } catch (err) {
    console.warn('Erro ao salvar pedido localmente:', err);
  }

  // 2. Se cliente Supabase estiver configurado, salvar nas tabelas 'orders' e 'order_items'
  if (supabase) {
    try {
      // Inserir registro principal do pedido
      const { error: orderError } = await supabase.from('orders').insert([
        {
          id: order.id,
          order_number: order.orderNumber,
          customer_name: order.customerName,
          order_type: order.orderType,
          subtotal: order.subtotal,
          total: order.total,
          payment_method: order.paymentMethod,
          status: order.status,
          created_at: order.createdAt,
          estimated_time_min: order.estimatedTimeMin,
        },
      ]);

      if (orderError) {
        console.warn('Aviso Supabase [orders]:', orderError.message);
      } else {
        // Inserir cada item do pedido
        const itemsPayload = order.items.map((item) => ({
          order_id: order.id,
          product_id: item.productId,
          product_name: item.name,
          category: item.category,
          unit_price: item.unitPrice,
          quantity: item.quantity,
          selected_addons: JSON.stringify(item.selectedAddons),
          notes: item.notes || null,
          total_price: item.totalPrice,
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(itemsPayload);
        if (itemsError) {
          console.warn('Aviso Supabase [order_items]:', itemsError.message);
        }
      }
    } catch (supabaseErr) {
      console.warn('Tentativa de envio para Supabase:', supabaseErr);
    }
  }

  return { success: true, id: order.id };
}

/**
 * Obtém todos os pedidos para visualização da cozinha / KDS
 */
export async function getOrders(): Promise<Order[]> {
  // Se houver Supabase ativo, tentar buscar os mais recentes
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (!error && data && data.length > 0) {
        // Mapear de volta se necessário
        const local = getLocalOrders();
        // Mesclar priorizando dados locais se houver itens completos
        return local.length > 0 ? local : (data as unknown as Order[]);
      }
    } catch (err) {
      console.warn('Supabase fetch fallback to local:', err);
    }
  }

  return getLocalOrders();
}

export function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function updateOrderStatus(orderId: string, newStatus: OrderStatus): void {
  try {
    const orders = getLocalOrders();
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (supabase) {
      supabase.from('orders').update({ status: newStatus }).eq('id', orderId).then();
    }
  } catch (err) {
    console.warn('Erro ao atualizar status:', err);
  }
}
