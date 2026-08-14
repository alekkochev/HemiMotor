import React, { useState } from 'react';
import { X, Calendar, Wrench, ShieldCheck, CheckCircle2, User, Phone, Mail, MapPin, Truck } from 'lucide-react';
import { Language, ServicePackage, Motorcycle } from '../types';
import { translations } from '../data/translations';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  preselectedService?: ServicePackage | null;
  preselectedMoto?: Motorcycle | null;
  prefilledDiagnosis?: string | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  preselectedService,
  preselectedMoto,
  prefilledDiagnosis
}) => {
  const t = translations[currentLang];

  const [bookingType, setBookingType] = useState<'service' | 'test-ride' | 'financing'>(
    preselectedMoto ? 'test-ride' : 'service'
  );
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [salonCity, setSalonCity] = useState('Скопје');
  const [motoModel, setMotoModel] = useState(
    preselectedMoto ? `${preselectedMoto.brand} ${preselectedMoto.name} (${preselectedMoto.displacement})` : ''
  );
  const [servicePackageName, setServicePackageName] = useState(
    preselectedService
      ? preselectedService.name
      : prefilledDiagnosis || 'Редовен Сервис (Замена на Масло Motul + Компјутерска Дијагностика)'
  );
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = 'HMC-' + Math.floor(100000 + Math.random() * 900000);
    setReferenceCode(ref);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {
      // silent
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121316] border border-white/10 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-100">
        
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#181A20] hover:bg-[#22252C] border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <>
            <div className="space-y-1">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-950/50 border border-red-500/30 text-[#FF5B4D] uppercase tracking-wider">
                HEMIMOTOR СКОПЈЕ
              </span>
              <h3 className="text-2xl font-display font-black text-white">
                {bookingType === 'service' ? 'Закажи Овластен Сервис' : bookingType === 'test-ride' ? 'Тест Возење во Салон' : 'Апликација за Кредитирање на Рати'}
              </h3>
              <p className="text-xs text-slate-400">
                Нашиот тим ќе ве контактира на телефонскиот број во рок од 30 минути за потврда на терминот.
              </p>
            </div>

            {/* Switch Booking Type */}
            <div className="flex rounded-xl bg-[#181A20] p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setBookingType('service')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  bookingType === 'service'
                    ? 'bg-[#E22E1A] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🛠️ Сервис
              </button>
              <button
                type="button"
                onClick={() => setBookingType('test-ride')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  bookingType === 'test-ride'
                    ? 'bg-[#E22E1A] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏍️ Тест Возење
              </button>
              <button
                type="button"
                onClick={() => setBookingType('financing')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  bookingType === 'financing'
                    ? 'bg-[#E22E1A] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                💳 Купи на Рати
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">ИМЕ И ПРЕЗИМЕ *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="на пр. Марко Николов"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#181A20] border border-white/10 focus:border-[#FF5B4D] text-white placeholder-slate-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">ТЕЛЕФОН ЗА КОНТАКТ *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07X XXX XXX"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#181A20] border border-white/10 focus:border-[#FF5B4D] text-white placeholder-slate-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">ИЗБЕРИ САЛОН / ГРАД *</label>
                  <select
                    value={salonCity}
                    onChange={(e) => setSalonCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181A20] border border-white/10 text-white font-semibold outline-none focus:border-[#FF5B4D]"
                  >
                    <option value="Скопје" className="bg-[#181A20] text-white">Скопје (Главен Салон Бул. Србија)</option>
                    <option value="Штип" className="bg-[#181A20] text-white">Штип (Централа & Сервисен Центар)</option>
                    <option value="Битола" className="bg-[#181A20] text-white">Битола (Салон Довлеџик)</option>
                    <option value="Струмица" className="bg-[#181A20] text-white">Струмица (Салон Ленинова)</option>
                    <option value="Тетово" className="bg-[#181A20] text-white">Тетово (Салон Маршал Тито)</option>
                    <option value="Охрид" className="bg-[#181A20] text-white">Охрид (Салон Бул. Туристичка)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">МОДЕЛ НА ВОЗИЛО</label>
                  <input
                    type="text"
                    value={motoModel}
                    onChange={(e) => setMotoModel(e.target.value)}
                    placeholder="пр. Hamachi Jog 3 50cc / Zontes 350D / SYM"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181A20] border border-white/10 focus:border-[#FF5B4D] text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">ПОСАКУВАН ДАТУМ</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#181A20] border border-white/10 focus:border-[#FF5B4D] text-white outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">E-MAIL (Опционално)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vasa.adresa@email.mk"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181A20] border border-white/10 text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">ЗАБЕЛЕШКИ ИЛИ ОПИС НА БАРАЊЕТО</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Внесете специфични прашања за рати, опрема или замена..."
                  className="w-full p-3 rounded-xl bg-[#181A20] border border-white/10 focus:border-[#FF5B4D] text-white placeholder-slate-500 outline-none"
                ></textarea>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Вашите податоци се заштитени. Овластен дилер на Hamachi — HEMIMOTOR Скопје.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#E22E1A] hover:bg-[#C82412] text-white font-black text-xs border border-red-500/30 transition-all cursor-pointer uppercase tracking-wider"
              >
                Испрати Барање за Потврда
              </button>

            </form>
          </>
        ) : (
          <div className="py-8 text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-display font-black text-white">
                Барањето е Успешно Регистрирано!
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Вашата резервација е заведена во системот на HEMIMOTOR во салон <strong className="text-white">{salonCity}</strong>. Ќе ве контактираме на <strong className="text-[#FF5B4D]">{phone}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#181A20] border border-white/10 max-w-sm mx-auto space-y-1 text-xs">
              <div className="text-slate-400 font-bold">РЕФЕРЕНТЕН БРОЈ НА НАЛОГ:</div>
              <div className="text-xl font-black text-[#FF5B4D] font-mono">{referenceCode}</div>
              <div className="text-[10px] text-slate-500">
                Зачувајте го овој код за брза идентификација во салонот.
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="px-8 py-3 rounded-xl bg-[#181A20] hover:bg-[#22252C] border border-white/10 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Затвори Прозорец
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
