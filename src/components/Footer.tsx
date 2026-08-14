import React, { useState } from 'react';
import { 
  Shield, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  Send, 
  ArrowUp,
  CreditCard,
  Truck
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface FooterProps {
  currentLang: Language;
  onOpenBooking: () => void;
  onOpenB2BModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onOpenBooking,
  onOpenB2BModal
}) => {
  const t = translations[currentLang];
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#070708] border-t border-white/10 relative z-10 text-slate-400">
      
      {/* Upper Hub & Showroom Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Brand Statement & Certifications */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#E22E1A] flex items-center justify-center font-black text-white text-xl tracking-tighter shadow-md shadow-red-500/20">
                H
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-display font-black text-2xl tracking-tighter text-white">
                    HEMIMOTOR
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  Овластен дилер на Hamachi · Скопје
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              Хеми Мотор — 20 години со вас. Овластен дилер на Hamachi (главен увозник) во Скопје — продажба на скутери, моторцикли, мото опрема и овластен сервис.
            </p>

            <div className="p-4 rounded-2xl bg-[#121316] border border-white/10 space-y-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2 text-[#FF5B4D] font-bold">
                <Shield className="w-4 h-4 text-[#FF5B4D]" />
                <span>ГАРАНЦИЈА & КРЕДИТИРАЊЕ</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>2 Години Фабричка Гаранција на Сите Нови Модели</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Купување на до 48 рати преку Iute, Silk Road и NLB</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Бесплатна достава низ цела Македонија</span>
              </div>
            </div>
          </div>

          {/* Center Column: Direct Facility Contacts */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF5B4D]">
              {t.contact.eyebrow}
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#121316] border border-white/10">
                <MapPin className="w-4 h-4 text-[#FF5B4D] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Салон & Сервис Скопје</div>
                  <div className="text-slate-400 mt-0.5">518 1/13, Керамидница, Скопје (едносмерната улица)</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#121316] border border-white/10">
                <Phone className="w-4 h-4 text-[#FF5B4D] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Телефон</div>
                  <div className="text-white font-black text-sm mt-0.5">070 222 446 / 02 3 135 058</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#121316] border border-white/10">
                <Clock className="w-4 h-4 text-[#FF5B4D] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Работно Време</div>
                  <div className="text-slate-400 mt-0.5">Пон - Петок: 09:00 - 17:00 | Сабота: 09:00 - 13:00</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Technical Newsletter & Quick Direct Actions */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF5B4D]">
              HEMIMOTOR Известувања
            </h4>

            <p className="text-xs text-slate-400">
              Пријавете се за најнови попусти, промоции на опрема и нови модели на моторцикли и скутери.
            </p>

            {!newsletterSubscribed ? (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="вашиот email..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121316] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5B4D]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#E22E1A] hover:bg-[#C82412] text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5 border border-red-500/30"
                >
                  <span>Зачлени се</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Успешно се зачленивте за попусти!</span>
              </div>
            )}

            <div className="pt-2 space-y-2">
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 rounded-xl bg-[#121316] hover:bg-[#1C1E26] border border-white/10 text-white font-bold text-xs transition-colors cursor-pointer text-center"
              >
                📅 Закажи Сервис или Тест Возење
              </button>
              <button
                onClick={onOpenB2BModal}
                className="w-full py-2.5 rounded-xl bg-[#121316] hover:bg-[#1C1E26] border border-red-500/40 text-[#FF5B4D] font-bold text-xs transition-colors cursor-pointer text-center"
              >
                💼 Флоти & Набавка на Големо
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div className="flex items-center space-x-2">
          <span>© {new Date().getFullYear()} HEMIMOTOR Скопје. Сите права се задржани.</span>
          <span>•</span>
          <span>Главен увозник: hamachi.mk</span>
        </div>

        <div className="flex items-center space-x-6">
          <span className="hover:text-slate-200 cursor-pointer">Политика за Приватност</span>
          <span className="hover:text-slate-200 cursor-pointer">Услови за Набавка</span>
          <span className="hover:text-slate-200 cursor-pointer">Салони & Сервиси</span>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-[#121316] hover:bg-[#1C1E26] border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center space-x-1"
            title="Назад на Врв"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">ВРВ</span>
          </button>
        </div>
      </div>

    </footer>
  );
};
