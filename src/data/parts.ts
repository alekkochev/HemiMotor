import { OemPart } from '../types';

export const OEM_PARTS: OemPart[] = [
  {
    id: 'zontes-350-cylinder-kit',
    partNumber: 'ZNT-350-CYL-OEM',
    name: 'Zontes 350cc Оригинален Цилиндар & Клип Комплет',
    category: 'engine',
    manufacturer: 'Zontes OEM Factory',
    priceMkd: 12900,
    priceMkdFormatted: '12.900 ден.',
    priceEur: 210,
    priceEurFormatted: '€ 210',
    compatibility: ['Zontes 350D', 'Zontes 350E', 'Zontes 350T', 'Zontes 350GK'],
    inStock: true,
    stockCount: 8,
    warranty: '1 Година Фабричка Гаранција',
    technicalSpecs: {
      'Материјал': 'Никасил алуминиумска кошулица',
      'Дијаметар': '77.0 mm',
      'Компресија': '11.8:1',
      'Комплет': 'Цилиндар, клип, прстени, болец и осигурачи'
    },
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bando-cvt-belt-sym-hamachi',
    partNumber: 'BND-CVT-842-20',
    name: 'Bando Погонски Ремен за Скутери 125cc - 200cc',
    category: 'transmission',
    manufacturer: 'Bando Chemical (Japan)',
    priceMkd: 1950,
    priceMkdFormatted: '1.950 ден.',
    priceEur: 32,
    priceEurFormatted: '€ 32',
    compatibility: ['Hamachi Phantom 150', 'Hamachi T9 125', 'SYM Jet 14 125', 'SYM Symphony ST 200'],
    inStock: true,
    stockCount: 34,
    warranty: '10.000 km Фабрички Ресурс',
    technicalSpecs: {
      'Димензија': '842 x 20 x 30 mm',
      'Материјал': 'Кевларски армиран EPDM состав',
      'Термичка отпорност': 'до 140°C без деформација'
    },
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'brenta-sinter-brake-pads',
    partNumber: 'BRN-FT-3092-ST',
    name: 'Brenta Сinter Кочиони Плочки (Предни/Задни)',
    category: 'braking',
    manufacturer: 'Brenta Brakes (Italy)',
    priceMkd: 1450,
    priceMkdFormatted: '1.450 ден.',
    priceEur: 24,
    priceEurFormatted: '€ 24',
    compatibility: ['Zontes 310/350/703', 'Kove 450 Rally', 'SYM Maxsym 400', 'Hamachi Fighter 150'],
    inStock: true,
    stockCount: 22,
    warranty: 'Оригинален ECE R90 Сертификат',
    technicalSpecs: {
      'Состав': 'Синтеруван метализиран фрикционен слој',
      'Температурен опсег': '-20°C до 550°C',
      'Карактеристики': 'Тивка работа и долготрајност на диск'
    },
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'did-520-vx3-chain-kit',
    partNumber: 'DID-520-VX3-116',
    name: 'D.I.D 520 VX3 X-Ring Јапонски Погонски Ланец',
    category: 'transmission',
    manufacturer: 'Daido Kogyo D.I.D (Japan)',
    priceMkd: 4900,
    priceMkdFormatted: '4.900 ден.',
    priceEur: 80,
    priceEurFormatted: '€ 80',
    compatibility: ['Zontes 350GK', 'Kove 450 Rally', 'Zontes 703RR', 'QJMotor SRT 550'],
    inStock: true,
    stockCount: 15,
    warranty: '25.000 km Фабрички Век',
    technicalSpecs: {
      'Тип': 'X-Ring запечатен со низок коефициент на триење',
      'Јакост': '37.5 kN на затегнување',
      'Должина': '116 Линкови со брза спојка'
    },
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'motul-7100-4t-10w40-pack',
    partNumber: 'MTL-7100-4T-10W40',
    name: 'Motul 7100 4T 10W-40 100% Синтетичко Моторно Масло (4L)',
    category: 'engine',
    manufacturer: 'Motul (France)',
    priceMkd: 3300,
    priceMkdFormatted: '3.300 ден.',
    priceEur: 54,
    priceEurFormatted: '€ 54',
    compatibility: ['Сите 4-тактни мотоцикли и скутери со влажна ламела'],
    inStock: true,
    stockCount: 45,
    warranty: 'Оригинален увоз со холограмска заштита',
    technicalSpecs: {
      'Стандарди': 'API SN / SM / SL / SJ / SH / SG',
      'Одобрувања': 'JASO MA2 под бр. M033MOT161',
      'Технологија': 'Ester Technology за заштита на менувачот'
    },
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'yuasa-ytx9-bs-battery',
    partNumber: 'YUA-YTX9-BS-AGM',
    name: 'Yuasa YTX9-BS AGM Акумулатор за Скутери и Мотори (12V 8Ah)',
    category: 'electronics',
    manufacturer: 'GS Yuasa (Japan / EU)',
    priceMkd: 2600,
    priceMkdFormatted: '2.600 ден.',
    priceEur: 42,
    priceEurFormatted: '€ 42',
    compatibility: ['Zontes 310/350', 'Hamachi Falcon 150', 'SYM Symphony', 'Kove 450'],
    inStock: true,
    stockCount: 18,
    warranty: '12 Месеци Гаранција',
    technicalSpecs: {
      'Капацитет': '12V 8.4Ah (10HR)',
      'Стартна струја': '135 CCA на -18°C',
      'Технологија': 'AGM фабрички запечатен без одржување'
    },
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  }
];
