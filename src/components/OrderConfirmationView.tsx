import React, { useEffect, useState } from 'react';
import { Order } from '../types';
import { kioskAudio } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
  ArrowRight,
  UtensilsCrossed,
  ShoppingBag,
  CreditCard,
  QrCode,
  MapPin,
} from 'lucide-react';

interface OrderConfirmationViewProps {
  order: Order;
  onNewOrder: () => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({
  order,
  onNewOrder,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(20);

  useEffect(() => {
    // Play celebratory sound
    kioskAudio.playSuccess();

    // Fire Jamaican reggae colored confetti
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#16a34a', '#eab308', '#dc2626', '#000000'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: ['#16a34a', '#eab308', '#dc2626'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: ['#16a34a', '#eab308', '#dc2626'],
        });
      }, 300);
    } catch {
      // Ignore confetti issues if canvas unsupported
    }

    // Auto-reset countdown
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onNewOrder();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onNewOrder]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'pix':
        return 'PIX no Totem (Aprovado)';
      case 'cartao_credito':
        return 'Cartão de Crédito';
      case 'cartao_debito':
        return 'Cartão de Débito';
      case 'vale_refeicao':
        return 'Vale Refeição';
      default:
        return method;
    }
  };

  const handleManualNewOrder = () => {
    kioskAudio.playTouch();
    onNewOrder();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between select-none">
      {/* Top Jamaican Reggae Accent Stripe */}
      <div className="h-2 w-full flex">
        <div className="h-full flex-1 bg-emerald-600" />
        <div className="h-full flex-1 bg-yellow-400" />
        <div className="h-full flex-1 bg-red-600" />
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 flex flex-col items-center justify-center text-center">
        {/* Success Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-2xl shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="w-14 h-14" />
          </div>
          <div className="absolute -top-1 -right-1 text-yellow-400">
            <Sparkles className="w-8 h-8" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-white mb-2">
          PEDIDO CONFIRMADO!
        </h1>
        <p className="text-base sm:text-lg text-neutral-300 max-w-lg mb-8">
          Seu pedido já foi enviado diretamente para a nossa chapa e cozinha.
        </p>

        {/* Big Giant Order Ticket Card */}
        <div className="w-full max-w-xl bg-neutral-900 border-2 border-yellow-400/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-yellow-500/10 text-left mb-8 relative overflow-hidden">
          {/* Subtle Reggae corner badge */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-bl-full pointer-events-none" />

          <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold block">
                SENHA DE ATENDIMENTO
              </span>
              <div className="text-5xl sm:text-6xl font-black text-yellow-400 font-mono tracking-tight">
                #{order.orderNumber}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold block">
                Cliente
              </span>
              <span className="text-xl sm:text-2xl font-bold text-white block">
                {order.customerName}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-1">
                {order.orderType === 'comer_aqui' ? (
                  <>
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>Comer Aqui</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Para Levar</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Time and Status Bar */}
          <div className="py-4 border-b border-neutral-800 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-neutral-300">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span>Tempo Estimado: <strong>~{order.estimatedTimeMin} a {order.estimatedTimeMin + 5} min</strong></span>
            </div>
            <div className="flex items-center gap-1 text-xs text-neutral-400 font-mono">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Praia do Norte</span>
            </div>
          </div>

          {/* Items Summary Breakdown */}
          <div className="py-4 border-b border-neutral-800 space-y-2">
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold block mb-2">
              Itens do seu Pedido
            </span>
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
              {order.items.map((it) => (
                <div key={it.id} className="flex justify-between items-start text-sm">
                  <div>
                    <span className="font-bold text-white">{it.quantity}x {it.name}</span>
                    {it.selectedAddons.length > 0 && (
                      <span className="text-xs text-yellow-400 block ml-4">
                        + {it.selectedAddons.map((a) => a.name).join(', ')}
                      </span>
                    )}
                    {it.notes && (
                      <span className="text-xs text-neutral-400 block ml-4">
                        ({it.notes})
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-neutral-300 tabular-nums">
                    {formatCurrency(it.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total & Payment details */}
          <div className="pt-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-400 block font-medium">Pagamento</span>
              <span className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                {order.paymentMethod === 'pix' ? (
                  <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <CreditCard className="w-3.5 h-3.5 text-yellow-400" />
                )}
                {getPaymentLabel(order.paymentMethod)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-neutral-400 block font-medium">Total Pago</span>
              <span className="text-2xl font-black text-yellow-400 font-mono tabular-nums">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Next Customer CTA & Countdown */}
        <div className="w-full max-w-xl space-y-4">
          <button
            type="button"
            onClick={handleManualNewOrder}
            className="w-full py-5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-neutral-950 font-black text-lg tracking-wide shadow-xl shadow-yellow-500/20 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>CONCLUIR & LIBERAR TOTEM</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Progress timer bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Retornando à tela inicial automaticamente em...</span>
              <span className="font-mono font-bold text-yellow-400">{secondsRemaining}s</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-500 transition-all duration-1000 ease-linear"
                style={{ width: `${(secondsRemaining / 20) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer Instructions */}
      <footer className="py-6 px-4 bg-neutral-900 border-t border-neutral-800 text-center text-xs text-neutral-400">
        <p>Acompanhe o número <strong>#{order.orderNumber}</strong> no painel de chamadas da praia. Bom rango e Jah Bless!</p>
      </footer>
    </div>
  );
};
