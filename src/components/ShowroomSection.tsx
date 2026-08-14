import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, SlidersHorizontal, ArrowUpDown, Shield, Check, 
  Sparkles, Fuel, Zap, Gauge, Flame, Wrench, X, Eye, 
  Calculator, Phone, ShoppingCart, MapPin, ChevronRight, Filter
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Motorcycle, MotoCategory, MotoSubCategory, Language } from '../types';
import { translations } from '../data/translations';
import { useMotorcycles } from '../lib/useMotorcycles';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ShowroomSectionProps {
  currentLang: Language;
  onBookTestRide: (moto: Motorcycle) => void;
  onOpenFinancing: (moto: Motorcycle) => void;
  initialCcFilter?: string;
  /** Кога е поставено: прикажи само оваа категорија (без табови) — за категориски страници. */
  fixedCategory?: MotoCategory;
}

export const ShowroomSection: React.FC<ShowroomSectionProps> = ({
  currentLang,
  onBookTestRide,
  onOpenFinancing,
  initialCcFilter,
  fixedCategory
}) => {
  const t = translations[currentLang];
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);

  // Реални податоци од Supabase (hamachi.mk) со демо fallback кога нема база
  const { motorcycles, usingDemo } = useMotorcycles();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<MotoCategory>(fixedCategory || 'all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedCcRange, setSelectedCcRange] = useState<string>(initialCcFilter || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'cc-asc' | 'cc-desc' | 'price-asc' | 'price-desc' | 'name'>('cc-asc');
  
  // Modal State for Motorcycle Details & Loan Calculator
  const [selectedMotoForDetails, setSelectedMotoForDetails] = useState<Motorcycle | null>(null);
  const [loanMonths, setLoanMonths] = useState<number>(24);
  const [downPaymentMkd, setDownPaymentMkd] = useState<number>(0);

  // Main Categories List
  const mainCategories: { id: MotoCategory; label: string; count: number; icon: string }[] = useMemo(() => [
    { id: 'all', label: t.showroom.filterAll, count: motorcycles.length, icon: '🚀' },
    { id: 'scooters', label: t.showroom.filterScooters, count: motorcycles.filter(m => m.category === 'scooters').length, icon: '🛵' },
    { id: 'motorcycles', label: t.showroom.filterMotorcycles, count: motorcycles.filter(m => m.category === 'motorcycles').length, icon: '🏍️' },
    { id: 'atv-quad', label: t.showroom.filterAtv, count: motorcycles.filter(m => m.category === 'atv-quad').length, icon: '🚜' },
    { id: 'electric', label: t.showroom.filterElectric, count: motorcycles.filter(m => m.category === 'electric').length, icon: '⚡' }
  ], [motorcycles, t]);

  // CC Ranges (од најмала до најголема кубикажа)
  const ccRanges = [
    { id: 'all', label: 'Сите Кубикажи' },
    { id: '50', label: '50cc (AM дозвола)' },
    { id: '110-125', label: '110cc - 125cc' },
    { id: '200-250', label: '200cc - 250cc' },
    { id: '278-368', label: '278cc - 368cc' },
    { id: '450-800', label: '450cc - 800cc (Рели/Adventure)' },
    { id: 'electric', label: '⚡ Електрични' }
  ];

  // Subcategories mapping based on active category
  const subCategoriesList = useMemo(() => {
    if (selectedCategory === 'scooters') {
      return [
        { id: 'all', label: 'Сите Скутери' },
        { id: 'scooter-50', label: '50cc Градски Мопеди (од 67.035 ден.)' },
        { id: 'scooter-125-200', label: '125cc - 200cc Градски' },
        { id: 'scooter-maxi-300', label: '278cc - 368cc Макси & Crossover' }
      ];
    }
    if (selectedCategory === 'motorcycles') {
      return [
        { id: 'all', label: 'Сите Моторцикли' },
        { id: 'cross-enduro', label: 'Крос / Pit Bike & Ендуро' },
        { id: 'street-naked', label: 'Street & Naked' },
        { id: 'cruiser-chopper', label: 'Чопери & V-Twin' },
        { id: 'adventure-rally', label: 'Рели & Adventure (450cc - 800cc)' }
      ];
    }
    if (selectedCategory === 'atv-quad') {
      return [
        { id: 'all', label: 'Сите Четирицикли' },
        { id: 'atv-junior', label: '125cc Junior Quad' },
        { id: 'atv-utility', label: '250cc Utility 4x2' }
      ];
    }
    return [];
  }, [selectedCategory]);

  const brands = useMemo(() => {
    const set = new Set<string>(motorcycles.map((m) => m.brand).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [motorcycles]);

  // Filter and Sort Engine (Default: CC Ascending from 50cc to 800cc)
  const filteredMotorcycles = useMemo(() => {
    let result = [...motorcycles];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(m => m.category === selectedCategory);
    }

    // Subcategory filter
    if (selectedSubCategory !== 'all') {
      result = result.filter(m => m.subCategory === selectedSubCategory);
    }

    // CC Range filter
    if (selectedCcRange !== 'all') {
      if (selectedCcRange === '50') {
        result = result.filter(m => m.ccNumber === 50);
      } else if (selectedCcRange === '110-125' || selectedCcRange === '125') {
        result = result.filter(m => m.ccNumber >= 100 && m.ccNumber <= 125);
      } else if (selectedCcRange === '200-250' || selectedCcRange === '250') {
        result = result.filter(m => m.ccNumber >= 190 && m.ccNumber <= 250);
      } else if (selectedCcRange === '278-368' || selectedCcRange === '350') {
        result = result.filter(m => m.ccNumber >= 270 && m.ccNumber <= 370);
      } else if (selectedCcRange === '450-800' || selectedCcRange === '800') {
        result = result.filter(m => m.ccNumber >= 440 && m.ccNumber <= 800);
      } else if (selectedCcRange === 'electric' || selectedCcRange === '0') {
        result = result.filter(m => m.ccNumber === 0);
      }
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      result = result.filter(m => m.brand === selectedBrand);
    }

    // Text search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        m.displacement.toLowerCase().includes(q) ||
        m.subtitle.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      );
    }

    // Sorting Logic
    result.sort((a, b) => {
      if (sortBy === 'cc-asc') {
        return a.ccNumber - b.ccNumber; // Smallest to Largest CC
      }
      if (sortBy === 'cc-desc') {
        return b.ccNumber - a.ccNumber; // Largest to Smallest CC
      }
      if (sortBy === 'price-asc') {
        return a.priceMkd - b.priceMkd;
      }
      if (sortBy === 'price-desc') {
        return b.priceMkd - a.priceMkd;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [selectedCategory, selectedSubCategory, selectedCcRange, selectedBrand, searchQuery, sortBy, motorcycles]);

  // Calculate Loan Installment for detail modal
  const calculatedLoanMonthly = useMemo(() => {
    if (!selectedMotoForDetails) return 0;
    const principal = Math.max(0, selectedMotoForDetails.priceMkd - downPaymentMkd);
    // Standard bank / Iute consumer interest approx 6.5% flat yearly for simplicity
    const interestFactor = 1 + (0.065 * (loanMonths / 12));
    const totalWithInterest = principal * interestFactor;
    return Math.round(totalWithInterest / loanMonths);
  }, [selectedMotoForDetails, downPaymentMkd, loanMonths]);

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

      tl.from('.gsap-showroom-header', {
        opacity: 0,
        y: 20,
        duration: 0.65,
        ease: 'power3.out'
      })
      .from('.gsap-showroom-tabs', {
        opacity: 0,
        y: 16,
        duration: 0.55,
        ease: 'power2.out'
      }, '-=0.4')
      .from('.gsap-showroom-controls', {
        opacity: 0,
        y: 18,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.4')
      .from('.gsap-moto-card', {
        opacity: 0,
        y: 28,
        scale: 0.96,
        stagger: 0.06,
        duration: 0.65,
        ease: 'power3.out'
      }, '-=0.35');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // GSAP Card Reveal on Filter / Search Change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.querySelectorAll('.gsap-moto-card'),
        { opacity: 0, y: 16, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.04,
          duration: 0.45,
          ease: 'power2.out',
          overwrite: 'auto'
        }
      );
    }
  }, [selectedCategory, selectedSubCategory, selectedCcRange, selectedBrand, searchQuery, sortBy]);

  return (
    <section 
      ref={sectionRef}
      id="showroom" 
      className="py-16 bg-[#0A0A0B] border-b border-white/10 text-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="gsap-showroom-header flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-red-950/40 border border-red-500/30 text-[#FF5B4D] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.showroom.eyebrow}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
              {t.showroom.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mt-1">
              {t.showroom.subtitle}
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center space-x-2 bg-[#121316] px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-slate-300">
            <span className={`w-2 h-2 rounded-full ${usingDemo ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
            <span>Прикажани {filteredMotorcycles.length} модели на залиха</span>
            {usingDemo && <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">ПРЕГЛЕД (демо)</span>}
          </div>
        </div>

        {/* Main Category Tabs — скриени кога е фиксирана категорија (категориска страница) */}
        {!fixedCategory && (
        <div className="gsap-showroom-tabs flex overflow-x-auto pb-2 gap-2 scrollbar-none mb-4">
          {mainCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedSubCategory('all');
                }}
                className={`px-4 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-150 flex items-center space-x-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#E22E1A] text-white border border-red-500/40'
                    : 'bg-[#121316] text-slate-300 hover:bg-[#1C1E26] hover:text-white border border-white/10'
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
        )}

        {/* Subcategories (if available for the selected category) */}
        {subCategoriesList.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 p-3 bg-[#121316] rounded-xl border border-white/10">
            <span className="text-xs font-bold text-slate-400 flex items-center mr-1">
              <Filter className="w-3.5 h-3.5 mr-1 text-[#FF5B4D]" />
              Подкатегории:
            </span>
            {subCategoriesList.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubCategory(sub.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedSubCategory === sub.id
                    ? 'bg-[#E22E1A] text-white'
                    : 'bg-[#181A20] hover:bg-[#22252C] text-slate-300 border border-white/5'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* Control Bar: Search, CC Ranges, Brands, Sorting */}
        <div className="gsap-showroom-controls bg-[#121316] p-4 rounded-2xl border border-white/10 mb-8 space-y-4">
          
          {/* Top Row: Search & Sorting */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.showroom.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181A20] border border-white/10 focus:border-red-500/50 focus:bg-[#1E2028] text-xs sm:text-sm text-white outline-none transition-all placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Brand Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#181A20] border border-white/10 text-xs sm:text-sm font-semibold text-slate-200 outline-none cursor-pointer focus:border-red-500/50"
              >
                <option value="all">Сите Брендови (Zontes, SYM, Kove...)</option>
                {brands.filter(b => b !== 'all').map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Sorting Dropdown (Smallest CC to Largest CC by default) */}
            <div className="md:col-span-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#181A20] border border-white/10 text-xs sm:text-sm font-bold text-slate-200 outline-none cursor-pointer focus:border-red-500/50"
                >
                  <option value="cc-asc">🏍️ Кубикажа: Најмала ➔ Најголема (50cc ➔ 800cc)</option>
                  <option value="cc-desc">🏍️ Кубикажа: Најголема ➔ Најмала (800cc ➔ 50cc)</option>
                  <option value="price-asc">💰 Цена: Од најниска</option>
                  <option value="price-desc">💰 Цена: Од највисока</option>
                  <option value="name">🔤 Име на Модел</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bottom Row: Cubic Capacity Pills (Кубикажа од најмала до најголема) */}
          <div className="flex items-center flex-wrap gap-1.5 pt-2 border-t border-white/10">
            <span className="text-xs font-bold text-slate-400 mr-2 flex items-center">
              <Gauge className="w-3.5 h-3.5 text-[#FF5B4D] mr-1" />
              Кубикажа:
            </span>
            {ccRanges.map((cc) => {
              const isSelected = selectedCcRange === cc.id;
              return (
                <button
                  key={cc.id}
                  onClick={() => setSelectedCcRange(cc.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-500/20 text-[#FF5B4D] border border-red-500/40 font-extrabold'
                      : 'bg-[#181A20] hover:bg-[#22252C] text-slate-300 border border-white/5'
                  }`}
                >
                  {cc.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* Motorcycle Grid */}
        {filteredMotorcycles.length === 0 ? (
          <div className="text-center py-16 bg-[#121316] rounded-2xl border border-white/10 p-8">
            <div className="w-16 h-16 bg-red-950/40 text-[#FF5B4D] border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Нема пронајдено модели</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
              Обидете се со ресетирање на филтрите или пребарување со друг поим.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubCategory('all');
                setSelectedCcRange('all');
                setSelectedBrand('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#1F2129] text-white text-xs font-bold hover:bg-[#282B35] border border-white/10 transition-colors"
            >
              Ресетирај Сите Филтри
            </button>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMotorcycles.map((moto) => (
              <div
                key={moto.id}
                className="gsap-moto-card bg-[#121316] rounded-2xl border border-white/10 overflow-hidden hover:border-red-500/40 transition-all duration-300 flex flex-col group"
              >
                {/* Card Image Header */}
                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                  <img
                    src={moto.image}
                    alt={moto.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121316] via-transparent to-transparent opacity-80"></div>

                  {/* Top Left Badge: Brand & CC */}
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-[#121316]/90 backdrop-blur-md border border-white/15 text-white text-[11px] font-black tracking-wider">
                      {moto.brand}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-[#E22E1A] text-white text-[11px] font-black">
                      {moto.displacement}
                    </span>
                  </div>

                  {/* Top Right Custom Badge */}
                  {moto.badge && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black tracking-wide uppercase">
                      {moto.badge}
                    </div>
                  )}

                  {/* Quick View Button */}
                  <button
                    onClick={() => setSelectedMotoForDetails(moto)}
                    className="absolute bottom-3 right-3 p-2 rounded-lg bg-[#181A20]/90 hover:bg-[#22252C] border border-white/15 text-white transition-all opacity-0 group-hover:opacity-100 flex items-center space-x-1 text-xs font-bold cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#FF5B4D]" />
                    <span>Брз Преглед</span>
                  </button>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  
                  <div>
                    {/* Title & Subtitle */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-black text-lg text-white group-hover:text-[#FF5B4D] transition-colors leading-snug">
                        {moto.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {moto.subtitle}
                    </p>

                    {/* Key Technical Specs Grid — само достапните спецификации */}
                    {[moto.power, moto.cooling, moto.topSpeed, moto.weight].some((v) => v && v !== '—') && (
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-xs">
                      {moto.power && moto.power !== '—' && (
                        <div className="p-2 rounded-lg bg-[#181A20] border border-white/5">
                          <span className="text-[10px] text-slate-400 block">Моќност</span>
                          <span className="font-bold text-slate-200">{moto.power}</span>
                        </div>
                      )}
                      {moto.cooling && moto.cooling !== '—' && (
                        <div className="p-2 rounded-lg bg-[#181A20] border border-white/5">
                          <span className="text-[10px] text-slate-400 block">Ладење / Мотор</span>
                          <span className="font-bold text-slate-200">{moto.cooling}</span>
                        </div>
                      )}
                      {moto.topSpeed && moto.topSpeed !== '—' && (
                        <div className="p-2 rounded-lg bg-[#181A20] border border-white/5">
                          <span className="text-[10px] text-slate-400 block">Макс. Брзина</span>
                          <span className="font-bold text-slate-200">{moto.topSpeed}</span>
                        </div>
                      )}
                      {moto.weight && moto.weight !== '—' && (
                        <div className="p-2 rounded-lg bg-[#181A20] border border-white/5">
                          <span className="text-[10px] text-slate-400 block">Маса / Резервоар</span>
                          <span className="font-bold text-slate-200">{moto.weight}</span>
                        </div>
                      )}
                    </div>
                    )}

                    {/* Available in Salons Tag */}
                    <div className="mt-3 flex items-center text-[11px] text-emerald-400 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 mr-1 flex-shrink-0" />
                      <span className="truncate">Достапен во: {moto.stockSalons.slice(0, 3).join(', ')}...</span>
                    </div>
                  </div>

                  {/* Pricing & Installment Row */}
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                          {moto.priceMkdFormatted}
                        </div>
                        <div className="text-xs font-semibold text-slate-400">
                          {moto.priceEurFormatted} (со вклучен ДДВ)
                        </div>
                      </div>

                      {/* Loan Installment Chip */}
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Рата од:
                        </span>
                        <span className="text-sm font-black text-[#FF5B4D]">
                          {moto.monthlyInstallmentMkd.toLocaleString()} ден.
                          <span className="text-[10px] font-normal text-slate-400">/мес.</span>
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button
                        onClick={() => setSelectedMotoForDetails(moto)}
                        className="py-2.5 px-3 rounded-xl bg-[#181A20] hover:bg-[#22252C] border border-white/10 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Calculator className="w-3.5 h-3.5 text-slate-400" />
                        <span>Спецификации</span>
                      </button>

                      <button
                        onClick={() => onOpenFinancing(moto)}
                        className="py-2.5 px-3 rounded-xl bg-[#E22E1A] hover:bg-[#C82412] text-white text-xs font-black border border-red-500/40 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <span>Купи на Рати</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Detail & Interactive Loan Calculator Modal */}
      {selectedMotoForDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121316] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-white/15 p-6 sm:p-8 relative text-slate-100">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedMotoForDetails(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#181A20] hover:bg-[#22252C] border border-white/10 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-md bg-[#E22E1A] text-white text-xs font-black">
                {selectedMotoForDetails.brand}
              </span>
              <span className="px-3 py-1 rounded-md bg-[#181A20] border border-white/10 text-white text-xs font-bold">
                {selectedMotoForDetails.displacement}
              </span>
              <span className="px-3 py-1 rounded-md bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                {selectedMotoForDetails.warrantyYears} Години Гаранција
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
              {selectedMotoForDetails.name}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {selectedMotoForDetails.subtitle}
            </p>

            {/* Modal Visual and Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
              
              {/* Left Column: Image & Highlights */}
              <div className="md:col-span-6 space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-950 border border-white/10">
                  <img
                    src={selectedMotoForDetails.image}
                    alt={selectedMotoForDetails.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="bg-[#181A20] p-4 rounded-2xl border border-white/10">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Фабрички Карактеристики:
                  </h4>
                  {selectedMotoForDetails.features.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {selectedMotoForDetails.features.map((f, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="w-3.5 h-3.5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  ) : selectedMotoForDetails.descriptionHtml ? (
                    <div
                      className="max-h-56 overflow-y-auto text-xs leading-relaxed text-slate-300 description-html"
                      dangerouslySetInnerHTML={{ __html: selectedMotoForDetails.descriptionHtml }}
                    />
                  ) : (
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {selectedMotoForDetails.description || 'Контактирајте не за повеќе информации за овој модел.'}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: Complete Specs & Loan Calculator */}
              <div className="md:col-span-6 space-y-5">
                
                {/* Real Price Display */}
                <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#FF5B4D] uppercase tracking-wider block">
                      Официјална Цена:
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      {selectedMotoForDetails.priceMkdFormatted}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-200">
                      {selectedMotoForDetails.priceEurFormatted}
                    </span>
                    <span className="text-[11px] text-slate-400 block">со вклучен ДДВ</span>
                  </div>
                </div>

                {/* Interactive Loan Installment Calculator */}
                <div className="p-5 rounded-2xl bg-[#181A20] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-white uppercase tracking-wide">
                      <Calculator className="w-4 h-4 text-[#FF5B4D]" />
                      <span>Пресметка на Рати (Iute / Diners / Банка)</span>
                    </div>
                  </div>

                  {/* Months Selector */}
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                      Број на Месечни Рати:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[12, 24, 36, 48].map((m) => (
                        <button
                          key={m}
                          onClick={() => setLoanMonths(m)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            loanMonths === m
                              ? 'bg-[#E22E1A] text-white'
                              : 'bg-[#121316] hover:bg-[#1C1E26] text-slate-300 border border-white/5'
                          }`}
                        >
                          {m} мес.
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calculated Result Box */}
                  <div className="p-3.5 rounded-xl bg-[#0D0E12] border border-white/10 text-white flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">
                        Месечна Рата ({loanMonths} мес.):
                      </span>
                      <span className="text-xl font-black text-white">
                        {calculatedLoanMonthly.toLocaleString()} ден.
                        <span className="text-xs font-normal text-slate-400"> / месец</span>
                      </span>
                    </div>
                    <span className="text-[10px] bg-red-600 text-white px-2 py-1 rounded font-bold">
                      БЕЗ ЖИРАНТИ
                    </span>
                  </div>
                </div>

                {/* Technical Specifications Table — само достапните податоци */}
                {[
                  ['Агрегат', selectedMotoForDetails.engine],
                  ['Ладење', selectedMotoForDetails.cooling],
                  ['Моќност', selectedMotoForDetails.power],
                  ['Вртежен момент', selectedMotoForDetails.torque],
                  ['Сопирачки', selectedMotoForDetails.brakes],
                  ['Тркала & Гуми', selectedMotoForDetails.tires],
                ].filter(([, v]) => v && v !== '—').length > 0 && (
                <div className="bg-[#181A20] p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
                  <h4 className="font-bold text-white uppercase tracking-wider">
                    Технички Податоци:
                  </h4>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {[
                      ['Агрегат', selectedMotoForDetails.engine],
                      ['Ладење', selectedMotoForDetails.cooling],
                      ['Моќност', selectedMotoForDetails.power],
                      ['Вртежен момент', selectedMotoForDetails.torque],
                      ['Сопирачки', selectedMotoForDetails.brakes],
                      ['Тркала & Гуми', selectedMotoForDetails.tires],
                    ]
                      .filter(([, v]) => v && v !== '—')
                      .map(([label, value]) => (
                        <div key={label}>
                          <span className="text-slate-400">{label}:</span>{' '}
                          <span className="font-bold text-slate-200">{value}</span>
                        </div>
                      ))}
                  </div>
                </div>
                )}

                {/* Action CTAs inside modal */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => {
                      const m = selectedMotoForDetails;
                      setSelectedMotoForDetails(null);
                      onOpenFinancing(m);
                    }}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-[#E22E1A] hover:bg-[#C82412] text-white font-black text-sm border border-red-500/40 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Аплицирај за Рати / Нарачај</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      const m = selectedMotoForDetails;
                      setSelectedMotoForDetails(null);
                      onBookTestRide(m);
                    }}
                    className="py-3.5 px-4 rounded-xl bg-[#181A20] hover:bg-[#22252C] border border-white/10 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Закажи Пробно Возење
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
