import React from 'react';
import { ProductCategory } from '../types';
import { CATEGORIES } from '../data/products';
import { kioskAudio } from '../utils/audio';
import { Sandwich, Utensils, GlassWater, Sparkles, Cookie } from 'lucide-react';

interface CategoryTabsProps {
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  cartCategoryCounts: Record<ProductCategory, number>;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
  cartCategoryCounts,
}) => {
  const getCategoryIcon = (id: ProductCategory) => {
    switch (id) {
      case 'lanches':
        return <Sandwich className="w-5 h-5 shrink-0" />;
      case 'batatas':
        return <Utensils className="w-5 h-5 shrink-0" />;
      case 'sucos':
        return <GlassWater className="w-5 h-5 shrink-0" />;
      case 'refrigerantes':
        return <Sparkles className="w-5 h-5 shrink-0" />;
      case 'chocolates':
        return <Cookie className="w-5 h-5 shrink-0" />;
    }
  };

  return (
    <nav className="w-full bg-neutral-900/90 border-b border-neutral-800 py-3 px-4 sm:px-6 sticky top-20 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = cartCategoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                kioskAudio.playTouch();
                onSelectCategory(cat.id);
              }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 select-none ${
                isActive
                  ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-500/20 scale-[1.02]'
                  : 'bg-neutral-950/70 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800/80'
              }`}
            >
              <span className={isActive ? 'text-neutral-950' : 'text-yellow-400'}>
                {getCategoryIcon(cat.id)}
              </span>
              <span>{cat.label}</span>
              {count > 0 && (
                <span
                  className={`w-5 h-5 rounded-full text-xs font-black flex items-center justify-center ${
                    isActive ? 'bg-neutral-950 text-yellow-400' : 'bg-emerald-600 text-white'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
