import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ShoppingBag, Search, Filter, Check, Star, Truck, ShieldCheck, 
  ChevronRight, Phone, Plus, ShoppingCart, Sparkles, Tag, Eye
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShopProduct, Language } from '../types';
import { translations } from '../data/translations';
import { useShopProducts } from '../lib/useShopProducts';
import { shopifyImg } from '../lib/cdn';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ShopSectionProps {
  currentLang: Language;
  onAddToCart: (product: ShopProduct) => void;
  onQuickOrder: (product: ShopProduct) => void;
}

export const ShopSection: React.FC<ShopSectionProps> = ({
  currentLang,
  onAddToCart,
  onQuickOrder
}) => {
  const t = translations[currentLang];
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);

  // Реална мото опрема од Supabase (hamachi.mk) со демо fallback
  const { shopProducts } = useShopProducts();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);

  const categories = [
    { id: 'all', label: t.shop.tabAll, icon: '🛍️', count: shopProducts.length },
    { id: 'helmets', label: t.shop.tabHelmets, icon: '🪖', count: shopProducts.filter(p => p.category === 'helmets').length },
    { id: 'oils', label: t.shop.tabOils, icon: '🛢️', count: shopProducts.filter(p => p.category === 'oils').length },
    { id: 'tires', label: t.shop.tabTires, icon: '🛞', count: shopProducts.filter(p => p.category === 'tires').length },
    { id: 'apparel', label: t.shop.tabApparel, icon: '🧥', count: shopProducts.filter(p => p.category === 'apparel').length },
    { id: 'accessories', label: t.shop.tabAccessories, icon: '🎒', count: shopProducts.filter(p => p.category === 'accessories').length },
    { id: 'parts', label: t.shop.tabParts, icon: '⚙️', count: shopProducts.filter(p => p.category === 'parts').length }
  ];

  const filteredProducts = useMemo(() => {
    let list = [...shopProducts];

    if (activeCategory !== 'all') {
      list = list.filter(p => p.category === activeCategory);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.compatibility.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.priceMkd - b.priceMkd);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.priceMkd - a.priceMkd);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [activeCategory, searchQuery, sortBy, shopProducts]);

  // GSAP Initial Scroll-Triggered Entrance
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true
        }
      });

      tl.from('.gsap-shop-header', {
        opacity: 0,
        y: 20,
        duration: 0.65,
        ease: 'power3.out'
      })
      .from('.gsap-shop-badge', {
        opacity: 0,
        x: 16,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.4')
      .from('.gsap-shop-tabs', {
        opacity: 0,
        y: 16,
        duration: 0.55,
        ease: 'power2.out'
      }, '-=0.35')
      .from('.gsap-shop-controls', {
        opacity: 0,
        y: 16,
        duration: 0.55,
        ease: 'power2.out'
      }, '-=0.4')
      .from('.gsap-shop-card', {
        opacity: 0,
        y: 26,
        scale: 0.96,
        stagger: 0.05,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.35');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // GSAP Category / Filter change animation
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.querySelectorAll('.gsap-shop-card'),
        { opacity: 0, y: 16, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.035,
          duration: 0.45,
          ease: 'power2.out',
          overwrite: 'auto'
        }
      );
    }
  }, [activeCategory, searchQuery, sortBy, shopProducts]);

  return (
    <section 
      ref={sectionRef}
      id="shop" 
      className="py-16 bg-transparent border-b border-white/10 text-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="gsap-shop-header">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-red-950/40 border border-red-500/30 text-[#FF5B4D] text-xs font-bold uppercase tracking-wider mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t.shop.eyebrow}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
              {t.shop.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mt-1">
              {t.shop.subtitle}
            </p>
          </div>

          {/* Delivery & Trust Banner */}
          <div className="gsap-shop-badge p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center space-x-3 text-xs text-emerald-300 font-semibold">
            <Truck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="font-bold text-white">{t.shop.freeShippingNotice}</div>
              <div className="text-[11px] text-emerald-400">{t.shop.deliveryTime}</div>
            </div>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="gsap-shop-tabs flex overflow-x-auto pb-3 gap-2 scrollbar-none mb-6">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-150 flex items-center space-x-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#E22E1A] text-white border border-red-500/40'
                    : 'bg-[#121316] hover:bg-[#1C1E26] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="gsap-shop-controls bg-[#121316] p-4 rounded-2xl border border-white/10 mb-8 grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Пребарај опрема, кацига, модел на гума (Motul, HJC, Michelin, SYM)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181A20] border border-white/10 focus:border-red-500/50 text-xs sm:text-sm text-white outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#181A20] border border-white/10 text-xs sm:text-sm font-bold text-slate-200 outline-none cursor-pointer focus:border-red-500/50"
            >
              <option value="featured">⭐ Најпродавани Производи</option>
              <option value="price-asc">💰 Цена: Од најниска</option>
              <option value="price-desc">💰 Цена: Од највисока</option>
              <option value="rating">🌟 Највисоки Оценки</option>
            </select>
          </div>

        </div>

        {/* Products Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="gsap-shop-card bg-[#121316] rounded-2xl border border-white/10 overflow-hidden hover:border-red-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Product Image */}
              <div>
                <div className="relative aspect-square bg-slate-950 overflow-hidden">
                  <img
                    src={shopifyImg(product.image, 600)}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
                    referrerPolicy="no-referrer"
                  />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#121316]/90 border border-white/15 text-white text-[10px] font-bold">
                      {product.brand}
                    </span>
                  </div>

                  {product.badge && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#E22E1A] text-white text-[10px] font-bold">
                        {product.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Body */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-[#FF5B4D] transition-colors line-clamp-2 leading-snug">
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="text-[11px] text-slate-300 bg-[#181A20] p-2 rounded-lg border border-white/5">
                    <span className="font-semibold text-slate-400">Компатибилност:</span> {product.compatibility}
                  </div>
                </div>
              </div>

              {/* Price & Add to Cart Bottom */}
              <div className="p-4 pt-0">
                <div className="flex items-baseline justify-between pt-2 border-t border-white/10">
                  <div>
                    <div className="text-lg font-black text-white">
                      {product.priceMkdFormatted}
                    </div>
                    <div className="text-[11px] text-slate-400 font-semibold">
                      {product.priceEurFormatted}
                    </div>
                  </div>
                  
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center">
                    <Check className="w-3 h-3 mr-1" />
                    На залиха
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={() => onAddToCart(product)}
                    className="py-2.5 px-3 rounded-xl bg-[#181A20] hover:bg-[#22252C] border border-white/10 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#FF5B4D]" />
                    <span>Во Кошничка</span>
                  </button>

                  <button
                    onClick={() => onQuickOrder(product)}
                    className="py-2.5 px-3 rounded-xl bg-[#E22E1A] hover:bg-[#C82412] text-white text-xs font-black transition-all flex items-center justify-center space-x-1 cursor-pointer border border-red-500/30"
                  >
                    <span>Купи Веднаш</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
