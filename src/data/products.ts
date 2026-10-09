import { Product, ProductCategory } from '../types';

// Imagens geradas com alta resolução para o Totem
import burgerImg from '../assets/images/laricas_jah_burger_1791584474094.jpg';
import friesImg from '../assets/images/laricas_jah_fries_1791584483397.jpg';
import juiceImg from '../assets/images/laricas_jah_juice_1791584493736.jpg';
import chocolateImg from '../assets/images/laricas_jah_chocolate_1791584502639.jpg';

export interface CategoryMeta {
  id: ProductCategory;
  label: string;
  iconName: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'lanches',
    label: 'Lanches Artesanais',
    iconName: 'sandwich',
    description: 'Burgers prensados na chapa de ferro com blends nobres e molhos da casa',
  },
  {
    id: 'batatas',
    label: 'Batatas Fritas',
    iconName: 'utensils',
    description: 'Crocantes, sequinhas e temperadas com sal marinho e ervas da praia',
  },
  {
    id: 'sucos',
    label: 'Sucos Tropicais',
    iconName: 'cup-soda',
    description: '100% fruta fresca da Mata Atlântica batida na hora',
  },
  {
    id: 'refrigerantes',
    label: 'Refrigerantes & Bebidas',
    iconName: 'beer',
    description: 'Trincando de geladas para matar a sede do litoral',
  },
  {
    id: 'chocolates',
    label: 'Chocolates & Doces',
    iconName: 'cookie',
    description: 'A larica doce perfeita para finalizar o seu rango',
  },
];

