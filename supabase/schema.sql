-- ==============================================================================
-- LARICAS JAH - TOTEM DE AUTOATENDIMENTO
-- Script SQL para Supabase com Tabelas, Índices e RLS (Row Level Security)
-- ==============================================================================

-- 1. Criação da tabela de PEDIDOS (orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    order_type TEXT NOT NULL CHECK (order_type IN ('comer_aqui', 'levar')),
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'cartao_credito', 'cartao_debito', 'vale_refeicao')),
    status TEXT NOT NULL DEFAULT 'recebido' CHECK (status IN ('recebido', 'preparando', 'pronto', 'entregue', 'cancelado')),
    estimated_time_min INTEGER NOT NULL DEFAULT 12,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Criação da tabela de ITENS DO PEDIDO (order_items)
CREATE TABLE IF NOT EXISTS public.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('lanches', 'batatas', 'sucos', 'refrigerantes', 'chocolates')),
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    selected_addons JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Índices para otimização de consultas e tempo de resposta do Totem
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ==============================================================================
-- 4. HABILITAÇÃO DO RLS (ROW LEVEL SECURITY)
-- ==============================================================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 5. POLÍTICAS DE SEGURANÇA PARA A TABELA 'orders'

-- Política para permitir que o totem (anon / authenticated) insira novos pedidos
CREATE POLICY "Permitir inserção de pedidos pelo Totem"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Política para permitir consulta de pedidos pelo totem e pelo sistema
CREATE POLICY "Permitir consulta de pedidos"
ON public.orders
FOR SELECT
TO anon, authenticated
USING (true);

-- Política para permitir atualização de status do pedido
CREATE POLICY "Permitir atualização de status do pedido"
ON public.orders
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 6. POLÍTICAS DE SEGURANÇA PARA A TABELA 'order_items'

-- Política para permitir que o totem insira os itens do pedido
CREATE POLICY "Permitir inserção de itens pelo Totem"
ON public.order_items
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Política para permitir consulta dos itens dos pedidos
CREATE POLICY "Permitir consulta de itens dos pedidos"
ON public.order_items
FOR SELECT
TO anon, authenticated
USING (true);

-- ==============================================================================
-- 7. (OPCIONAL) POLÍTICAS PARA SUPABASE STORAGE (BUCKETS DE IMAGENS DO CARDÁPIO)
-- ==============================================================================

-- Criação do Bucket de imagens do cardápio 'laricas-menu' se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('laricas-menu', 'laricas-menu', true)
ON CONFLICT (id) DO NOTHING;

-- Permitir leitura pública das imagens dos produtos no Totem
CREATE POLICY "Imagens do cardápio públicas para leitura"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'laricas-menu');

-- Permitir upload de imagens para usuários autenticados/administradores
CREATE POLICY "Upload de fotos do cardápio"
ON storage.objects
FOR INSERT
TO authenticated, anon
WITH CHECK (bucket_id = 'laricas-menu');
