import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, ChevronRight, Globe, ShoppingBag, Wrench } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { CategoryPage } from './CategoryCards';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenB2BModal: () => void;
  onOpenCart?: () => void;
  cartItemsCount?: number;
  cartItemCount?: number;
  page: CategoryPage;
  onNavigate: (page: CategoryPage) => void;
  onContact: () => void;
  onBookService: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  onOpenB2BModal,
  onOpenCart,
  cartItemsCount,
  cartItemCount,
  page,
  onNavigate,
  onContact,
  onBookService
}) => {
  const displayCartCount = cartItemCount ?? cartItemsCount ?? 0;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const t = translations[currentLang];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Почетна' },
    { id: 'scooters', label: 'Скутери' },
    { id: 'motorcycles', label: 'Моторцикли' },
    { id: 'equipment', label: 'Опрема' },
    { id: 'contact', label: 'Контакт' }
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'contact') {
      onContact();
      return;
    }
    onNavigate(id as CategoryPage);
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'mk', label: 'Македонски' },
    { code: 'en', label: 'English' },
    { code: 'sq', label: 'Shqip' }
  ];

  return (
    <>
      {/* Top Banner Ticker - Light Clean Style */}
      <div id="top-telemetry-ticker" className="bg-slate-900 text-white text-[11px] font-medium py-1.5 px-4 z-50 relative hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-red-400 font-semibold tracking-wider">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping mr-2"></span>
              ГЛАВЕН УВОЗНИК: HAMACHI • HEMIMOTOR — ОВЛАСТЕН ДИЛЕР ВО СКОПЈЕ
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center text-slate-300">
              <Shield className="w-3.5 h-3.5 text-red-500 mr-1.5 inline" />
              2 Години Фабричка Гаранција & Обезбеден Сервис
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-medium">
              Кредитирање до 48 рати со лична карта
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-300 font-mono text-[10px]">САЛОН: Скопје · 518 1/13 Керамидница</span>
          </div>
        </div>
      </div>

      {/* Main Navbar - Sophisticated Dark Theme */}
      <header
        id="main-navbar"
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#16171C]/95 backdrop-blur-md border-b border-white/10 shadow-2xl'
            : 'bg-[#16171C] border-b border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo - HEMIMOTOR */}
            <div
              id="brand-logo-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center space-x-3 cursor-pointer group select-none"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E22E1A] to-[#B91C1C] p-0.5 border border-red-500/30 group-hover:border-red-500/60 transition-all flex items-center justify-center">
                <div className="w-full h-full bg-[#121316] rounded-[10px] flex items-center justify-center">
                  <span className="font-display font-black text-xl text-[#FF4433] tracking-tighter">H</span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-display font-black text-2xl tracking-tight text-white group-hover:text-[#FF4433] transition-colors">
                    HEMIMOTOR
                  </span>
                </div>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase -mt-0.5">
                  Овластен дилер на Hamachi · Скопје
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav id="desktop-nav-links" className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = item.id === 'home' ? page === 'home' : item.id === page;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer flex items-center space-x-1.5 ${
                      isActive
                        ? 'text-[#FF4433] bg-red-500/10 font-bold border border-red-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>

                  </button>
                );
              })}
            </nav>

            {/* Actions: Cart, AI advisor, Language & CTA */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Закажи Сервис — директно во навбарот */}
              <button
                id="btn-nav-service"
                onClick={onBookService}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#181A20] hover:bg-[#22252C] border border-white/10 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                title="Закажи сервисен термин"
              >
                <Wrench className="w-4 h-4 text-[#FF5B4D]" />
                <span>Закажи Сервис</span>
              </button>

              {/* Shopping Cart Drawer Trigger */}
              {onOpenCart && (
                <button
                  id="btn-nav-cart"
                  onClick={onOpenCart}
                  className="relative p-2.5 rounded-lg bg-[#181A20] hover:bg-[#22252C] border border-white/10 text-slate-200 transition-colors cursor-pointer"
                  title="Кошничка за купување"
                >
                  <ShoppingBag className="w-5 h-5 text-slate-200" />
                  {displayCartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E22E1A] text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {displayCartCount}
                    </span>
                  )}
                </button>
              )}

              {/* Language Selector */}
              <div className="relative">
                <button
                  id="btn-language-selector"
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center space-x-1 px-2.5 py-2 rounded-lg bg-[#181A20] hover:bg-[#22252C] border border-white/10 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span className="uppercase">{currentLang}</span>
                </button>

                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-[#121316] border border-white/15 rounded-xl shadow-2xl py-1 z-50">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          onLanguageChange(l.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer ${
                          currentLang === l.code ? 'text-[#FF5B4D] font-bold bg-red-500/10' : 'text-slate-300'
                        }`}
                      >
                        <span>{l.label}</span>
                        {currentLang === l.code && <span className="text-[#FF5B4D]">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Main CTA */}
              <button
                id="btn-request-b2b-nav"
                onClick={onOpenB2BModal}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#E22E1A] hover:bg-[#C82412] text-white font-bold text-xs border border-red-500/40 transition-all cursor-pointer"
              >
                <span>{t.nav.requestB2B}</span>
                <ChevronRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Mobile Menu & Cart Trigger */}
            <div className="flex items-center space-x-2 lg:hidden">
              {onOpenCart && (
                <button
                  onClick={onOpenCart}
                  className="relative p-2 rounded-lg bg-[#181A20] border border-white/10 text-slate-200"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {displayCartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E22E1A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {displayCartCount}
                    </span>
                  )}
                </button>
              )}

              <button
                id="btn-mobile-lang"
                onClick={() => {
                  const nextLang: Language = currentLang === 'mk' ? 'en' : currentLang === 'en' ? 'sq' : 'mk';
                  onLanguageChange(nextLang);
                }}
                className="px-2 py-1.5 rounded-lg bg-[#181A20] border border-white/10 text-xs font-mono font-bold uppercase text-[#FF5B4D]"
              >
                {currentLang}
              </button>

              <button
                id="btn-mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-lg bg-[#181A20] border border-white/10 text-slate-200 hover:bg-[#22252C]"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div id="mobile-nav-dropdown" className="lg:hidden bg-[#0D0E11] border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = item.id === 'home' ? page === 'home' : item.id === page;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                      isActive ? 'bg-red-500/10 text-[#FF5B4D]' : 'text-slate-200 hover:bg-white/5 hover:text-[#FF5B4D]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBookService();
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-[#181A20] border border-white/10 text-slate-200 font-bold text-sm"
              >
                <Wrench className="w-4 h-4 text-[#FF5B4D]" />
                <span>Закажи Сервис</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenB2BModal();
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-[#E22E1A] hover:bg-[#C82412] text-white font-bold text-sm border border-red-500/40"
              >
                <span>{t.nav.requestB2B}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
