import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { OemPart, Language } from '../types';
import { OEM_PARTS } from '../data/parts';
import { translations } from '../data/translations';
import { usePartsProducts } from '../lib/usePartsProducts';
import { shopifyImg } from '../lib/cdn';
import { 
  Search, 
  Truck, 
  ShieldCheck, 
  Package, 
  Info, 
  X,
  FileCheck,
  CheckCircle2
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface OemPartsSectionProps {
  currentLang: Language;
  onRequestPartQuote: (part: OemPart) => void;
}

export const OemPartsSection: React.FC<OemPartsSectionProps> = ({
  currentLang,
  onRequestPartQuote
}) => {
  const t = translations[currentLang];
  const { parts } = usePartsProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPartModal, setSelectedPartModal] = useState<OemPart | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);

  const categories = [
    { id: 'all', label: t.parts.filterAll },
    { id: 'engine', label: t.parts.filterEngine },
    { id: 'braking', label: t.parts.filterBraking },
    { id: 'exhaust', label: t.parts.filterExhaust },
    { id: 'electronics', label: t.parts.filterElectronics },
    { id: 'suspension', label: t.parts.filterSuspension },
    { id: 'transmission', label: 'Трансмисија, Ремен & Ланец' }
  ];

  const filteredParts = OEM_PARTS.filter((part) => {
    const matchesCat = activeCategory === 'all' || part.category === activeCategory;
    const matchesSearch = 
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.compatibility.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

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

      tl.from('.gsap-parts-header', {
        opacity: 0,
        y: 20,
        duration: 0.65,
        ease: 'power3.out'
      })
      .from('.gsap-parts-badge', {
        opacity: 0,
        x: 16,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.4')
      .from('.gsap-parts-controls', {
        opacity: 0,
        y: 16,
        duration: 0.55,
        ease: 'power2.out'
      }, '-=0.35')
      .from('.gsap-part-card', {
        opacity: 0,
        y: 24,
        scale: 0.97,
        stagger: 0.05,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.3')
      .from('.gsap-parts-banner', {
        opacity: 0,
        y: 20,
        duration: 0.55,
        ease: 'power2.out'
      }, '-=0.25');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // GSAP filter animation
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.querySelectorAll('.gsap-part-card'),
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
  }, [activeCategory, searchQuery]);

  return (
    <section 
      ref={sectionRef}
      id="oem-parts" 
      className="py-16 lg:py-24 bg-transparent border-b border-white/10 relative text-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="gsap-parts-header space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-red-950/40 border border-red-500/30 text-[#FF5B4D] text-xs font-bold uppercase tracking-wider">
              <Package className="w-3.5 h-3.5" />
              <span>{t.parts.eyebrow}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
              {t.parts.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              {t.parts.subtitle}
            </p>
          </div>

          {/* Quick OEM Highlights Badge */}
          <div className="gsap-parts-badge flex items-center space-x-4 p-3 rounded-2xl bg-[#121316] border border-white/10 text-xs font-semibold text-slate-300">
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>24-48h Карго Достава</span>
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center space-x-1.5 text-[#FF5B4D]">
              <ShieldCheck className="w-4 h-4 text-[#FF5B4D]" />
              <span>100% Оригинални Фабрички Делови</span>
            </div>
          </div>
        </div>

        {/* Реални фотографии на резервни делови од магацинот */}
        {parts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Реални Фотографии на Делови од Магацинот:
              </div>
              <span className="text-[11px] text-slate-400 font-semibold">
                {parts.length}+ делови на залиха
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {parts.slice(0, 12).map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl overflow-hidden bg-[#121316] border border-white/10 group"
                >
                  <div className="aspect-square bg-slate-950 overflow-hidden">
                    <img
                      src={shopifyImg(p.image, 400)}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-2">
                    <div className="text-[10px] font-bold text-slate-300 line-clamp-1">
                      {p.title}
                    </div>
                    {p.price > 0 && (
                      <div className="text-[11px] font-black text-[#FF5B4D]">
                        {p.price.toLocaleString('mk-MK')} ден.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Category Filter Controls */}
        <div className="gsap-parts-controls space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              id="parts-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.parts.searchPlaceholder}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#121316] border border-white/10 focus:border-red-500/50 text-sm text-white placeholder-slate-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ ИСЧИСТИ
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#E22E1A] text-white border border-red-500/40'
                    : 'bg-[#121316] text-slate-300 hover:bg-[#1C1E26] hover:text-white border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Parts Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParts.map((part) => (
            <div
              key={part.id}
              id={`part-card-${part.id}`}
              className="gsap-part-card rounded-2xl bg-[#121316] border border-white/10 hover:border-red-500/40 p-5 flex flex-col justify-between space-y-4 group transition-all duration-200"
            >
              <div className="space-y-3">
                
                {/* Part Header & Availability */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#181A20] text-slate-300 border border-white/10">
                    {part.partNumber}
                  </span>
                  <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>На Залиха ({part.stockCount} бр.)</span>
                  </span>
                </div>

                {/* Part Name & Manufacturer */}
                <div>
                  <div className="text-[11px] font-bold text-[#FF5B4D] uppercase tracking-wider">
                    {part.manufacturer}
                  </div>
                  <h3 className="text-base font-display font-black text-white group-hover:text-[#FF5B4D] transition-colors mt-0.5">
                    {part.name}
                  </h3>
                </div>

                {/* Compatibility Tags */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    Компатибилни Модели:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {part.compatibility.slice(0, 3).map((comp, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#181A20] text-slate-300 border border-white/5"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Tech Spec Highlights */}
                <div className="p-2.5 rounded-xl bg-[#181A20] border border-white/5 text-[11px] space-y-1">
                  {Object.entries(part.technicalSpecs).slice(0, 2).map(([key, val], i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-slate-400">{key}:</span>
                      <span className="text-slate-200 font-bold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-400">Цена во Салон</div>
                  <div className="text-lg font-black text-white">{part.priceMkdFormatted}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedPartModal(part)}
                    className="p-2 rounded-xl bg-[#181A20] hover:bg-[#22252C] border border-white/10 text-slate-300 transition-colors cursor-pointer"
                    title="Погледни Детали"
                  >
                    <Info className="w-4 h-4 text-[#FF5B4D]" />
                  </button>
                  <button
                    onClick={() => onRequestPartQuote(part)}
                    className="px-4 py-2 rounded-xl bg-[#E22E1A] hover:bg-[#C82412] text-white font-bold text-xs transition-colors cursor-pointer flex items-center space-x-1 border border-red-500/30"
                  >
                    <span>Нарачај</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom VIN Lookup Banner */}
        <div className="p-6 rounded-3xl bg-[#121316] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-xs font-bold text-[#FF5B4D] uppercase flex items-center space-x-1.5">
              <FileCheck className="w-4 h-4" />
              <span>ДИРЕКТЕН УВОЗ НА ДЕЛОВИ ПО БАРАЊЕ</span>
            </div>
            <h4 className="text-lg font-display font-black text-white">
              Не го наоѓате вашиот специфичен број на дел?
            </h4>
            <p className="text-xs text-slate-400 max-w-xl">
              Нашиот централен магацин во Штип и Скопје има директен пристап до над 15.000 фабрички делови за Zontes, SYM, Kove, QJMotor, HMC и Hamachi.
            </p>
          </div>
          <button
            onClick={() => onRequestPartQuote(OEM_PARTS[0])}
            className="px-6 py-3 rounded-xl bg-[#181A20] hover:bg-[#22252C] border border-white/10 text-white font-bold text-xs whitespace-nowrap transition-colors cursor-pointer flex items-center space-x-2"
          >
            <span>Побарај Дел по Број на Шасија (VIN)</span>
          </button>
        </div>

      </div>

      {/* Detailed Part Specifications Modal */}
      {selectedPartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#121316] border border-white/15 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-100 relative">
            <button
              onClick={() => setSelectedPartModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#181A20] hover:bg-[#22252C] border border-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#E22E1A] text-white uppercase">
                {selectedPartModal.category}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                OEM Code: {selectedPartModal.partNumber}
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-[#FF5B4D] uppercase">
                {selectedPartModal.manufacturer}
              </div>
              <h3 className="text-2xl font-display font-black text-white mt-0.5">
                {selectedPartModal.name}
              </h3>
            </div>

            {/* Technical Specifications Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Фабрички Технички Профил:
              </h4>
              <div className="p-4 rounded-2xl bg-[#181A20] border border-white/10 space-y-2 text-xs">
                {Object.entries(selectedPartModal.technicalSpecs).map(([key, val], idx) => (
                  <div key={idx} className="flex justify-between border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-slate-400">{key}:</span>
                    <span className="text-white font-bold text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compatibility Full List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Компатибилност:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedPartModal.compatibility.map((c, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-[#181A20] text-slate-300 border border-white/10 font-medium">
                    ✓ {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-2xl font-black text-white">
                {selectedPartModal.price}
              </div>
              <button
                onClick={() => {
                  const part = selectedPartModal;
                  setSelectedPartModal(null);
                  onRequestPartQuote(part);
                }}
                className="px-6 py-3 rounded-xl bg-[#E22E1A] hover:bg-[#C82412] text-white font-bold text-xs transition-colors cursor-pointer border border-red-500/30"
              >
                Побарај Достапност & Нарачај
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
