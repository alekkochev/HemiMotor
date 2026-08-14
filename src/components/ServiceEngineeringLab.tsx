import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ServicePackage, Language } from '../types';
import { SERVICE_PACKAGES } from '../data/services';
import { translations } from '../data/translations';
import { 
  Wrench, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  Calculator, 
  Clock, 
  ChevronRight,
  Phone,
  Sparkles
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceEngineeringLabProps {
  currentLang: Language;
  onBookServicePackage: (pkg: ServicePackage) => void;
}

export const ServiceEngineeringLab: React.FC<ServiceEngineeringLabProps> = ({
  currentLang,
  onBookServicePackage
}) => {
  const t = translations[currentLang];
  const sectionRef = useRef<HTMLElement | null>(null);
  const detailCardRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);

  const [activeTab, setActiveTab] = useState<string>(SERVICE_PACKAGES[0].id);

  // Interactive Service Cost Calculator State
  const [selectedDisplacement, setSelectedDisplacement] = useState<'50-125cc' | '250-400cc' | '500-800cc'>('50-125cc');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['oil-motul', 'diagnostics']);

  const activePackage = SERVICE_PACKAGES.find((p) => p.id === activeTab) || SERVICE_PACKAGES[0];

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

      tl.from('.gsap-service-header', {
        opacity: 0,
        y: 20,
        duration: 0.65,
        ease: 'power3.out'
      })
      .from('.gsap-service-tab', {
        opacity: 0,
        x: -16,
        stagger: 0.05,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.35')
      .from('.gsap-service-card', {
        opacity: 0,
        y: 24,
        scale: 0.98,
        duration: 0.65,
        ease: 'power3.out'
      }, '-=0.3')
      .from('.gsap-service-calc', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.25');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // GSAP Tab Change Animation
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (detailCardRef.current) {
      gsap.fromTo(
        detailCardRef.current,
        { opacity: 0.35, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  // Dynamic cost calculation in MKD
  const calculateTotalMkd = () => {
    let base = selectedDisplacement === '50-125cc' ? 1800 : selectedDisplacement === '250-400cc' ? 3200 : 4900;
    if (selectedAddons.includes('oil-motul')) base += 1200;
    if (selectedAddons.includes('diagnostics')) base += 900;
    if (selectedAddons.includes('tires-balance')) base += 1400;
    if (selectedAddons.includes('cvt-belt')) base += 2100;
    return base;
  };

  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter((id) => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="service-lab" 
      className="py-16 lg:py-24 bg-transparent border-b border-white/10 relative text-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="gsap-service-header text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-red-950/40 border border-red-500/30 text-[#FF5B4D] text-xs font-bold uppercase tracking-wider">
            <Wrench className="w-3.5 h-3.5" />
            <span>{t.service.eyebrow}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
            {t.service.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {t.service.subtitle}
          </p>
        </div>

        {/* Feature Spotlight: Service Selector & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive Service Selector Tabs */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              {SERVICE_PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  id={`service-tab-${pkg.id}`}
                  onClick={() => setActiveTab(pkg.id)}
                  className={`gsap-service-tab w-full text-left p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between ${
                    activeTab === pkg.id
                      ? 'bg-[#181A20] border-red-500/40 text-white'
                      : 'bg-[#121316] border-white/10 hover:bg-[#1C1E26] text-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${activeTab === pkg.id ? 'bg-[#FF5B4D]' : 'bg-slate-600'}`}></span>
                      <span className={`text-sm font-bold ${activeTab === pkg.id ? 'text-white font-black' : 'text-slate-300'}`}>
                        {pkg.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-4 font-medium">
                      Стандард: {pkg.isoStandard}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${activeTab === pkg.id ? 'text-[#FF5B4D]' : 'text-slate-500'}`} />
                </button>
              ))}
            </div>

            {/* ISO Guarantee Callout */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ГАРАНЦИЈА НА СЕКОЈ ВГРАДЕН ДЕЛ</span>
              </div>
              <p className="text-xs text-emerald-400/90">
                Секое возило сервисирано во Hamachi центрите добива електронски запис во сервисна книшка и оригинални фабрички делови.
              </p>
            </div>
          </div>

          {/* Right Column: Active Service Deep Dive Card */}
          <div ref={detailCardRef} className="gsap-service-card lg:col-span-7 rounded-3xl bg-[#121316] border border-white/10 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            
            <div className="space-y-6 relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-950/50 border border-red-500/30 text-[#FF5B4D] uppercase tracking-wider">
                    {activePackage.category}
                  </span>
                  <h3 className="text-2xl font-display font-black text-white mt-1">
                    {activePackage.name}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-semibold">Ориентациона Цена</div>
                  <div className="text-xl font-black text-[#FF5B4D]">
                    {activePackage.priceEstimateMkd}
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {activePackage.description}
              </p>

              {/* Verified Benefits */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Што вклучува овој протокол:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activePackage.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hardware & Standard Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-[#181A20] border border-white/10">
                  <div className="text-slate-400 text-[10px] font-bold">ОПРЕМА & АЛАТИ:</div>
                  <div className="text-slate-200 font-bold mt-0.5">{activePackage.equipmentUsed}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#181A20] border border-white/10">
                  <div className="text-slate-400 text-[10px] font-bold">ВРЕМЕТРАЕЊЕ:</div>
                  <div className="text-[#FF5B4D] font-bold mt-0.5">
                    {activePackage.duration} • {activePackage.warrantyMonths} Месеци Сервисна Гаранција
                  </div>
                </div>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
              <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#FF5B4D]" />
                <span>Сервисни термини достапни секој работен ден</span>
              </div>
              <button
                id="btn-book-active-package"
                onClick={() => onBookServicePackage(activePackage)}
                className="px-6 py-3 rounded-xl bg-[#E22E1A] hover:bg-[#C82412] text-white font-bold text-xs border border-red-500/30 transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>{t.service.btnSchedule}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Interactive Service Cost Estimator */}
        <div className="gsap-service-calc p-6 sm:p-8 rounded-3xl bg-[#121316] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-[#181A20] border border-white/10 text-[#FF5B4D]">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-white">
                  Интерактивен Калкулатор за Сервис
                </h3>
                <p className="text-xs text-slate-400">
                  Транспарентна пресметка за редовно одржување и замена на потрошни материјали.
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400 font-semibold">Проценета Вкупна Цена:</div>
              <div className="text-2xl sm:text-3xl font-black text-[#FF5B4D]">
                {calculateTotalMkd().toLocaleString()} ден.
                <span className="text-xs font-semibold text-slate-400 ml-1">({Math.round(calculateTotalMkd() / 61.5)} €)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1: Motorcycle Category Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase">
                1. Изберете Кубикажа на Возилото:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '50-125cc', label: '50cc - 125cc', sub: 'Скутери / Мопеди' },
                  { id: '250-400cc', label: '200cc - 400cc', sub: 'Макси / Ендуро' },
                  { id: '500-800cc', label: '500cc - 800cc', sub: 'Adventure / Рели' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedDisplacement(type.id as any)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedDisplacement === type.id
                        ? 'bg-[#181A20] border-red-500/40 text-white font-bold'
                        : 'bg-[#181A20]/50 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-[#181A20]'
                    }`}
                  >
                    <div className="text-xs font-bold">{type.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{type.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Service Addons */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase">
                2. Изберете Сервисни Работи:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'oil-motul', label: 'Масло Motul + ОЕМ Филтер (+1.200 ден.)' },
                  { id: 'diagnostics', label: 'Компјутерска Дијагностика (+900 ден.)' },
                  { id: 'tires-balance', label: 'Монтажа на Гума & Баланс (+1.400 ден.)' },
                  { id: 'cvt-belt', label: 'Замена на CVT Ремен / Ролни (+2.100 ден.)' }
                ].map((addon) => (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      selectedAddons.includes(addon.id)
                        ? 'bg-[#181A20] border-red-500/40 text-[#FF5B4D] font-bold'
                        : 'bg-[#181A20]/50 border-white/5 text-slate-300 hover:bg-[#181A20]'
                    }`}
                  >
                    <span className="text-[11px]">{addon.label}</span>
                    <span className="text-xs font-bold">{selectedAddons.includes(addon.id) ? '✓' : '+'}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-between border-t border-white/10 gap-3">
            <div className="text-xs text-slate-400">
              * Вклучен оригинален материјал, ДДВ и сервисен запис во Hamachi базата.
            </div>
            <button
              onClick={() => onBookServicePackage(activePackage)}
              className="px-6 py-3 rounded-xl bg-[#E22E1A] hover:bg-[#C82412] text-white font-bold text-xs transition-colors cursor-pointer border border-red-500/30"
            >
              Закажи со Оваа Пресметка ({calculateTotalMkd().toLocaleString()} ден.)
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
