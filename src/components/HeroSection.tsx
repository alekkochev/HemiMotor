import React, { useState, useEffect, useRef } from 'react';
import { Shield, Wrench, ChevronRight, Gauge, Flame, Volume2, VolumeX, ArrowUpRight, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Language } from '../types';
import { translations } from '../data/translations';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroSectionProps {
  currentLang: Language;
  onExploreShowroom: (ccFilter?: string) => void;
  onOpenShop: () => void;
  onBookService: () => void;
  onOpenB2B: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  onExploreShowroom,
  onOpenShop,
  onBookService,
  onOpenB2B
}) => {
  const t = translations[currentLang];
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Engine Audio Synthesizer State & RPM Gauge
  const [rpm, setRpm] = useState<number>(1400); // Idle RPM
  const [isRevving, setIsRevving] = useState<boolean>(false);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  // GSAP Subtle Scroll-Triggered Entrance Animation
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true
        }
      });

      tl.from('.gsap-hero-eyebrow', {
        opacity: 0,
        y: -14,
        duration: 0.6,
        ease: 'power3.out'
      })
      .from('.gsap-hero-title', {
        opacity: 0,
        y: 26,
        duration: 0.75,
        ease: 'power3.out'
      }, '-=0.4')
      .from('.gsap-hero-desc', {
        opacity: 0,
        y: 18,
        duration: 0.7,
        ease: 'power3.out'
      }, '-=0.5')
      .from('.gsap-hero-pills-wrap', {
        opacity: 0,
        y: 15,
        duration: 0.55,
        ease: 'power2.out'
      }, '-=0.45')
      .from('.gsap-hero-pill', {
        opacity: 0,
        scale: 0.94,
        y: 8,
        stagger: 0.04,
        duration: 0.45,
        ease: 'power2.out'
      }, '-=0.35')
      .from('.gsap-hero-btn', {
        opacity: 0,
        y: 16,
        stagger: 0.07,
        duration: 0.55,
        ease: 'power2.out'
      }, '-=0.35')
      .from('.gsap-hero-stat', {
        opacity: 0,
        y: 20,
        stagger: 0.07,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.35')
      .from('.gsap-hero-showcase', {
        opacity: 0,
        scale: 0.95,
        y: 24,
        duration: 0.9,
        ease: 'power3.out'
      }, '-=0.7')
      .from('.gsap-hero-brands-bar', {
        opacity: 0,
        y: 18,
        duration: 0.65,
        ease: 'power2.out'
      }, '-=0.4')
      .from('.gsap-hero-brand-item', {
        opacity: 0,
        y: 12,
        stagger: 0.05,
        duration: 0.45,
        ease: 'power2.out'
      }, '-=0.4');

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Initialize Web Audio
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Sawtooth with low-pass filter simulates 4-stroke engine firing pulses
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(48, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(360, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      audioCtxRef.current = ctx;
      oscRef.current = osc;
      gainRef.current = gain;
      filterRef.current = filter;
      setIsAudioActive(true);
    } else if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
      setIsAudioActive(true);
    }
  };

  const stopAudio = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
      setIsAudioActive(false);
      setIsRevving(false);
      setRpm(1400);
    }
  };

  // Rev Throttle Handler
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRevving) {
      interval = setInterval(() => {
        setRpm((prev) => {
          const next = Math.min(11500, prev + 550);
          if (oscRef.current && audioCtxRef.current && filterRef.current && gainRef.current) {
            const freq = 48 + (next / 11500) * 320;
            oscRef.current.frequency.setTargetAtTime(freq, audioCtxRef.current.currentTime, 0.05);
            filterRef.current.frequency.setTargetAtTime(360 + (next / 11500) * 2000, audioCtxRef.current.currentTime, 0.05);
            gainRef.current.gain.setTargetAtTime(0.08, audioCtxRef.current.currentTime, 0.05);
          }
          return next;
        });
      }, 50);
    } else {
      interval = setInterval(() => {
        setRpm((prev) => {
          if (prev <= 1500) return 1400;
          const next = Math.max(1400, prev - 750);
          if (oscRef.current && audioCtxRef.current && filterRef.current && gainRef.current) {
            const freq = 48 + (next / 11500) * 320;
            oscRef.current.frequency.setTargetAtTime(freq, audioCtxRef.current.currentTime, 0.08);
            filterRef.current.frequency.setTargetAtTime(360 + (next / 11500) * 2000, audioCtxRef.current.currentTime, 0.08);
            gainRef.current.gain.setTargetAtTime(0.04, audioCtxRef.current.currentTime, 0.08);
          }
          return next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isRevving]);

  const quickCcCategories = [
    { label: '50cc Скутери', cc: '50', price: 'од 67.035 ден.' },
    { label: '110-125cc Градски & Крос', cc: '125', price: 'од 64.575 ден.' },
    { label: '200-250cc Ендуро & Naked', cc: '250', price: 'од 83.025 ден.' },
    { label: '300-368cc Макси Скутери', cc: '350', price: 'од 307.500 ден.' },
    { label: '450-800cc Рели & Adventure', cc: '800', price: 'од 424.350 ден.' },
    { label: '⚡ 100% Електрични', cc: '0', price: 'од 92.250 ден.' }
  ];

  const brandLogos = [
    { name: 'ZONTES', role: 'Премиум Моторцикли & Макси Скутери' },
    { name: 'SYM', role: 'Тајвански Бр. 1 Скутери' },
    { name: 'KOVE', role: 'Дакар Рели & 800cc Adventure' },
    { name: 'QJMOTOR', role: 'Brembo & Marzocchi Твинови' },
    { name: 'HMC', role: 'Ендуро, Крос & Чопери' },
    { name: 'HAMACHI', role: '50cc Скутери & Електрични Мопеди' }
  ];

  return (
    <section 
      ref={containerRef}
      id="hero-section" 
      className="relative bg-transparent border-b border-white/10 overflow-hidden pt-8 pb-16 lg:py-20 text-slate-100"
    >
      {/* Subtle engineering background grid */}
      <div className="absolute inset-0 tech-grid-pattern-dark opacity-40 pointer-events-none"></div>

      {/* Subtle crimson glow */}
      <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-slate-700/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Official Importer Badge */}
            <div className="gsap-hero-eyebrow inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-950/40 border border-red-500/30">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4433] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF4433]"></span>
              </span>
              <span className="text-xs font-bold tracking-wide text-red-200">
                {t.hero.eyebrow}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="gsap-hero-title text-3xl sm:text-5xl xl:text-6xl font-display font-black tracking-tight text-white leading-[1.1]">
                <span className="text-white">{t.hero.titleStart}</span> <br />
                <span className="text-[#FF4433] underline decoration-red-500/40 decoration-wavy">
                  {t.hero.titleHighlight.split(/(cc)/i).map((part, i) =>
                    /^cc$/i.test(part) ? (
                      <span key={i} className="text-white no-underline">{part}</span>
                    ) : (
                      part
                    )
                  )}
                </span>
              </h1>
              <p className="gsap-hero-desc text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                {t.hero.description}
              </p>
            </div>

            {/* Quick Displacement Jump Pills (од најмала до најголема кубикажа) */}
            <div className="gsap-hero-pills-wrap pt-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4433]" />
                <span>Брз Избор по Кубикажа (од 50cc до 800cc):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickCcCategories.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onExploreShowroom(item.cc)}
                    className="gsap-hero-pill px-3 py-1.5 rounded-lg bg-[#14151A] hover:bg-[#1C1E26] border border-white/10 hover:border-red-500/40 text-xs font-bold text-slate-200 hover:text-[#FF4433] transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({item.price})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-btn-showroom"
                onClick={() => onExploreShowroom()}
                className="gsap-hero-btn px-6 py-3.5 rounded-xl bg-[#E22E1A] hover:bg-[#C82412] text-white font-bold text-sm border border-red-500/40 transition-all flex items-center space-x-2 group cursor-pointer"
              >
                <span>{t.hero.btnShowroom}</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-btn-shop"
                onClick={onOpenShop}
                className="gsap-hero-btn px-6 py-3.5 rounded-xl bg-[#181A20] hover:bg-[#22252C] border border-white/15 text-white font-bold text-sm transition-all flex items-center space-x-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-red-400" />
                <span>{t.hero.btnShop}</span>
              </button>

              <button
                id="hero-btn-b2b"
                onClick={onOpenB2B}
                className="gsap-hero-btn px-4 py-3.5 rounded-xl bg-[#121316] hover:bg-[#1A1C22] border border-white/10 text-slate-200 font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <span>{t.hero.btnFleetQuote}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#FF4433]" />
              </button>
            </div>

            {/* Verified Statistics Bar */}
            <div className="pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="gsap-hero-stat p-3 rounded-xl bg-[#121316] border border-white/10">
                <div className="text-2xl font-black text-white">
                  {t.hero.statYears}
                </div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase mt-0.5">
                  {t.hero.statYearsLabel}
                </div>
              </div>

              <div className="gsap-hero-stat p-3 rounded-xl bg-[#121316] border border-white/10">
                <div className="text-2xl font-black text-[#FF4433]">
                  {t.hero.statServiced}
                </div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase mt-0.5">
                  {t.hero.statServicedLabel}
                </div>
              </div>

              <div className="gsap-hero-stat p-3 rounded-xl bg-[#121316] border border-white/10">
                <div className="text-2xl font-black text-emerald-400">
                  {t.hero.statUptime}
                </div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase mt-0.5">
                  {t.hero.statUptimeLabel}
                </div>
              </div>

              <div className="gsap-hero-stat p-3 rounded-xl bg-[#121316] border border-white/10">
                <div className="text-2xl font-black text-slate-200">
                  {t.hero.statProjects}
                </div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase mt-0.5">
                  {t.hero.statProjectsLabel}
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Interactive Motorcycle Display & Sound Dyno */}
          <div className="lg:col-span-5 relative">
            <div className="gsap-hero-showcase relative rounded-2xl overflow-hidden bg-[#121316] border border-white/10 p-3 group">
              
              {/* Product Visual */}
              <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80"
                  alt="HAMACHI & KOVE Flagship"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 opacity-95"
                  referrerPolicy="no-referrer"
                />
                
                {/* Clean vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#16171C] via-black/25 to-transparent"></div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#121316]/90 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>HAMACHI МОТО ЦЕНТАР</span>
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#E22E1A] text-white text-[11px] font-black tracking-wider uppercase">
                  ZONTES • KOVE • SYM
                </div>

                {/* Bottom Overlay: Tachometer Bar & Engine Audio */}
                <div className="absolute bottom-3 inset-x-3 p-3 rounded-xl bg-[#14151B]/95 backdrop-blur-md border border-white/15 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center space-x-1.5 text-white">
                      <Gauge className="w-4 h-4 text-[#FF4433]" />
                      <span>DYNO ТАХОМЕТАР</span>
                    </div>
                    <div className="text-[#FF4433] font-black font-mono">
                      {rpm.toLocaleString()} <span className="text-slate-400 text-[10px]">RPM</span>
                    </div>
                  </div>

                  {/* RPM Progress Bar */}
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden flex p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-75 ${
                        rpm > 9000
                          ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-[#E22E1A]'
                          : rpm > 5000
                          ? 'bg-gradient-to-r from-emerald-500 to-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (rpm / 12000) * 100)}%` }}
                    ></div>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex items-center justify-between pt-1 gap-2">
                    {!isAudioActive ? (
                      <button
                        id="btn-init-engine-audio"
                        onClick={initAudio}
                        className="flex-1 py-2 px-3 rounded-lg bg-[#1F2129] hover:bg-[#282B35] border border-white/10 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#FF4433]" />
                        <span>{t.hero.soundSim} (Вклучи Звук)</span>
                      </button>
                    ) : (
                      <>
                        <button
                          id="btn-throttle-rev"
                          onMouseDown={() => setIsRevving(true)}
                          onMouseUp={() => setIsRevving(false)}
                          onTouchStart={() => setIsRevving(true)}
                          onTouchEnd={() => setIsRevving(false)}
                          onMouseLeave={() => setIsRevving(false)}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer select-none ${
                            isRevving
                              ? 'bg-[#E22E1A] text-white scale-[0.98]'
                              : 'bg-[#1F2129] hover:bg-[#282B35] border border-white/10 text-white'
                          }`}
                        >
                          <Flame className={`w-4 h-4 ${isRevving ? 'animate-bounce' : ''}`} />
                          <span>{t.hero.soundSimRev}</span>
                        </button>

                        <button
                          id="btn-stop-engine-audio"
                          onClick={stopAudio}
                          className="py-2 px-3 rounded-lg bg-[#1F2129] hover:bg-[#282B35] border border-white/10 text-slate-300 text-xs font-bold flex items-center justify-center cursor-pointer"
                          title="Исклучи"
                        >
                          <VolumeX className="w-4 h-4 text-slate-400" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Callouts */}
              <div className="grid grid-cols-3 gap-2 mt-2 pt-1 text-center text-xs">
                <div className="p-2 rounded-lg bg-[#15161C] border border-white/5">
                  <div className="text-slate-400 text-[10px] font-bold">ГАРАНЦИЈА</div>
                  <div className="text-white font-black">2 Години</div>
                </div>
                <div className="p-2 rounded-lg bg-[#15161C] border border-white/5">
                  <div className="text-slate-400 text-[10px] font-bold">КРЕДИТИРАЊЕ</div>
                  <div className="text-[#FF4433] font-black">до 48 Рати</div>
                </div>
                <div className="p-2 rounded-lg bg-[#15161C] border border-white/5">
                  <div className="text-slate-400 text-[10px] font-bold">ДОСТАВА</div>
                  <div className="text-emerald-400 font-black">Низ Цела МК</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Official Brands Banner */}
        <div className="gsap-hero-brands-bar mt-14 pt-6 border-t border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {brandLogos.map((b, idx) => (
              <div
                key={idx}
                className="gsap-hero-brand-item p-3 rounded-xl bg-[#121316] border border-white/10 hover:border-red-500/40 transition-all text-center group cursor-pointer"
                onClick={() => onExploreShowroom()}
              >
                <div className="font-display font-black text-lg text-white group-hover:text-[#FF4433] transition-colors tracking-tight">
                  {b.name}
                </div>
                <div className="text-[10px] font-medium text-slate-400 line-clamp-1 mt-0.5">
                  {b.role}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

