import React, { useState, useEffect } from 'react';
import { OrderType } from '../types';
import { kioskAudio } from '../utils/audio';
import { Volume2, VolumeX, RotateCcw, UtensilsCrossed, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  orderType: OrderType;
  onToggleOrderType: (type: OrderType) => void;
  onResetOrder: () => void;
  totalItemsCount: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  orderType,
  onToggleOrderType,
  onResetOrder,
  totalItemsCount,
  onOpenCart,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(!kioskAudio.isEnabled());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const enabled = kioskAudio.toggleSound();
    setIsMuted(!enabled);
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 text-white">
      {/* Subtle Reggae Top Line Accent */}
      <div className="h-1.5 w-full flex">
        <div className="h-full flex-1 bg-emerald-600" />
        <div className="h-full flex-1 bg-yellow-400" />
        <div className="h-full flex-1 bg-red-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onResetOrder}
            className="flex items-center gap-2 group text-left cursor-pointer focus-visible:outline-none"
            title="Voltar ao início"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 via-yellow-600 to-red-700 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-neutral-900 rounded-[10px] flex items-center justify-center font-black text-yellow-400 text-lg">
                LJ
              </div>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white font-display block leading-none">
                LARICAS <span className="text-yellow-400">JAH</span>
              </span>
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mt-1">
                Litoral Norte SP
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Order Type Segmented Control (Comer Aqui vs Levar) + Clock */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center p-1 bg-neutral-900 rounded-xl border border-neutral-800">
            <button
              type="button"
              onClick={() => {
                kioskAudio.playTouch();
                onToggleOrderType('comer_aqui');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                orderType === 'comer_aqui'
                  ? 'bg-yellow-400 text-neutral-950 shadow-md font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Comer no Local</span>
            </button>
            <button
              type="button"
              onClick={() => {
                kioskAudio.playTouch();
                onToggleOrderType('levar');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                orderType === 'levar'
                  ? 'bg-yellow-400 text-neutral-950 shadow-md font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Para Viagem</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center text-xs font-mono text-neutral-400 bg-neutral-900/60 px-3 py-2 rounded-lg border border-neutral-800/80">
            <span>{timeStr}</span>
          </div>
        </div>

        {/* Zone 3: Primary Action & Utilities */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Sound toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-yellow-400 hover:border-yellow-400/40 transition-colors"
            title={isMuted ? 'Ativar som' : 'Desativar som'}
            aria-label="Controle de áudio"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Cancel / Restart Order Button */}
          {totalItemsCount > 0 && (
            <button
              type="button"
              onClick={() => {
                kioskAudio.playTouch();
                onResetOrder();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-400/40 text-xs font-medium transition-colors"
              title="Cancelar e recomeçar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          )}

          {/* Primary View Cart CTA */}
          <button
            type="button"
            onClick={() => {
              kioskAudio.playTouch();
              onOpenCart();
            }}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/50 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Meu Pedido</span>
            {totalItemsCount > 0 && (
              <span className="w-6 h-6 rounded-full bg-yellow-400 text-neutral-950 text-xs font-black flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
