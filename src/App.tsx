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
import { Language, Motorcycle, ServicePackage, OemPart, ShopProduct } from './types';
import { SHOP_PRODUCTS } from './data/shopProducts';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('mk');
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);

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

  // Intersection Observer for active section highlight
  useEffect(() => {
    const sections = [
      'hero-section',
      'showroom',
      'shop',
      'salons',
      'service-lab',
      'oem-parts',
      'b2b-fleet',
      'credentials',
      'case-studies',
      'contact'
    ];
    const handleScroll = () => {
      const scrollY = window.scrollY;
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop - 120;
          const height = element.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(sectionId.replace('-section', ''));
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Handlers
  const handleExploreShowroom = () => {
    scrollToSection('showroom');
  };

  const handleOpenBooking = () => {
    setSelectedMotoForBooking(null);
    setSelectedServiceForBooking(null);
    setPrefilledDiagnosis(null);
    setIsBookingOpen(true);
  };

  const handleTestRideMoto = (moto: Motorcycle) => {
    setSelectedMotoForBooking(moto);
    setSelectedServiceForBooking(null);
    setIsBookingOpen(true);
  };

  const handleBookServicePackage = (pkg: ServicePackage) => {
    setSelectedServiceForBooking(pkg);
    setSelectedMotoForBooking(null);
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
        onOpenBooking={handleOpenBooking}
        onOpenB2BModal={handleOpenB2BModal}
        onOpenCart={() => setIsCartOpen(true)}
        cartItemCount={cartTotalCount}
        activeSection={activeSection}
      />

      {/* Main Experience Flow */}
      <main>
        {/* 1. Hero Section with quick CC filters & engine sound preview */}
        <HeroSection
          currentLang={currentLang}
          onExploreShowroom={handleExploreShowroom}
          onOpenShop={() => scrollToSection('shop')}
          onBookService={handleOpenBooking}
          onOpenB2B={handleOpenB2BModal}
        />

        {/* 2. Official Industry Credentials & Trust Bar */}
        <TrustBar currentLang={currentLang} />

        {/* 3. Motorcycles Showroom sorted from lowest to highest displacement with filters & loan calculator */}
        <ShowroomSection
          currentLang={currentLang}
          onBookTestRide={handleTestRideMoto}
          onOpenFinancing={(moto) => {
            setSelectedMotoForBooking(moto);
            setIsBookingOpen(true);
          }}
        />

        {/* 4. Shop / Prodavnica Section with categorized moto equipment & real prices */}
        <ShopSection
          currentLang={currentLang}
          onAddToCart={handleAddToCart}
          onQuickOrder={handleQuickOrder}
        />

        {/* 5. Salons & Dealership Network in 6 Macedonian Cities */}
        <SalonsSection
          currentLang={currentLang}
          onBookTestRide={handleOpenBooking}
        />

        {/* 6. Certified Service Engineering Lab & Dyno Center */}
        <ServiceEngineeringLab
          currentLang={currentLang}
          onBookServicePackage={handleBookServicePackage}
        />

        {/* 7. 100% Genuine OEM Parts Catalog & VIN Lookup */}
        <OemPartsSection
          currentLang={currentLang}
          onRequestPartQuote={handleRequestPartQuote}
        />

        {/* 8. B2B Corporate Fleet Operations & Delivery Scooter TCO Calculator */}
        <B2BFleetEnterprise
          currentLang={currentLang}
          onOpenB2BConfigurator={handleOpenB2BModal}
        />

        {/* 9. Comparison Matrix & Dealership Standards */}
        <EngineeringCredentials
          currentLang={currentLang}
          onBookTour={handleOpenBooking}
        />

        {/* 10. Verified Client Case Studies & Reviews */}
        <CaseStudiesSection
          currentLang={currentLang}
          onOpenB2B={handleOpenB2BModal}
        />
      </main>

      {/* Corporate & Hub Footer */}
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

      {/* Interactive Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        currentLang={currentLang}
        preselectedMoto={selectedMotoForBooking}
        preselectedService={selectedServiceForBooking}
        prefilledDiagnosis={prefilledDiagnosis}
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
