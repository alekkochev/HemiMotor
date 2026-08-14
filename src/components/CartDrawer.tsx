import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, ShieldCheck, CheckCircle2, Phone, ArrowRight, ChevronRight } from 'lucide-react';
import { ShopProduct, Language } from '../types';

export interface CartItem {
  product: ShopProduct;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  currentLang: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentLang
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [orderCompleted, setOrderCompleted] = useState<boolean>(false);
  
  // Checkout Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: 'Скопје',
    address: '',
    paymentMethod: 'cash_on_delivery', // 'cash_on_delivery' | 'card_installments'
    notes: ''
  });

  if (!isOpen) return null;

  const subtotalMkd = items.reduce((acc, item) => acc + (item.product.priceMkd * item.quantity), 0);
  const shippingMkd = subtotalMkd >= 3000 || subtotalMkd === 0 ? 0 : 150;
  const totalMkd = subtotalMkd + shippingMkd;
  const totalEur = (totalMkd / 61.5).toFixed(1);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderCompleted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121316] border-l border-white/10 shadow-2xl flex flex-col justify-between text-slate-100">
          
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#181A20]">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-red-950/50 border border-red-500/30 text-[#FF5B4D]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-white">
                  Вашата Кошничка
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {items.length} {items.length === 1 ? 'производ' : 'производи'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            {orderCompleted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-white">
                  Нарачката е Успешно Примена!
                </h4>
                <p className="text-sm text-slate-400">
                  Ви благодариме <span className="font-bold text-white">{formData.fullName || 'почитувани'}</span>. Нашиот тим од Hamachi Motors ќе ве контактира на <span className="font-bold text-[#FF5B4D]">{formData.phone || 'вашиот број'}</span> за потврда пред испраќање преку Карго Експрес.
                </p>
                <div className="p-4 rounded-xl bg-[#181A20] border border-white/10 text-xs text-left space-y-1">
                  <div><span className="text-slate-400">Град & Адреса:</span> <span className="font-bold text-white">{formData.city}, {formData.address}</span></div>
                  <div><span className="text-slate-400">Вкупен Износ:</span> <span className="font-black text-[#FF5B4D]">{totalMkd.toLocaleString()} ден.</span></div>
                  <div><span className="text-slate-400">Начин на плаќање:</span> <span className="font-bold text-emerald-400">При преземање на пратката</span></div>
                </div>
                <button
                  onClick={() => {
                    onClearCart();
                    setIsCheckingOut(false);
                    setOrderCompleted(false);
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl bg-[#E22E1A] hover:bg-[#C82412] text-white font-bold text-xs border border-red-500/30 transition-all cursor-pointer"
                >
                  Затвори и Продолжи
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 text-slate-400 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto text-slate-600" />
                <p className="text-sm font-semibold text-slate-300">Вашата кошничка е празна</p>
                <p className="text-xs text-slate-500">Додајте кацига, масло Motul, гума или опрема од нашата продавница.</p>
              </div>
            ) : isCheckingOut ? (
              /* Checkout Form */
              <form onSubmit={handleSubmitOrder} className="space-y-3 text-xs">
                <div className="font-bold text-white text-sm mb-2 pb-1 border-b border-white/10">
                  Податоци за достава со Карго:
                </div>
                
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Име и Презиме *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="на пр. Александар Стојановски"
                    className="w-full px-3 py-2 rounded-xl bg-[#181A20] border border-white/10 text-white placeholder-slate-500 outline-none focus:border-[#FF5B4D]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Телефонски број за достава *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="07X XXX XXX"
                    className="w-full px-3 py-2 rounded-xl bg-[#181A20] border border-white/10 text-white placeholder-slate-500 outline-none focus:border-[#FF5B4D]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Град во МК *</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#181A20] border border-white/10 text-white outline-none focus:border-[#FF5B4D]"
                    >
                      <option value="Скопје" className="bg-[#181A20] text-white">Скопје</option>
                      <option value="Штип" className="bg-[#181A20] text-white">Штип</option>
                      <option value="Битола" className="bg-[#181A20] text-white">Битола</option>
                      <option value="Куманово" className="bg-[#181A20] text-white">Куманово</option>
                      <option value="Прилеп" className="bg-[#181A20] text-white">Прилеп</option>
                      <option value="Тетово" className="bg-[#181A20] text-white">Тетово</option>
                      <option value="Охрид" className="bg-[#181A20] text-white">Охрид</option>
                      <option value="Струмица" className="bg-[#181A20] text-white">Струмица</option>
                      <option value="Велес" className="bg-[#181A20] text-white">Велес</option>
                      <option value="Гостивар" className="bg-[#181A20] text-white">Гостивар</option>
                      <option value="Кавадарци" className="bg-[#181A20] text-white">Кавадарци</option>
                      <option value="Кочани" className="bg-[#181A20] text-white">Кочани</option>
                      <option value="Гевгелија" className="bg-[#181A20] text-white">Гевгелија</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Адреса и Број *</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Улица и број..."
                      className="w-full px-3 py-2 rounded-xl bg-[#181A20] border border-white/10 text-white placeholder-slate-500 outline-none focus:border-[#FF5B4D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Начин на плаќање</label>
                  <div className="p-2.5 rounded-xl bg-[#181A20] border border-white/10 flex items-center justify-between">
                    <span className="font-bold text-white">Плаќање во готово при достава</span>
                    <span className="text-emerald-400 font-bold text-[10px] bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">Безбедно</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="w-1/3 py-2.5 rounded-xl bg-[#181A20] hover:bg-[#22252C] border border-white/10 text-slate-300 font-bold transition-colors"
                  >
                    Назад
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 rounded-xl bg-[#E22E1A] hover:bg-[#C82412] text-white font-black border border-red-500/30 transition-all flex items-center justify-center space-x-1"
                  >
                    <span>Потврди Нарачка</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              /* Items List */
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 rounded-2xl bg-[#181A20] border border-white/10 flex space-x-3 items-center"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-xl bg-black border border-white/10 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs text-white truncate">
                        {item.product.name}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        {item.product.priceMkdFormatted} / парче
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-1.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="w-6 h-6 rounded-md bg-[#121316] border border-white/10 text-slate-200 flex items-center justify-center hover:bg-white/10 font-bold"
                        >
                          -
                        </button>
                        <span className="font-bold text-xs text-white px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="w-6 h-6 rounded-md bg-[#121316] border border-white/10 text-slate-200 flex items-center justify-center hover:bg-white/10 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-xs text-[#FF5B4D]">
                        {(item.product.priceMkd * item.quantity).toLocaleString()} ден.
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        title="Отстрани"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Summary */}
          {!orderCompleted && items.length > 0 && !isCheckingOut && (
            <div className="p-5 border-t border-white/10 bg-[#181A20] space-y-3">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Износ на производи:</span>
                  <span className="font-bold text-white">{subtotalMkd.toLocaleString()} ден.</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Достава низ МК:</span>
                  <span className={shippingMkd === 0 ? "font-bold text-emerald-400" : "font-bold text-white"}>
                    {shippingMkd === 0 ? "Бесплатна достава" : `${shippingMkd} ден.`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-white/10">
                  <span>Вкупно:</span>
                  <span className="text-[#FF5B4D] text-lg">{totalMkd.toLocaleString()} ден. ({totalEur} €)</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-3.5 rounded-xl bg-[#E22E1A] hover:bg-[#C82412] text-white font-black text-sm border border-red-500/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Кон Наплата & Достава</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] text-slate-400 flex items-center justify-center space-x-1">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                <span>Брза испорака низ Македонија за 24-48 часа</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
