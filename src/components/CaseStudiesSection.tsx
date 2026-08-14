import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CASE_STUDIES, TESTIMONIALS } from '../data/fleet';
import { Language } from '../types';
import { translations } from '../data/translations';
import { 
  Briefcase, 
  TrendingUp, 
  Star, 
  Quote, 
  ChevronRight
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CaseStudiesSectionProps {
  currentLang: Language;
  onOpenB2B: () => void;
}

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({
  currentLang,
  onOpenB2B
}) => {
  const t = translations[currentLang];
  const sectionRef = useRef<HTMLElement | null>(null);

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

      tl.from('.gsap-case-header', {
        opacity: 0,
        y: 20,
        duration: 0.65,
        ease: 'power3.out'
      })
      .from('.gsap-case-card', {
        opacity: 0,
        y: 26,
        scale: 0.96,
        stagger: 0.08,
        duration: 0.65,
        ease: 'power3.out'
      }, '-=0.35')
      .from('.gsap-testimonial-card', {
        opacity: 0,
        y: 20,
        stagger: 0.06,
        duration: 0.55,
        ease: 'power2.out'
      }, '-=0.25');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="case-studies" 
      className="py-16 lg:py-24 bg-transparent border-b border-white/10 relative text-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="gsap-case-header text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-red-950/40 border border-red-500/30 text-[#FF5B4D] text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{t.caseStudies.eyebrow}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
            {t.caseStudies.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {t.caseStudies.subtitle}
          </p>
        </div>

        {/* Featured Case Studies */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              className="gsap-case-card rounded-3xl bg-[#121316] border border-white/10 hover:border-white/20 p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-200 group"
            >
              <div className="space-y-4">
                
                {/* Client Logo Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-3 py-1 rounded-lg bg-[#181A20] text-[#FF5B4D] border border-white/10">
                    {study.logoText}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400">
                    ✓ ВЕРИФИКУВАН ПАРТНЕР
                  </span>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">
                    {study.industry}
                  </div>
                  <h3 className="text-xl font-display font-black text-white group-hover:text-[#FF5B4D] transition-colors mt-1">
                    {study.client}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {study.projectScope}
                </p>

                {/* Quantitative Impact Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  <div className="p-3 rounded-2xl bg-[#181A20] border border-white/10">
                    <div className="text-slate-400 text-[10px] font-bold">ВОЗЕН ПАРК:</div>
                    <div className="text-white font-black">{study.unitsDeployed} Единици</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#181A20] border border-white/10">
                    <div className="text-slate-400 text-[10px] font-bold">ДОСТАПНОСТ:</div>
                    <div className="text-emerald-400 font-black">{study.uptimeAchieved}</div>
                  </div>
                </div>

                {/* Direct Quote */}
                <div className="p-4 rounded-2xl bg-[#181A20] border border-white/10 space-y-2 relative">
                  <Quote className="w-5 h-5 text-white/10 absolute top-2 right-2" />
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    „{study.quote}“
                  </p>
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-xs font-bold text-white">{study.author}</div>
                    <div className="text-[10px] font-semibold text-[#FF5B4D]">{study.authorRole}</div>
                  </div>
                </div>

              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Постигната заштеда: <strong className="text-emerald-400">{study.maintenanceCostSaved}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Testimonials Grid */}
        <div className="pt-6 space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-xl font-display font-black text-white">
              Што велат нашите купувачи
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((test) => (
              <div
                key={test.id}
                className="gsap-testimonial-card p-6 rounded-3xl bg-[#121316] border border-white/10 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-1 text-[#FF5B4D]">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FF5B4D]" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    „{test.comment}“
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <div className="text-xs font-bold text-white">{test.author}</div>
                  <div className="text-[11px] text-slate-400">{test.role} • <span className="text-[#FF5B4D] font-semibold">{test.organization}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Strip */}
        <div className="gsap-case-cta p-8 rounded-3xl bg-[#121316] border border-red-500/30 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h4 className="text-xl font-display font-black text-white">
              Сакате понуда за флота или нов моторцикл?
            </h4>
            <p className="text-xs text-slate-400 max-w-xl">
              Посетете некој од нашите 6 салони во Скопје, Штип, Битола, Струмица, Тетово или Охрид или закажете онлајн консултација.
            </p>
          </div>
          <button
            onClick={onOpenB2B}
            className="px-8 py-3.5 rounded-xl bg-[#E22E1A] hover:bg-[#C82412] text-white font-bold text-xs whitespace-nowrap transition-colors cursor-pointer border border-red-500/30"
          >
            Побарајте Понуда
          </button>
        </div>

      </div>
    </section>
  );
};