export const PRODUCTS: Product[] = [
  // --- LANCHES ---
  {
    id: 'lanche-jah-roots',
    name: 'Jah Roots Burger',
    category: 'lanches',
    description: 'Blend bovino artesanal 180g, cheddar inglês cremoso derretido, cebola caramelizada no melaço de cana e bacon crocante no brioche tostado.',
    price: 39.90,
    image: burgerImg,
    tag: 'Mais Pedido',
    prepTimeMin: 12,
    availableAddons: [
      { id: 'bacon-extra', name: 'Bacon Crocante Extra', price: 6.00 },
      { id: 'queijo-extra', name: 'Cheddar Inglês Extra', price: 5.00 },
      { id: 'burger-extra', name: 'Hambúrguer 180g Adicional', price: 12.00 },
      { id: 'molho-jah', name: 'Pote Molho Especial Jah (50g)', price: 4.50 },
    ],
  },
  {
    id: 'lanche-zion-smash',
    name: 'Zion Double Smash',
    category: 'lanches',
    description: 'Dois smash burgers de 90g com crostinha dourada, queijo prato duplo derretido, picles artesanais de pepino e molho secreto da casa.',
    price: 34.90,
    image: burgerImg,
    tag: 'Smash Clássico',
    prepTimeMin: 10,
    availableAddons: [
      { id: 'bacon-extra', name: 'Bacon Crocante Extra', price: 6.00 },
      { id: 'queijo-extra', name: 'Queijo Duplo Extra', price: 5.00 },
      { id: 'cebola-crispy', name: 'Cebola Crispy Dourada', price: 4.00 },
      { id: 'ovo-gema-mole', name: 'Ovo Caipira Estalado', price: 3.50 },
    ],
  },
  {
    id: 'lanche-marley-veggie',
    name: 'Marley Veggie Crioulo',
    category: 'lanches',
    description: 'Hambúrguer artesanal de grão-de-bico com ervas finas, queijo coalho tostado na chapa, chimichurri litorâneo e folhas frescas de rúcula no brioche.',
    price: 33.90,
    image: burgerImg,
    tag: 'Opção Veggie',
    prepTimeMin: 12,
    availableAddons: [
      { id: 'queijo-coalho-extra', name: 'Queijo Coalho Extra', price: 6.00 },
      { id: 'tomate-seco', name: 'Tomate Seco Confit', price: 4.50 },
      { id: 'chimichurri-extra', name: 'Pote Chimichurri Extra', price: 3.50 },
    ],
  },
  {
    id: 'lanche-kingston-crispy',
    name: 'Kingston Chicken Crispy',
    category: 'lanches',
    description: 'Sobrecoxa de frango empanada com casquinha ultracrocante marinada no limão cravo, maionese verde de coentro e salada coleslaw tropical.',
    price: 36.90,
    image: burgerImg,
    tag: 'Super Crocante',
    prepTimeMin: 12,
    availableAddons: [
      { id: 'bacon-extra', name: 'Bacon Crocante Extra', price: 6.00 },
      { id: 'queijo-extra', name: 'Queijo Cheddar Extra', price: 5.00 },
      { id: 'maionese-verde', name: 'Pote Maionese Verde Extra', price: 4.00 },
    ],
  },
  {
    id: 'lanche-litoral-monster',
    name: 'Maresias Monster Bacon',
    category: 'lanches',
    description: 'Triplo smash 80g, montanha de cheddar cremoso derretido, farofa crocante de bacon artesanal e molho barbecue defumado.',
    price: 44.90,
    image: burgerImg,
    tag: 'Fome Braba',
    prepTimeMin: 14,
    availableAddons: [
      { id: 'bacon-extra', name: 'Bacon Crocante Extra', price: 6.00 },
      { id: 'batata-palha', name: 'Farofa de Bacon Extra', price: 5.00 },
      { id: 'picles-extra', name: 'Picles Artesanal Extra', price: 3.00 },
    ],
  },

  // --- BATATAS FRITAS ---
  {
    id: 'batata-jah-herbs',
    name: 'Batata Rústica Jah Herbs',
    category: 'batatas',
    description: 'Batatas rústicas com corte grosso e casquinha dourada, temperadas com alecrim fresco da horta, sal marinho de Ubatuba e páprica defumada.',
    price: 24.90,
    image: friesImg,
    tag: 'Favorita da Praia',
    prepTimeMin: 8,
    availableAddons: [
      { id: 'molho-alho', name: 'Molho Aioli de Alho Assado', price: 4.00 },
      { id: 'queijo-parmesao', name: 'Parmesão Ralado na Hora', price: 5.00 },
      { id: 'pimenta-biquinho', name: 'Pimenta Biquinho Defumada', price: 3.00 },
    ],
  },
  {
    id: 'batata-cheddar-bacon',
    name: 'Fritas Cheddar Melt & Bacon',
    category: 'batatas',
    description: 'Porção reforçada de batatas palito super crocantes cobertas por uma generosa cascata de queijo cheddar inglês e cubos tostados de bacon.',
    price: 32.90,
    image: friesImg,
    tag: 'Para Compartilhar',
    prepTimeMin: 9,
    availableAddons: [
      { id: 'cheddar-dobro', name: 'Dobro de Calda de Cheddar', price: 6.00 },
      { id: 'bacon-dobro', name: 'Dobro de Bacon Crocante', price: 6.00 },
      { id: 'cebolinha-fresca', name: 'Cebolinha Verde Fresca', price: 2.00 },
    ],
  },
  {
    id: 'batata-crinkle-verde',
    name: 'Batata Crinkle com Molho Verde',
    category: 'batatas',
    description: 'Batatas onduladas bem sequinhas com tempero especial litorâneo, acompanhadas de pote com 100ml da nossa aclamada maionese verde artesanal.',
    price: 26.90,
    image: friesImg,
    tag: 'Ondulada Crocante',
    prepTimeMin: 8,
    availableAddons: [
      { id: 'maionese-verde-pote', name: 'Pote Extra de Maionese Verde', price: 4.50 },
      { id: 'parmesao-ralado', name: 'Parmesão Especial', price: 4.50 },
    ],
  },
  {
    id: 'mandioca-frita-praia',
    name: 'Mandioca Cremosa da Ilha',
    category: 'batatas',
    description: 'Pedaços nobres de mandioca frita com casquinha crocante e interior aveludado derretendo na boca, finalizada com manteiga de garrafa e cheiro-verde.',
    price: 28.90,
    image: friesImg,
    tag: 'Receita Caiçara',
    prepTimeMin: 10,
    availableAddons: [
      { id: 'manteiga-garrafa', name: 'Dose Extra Manteiga de Garrafa', price: 3.50 },
      { id: 'queijo-coalho', name: 'Tiras de Queijo Coalho Frito', price: 7.00 },
    ],
  },

  // --- SUCOS TROPICAIS ---
  {
    id: 'suco-maracuja-manga',
    name: 'Suco Maracujá & Manga Tropical',
    category: 'sucos',
    description: 'Polpa fresca de maracujá doce batida com manga palmer madura e folhas de hortelã. Extremamente refrescante e encorpado (500ml).',
    price: 15.90,
    image: juiceImg,
    tag: '100% Natural',
    prepTimeMin: 5,
    availableAddons: [
      { id: 'chia-sementes', name: 'Sementes de Chia', price: 2.50 },
      { id: 'gengibre-extra', name: 'Toque de Gengibre Fresco', price: 2.00 },
    ],
  },
  {
    id: 'suco-abacaxi-gengibre',
    name: 'Suco Abacaxi com Hortelã & Gengibre',
    category: 'sucos',
    description: 'Abacaxi pérola doce batido com folhas frescas de hortelã e leve toque termogênico de gengibre ralado. Servido trincando no gelo (500ml).',
    price: 14.90,
    image: juiceImg,
    tag: 'Super Refrescante',
    prepTimeMin: 5,
    availableAddons: [
      { id: 'limao-espremido', name: 'Limão Taiti Espremido', price: 2.00 },
      { id: 'agua-de-coco', name: 'Bater com Água de Coco (+R$ 4)', price: 4.00 },
    ],
  },
  {
    id: 'suco-laranja-terra',
    name: 'Suco Laranja Pura da Terra',
    category: 'sucos',
    description: 'Laranjas selecionadas espremidas na hora sem adição de água nem açúcar. Doçura natural da fruta (500ml).',
    price: 13.90,
    image: juiceImg,
    tag: 'Sem Açúcar',
    prepTimeMin: 4,
    availableAddons: [
      { id: 'gelo-duplo', name: 'Gelo Extra', price: 0.00 },
    ],
  },
  {
    id: 'suco-acai-copo',
    name: 'Açaí Puro da Praia (Copo 400ml)',
    category: 'sucos',
    description: 'Açaí cremoso batido com banana prata e xarope suave de guaraná natural. Acompanha pote de granola crocante com castanhas.',
    price: 21.90,
    image: juiceImg,
    tag: 'Energia da Praia',
    prepTimeMin: 6,
    availableAddons: [
      { id: 'leite-condensado', name: 'Leite Condensado', price: 3.00 },
      { id: 'leite-ninho', name: 'Leite em Pó Ninho', price: 3.50 },
      { id: 'pacoca-rolha', name: 'Paçoca Rolha Farelo', price: 2.50 },
      { id: 'morangos-frescos', name: 'Morangos Frescos Picados', price: 5.00 },
    ],
  },

  // --- REFRIGERANTES & BEBIDAS ---
  {
    id: 'refri-coca-lata',
    name: 'Coca-Cola Original 350ml (Lata)',
    category: 'refrigerantes',
    description: 'Lata trincando de gelada. Acompanha copo com pedras de gelo e rodela de limão se desejar.',
    price: 7.90,
    image: juiceImg,
    tag: 'Bebida Gelada',
    prepTimeMin: 2,
    availableAddons: [
      { id: 'limao-gelo', name: 'Copo com Gelo e Limão', price: 0.00 },
    ],
  },
  {
    id: 'refri-coca-zero',
    name: 'Coca-Cola Zero Açúcar 350ml (Lata)',
    category: 'refrigerantes',
    description: 'Zero açúcar, geladíssima com gás perfeito.',
    price: 7.90,
    image: juiceImg,
    tag: 'Zero Calorias',
    prepTimeMin: 2,
    availableAddons: [
      { id: 'limao-gelo', name: 'Copo com Gelo e Limão', price: 0.00 },
    ],
  },
  {
    id: 'refri-guarana-antarctica',
    name: 'Guaraná Antarctica 350ml (Lata)',
    category: 'refrigerantes',
    description: 'O sabor da Amazônia na praia. Lata bem gelada acompanhada de copo com gelo.',
    price: 7.90,
    image: juiceImg,
    tag: 'Original do Brasil',
    prepTimeMin: 2,
    availableAddons: [
      { id: 'limao-gelo', name: 'Copo com Gelo e Laranja', price: 0.00 },
    ],
  },
  {
    id: 'bebida-mate-limao',
    name: 'Chá Mate Gelado com Limão (500ml)',
    category: 'refrigerantes',
    description: 'O clássico inconfundível do litoral brasileiro: chá tostado batido bem gelado com suco de limão taiti.',
    price: 9.90,
    image: juiceImg,
    tag: 'Tradição do Litoral',
    prepTimeMin: 3,
    availableAddons: [],
  },
  {
    id: 'bebida-agua-mineral',
    name: 'Água Mineral da Serra 500ml',
    category: 'refrigerantes',
    description: 'Água mineral pura e cristalina de nascente da Serra do Mar. Opção com gás ou sem gás.',
    price: 5.50,
    image: juiceImg,
    tag: 'Hidratação Pura',
    prepTimeMin: 1,
    availableAddons: [
      { id: 'rodela-limao', name: 'Rodela de Limão Taiti', price: 0.00 },
    ],
  },

  // --- CHOCOLATES & SOBREMESAS ---
  {
    id: 'doce-brownie-vulcao',
    name: 'Brownie Vulcão de Chocolate Belga',
    category: 'chocolates',
    description: 'Brownie denso e úmido feito com chocolate meio amargo 70%, coberto com cascata quente de fudge cremoso e raspas crocantes de chocolate.',
    price: 19.90,
    image: chocolateImg,
    tag: 'A Larica Perfeita',
    prepTimeMin: 5,
    availableAddons: [
      { id: 'bola-sorvete', name: 'Bola de Sorvete de Creme', price: 6.50 },
      { id: 'castanhas-caju', name: 'Castanha de Caju Tostada', price: 3.50 },
      { id: 'calda-extra', name: 'Calda de Chocolate Quente Extra', price: 4.00 },
    ],
  },
  {
    id: 'doce-cookie-recheado',
    name: 'Cookie Rústico Recheado 120g',
    category: 'chocolates',
    description: 'Cookie gigante com massa dourada amanteigada, recheado com creme de avelã com cacau e pedaços generosos de chocolate ao leite.',
    price: 13.90,
    image: chocolateImg,
    tag: 'Crocante & Macio',
    prepTimeMin: 3,
    availableAddons: [
      { id: 'aquecer-totem', name: 'Servir Quentinho da Estufa', price: 0.00 },
    ],
  },
  {
    id: 'doce-barra-cacau70',
    name: 'Barra de Chocolate Artesanal Cacau 70%',
    category: 'chocolates',
    description: 'Barra de 80g de chocolate bean-to-bar feito no litoral paulista, com nibs de cacau torrados e cristais suaves de flor de sal.',
    price: 16.90,
    image: chocolateImg,
    tag: 'Bean to Bar Litoral',
    prepTimeMin: 1,
    availableAddons: [],
  },
  {
    id: 'doce-mini-churros',
    name: 'Mini Churros com Chocolate & Doce de Leite',
    category: 'chocolates',
    description: '6 unidades de mini churros crocantes e sequinhos, passados na canela com açúcar, acompanhados de pote de ganache de chocolate e doce de leite artesanal.',
    price: 18.90,
    image: chocolateImg,
    tag: 'Porção com 6 Unidades',
    prepTimeMin: 6,
    availableAddons: [
      { id: 'pote-ganache-extra', name: 'Pote Ganache Extra', price: 4.00 },
      { id: 'pote-doce-leite-extra', name: 'Pote Doce de Leite Extra', price: 4.00 },
    ],
  },
];
