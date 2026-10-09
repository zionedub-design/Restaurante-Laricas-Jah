import React from 'react';
import heroImg from '../assets/images/laricas_jah_hero_1791584462659.jpg';
import { kioskAudio } from '../utils/audio';
import { Utensils, Sparkles, MapPin, Sun } from 'lucide-react';

interface AttractScreenProps {
  onStart: () => void;
}

export const AttractScreen: React.FC<AttractScreenProps> = ({ onStart }) => {
  const handleTouch = () => {
    kioskAudio.playTouch();
    onStart();
  };

  return (
    <div
      onClick={handleTouch}
      className="relative w-full h-full min-h-screen flex flex-col justify-between overflow-hidden cursor-pointer select-none bg-neutral-950 text-white"
    >
      {/* Background Hero Image with measured overlay scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Laricas Jah - Litoral Norte"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-105 animate-pulse duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/75 to-neutral-950/40" />
      </div>

      {/* Reggae Accent Stripe at Top */}
      <div className="relative z-10 w-full h-2.5 flex">
        <div className="h-full flex-1 bg-emerald-600" />
        <div className="h-full flex-1 bg-yellow-400" />
        <div className="h-full flex-1 bg-red-600" />
      </div>

      {/* Top Header Badge */}
      <header className="relative z-10 px-8 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black/50 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
            <Sun className="w-6 h-6 animate-spin duration-12000" />
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Praia do Norte · Litoral Norte SP</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs tracking-wider uppercase text-yellow-400 font-semibold block">Totem 01</span>
          <span className="text-sm text-neutral-400 font-mono">Autoatendimento Ativo</span>
        </div>
      </header>

      {/* Center Showcase Branding */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 text-center my-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-yellow-400/40 text-yellow-300 text-sm font-semibold tracking-wide mb-6">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>Sabor Caiçara com Alma Jamaicana</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white drop-shadow-2xl mb-4 font-display">
          LARICAS <span className="text-yellow-400">JAH</span>
        </h1>

        <p className="text-xl md:text-2xl text-neutral-200 font-medium max-w-2xl mx-auto mb-10 text-balance leading-relaxed">
          Burgers artesanais na brasa, batatas crocantes, sucos naturais e chocolates para matar sua larica na praia.
        </p>

        {/* Big Touch CTA Button */}
        <div className="inline-block transform transition-transform hover:scale-105 active:scale-95">
          <button
            type="button"
            className="group px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-yellow-500 to-red-600 p-[3px] shadow-2xl shadow-yellow-500/20"
          >
            <div className="px-10 py-5 rounded-[13px] bg-neutral-900 flex items-center gap-4 text-2xl font-bold tracking-wide text-white group-hover:bg-neutral-800 transition-colors">
              <Utensils className="w-8 h-8 text-yellow-400 animate-bounce" />
              <span>TOQUE NA TELA PARA INICIAR</span>
            </div>
          </button>
        </div>

        <p className="mt-6 text-neutral-400 text-sm tracking-wide">
          Sem filas · Escolha seus itens · Pague no Totem com Cartão ou Pix
        </p>
      </main>

      {/* Bottom Features Strip */}
      <footer className="relative z-10 px-8 py-6 bg-black/60 border-t border-neutral-800/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-around gap-6 text-center">
          <div>
            <p className="text-lg font-bold text-yellow-400">100% Artesanal</p>
            <p className="text-xs text-neutral-400">Blends frescos e pão brioche dourado</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-neutral-800" />
          <div>
            <p className="text-lg font-bold text-emerald-400">Frutas Frescas</p>
            <p className="text-xs text-neutral-400">Sucos e açaí batidos na hora</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-neutral-800" />
          <div>
            <p className="text-lg font-bold text-red-400">Rapidez Jah</p>
            <p className="text-xs text-neutral-400">Preparo ágil acompanhado por senha</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
