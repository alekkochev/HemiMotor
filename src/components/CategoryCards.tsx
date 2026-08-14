import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useMotorcycles } from '../lib/useMotorcycles';
import { useShopProducts } from '../lib/useShopProducts';
import { shopifyImg } from '../lib/cdn';

export type CategoryPage = 'home' | 'scooters' | 'motorcycles' | 'equipment';

interface CategoryCardsProps {
  onSelectCategory: (page: CategoryPage) => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({ onSelectCategory }) => {
  const { motorcycles } = useMotorcycles();
  const { shopProducts } = useShopProducts();

  const scooterImg = motorcycles.find((m) => m.category === 'scooters' && m.image)?.image || '';
  const motoImg = motorcycles.find((m) => m.category === 'motorcycles' && m.image)?.image || '';
  const equipImg = shopProducts.find((p) => p.image)?.image || '';

  const scooterCount = motorcycles.filter((m) => m.category === 'scooters').length;
  const motoCount = motorcycles.filter((m) => m.category === 'motorcycles').length;

  const categories = [
    {
      page: 'scooters' as CategoryPage,
      title: 'Скутери',
      subtitle: '50cc до 368cc — градски, спортски, ретро и електрични',
      count: scooterCount,
      image: scooterImg,
    },
    {
      page: 'motorcycles' as CategoryPage,
      title: 'Моторцикли',
      subtitle: 'Крос, ендуро, street, чопери и рели — од 50cc до 800cc',
      count: motoCount,
      image: motoImg,
    },
    {
      page: 'equipment' as CategoryPage,
      title: 'Мото Опрема',
      subtitle: 'Кациги, јакни, обувки, ракавици и заштитна опрема',
      count: shopProducts.length,
      image: equipImg,
    },
  ];

  return (
    <section id="categories" className="py-16 bg-transparent border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-red-950/40 border border-red-500/30 text-[#FF5B4D] text-xs font-bold uppercase tracking-wider mb-2">
            Категории
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
            Изберете Категорија
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Скутери, моторцикли и мото опрема — директно од овластениот увозник.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.page}
              onClick={() => onSelectCategory(cat.page)}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#121316] text-left transition-all duration-300 hover:border-red-500/50 hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#181A20]">
                {cat.image ? (
                  <img
                    src={shopifyImg(cat.image, 800)}
                    alt={cat.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 text-5xl">
                    🏍️
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121316] via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-black text-2xl text-white drop-shadow">
                      {cat.title}
                    </h3>
                    <span className="px-2.5 py-1 rounded-full bg-[#E22E1A] text-white text-xs font-bold">
                      {cat.count}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{cat.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#FF5B4D] transition-colors">
                  Погледни ја категоријата
                </span>
                <ChevronRight className="w-4 h-4 text-[#FF5B4D] transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
