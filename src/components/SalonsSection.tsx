import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Clock, ShieldCheck, ChevronRight, Wrench, Sparkles, Navigation } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Language } from '../types';
import { translations } from '../data/translations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SalonsSectionProps {
  currentLang: Language;
  onSelectSalonForVisit?: (salonName: string) => void;
}

export const SalonsSection: React.FC<SalonsSectionProps> = ({
  currentLang,
  onSelectSalonForVisit
}) => {
  const t = translations[currentLang];
  const [activeCity, setActiveCity] = useState<string>('skopje');
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);

  const salons = [
    {
      id: 'skopje',
      city: 'Скопје',
      name: 'HEMIMOTOR — Продажба & Сервис Скопје',
      address: '518 1/13, Керамидница, Скопје (едносмерната улица)',
      phone: '070 222 446 / 02 3 135 058',
      email: 'info@hemimotor.com.mk',
      hours: 'Пон - Петок: 09:00 - 17:00 | Сабота: 09:00 - 13:00',
      badge: 'ОВЛАСТЕН ДИЛЕР НА HAMACHI · СКОПЈЕ',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      modelsOnDisplay: 'Скутери и моторцикли од 50cc до 800cc — Hamachi, Zontes, SYM, Kove, QJMotor'
    }
  ];

  const currentSalon = salons.find(s => s.id === activeCity) || salons[0];

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

      tl.from('.gsap-salons-header', {
        opacity: 0,
        y: 20,
        duration: 0.65,
        ease: 'power3.out'
      })
      .from('.gsap-salons-btn', {
        opacity: 0,
        y: 12,
        scale: 0.95,
        stagger: 0.04,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.35')
      .from('.gsap-salons-card', {
        opacity: 0,
        y: 24,
        scale: 0.98,
        duration: 0.65,
        ease: 'power3.out'
      }, '-=0.3');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // GSAP Animation when activeCity changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0.4, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );
    }
  }, [activeCity]);

  return (
    <section 
      ref={sectionRef}
      id="salons" 
      className="py-16 bg-[#0A0A0B] border-b border-white/10 text-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="gsap-salons-header text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-red-950/40 border border-red-500/30 text-[#FF5B4D] text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t.salons.eyebrow}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
            {t.salons.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            {t.salons.subtitle}
          </p>
        </div>

        {/* City Selector — само Скопје (Hemi Motor е дилер на Hamachi во Скопје) */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {salons.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveCity(s.id)}
              className={`gsap-salons-btn px-5 py-3 rounded-xl font-black text-xs sm:text-sm transition-all duration-150 flex items-center space-x-2 cursor-pointer ${
                activeCity === s.id
                  ? 'bg-[#E22E1A] text-white border border-red-500/40 shadow-md shadow-red-500/20'
                  : 'bg-[#121316] hover:bg-[#1C1E26] text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <MapPin className="w-4 h-4 text-[#FF5B4D]" />
              <span>{s.city}</span>
            </button>
          ))}
        </div>

        {/* Active Salon Detailed Feature Card */}
        <div ref={cardRef} className="gsap-salons-card bg-[#121316] rounded-3xl border border-white/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Info Panel */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-between">
            <div>
              <div className="inline-block px-3 py-1 rounded-md bg-red-950/50 text-[#FF5B4D] border border-red-500/30 text-xs font-bold uppercase tracking-wider mb-3">
                {currentSalon.badge}
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white leading-tight">
                {currentSalon.name}
              </h3>

              {/* Info Items */}
              <div className="space-y-4 mt-6 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-[#181A20] text-slate-300 border border-white/10 mt-0.5">
                    <MapPin className="w-5 h-5 text-[#FF5B4D]" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Адреса:</div>
                    <div className="text-slate-400">{currentSalon.address}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-[#181A20] text-slate-300 border border-white/10 mt-0.5">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Телефонски Линии:</div>
                    <div className="text-emerald-400 font-bold">{currentSalon.phone}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-[#181A20] text-slate-300 border border-white/10 mt-0.5">
                    <Clock className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Работно Време:</div>
                    <div className="text-slate-400">{currentSalon.hours}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#181A20] border border-white/10">
                  <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Возила изложени во салонот:
                  </div>
                  <div className="text-xs text-slate-400">
                    {currentSalon.modelsOnDisplay}
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
              <a
                href={`tel:${currentSalon.phone.split('/')[0].trim().replace(/\s/g, '')}`}
                className="px-6 py-3 rounded-xl bg-[#181A20] hover:bg-[#22252C] border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#FF5B4D]" />
                <span>Повикај го Салонот</span>
              </a>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(currentSalon.name + ' ' + currentSalon.city + ' Macedonia')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-[#E22E1A] hover:bg-[#C82412] text-white font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition-all border border-red-500/30"
              >
                <Navigation className="w-4 h-4" />
                <span>Отвори Google Навигација</span>
              </a>
            </div>
          </div>

          {/* Right Image Display */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-slate-950">
            <img
              src={currentSalon.image}
              alt={currentSalon.name}
              className="w-full h-full object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121316] via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#121316]/95 backdrop-blur-md border border-white/15 text-xs text-white">
              <span className="font-black text-white block">{currentSalon.city} Мото Центар</span>
              <span className="text-slate-400 text-[11px]">Овластена продажба, резервни делови и брз сервис</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
