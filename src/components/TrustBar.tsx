import React from 'react';
import { ShieldCheck, Award, CheckCircle2, Cpu, Wrench, FileCheck, Layers, CreditCard, Truck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface TrustBarProps {
  currentLang: Language;
}

export const TrustBar: React.FC<TrustBarProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  const credentials = [
    {
      badge: 'ГАРАНЦИЈА',
      title: '2 Години Фабричка Гаранција',
      description: 'Официјална сервисна покриеност на сите нови скутери и мотори',
      icon: ShieldCheck
    },
    {
      badge: 'РАТИ',
      title: 'Кредитирање до 48 Рати',
      description: 'Брзо одобрување со лична карта преку Iute, Silk Road и банки',
      icon: CreditCard
    },
    {
      badge: 'СЕРВИС',
      title: 'Овластена Сервисна Мрежа',
      description: 'Специјализирани сервисни центри во 6 градови во Македонија',
      icon: Wrench
    },
    {
      badge: 'ДОСТАВА',
      title: 'Достава до Врата',
      description: 'Брза и сигурна испорака на возила и опрема низ цела земја',
      icon: Truck
    },
    {
      badge: 'ОРИГИНАЛ',
      title: '100% Оригинални Делови',
      description: 'Директен увоз на резервни делови за Zontes, SYM, Kove, Hamachi',
      icon: Layers
    },
    {
      badge: 'ЗАЛИХА',
      title: 'Веднаш Достапни Возила',
      description: 'Голем избор на модели на лагер подготвени за регистрација',
      icon: CheckCircle2
    }
  ];

  return (
    <section id="trust-bar" className="py-10 bg-[#0D0E12] border-b border-white/10 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#FF5B4D] uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Зошто да изберете HEMIMOTOR</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
            Лидер во Мото Индустријата во Македонија
          </h2>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {credentials.map((cred, idx) => {
            const Icon = cred.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#121316] border border-white/10 hover:border-red-500/40 transition-all duration-200 group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-500/10 text-[#FF5B4D] border border-red-500/30">
                    {cred.badge}
                  </span>
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-[#FF5B4D] transition-colors" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-[#FF5B4D] transition-colors">
                    {cred.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-snug mt-1">
                    {cred.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
