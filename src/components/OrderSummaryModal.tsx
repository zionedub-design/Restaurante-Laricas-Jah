import React, { useState } from 'react';
import { OrderItem, OrderType, PaymentMethod } from '../types';
import { kioskAudio } from '../utils/audio';
import {
  X,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  QrCode,
  UtensilsCrossed,
  ShoppingBag,
  ArrowRight,
  User,
  ShieldCheck,
  Receipt,
  Keyboard,
} from 'lucide-react';

interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  orderType: OrderType;
  onChangeOrderType: (type: OrderType) => void;
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onConfirmOrder: (
    customerName: string,
    paymentMethod: PaymentMethod,
    orderType: OrderType
  ) => void;
  isSubmitting: boolean;
}

export const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({
  isOpen,
  onClose,
  items,
  orderType,
  onChangeOrderType,
  onUpdateQuantity,
  onRemoveItem,
  onConfirmOrder,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cartao_credito');
  const [showTouchKeyboard, setShowTouchKeyboard] = useState<boolean>(false);

  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleConfirm = () => {
    kioskAudio.playTouch();
    const finalName = customerName.trim() || 'Cliente Jah';
    onConfirmOrder(finalName, paymentMethod, orderType);
  };

  const keyboardKeys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ESP', 'APAGAR'],
  ];

  const handleKeyPress = (key: string) => {
    kioskAudio.playTouch();
    if (key === 'APAGAR') {
      setCustomerName((prev) => prev.slice(0, -1));
    } else if (key === 'ESP') {
      setCustomerName((prev) => prev + ' ');
    } else {
      if (customerName.length < 24) {
        setCustomerName((prev) => prev + key);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-neutral-950 flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider block">
                Totem Laricas Jah
              </span>
              <h2 className="text-2xl font-bold font-display text-white">Resumo do Pedido</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              kioskAudio.playTouch();
              onClose();
            }}
            className="w-12 h-12 rounded-2xl bg-neutral-800/80 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
            aria-label="Voltar ao Cardápio"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body - 2 Columns on Desktop */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-neutral-800">
          {/* Left Column: Items List */}
          <div className="lg:col-span-7 p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] lg:max-h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                  Itens Selecionados ({items.length})
                </h3>
                <span className="text-xs text-neutral-500">Revise suas escolhas</span>
              </div>

              {items.length === 0 ? (
                <div className="py-12 text-center text-neutral-500">
                  <p>Nenhum item adicionado ao pedido.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center gap-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover rounded-xl shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-base text-white truncate font-display">
                            {item.name}
                          </h4>
                          <span className="font-mono font-bold text-sm text-yellow-400 tabular-nums shrink-0">
                            {formatCurrency(item.totalPrice)}
                          </span>
                        </div>

                        {item.selectedAddons.length > 0 && (
                          <p className="text-xs text-yellow-300/80 mt-1 truncate">
                            + {item.selectedAddons.map((a) => a.name).join(', ')}
                          </p>
                        )}

                        {item.notes && (
                          <p className="text-xs text-red-400 mt-0.5 truncate">Obs: {item.notes}</p>
                        )}

                        {/* Quantity and Remove buttons */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-800/60">
                          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700/80 rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() => {
                                kioskAudio.playTouch();
                                onUpdateQuantity(item.id, item.quantity - 1);
                              }}
                              className="w-7 h-7 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white"
                              aria-label="Diminuir"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center font-mono font-bold text-xs text-white tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                kioskAudio.playTouch();
                                onUpdateQuantity(item.id, item.quantity + 1);
                              }}
                              className="w-7 h-7 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white"
                              aria-label="Aumentar"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              kioskAudio.playTouch();
                              onRemoveItem(item.id);
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors"
                            title="Remover item"
                            aria-label={`Remover ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                kioskAudio.playTouch();
                onClose();
              }}
              className="mt-6 w-full py-3 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-sm font-semibold text-neutral-300 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Mais Itens ao Pedido</span>
            </button>
          </div>

          {/* Right Column: Order Setup & Payment */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-6 bg-neutral-950/40 overflow-y-auto">
            <div className="space-y-6">
              {/* Order Mode (Comer Aqui vs Levar) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                  1. Local de Consumo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      kioskAudio.playTouch();
                      onChangeOrderType('comer_aqui');
                    }}
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border font-bold text-xs transition-all ${
                      orderType === 'comer_aqui'
                        ? 'bg-yellow-400 text-neutral-950 border-yellow-400'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                    }`}
                  >
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>Comer Aqui</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      kioskAudio.playTouch();
                      onChangeOrderType('levar');
                    }}
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border font-bold text-xs transition-all ${
                      orderType === 'levar'
                        ? 'bg-yellow-400 text-neutral-950 border-yellow-400'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Para Levar</span>
                  </button>
                </div>
              </div>

              {/* Customer Name / Chamada na Tela */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>2. Seu Nome (Para a Senha)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTouchKeyboard(!showTouchKeyboard)}
                    className="text-xs text-yellow-400 flex items-center gap-1 hover:underline"
                  >
                    <Keyboard className="w-3.5 h-3.5" />
                    <span>{showTouchKeyboard ? 'Ocultar Teclado' : 'Abrir Teclado Touch'}</span>
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Ex: João, Maria, Pedro..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value.toUpperCase())}
                  onFocus={() => setShowTouchKeyboard(true)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 font-bold text-base focus:outline-none focus:border-yellow-400 uppercase"
                />

                {/* On-screen touch keyboard for Kiosk Ergonomics */}
                {showTouchKeyboard && (
                  <div className="mt-3 p-2 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl">
                    <div className="space-y-1.5">
                      {keyboardKeys.map((row, rIdx) => (
                        <div key={rIdx} className="flex justify-center gap-1">
                          {row.map((k) => (
                            <button
                              key={k}
                              type="button"
                              onClick={() => handleKeyPress(k)}
                              className={`h-9 px-2.5 rounded-lg text-xs font-black transition-colors ${
                                k === 'APAGAR'
                                  ? 'bg-red-900/60 text-red-200 border border-red-700'
                                  : k === 'ESP'
                                  ? 'bg-neutral-800 text-neutral-200 px-6'
                                  : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                              }`}
                            >
                              {k}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                  3. Forma de Pagamento no Totem
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      kioskAudio.playTouch();
                      setPaymentMethod('pix');
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'pix'
                        ? 'bg-emerald-600/20 border-emerald-400 text-white font-bold'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">PIX</p>
                      <p className="text-[10px] text-neutral-400">QR Code na Tela</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      kioskAudio.playTouch();
                      setPaymentMethod('cartao_credito');
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'cartao_credito'
                        ? 'bg-yellow-400/20 border-yellow-400 text-white font-bold'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-yellow-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Crédito</p>
                      <p className="text-[10px] text-neutral-400">Aproxime ou Insira</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      kioskAudio.playTouch();
                      setPaymentMethod('cartao_debito');
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'cartao_debito'
                        ? 'bg-yellow-400/20 border-yellow-400 text-white font-bold'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-yellow-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Débito</p>
                      <p className="text-[10px] text-neutral-400">Pinpad integrado</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      kioskAudio.playTouch();
                      setPaymentMethod('vale_refeicao');
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'vale_refeicao'
                        ? 'bg-red-500/20 border-red-400 text-white font-bold'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-red-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Vale Refeição</p>
                      <p className="text-[10px] text-neutral-400">Alelo, Sodexo, VR</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Price Calculations and Final Confirm CTA */}
            <div className="pt-4 border-t border-neutral-800 space-y-3">
              <div className="flex justify-between text-sm text-neutral-400">
                <span>Subtotal dos Itens</span>
                <span className="font-mono tabular-nums text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-base font-bold text-white">Valor Total</span>
                <span className="text-3xl font-black text-yellow-400 font-mono tabular-nums">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <button
                type="button"
                disabled={items.length === 0 || isSubmitting}
                onClick={handleConfirm}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-yellow-500 to-red-600 hover:opacity-95 active:scale-95 text-neutral-950 font-black text-lg tracking-wide shadow-xl shadow-yellow-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Processando Pedido...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-6 h-6" />
                    <span>CONFIRMAR & PAGAR PEDIDO</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-neutral-500">
                O recibo e número do pedido serão impressos e gerados na tela a seguir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
