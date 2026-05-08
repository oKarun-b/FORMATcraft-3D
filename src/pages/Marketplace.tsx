import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  ShoppingCart, 
  Star, 
  Package, 
  Grid, 
  Layers, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: 'fabric' | 'furniture' | 'template' | 'asset';
  price: number | 'Free';
  rating: number;
  sales: number;
  image: string;
  author: string;
  tags: string[];
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Italian Silk Pattern Pack',
    category: 'fabric',
    price: 24,
    rating: 4.9,
    sales: 1240,
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800',
    author: 'Atelier Silva',
    tags: ['luxury', 'fashion', 'high-res']
  },
  {
    id: '2',
    name: 'Mid-Century Chair Template',
    category: 'furniture',
    price: 45,
    rating: 4.8,
    sales: 850,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800',
    author: 'Nordic Craft',
    tags: ['oak', 'scandic', 'precise']
  },
  {
    id: '3',
    name: 'Digital Drafting Base Mesh',
    category: 'template',
    price: 'Free',
    rating: 4.7,
    sales: 5200,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800',
    author: 'FormaCraft',
    tags: ['basics', 'starter', 'optimized']
  },
  {
    id: '4',
    name: 'Heavy Denim Texture Set',
    category: 'fabric',
    price: 15,
    rating: 5.0,
    sales: 430,
    image: 'https://images.unsplash.com/photo-1582142306909-195724d33ffc?q=80&w=800',
    author: 'Indigo Labs',
    tags: ['workwear', 'durable', 'denim']
  },
  {
    id: '5',
    name: 'Modular Sofa System',
    category: 'furniture',
    price: 89,
    rating: 4.6,
    sales: 210,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800',
    author: 'Urban Space',
    tags: ['modular', 'living', 'modern']
  },
  {
    id: '6',
    name: 'Bespoke Suit Pattern',
    category: 'template',
    price: 35,
    rating: 4.9,
    sales: 640,
    image: 'https://images.unsplash.com/photo-1594932293270-9ae2121443d1?q=80&w=800',
    author: 'Savile Row Digital',
    tags: ['tailoring', 'luxury', 'precise']
  }
];

export const MarketplacePage = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#050505] min-h-screen pt-24 pb-20"
    >
      {/* Header & Hero */}
      <section className="py-20 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <span className="text-[11px] font-mono font-bold text-gold uppercase tracking-[0.4em] mb-4 block">DESIGN LIQUIDITY</span>
            <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tight italic mb-8">The Marketplace.</h1>
            <p className="text-lg text-white/40 max-w-2xl font-light leading-relaxed">
              Access a premium library of textures, templates, and 3D assets curated for the professional digital artisan. Monetize your designs or fuel your production.
            </p>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="sticky top-20 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {['all', 'fabric', 'furniture', 'template', 'asset'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                  activeCategory === cat 
                    ? 'bg-gold border-gold text-black' 
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
            <input 
              type="text"
              placeholder="SEARCH ASSETS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-12 pr-6 text-[10px] font-mono text-white tracking-widest focus:outline-none focus:border-gold/50 transition-colors uppercase"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-32 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-white/20" />
            </div>
            <h3 className="text-white font-serif italic text-2xl mb-2">No assets found</h3>
            <p className="text-white/40 text-sm">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Seller Promo */}
      <section className="container mx-auto px-6 pt-20">
        <div className="p-16 rounded-[3rem] border border-gold/20 bg-gold/[0.03] glass relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/10 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-xl">
             <span className="text-[11px] font-mono font-bold text-gold uppercase tracking-[0.4em] mb-4 block">BECOME A CREATOR</span>
             <h2 className="text-4xl text-white font-serif italic mb-6">Monetize Your Craft.</h2>
             <p className="text-white/50 mb-10 leading-relaxed font-light">
               Join our community of elite digital artisans. Upload your patterns, textures, or models and earn industry-leading commissions on every sale.
             </p>
             <button className="px-10 py-4 rounded-full bg-gold text-black font-bold text-[10px] uppercase tracking-widest hover:bg-gold-light transition-all flex items-center gap-3">
               Start Selling <ChevronRight size={14} />
             </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const ProductCard = ({ product, index }: { product: Product, index: number }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/5 border border-white/5 group-hover:border-white/20 transition-all duration-500">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
           <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-gold transition-colors">
              <ShoppingCart size={18} />
           </button>
           <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
              <Download size={18} />
           </button>
        </div>

        {/* Info Tags */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono text-white/80 uppercase tracking-widest">
            {product.category}
          </span>
          {product.sales > 500 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/90 text-black text-[9px] font-bold uppercase tracking-widest">
              <TrendingUp size={10} /> Bestseller
            </div>
          )}
        </div>

        <div className="absolute top-6 right-6">
          <div className="px-3 py-1 rounded-full bg-gold text-black text-[10px] font-bold tracking-tight">
            {typeof product.price === 'number' ? `$${product.price}` : product.price}
          </div>
        </div>
      </div>

      <div className="mt-6 px-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-white font-medium text-sm tracking-tight group-hover:text-gold transition-colors">{product.name}</h3>
          <div className="flex items-center gap-1 text-gold">
            <Star size={12} fill="currentColor" />
            <span className="text-[10px] font-mono font-bold leading-none">{product.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-white/40 font-light mb-4">
          <span>by {product.author}</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span>{product.sales}+ Sales</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {product.tags.map(tag => (
            <span key={tag} className="text-[8px] font-mono text-white/20 uppercase tracking-widest">#{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
