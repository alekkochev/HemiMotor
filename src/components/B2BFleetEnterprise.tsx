import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FleetTier, Language } from '../types';
import { FLEET_TIERS } from '../data/fleet';
import { translations } from '../data/translations';
import { 
  Building2, 
  ShieldCheck, 
  TrendingDown, 
  Activity, 
  CheckCircle2, 
  Sliders, 
  ChevronRight, 
  Truck,
  Users,
  Percent
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface B2BFleetEnterpriseProps {
  currentLang: Language;
  onOpenB2BConfigurator: () => void;
}

export const B2BFleetEnterprise: React.FC<B2BFleetEnterpriseProps> = ({
  currentLang,
  onOpenB2BConfigurator
}) => {
  const t = translations[currentLang];
  const sectionRef = useRef<HTMLElement | null>(null);

  const [fleetSize, setFleetSize] = useState<number>(12);
  const [fuelType, setFuelType] = useState<'euro5' | 'electric'>('euro5');

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

      tl.from('.gsap-b2b-header', {
        opacity: 0,
        y: 20,
        duration: 0.65,
        ease: 'power3.out'
      })
      .from('.gsap-b2b-calc', {
        opacity: 0,
        y: 24,
        scale: 0.98,
        duration: 0.65,
        ease: 'power3.out'
      }, '-=0.35')
      .from('.gsap-fleet-tier', {
        opacity: 0,
        y: 24,
        scale: 0.97,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.25');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ROI / TCO Calculation Simulation
  const monthlyCostPerMoto = fuelType === 'euro5' ? 95 : 65;
  const standardLocalCost = 150;
  const monthlySavings = (standardLocalCost - monthlyCostPerMoto) * fleetSize;
  const annualSavings = monthlySavings * 12;
  const uptimeGuarantee = fleetSize > 10 ? '99.8%' : '99.5%';
  const slaResponse = fleetSize > 15 ? '2 Часа + Заменско Возило' : '4 Часа';

  return (
    <section 
      ref={sectionRef}
      id="b2b-fleet" 
      className="py-16 lg:py-24 bg-[#0A0A0B] border-b border-white/10 relative text-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="gsap-b2b-header text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-red-950/40 border border-red-500/30 text-[#FF5B4D] text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t.b2b.eyebrow}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
            {t.b2b.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {t.b2b.subtitle}
          </p>
        </div>

        {/* Interactive Fleet TCO & ROI Cost Optimizer Card */}
        <div className="gsap-b2b-calc rounded-3xl bg-[#121316] border border-white/10 p-6 sm:p-10 space-y-8">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#FF5B4D] uppercase">
                <Sliders className="w-4 h-4" />
                <span>{t.b2b.calcTitle}</span>
              </div>
              <h3 className="text-2xl font-display font-black text-white">
                Калкулатор за Трошоци на Доставна & Бизнис Флота
              </h3>
            </div>

            <div className="flex items-center space-x-2 bg-[#181A20] p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => setFuelType('euro5')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  fuelType === 'euro5'
                    ? 'bg-[#E22E1A] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Бензин Euro 5 (Скутери 50-125cc)
              </button>
              <button
                onClick={() => setFuelType('electric')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  fuelType === 'electric'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Електрични Возила (Zero Emission)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Controls */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Slider Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-bold uppercase">{t.b2b.fleetSize}</span>
                  <span className="text-2xl font-black text-[#FF5B4D]">{fleetSize} Возила</span>
                </div>

                <input
                  type="range"
                  min="3"
                  max="50"
                  step="1"
                  value={fleetSize}
                  onChange={(e) => setFleetSize(parseInt(e.target.value))}
                  className="w-full h-2.5 bg-[#181A20] rounded-lg appearance-none cursor-pointer accent-[#E22E1A]"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>3 Скутера (Мал бизнис)</span>
                  <span>15 Скутера (Доставна служба)</span>
                  <span>40+ Скутера (Голема мрежа)</span>
                </div>
              </div>

              {/* Verified Value Points */}
              <div className="space-y-2 pt-2 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Вклучен редовен сервис, оригинални потрошни материјали и замена на гуми.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Обезбедено заменско возило во рок од неколку часа без прекин на испораките.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Флексибилни услови за плаќање на фактура и ДДВ поврат.</span>
                </div>
              </div>
            </div>

            {/* Right Projected Output Metrics */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-2xl bg-[#181A20] border border-white/10 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase">
                  {t.b2b.calcMonthlySavings}
                </div>
                <div className="text-3xl font-black text-emerald-400">
                  € {monthlySavings.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">
                  (€ {annualSavings.toLocaleString()} годишна заштеда на одржување)
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#181A20] border border-white/10 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase">
                  {t.b2b.calcUptime}
                </div>
                <div className="text-3xl font-black text-[#FF5B4D]">
                  {uptimeGuarantee}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">
                  Гаранција за достапност на возниот парк
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#181A20] border border-white/10 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase">
                  {t.b2b.calcSla}
                </div>
                <div className="text-lg font-black text-white">
                  {slaResponse}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">
                  Сервисна поддршка во сите поголеми градови
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#181A20] border border-white/10 flex flex-col justify-between">
                <div className="text-[11px] font-bold text-slate-400 uppercase">
                  Сметководствен Третман
                </div>
                <div className="text-xs text-slate-300 font-semibold">
                  100% Признат деловен трошок со фактура за фирми
                </div>
              </div>

            </div>

          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between border-t border-white/10 gap-4">
            <div className="text-xs text-slate-400">
              * HEMIMOTOR е овластен дилер на Hamachi — водечки снабдувач на возила за достава во Македонија.
            </div>
            <button
              onClick={onOpenB2BConfigurator}
              className="px-6 py-3.5 rounded-xl bg-[#E22E1A] hover:bg-[#C82412] text-white font-bold text-xs border border-red-500/30 transition-all cursor-pointer flex items-center space-x-2"
            >
              <span>{t.b2b.btnGetProposal}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Dedicated Corporate Tiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {FLEET_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`gsap-fleet-tier rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 border transition-all duration-200 ${
                tier.id === 'enterprise-fleet'
                  ? 'bg-[#181A20] border-red-500/40'
                  : 'bg-[#121316] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="space-y-4">
                {tier.id === 'enterprise-fleet' && (
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-[#E22E1A] text-white uppercase tracking-wide border border-red-500/30">
                    ★ Најпопуларен Пакет за Достава
                  </span>
                )}

                <div>
                  <div className="text-xs font-bold text-[#FF5B4D] uppercase">
                    {tier.recommendedFleetSize}
                  </div>
                  <h3 className="text-2xl font-display font-black text-white mt-1">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {tier.subtitle}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#181A20] border border-white/10">
                  <div className="text-[10px] font-bold text-slate-400">МЕСЕЧНО ОДРЖУВАЊЕ:</div>
                  <div className="text-xl font-black text-white">
                    {tier.baseMonthlyRatePerUnit}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Вклучено во Пакетот:
                  </div>
                  <ul className="space-y-2">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start text-xs text-slate-300 space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="text-[11px] text-slate-400 font-medium">
                  <span className="font-bold text-white">SLA:</span> {tier.slaResponseTime}
                </div>
                <button
                  onClick={onOpenB2BConfigurator}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center space-x-2 ${
                    tier.id === 'enterprise-fleet'
                      ? 'bg-[#E22E1A] hover:bg-[#C82412] text-white border border-red-500/30'
                      : 'bg-[#181A20] hover:bg-[#22252C] border border-white/10 text-white'
                  }`}
                >
                  <span>Побарај Корпоративна Понуда</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
