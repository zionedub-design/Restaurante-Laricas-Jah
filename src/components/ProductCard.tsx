import React, { useState } from 'react';
import { Product } from '../types';
import { kioskAudio } from '../utils/audio';
import { Plus, Clock, UtensilsCrossed } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
}) => {
  const [imgError, setImgError] = useState(false);

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  const handleCardClick = () => {
    kioskAudio.playTouch();
    onSelect(product);
  };

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    kioskAudio.playAdd();
    onQuickAdd(product);
  };

  return (
    <article
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between bg-neutral-900/80 rounded-2xl border border-neutral-800 hover:border-yellow-500/50 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 cursor-pointer select-none"
    >
      {/* Product Image Area */}
      <div className="relative w-full aspect-[4/3] bg-neutral-950 overflow-hidden">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-800 text-yellow-400 p-4">
            <UtensilsCrossed className="w-12 h-12 mb-2 opacity-60" />
            <span className="text-xs text-neutral-400 font-medium text-center">{product.name}</span>
          </div>
        )}

        {/* Soft Contrast Scrim at bottom of image */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />

        {/* Subtle tag kicker if available */}
        {product.tag && (
          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg border border-yellow-500/30 text-yellow-300 text-xs font-bold tracking-wide">
            {product.tag}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: unboxed clean text */}
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1.5 font-medium">
            <span className="flex items-center gap-1 text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{product.prepTimeMin} min</span>
            </span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>Preparo na hora</span>
          </div>

          <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors font-display line-clamp-1 mb-2">
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed line-clamp-2 mb-4">
            {product.description}
          </p>
        </div>

        {/* Bottom Bar: Price & Action */}
        <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
              Preço
            </span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums tracking-tight">
              {formattedPrice}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickAddClick}
              className="w-12 h-12 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-neutral-950 flex items-center justify-center font-black transition-all shadow-md shadow-yellow-500/20"
              title="Adicionar direto"
              aria-label={`Adicionar ${product.name}`}
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
