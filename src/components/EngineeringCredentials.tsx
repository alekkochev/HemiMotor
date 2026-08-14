import React from 'react';
import { COMPARISON_POINTS } from '../data/fleet';
import { Language } from '../types';
import { translations } from '../data/translations';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Award, 
  Wrench,
  Sparkles
} from 'lucide-react';

interface EngineeringCredentialsProps {
  currentLang: Language;
  onBookTour: () => void;
}

export const EngineeringCredentials: React.FC<EngineeringCredentialsProps> = ({
  currentLang,
  onBookTour
}) => {
  const t = translations[currentLang];

  const leadEngineers = [
    {
      name: 'Сервисен Центар Скопје',
      role: 'Бул. Србија бр. 32 (Аеродром)',
      credentials: 'Овластена компјутерска дијагностика за Zontes & SYM',
      specialty: 'Редовни сервиси, замена на ремени, сопирачки и дијагностика'
    },
    {
      name: 'Централен Сервис Штип',
      role: 'Ул. Струмичка бр. 45',
      credentials: 'Централен магацин на делови и генерален ремонт',
      specialty: 'Комплетна механичка поддршка, дино тестирање и гарантен сервис'
    },
    {
      name: 'Сервисна Мрежа Битола & Охрид',
      role: 'Регионални овластени сервисери',
      credentials: 'Брза реакција за приватни клиенти и доставни флоти',
      specialty: 'Експресен сервис во ист ден и достава на потрошни материјали'
    }
  ];

  return (
    <section id="credentials" className="py-16 lg:py-24 bg-[#0A0A0B] border-b border-white/10 relative text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-red-950/40 border border-red-500/30 text-[#FF5B4D] text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>{t.comparison.eyebrow}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
            {t.comparison.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Зошто купувањето и сервисирањето кај овластен дилер како HEMIMOTOR ви дава 100% сигурност.
          </p>
        </div>

        {/* The Engineering Comparison Table Matrix */}
        <div className="rounded-3xl bg-[#121316] border border-white/10 overflow-hidden">
          <div className="grid grid-cols-12 bg-[#181A20] border-b border-white/10 p-4 sm:p-5 text-xs font-bold tracking-wider">
            <div className="col-span-4 sm:col-span-3 text-slate-400 uppercase">
              Критериум
            </div>
            <div className="col-span-4 sm:col-span-4 text-slate-400 uppercase">
              {t.comparison.standardShop}
            </div>
            <div className="col-span-4 sm:col-span-5 text-[#FF5B4D] uppercase flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FF5B4D]" />
              <span>{t.comparison.hemiMotorStandard}</span>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {COMPARISON_POINTS.map((point, index) => (
              <div
                key={index}
                className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-white/[0.02] transition-colors text-xs"
              >
                <div className="col-span-4 sm:col-span-3 font-bold text-white pr-2">
                  {point.feature}
                </div>

                <div className="col-span-4 sm:col-span-4 text-slate-400 flex items-start space-x-2 pr-2">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{point.standard}</span>
                </div>

                <div className="col-span-4 sm:col-span-5 text-white flex items-start space-x-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-200 font-semibold">{point.hemimotor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Centers */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <div className="text-xs font-bold text-[#FF5B4D] uppercase tracking-wider">
              Овластени Локации
            </div>
            <h3 className="text-2xl font-display font-black text-white">
              Сервисни Локации низ Македонија
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadEngineers.map((eng, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#121316] border border-white/10 hover:border-white/20 transition-all duration-200 space-y-4"
              >
                <div className="w-10 h-10 rounded-xl bg-red-950/50 border border-red-500/30 flex items-center justify-center text-[#FF5B4D] font-black text-sm">
                  0{idx + 1}
                </div>

                <div>
                  <h4 className="text-lg font-display font-black text-white">
                    {eng.name}
                  </h4>
                  <div className="text-xs font-semibold text-[#FF5B4D] mt-0.5">
                    {eng.role}
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1.5 pt-3 border-t border-white/10">
                  <div className="font-semibold text-emerald-400 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{eng.credentials}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {eng.specialty}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
