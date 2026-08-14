import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustBar } from './components/TrustBar';
import { ShowroomSection } from './components/ShowroomSection';
import { ShopSection } from './components/ShopSection';
import { SalonsSection } from './components/SalonsSection';
import { ServiceEngineeringLab } from './components/ServiceEngineeringLab';
import { OemPartsSection } from './components/OemPartsSection';
import { B2BFleetEnterprise } from './components/B2BFleetEnterprise';
import { EngineeringCredentials } from './components/EngineeringCredentials';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { FleetConfiguratorModal } from './components/FleetConfiguratorModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { CategoryCards, CategoryPage } from './components/CategoryCards';
import { Language, Motorcycle, ServicePackage, OemPart, ShopProduct } from './types';
import { ArrowLeft } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('mk');
  const [page, setPage] = useState<CategoryPage>('home');

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);
  const [bookingMode, setBookingMode] = useState<'service' | 'test-ride' | 'financing'>('service');

  // Pre-filled modal contexts
  const [selectedMotoForBooking, setSelectedMotoForBooking] = useState<Motorcycle | null>(null);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServicePackage | null>(null);
  const [selectedPartForQuote, setSelectedPartForQuote] = useState<OemPart | null>(null);
  const [prefilledDiagnosis, setPrefilledDiagnosis] = useState<string | null>(null);

  // Cart handlers
  const handleAddToCart = (product: ShopProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleQuickOrder = (product: ShopProduct) => {
    handleAddToCart(product);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Total cart items count
  const cartTotalCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  // Навигација меѓу страници
  const navigateTo = (target: CategoryPage) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 75;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleContactNav = () => {
    if (page !== 'home') {
      setPage('home');
      setTimeout(() => scrollToSection('contact'), 150);
    } else {
      scrollToSection('contact');
    }
  };

  // Handlers
  const handleExploreShowroom = () => {
    navigateTo('scooters');
  };

  const handleOpenBooking = () => {
    setSelectedMotoForBooking(null);
    setSelectedServiceForBooking(null);
    setPrefilledDiagnosis(null);
    setBookingMode('service');
    setIsBookingOpen(true);
  };

  const handleTestRideMoto = (moto: Motorcycle) => {
    setSelectedMotoForBooking(moto);
    setSelectedServiceForBooking(null);
    setBookingMode('test-ride');
    setIsBookingOpen(true);
  };

  const handleBookServicePackage = (pkg: ServicePackage) => {
    setSelectedServiceForBooking(pkg);
    setSelectedMotoForBooking(null);
    setBookingMode('service');
    setIsBookingOpen(true);
  };

  const handleRequestPartQuote = (part: OemPart) => {
    setSelectedPartForQuote(part);
    setIsB2BModalOpen(true);
  };

  const handleOpenB2BModal = () => {
    setSelectedPartForQuote(null);
    setIsB2BModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-100 selection:bg-[#E22E1A]/30 selection:text-white relative font-sans">

      {/* Navigation Header */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenB2BModal={handleOpenB2BModal}
        onOpenCart={() => setIsCartOpen(true)}
        cartItemCount={cartTotalCount}
        page={page}
        onNavigate={navigateTo}
        onContact={handleContactNav}
        onBookService={handleOpenBooking}
      />

      {/* Main Experience Flow */}
      <main>
        {page === 'home' ? (
          <>
            {/* 1. Hero */}
            <HeroSection
              currentLang={currentLang}
              onExploreShowroom={handleExploreShowroom}
              onOpenShop={() => navigateTo('equipment')}
              onBookService={handleOpenBooking}
              onOpenB2B={handleOpenB2BModal}
            />

            {/* 2. Категории со фотографии (влез во секоја категорија) */}
            <CategoryCards onSelectCategory={navigateTo} />

            {/* 3. Trust Bar */}
            <TrustBar currentLang={currentLang} />

            {/* 4. Салон Скопје */}
            <SalonsSection
              currentLang={currentLang}
              onBookTestRide={handleOpenBooking}
            />

            {/* 5. Сервис */}
            <ServiceEngineeringLab
              currentLang={currentLang}
              onBookServicePackage={handleBookServicePackage}
            />

            {/* 6. OEM Делови */}
            <OemPartsSection
              currentLang={currentLang}
              onRequestPartQuote={handleRequestPartQuote}
            />

            {/* 7. B2B */}
            <B2BFleetEnterprise
              currentLang={currentLang}
              onOpenB2BConfigurator={handleOpenB2BModal}
            />

            {/* 8. Споредба */}
            <EngineeringCredentials
              currentLang={currentLang}
              onBookTour={handleOpenBooking}
            />

            {/* 9. Case Studies */}
            <CaseStudiesSection
              currentLang={currentLang}
              onOpenB2B={handleOpenB2BModal}
            />
          </>
        ) : page === 'equipment' ? (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
              <button
                onClick={() => navigateTo('home')}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#121316] hover:bg-[#1C1E26] border border-white/10 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#FF5B4D]" />
                <span>Назад на почетна</span>
              </button>
            </div>
            <ShopSection
              currentLang={currentLang}
              onAddToCart={handleAddToCart}
              onQuickOrder={handleQuickOrder}
            />
          </>
        ) : (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
              <button
                onClick={() => navigateTo('home')}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#121316] hover:bg-[#1C1E26] border border-white/10 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#FF5B4D]" />
                <span>Назад на почетна</span>
              </button>
            </div>
            <ShowroomSection
              currentLang={currentLang}
              onBookTestRide={handleTestRideMoto}
              onOpenFinancing={(moto) => {
                setSelectedMotoForBooking(moto);
                setBookingMode('financing');
                setIsBookingOpen(true);
              }}
              fixedCategory={page === 'scooters' ? 'scooters' : 'motorcycles'}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onOpenBooking={handleOpenBooking}
        onOpenB2BModal={handleOpenB2BModal}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        currentLang={currentLang}
      />

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        currentLang={currentLang}
        preselectedMoto={selectedMotoForBooking}
        preselectedService={selectedServiceForBooking}
        prefilledDiagnosis={prefilledDiagnosis}
        bookingType={bookingMode}
      />

      <FleetConfiguratorModal
        isOpen={isB2BModalOpen}
        onClose={() => setIsB2BModalOpen(false)}
        currentLang={currentLang}
        prefilledPart={selectedPartForQuote}
      />

    </div>
  );
}
