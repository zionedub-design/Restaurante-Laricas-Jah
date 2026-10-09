import React, { useState } from 'react';
import { Product, ProductAddon, SelectedAddon } from '../types';
import { kioskAudio } from '../utils/audio';
import { X, Plus, Minus, Check, Clock, Sparkles } from 'lucide-react';

interface ProductCustomizerModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    selectedAddons: SelectedAddon[],
    notes: string
  ) => void;
}

export const ProductCustomizerModal: React.FC<ProductCustomizerModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !product) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState<string>('');

  const quickObservations = [
    'Sem cebola',
    'Sem picles',
    'Sem tomate',
    'Sem molho',
    'Molho à parte',
    'Carne bem passada',
    'Carne ao ponto',
  ];

  const handleToggleAddon = (addon: ProductAddon) => {
    kioskAudio.playTouch();
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, { id: addon.id, name: addon.name, price: addon.price }];
      }
    });
  };

  const handleToggleObservation = (obs: string) => {
    kioskAudio.playTouch();
    setActiveNotes((prev) =>
      prev.includes(obs) ? prev.filter((o) => o !== obs) : [...prev, obs]
    );
  };

  const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const unitTotal = product.price + addonsTotal;
  const grandTotal = unitTotal * quantity;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleConfirm = () => {
    kioskAudio.playAdd();
    const finalNotes = [
      ...activeNotes,
      customNote.trim(),
    ].filter(Boolean).join(', ');

    onAddToCart(product, quantity, selectedAddons, finalNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Modal Header */}
        <div className="relative px-6 py-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div>
            <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider block">
              Personalização de Pedido
            </span>
            <h2 className="text-2xl font-bold font-display text-white">{product.name}</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              kioskAudio.playTouch();
              onClose();
            }}
            className="w-12 h-12 rounded-2xl bg-neutral-800/80 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Product Banner Preview */}
          <div className="flex gap-4 items-center bg-neutral-950/70 p-4 rounded-2xl border border-neutral-800/80">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-24 h-24 object-cover rounded-xl shrink-0"
            />
            <div className="flex-1">
              <p className="text-sm text-neutral-300 leading-relaxed">{product.description}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{product.prepTimeMin} min de preparo</span>
                </span>
                <span className="font-mono text-white font-bold text-sm">
                  {formatCurrency(product.price)} un.
                </span>
              </div>
            </div>
          </div>

          {/* Quantity Selector Section */}
          <div className="bg-neutral-950/40 p-4 rounded-2xl border border-neutral-800/80 flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-white">Quantidade</h4>
              <p className="text-xs text-neutral-400">Selecione quantas unidades deseja</p>
            </div>
            <div className="flex items-center gap-4 bg-neutral-900 border border-neutral-700 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  kioskAudio.playTouch();
                  setQuantity((q) => Math.max(1, q - 1));
                }}
                disabled={quantity <= 1}
                className="w-12 h-12 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all active:scale-95 text-lg font-bold"
                aria-label="Diminuir quantidade"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-8 text-center font-mono font-black text-2xl text-yellow-400 tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => {
                  kioskAudio.playTouch();
                  setQuantity((q) => Math.min(20, q + 1));
                }}
                className="w-12 h-12 rounded-xl bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white transition-all active:scale-95 text-lg font-bold"
                aria-label="Aumentar quantidade"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Addons Checklist if available */}
          {product.availableAddons && product.availableAddons.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>Deseja Adicionais? (Opcional)</span>
                </h4>
                <span className="text-xs text-neutral-400">Turbine sua larica</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.availableAddons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => handleToggleAddon(addon)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                        isChecked
                          ? 'bg-yellow-500/15 border-yellow-400 text-white font-medium'
                          : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                            isChecked
                              ? 'bg-yellow-400 border-yellow-400 text-neutral-950'
                              : 'border-neutral-700 bg-neutral-900'
                          }`}
                        >
                          {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                        <span className="text-sm">{addon.name}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-yellow-400 shrink-0 ml-2">
                        +{formatCurrency(addon.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Observations for Kitchen */}
          <div>
            <h4 className="text-base font-bold text-white mb-2">Observações Rápidas</h4>
            <p className="text-xs text-neutral-400 mb-3">Toque para retirar ingredientes ou indicar preferências</p>
            <div className="flex flex-wrap gap-2">
              {quickObservations.map((obs) => {
                const isSelected = activeNotes.includes(obs);
                return (
                  <button
                    key={obs}
                    type="button"
                    onClick={() => handleToggleObservation(obs)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-neutral-950 border border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    {isSelected ? `✕ ${obs}` : obs}
                  </button>
                );
              })}
            </div>

            <div className="mt-3">
              <input
                type="text"
                placeholder="Outra observação para a chapa..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-5 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 block font-semibold">
              Total ({quantity}x)
            </span>
            <span className="text-2xl font-black text-white font-mono tabular-nums">
              {formatCurrency(grandTotal)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                kioskAudio.playTouch();
                onClose();
              }}
              className="px-5 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-sm font-semibold text-neutral-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-yellow-500 hover:from-emerald-500 hover:to-yellow-400 text-neutral-950 font-black text-base tracking-wide shadow-lg shadow-yellow-500/10 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Adicionar ao Pedido</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
