/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Product,
  ProductCategory,
  OrderItem,
  OrderType,
  PaymentMethod,
  Order,
  SelectedAddon,
} from './types';
import { PRODUCTS, CATEGORIES } from './data/products';
import { saveOrder, getNextOrderNumber } from './services/supabase';
import { kioskAudio } from './utils/audio';

import { AttractScreen } from './components/AttractScreen';
import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { ProductCard } from './components/ProductCard';
import { ProductCustomizerModal } from './components/ProductCustomizerModal';
import { OrderSummaryModal } from './components/OrderSummaryModal';
import { OrderConfirmationView } from './components/OrderConfirmationView';

import {
  Search,
  ShoppingBag,
  ArrowRight,
  Flame,
  Waves,
  Sun,
  ShieldCheck,
} from 'lucide-react';

export default function App() {
  // Navigation / Kiosk State
  const [view, setView] = useState<'attract' | 'catalog' | 'confirmation'>('attract');
  const [orderType, setOrderType] = useState<OrderType>('comer_aqui');
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('lanches');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart & Customization State
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Inactivity timeout to return to attract screen if left idle for 2 minutes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      if (view === 'catalog') {
        timeoutId = setTimeout(() => {
          if (cartItems.length === 0) {
            setView('attract');
          }
        }, 120000); // 2 minutes
      }
    };

    window.addEventListener('pointerdown', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('pointerdown', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [view, cartItems.length]);

  // Totals calculations
  const totalItemsCount = useMemo(() => {
    return cartItems.reduce((acc, it) => acc + it.quantity, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, it) => acc + it.totalPrice, 0);
  }, [cartItems]);

  // Counts per category for category badges
  const cartCategoryCounts = useMemo(() => {
    const counts: Record<ProductCategory, number> = {
      lanches: 0,
      batatas: 0,
      sucos: 0,
      refrigerantes: 0,
      chocolates: 0,
    };
    cartItems.forEach((it) => {
      counts[it.category] = (counts[it.category] || 0) + it.quantity;
    });
    return counts;
  }, [cartItems]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter((p) => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tag && p.tag.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeCategory, searchQuery]);

  // Handlers
  const handleStartKiosk = () => {
    setView('catalog');
  };

  const handleResetOrder = () => {
    setCartItems([]);
    setCompletedOrder(null);
    setIsCartOpen(false);
    setView('attract');
  };

  const handleQuickAdd = (product: Product) => {
    // If the product has addons, opening the customizer is better, but quick add adds 1 standard unit
    handleAddCustomizedItem(product, 1, [], '');
  };

  const handleAddCustomizedItem = (
    product: Product,
    quantity: number,
    selectedAddons: SelectedAddon[],
    notes: string
  ) => {
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = product.price + addonsTotal;
    const totalPrice = unitPrice * quantity;

    // Create unique key based on product id and chosen additions/notes
    const addonKey = selectedAddons.map((a) => a.id).sort().join('-');
    const itemSignature = `${product.id}_${addonKey}_${notes.trim().toLowerCase()}`;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === itemSignature);
      if (existingIdx >= 0) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          totalPrice: updated[existingIdx].unitPrice * newQty,
        };
        return updated;
      } else {
        const newItem: OrderItem = {
          id: itemSignature,
          productId: product.id,
          name: product.name,
          category: product.category,
          unitPrice,
          quantity,
          selectedAddons,
          notes,
          totalPrice,
          image: product.image,
        };
        return [...prev, newItem];
      }
    });
  };

  const handleUpdateItemQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleConfirmOrder = async (
    customerName: string,
    paymentMethod: PaymentMethod,
    selectedOrderType: OrderType
  ) => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);

    try {
      const orderNumber = getNextOrderNumber();
      const maxPrep = Math.max(
        ...cartItems.map((it) => {
          const prod = PRODUCTS.find((p) => p.id === it.productId);
          return prod?.prepTimeMin || 10;
        })
      );

      const newOrder: Order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        orderNumber,
        customerName,
        orderType: selectedOrderType,
        items: [...cartItems],
        subtotal: cartSubtotal,
        total: cartSubtotal,
        paymentMethod,
        status: 'recebido',
        createdAt: new Date().toISOString(),
        estimatedTimeMin: maxPrep,
      };

      // Salva no Supabase e no banco local simultaneamente
      await saveOrder(newOrder);

      setCompletedOrder(newOrder);
      setCartItems([]);
      setIsCartOpen(false);
      setView('confirmation');
    } catch (err) {
      console.warn('Erro ao finalizar pedido:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Active Category Meta
  const currentCategoryMeta = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans select-none">
      {/* 1. Attract / Idle Screen */}
      {view === 'attract' && <AttractScreen onStart={handleStartKiosk} />}

      {/* 2. Order Confirmation Ticket Screen */}
      {view === 'confirmation' && completedOrder && (
        <OrderConfirmationView
          order={completedOrder}
          onNewOrder={handleResetOrder}
        />
      )}

      {/* 3. Main Self-Service Kiosk Menu Screen */}
      {view === 'catalog' && (
        <div className="flex-1 flex flex-col pb-28">
          {/* Top Bar Header */}
          <Header
            orderType={orderType}
            onToggleOrderType={setOrderType}
            onResetOrder={handleResetOrder}
            totalItemsCount={totalItemsCount}
            onOpenCart={() => setIsCartOpen(true)}
          />

          {/* Category Tabs Bar */}
          <CategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              setSearchQuery('');
            }}
            cartCategoryCounts={cartCategoryCounts}
          />

          {/* Main Content Area */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex-1 w-full">
            {/* Category Header & Search Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-1">
                  <Sun className="w-4 h-4 text-yellow-400" />
                  <span>Cardápio Oficial Laricas Jah</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white font-display">
                  {searchQuery ? `Busca: "${searchQuery}"` : currentCategoryMeta?.label}
                </h2>
                <p className="text-sm text-neutral-400 mt-0.5">
                  {searchQuery
                    ? `${filteredProducts.length} itens encontrados`
                    : currentCategoryMeta?.description}
                </p>
              </div>

              {/* Touch-Friendly Search Input */}
              <div className="relative w-full md:w-80">
                <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Pesquisar burger, batata, suco..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-800"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center text-neutral-500">
                <Waves className="w-16 h-16 mx-auto mb-3 opacity-30 text-yellow-400" />
                <p className="text-lg font-bold text-neutral-300">Nenhum item encontrado</p>
                <p className="text-sm text-neutral-500 mt-1">Tente buscar por outro termo ou selecione outra categoria.</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-neutral-800 text-yellow-400 font-semibold text-xs hover:bg-neutral-700"
                >
                  Limpar Pesquisa
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setCustomizingProduct(p)}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Sticky Bottom Kiosk Bar (Summary & Proceed) */}
          <aside className="fixed bottom-0 inset-x-0 z-40 bg-neutral-950/95 border-t border-neutral-800 backdrop-blur-md py-4 px-4 sm:px-6 shadow-2xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-yellow-400 shrink-0">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-neutral-400 tracking-wider">
                      Resumo da Bandeja:
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'itens'}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white font-mono tabular-nums leading-none mt-1">
                    {formatCurrency(cartSubtotal)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={totalItemsCount === 0}
                  onClick={() => {
                    kioskAudio.playTouch();
                    setIsCartOpen(true);
                  }}
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-base sm:text-lg tracking-wide shadow-xl transition-all active:scale-95 cursor-pointer ${
                    totalItemsCount > 0
                      ? 'bg-gradient-to-r from-emerald-600 via-yellow-500 to-red-600 text-neutral-950 shadow-yellow-500/20 hover:opacity-95'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  <ShieldCheck className="w-6 h-6" />
                  <span>CONFERIR PEDIDO</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Product Customizer & Quantity Modal */}
      <ProductCustomizerModal
        product={customizingProduct}
        isOpen={!!customizingProduct}
        onClose={() => setCustomizingProduct(null)}
        onAddToCart={handleAddCustomizedItem}
      />

      {/* Order Summary & Checkout Modal */}
      <OrderSummaryModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        orderType={orderType}
        onChangeOrderType={setOrderType}
        onUpdateQuantity={handleUpdateItemQuantity}
        onRemoveItem={handleRemoveItem}
        onConfirmOrder={handleConfirmOrder}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
