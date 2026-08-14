import React, { useState } from 'react';
import { X, Building2, ShieldCheck, CheckCircle2, FileText, Send, Phone, Mail, User, MapPin } from 'lucide-react';
import { Language, OemPart } from '../types';
import confetti from 'canvas-confetti';

interface FleetConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  prefilledPart?: OemPart | null;
}

export const FleetConfiguratorModal: React.FC<FleetConfiguratorModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  prefilledPart
}) => {
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState(''); // ЕДБ
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fleetType, setFleetType] = useState(
    prefilledPart ? 'oem-bulk-parts' : 'commercial-courier'
  );
  const [estimatedUnits, setEstimatedUnits] = useState('5 - 15 Единици');
  const [slaRequirement, setSlaRequirement] = useState('4 Часа (Стандард)');
  const [projectDescription, setProjectDescription] = useState(
    prefilledPart ? `Барање за понуда за OEM дел: ${prefilledPart.name} (${prefilledPart.partNumber})` : ''
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [tenderRef, setTenderRef] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = 'HMC-B2B-' + Math.floor(10000 + Math.random() * 90000);
    setTenderRef(ref);
    setIsSuccess(true);
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.5 }
      });
    } catch {
      // silent
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121316] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-100">
        
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#181A20] hover:bg-[#22252C] border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <>
            <div className="space-y-1">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-950/50 border border-red-500/30 text-[#FF5B4D] uppercase tracking-wider">
                HEMIMOTOR B2B & ФЛОТИ
              </span>
              <h3 className="text-2xl font-display font-black text-white">
                Барање за Корпоративна Понуда & Флоти
              </h3>
              <p className="text-xs text-slate-400">
                Специјални услови за набавка на скутери/мотоцикли и одржување за курирски служби, ресторани и компании.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">НАЗИВ НА КОМПАНИЈА *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="пр. Брза Достава ДООЕЛ"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#181A20] border border-white/10 focus:border-[#FF5B4D] text-white placeholder-slate-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">ЕДБ / ДАНОЧЕН БРОЈ (Опционално)</label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="40300XXXXXXXX"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181A20] border border-white/10 text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">ЛИЦЕ ЗА КОНТАКТ *</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Име и Презиме"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181A20] border border-white/10 focus:border-[#FF5B4D] text-white placeholder-slate-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">E-MAIL ЗА ПОНУДА *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@kompanija.mk"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181A20] border border-white/10 focus:border-[#FF5B4D] text-white placeholder-slate-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">ТЕЛЕФОН *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07X XXX XXX"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181A20] border border-white/10 focus:border-[#FF5B4D] text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">ТИП НА ПОТРЕБА</label>
                  <select
                    value={fleetType}
                    onChange={(e) => setFleetType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181A20] border border-white/10 text-white font-semibold outline-none focus:border-[#FF5B4D]"
                  >
                    <option value="commercial-courier" className="bg-[#181A20]">Курирска / Доставна Флота</option>
                    <option value="police-security" className="bg-[#181A20]">Обезбедување / Патрола</option>
                    <option value="full-service-lease" className="bg-[#181A20]">Оперативен Лизинг + Сервис</option>
                    <option value="oem-bulk-parts" className="bg-[#181A20]">Делови на Големо</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">ПЛАНИРАН БРОЈ</label>
                  <select
                    value={estimatedUnits}
                    onChange={(e) => setEstimatedUnits(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181A20] border border-white/10 text-white font-semibold outline-none focus:border-[#FF5B4D]"
                  >
                    <option value="1 - 4 Единици" className="bg-[#181A20]">1 - 4 Возила</option>
                    <option value="5 - 15 Единици" className="bg-[#181A20]">5 - 15 Возила</option>
                    <option value="16 - 50 Единици" className="bg-[#181A20]">16 - 50 Возила</option>
                    <option value="50+ Единици" className="bg-[#181A20]">50+ Возила</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">СЕРВИСНА ПОДДРШКА</label>
                  <select
                    value={slaRequirement}
                    onChange={(e) => setSlaRequirement(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181A20] border border-white/10 text-white font-semibold outline-none focus:border-[#FF5B4D]"
                  >
                    <option value="4 Часа (Стандард)" className="bg-[#181A20]">Редовен Сервис во Салон</option>
                    <option value="2 Часа (Приоритет + Замена)" className="bg-[#181A20]">Приоритетен + Заменско Возило</option>
                    <option value="Мобилен Сервис" className="bg-[#181A20]">Мобилен Сервис на Локација</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">ДОПОЛНИТЕЛНИ БАРАЊА ИЛИ ОПИС</label>
                <textarea
                  rows={3}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Опишете ги деталите за вашите возила, дали ви треба кутија за достава, брендирање, кациги..."
                  className="w-full p-3 rounded-xl bg-[#181A20] border border-white/10 focus:border-[#FF5B4D] text-white placeholder-slate-500 outline-none"
                ></textarea>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Писмената понуда ќе содржи детален преглед на цени со вклучен ДДВ и сервисен договор.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#E22E1A] hover:bg-[#C82412] text-white font-bold text-xs border border-red-500/30 transition-all cursor-pointer uppercase tracking-wider"
              >
                Испрати Барање за B2B Понуда
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
                Барањето е Успешно Испратено!
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                B2B тимот на HEMIMOTOR ќе изготви специјална понуда за <strong className="text-white">{companyName}</strong> и ќе ве контактира на <strong className="text-[#FF5B4D]">{phone}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#181A20] border border-white/10 max-w-sm mx-auto space-y-1 text-xs">
              <div className="text-slate-400 font-bold">БРОЈ НА НАЛОГ:</div>
              <div className="text-xl font-black text-[#FF5B4D] font-mono">{tenderRef}</div>
            </div>

            <button
              onClick={handleClose}
              className="px-8 py-3 rounded-xl bg-[#181A20] hover:bg-[#22252C] border border-white/10 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Затвори
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
