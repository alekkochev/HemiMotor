import { ShopProduct } from '../types';

export const SHOP_PRODUCTS: ShopProduct[] = [
  // ==========================================
  // МОТО КАЦИГИ (HELMETS)
  // ==========================================
  {
    id: 'helmet-hmc-carbon-flip',
    name: 'HMC Pro Modular Flip-Up Кацига со Двоен Визир',
    brand: 'HMC',
    category: 'helmets',
    categoryLabel: 'Мото Кациги',
    priceMkd: 4920,
    priceMkdFormatted: '4.920 ден.',
    priceEur: 80,
    priceEurFormatted: '80 €',
    oldPriceMkd: 5850,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockCount: 24,
    compatibility: 'Универзална за сите скутери и моторцикли (ECE R22-06 Сертифицирана)',
    description: 'Модуларна flip-up кацига со вградени внатрешни сончеви очила (Drop-Down Sun Visor), повеќеканален систем за вентилација и антибактериска постава која се вади и пере.',
    specifications: {
      'Сертификат': 'ECE 22.06 & DOT Одобрена',
      'Визир': 'Анти-гребење поликарбонат со Pinlock припрема',
      'Материјал': 'ABS термопластична композитна школка',
      'Закопчување': 'Микрометарска метална брза копча',
      'Тежина': '1,550g ± 50g'
    },
    rating: 4.9,
    reviewsCount: 42
  },
  {
    id: 'helmet-hmc-urban-jet',
    name: 'HAMACHI Urban Open-Face Ѕвонеста Кацига',
    brand: 'HAMACHI',
    category: 'helmets',
    categoryLabel: 'Мото Кациги',
    priceMkd: 2460,
    priceMkdFormatted: '2.460 ден.',
    priceEur: 40,
    priceEurFormatted: '40 €',
    oldPriceMkd: 2990,
    image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockCount: 38,
    compatibility: 'Идеална за градски скутери 50cc - 125cc (Jog, Eagle, Symphony)',
    description: 'Лесна и комфорна отворена кацига со долг визир за заштита од ветер и инсекти. Совршено се собира во просторот под седиштето на повеќето скутери.',
    specifications: {
      'Сертификат': 'ECE 22.05 Европски Стандард',
      'Визир': 'Проѕирен долг длабок визир',
      'Материјал': 'High-Impact Polycarbonate',
      'Тежина': '1,050g'
    },
    rating: 4.8,
    reviewsCount: 31
  },
  {
    id: 'helmet-hmc-cross-enduro',
    name: 'HMC MX-Pro Крос / Ендуро Кацига со Штитник',
    brand: 'HMC',
    category: 'helmets',
    categoryLabel: 'Мото Кациги',
    priceMkd: 3995,
    priceMkdFormatted: '3.995 ден.',
    priceEur: 65,
    priceEurFormatted: '65 €',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockCount: 19,
    compatibility: 'За Cross, Enduro, Pit Bike и ATV возила',
    description: 'Агресивна крос кацига со прилагодлив штитник, подготвена за користење со мото крос очила (goggles). Вклучува заштитна мрежичка за филтрирање на прашина на брадата.',
    specifications: {
      'Сертификат': 'ECE 22.06',
      'Школка': 'Аеродинамична термопластика',
      'Вентилација': '6 предни отвори + 4 задни екстрактори'
    },
    rating: 4.9,
    reviewsCount: 28
  },

  // ==========================================
  // МОТОРНИ МАСЛА & МАЗИВА (OILS)
  // ==========================================
  {
    id: 'oil-motul-7100-10w40',
    name: 'MOTUL 7100 4T 10W-40 100% Synthetic (1L)',
    brand: 'MOTUL',
    category: 'oils',
    categoryLabel: 'Моторни Масла',
    priceMkd: 1045,
    priceMkdFormatted: '1.045 ден.',
    priceEur: 17,
    priceEurFormatted: '17 €',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockCount: 85,
    compatibility: 'Zontes, SYM, Kove, QJMotor, Yamaha, Honda 4-тактни мотори',
    description: '100% синтетичко моторно масло со Ester технологија за максимална заштита на агрегатот и мазно менување на брзините. Ги исполнува строгите JASO MA2 и API SP спецификации.',
    specifications: {
      'Вискозност': 'SAE 10W-40',
      'Квалитет': '100% Синтетичко (Ester Technology)',
      'Стандард': 'JASO MA2 / API SP',
      'Волумен': '1 Литар'
    },
    rating: 5.0,
    reviewsCount: 64
  },
  {
    id: 'oil-motul-scooter-expert-10w40',
    name: 'MOTUL Scooter Expert 4T 10W-40 MB (1L)',
    brand: 'MOTUL',
    category: 'oils',
    categoryLabel: 'Моторни Масла',
    priceMkd: 675,
    priceMkdFormatted: '675 ден.',
    priceEur: 11,
    priceEurFormatted: '11 €',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockCount: 120,
    compatibility: 'За сите 4T скутери: Hamachi Jog 3, Eagle, SYM Orbit, Jet 14, Joyride',
    description: 'Специјално развиено масло за 4-тактни скутери со автоматски CVT варијаторски пренос. Ја намалува потрошувачката на гориво и спречува прегревање при градски метеж.',
    specifications: {
      'Вискозност': '10W-40 Technosynthese',
      'Стандард': 'JASO MB / API SM/SL',
      'Пакување': '1L со прецизен инка-наставок'
    },
    rating: 4.9,
    reviewsCount: 57
  },
  {
    id: 'oil-motul-scooter-power-2t',
    name: 'MOTUL Scooter Power 2T Full Synthetic (1L)',
    brand: 'MOTUL',
    category: 'oils',
    categoryLabel: 'Моторни Масла',
    priceMkd: 799,
    priceMkdFormatted: '799 ден.',
    priceEur: 13,
    priceEurFormatted: '13 €',
    image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockCount: 45,
    compatibility: 'За 2-тактни скутери и мопеди со автоматско мешање или претходна мешавина',
    description: 'Анти-димно 100% синтетичко 2T масло кое спречува создавање јаглеродни наслаги на свеќицата и ауспухот.',
    specifications: {
      'Тип': '100% Синтетичко 2-Тактно Масло',
      'Стандард': 'JASO FD / ISO-L-EGD / API TC',
      'Карактеристики': 'Anti-Smoke формула'
    },
    rating: 4.9,
    reviewsCount: 39
  },

  // ==========================================
  // ГУМИ ЗА СКУТЕРИ И МОТОРИ (TIRES)
  // ==========================================
  {
    id: 'tire-cst-350-10-scooter',
    name: 'CST Tubeless Градска Гума 3.50-10 (За Jog 3 / Eagle)',
    brand: 'CST',
    category: 'tires',
    categoryLabel: 'Мото Гуми',
    priceMkd: 1540,
    priceMkdFormatted: '1.540 ден.',
    priceEur: 25,
    priceEurFormatted: '25 €',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockCount: 60,
    compatibility: 'Hamachi Jog 3, Sprint, Piaggio Zip, Кинески 50cc скутери со 10" тркала',
    description: 'Издржлива 4-слојна Tubeless гума со длабоки канали за брзо исфрлање на вода и одлично држење на сув и влажен асфалт.',
    specifications: {
      'Димензија': '3.50 - 10 (Tubeless)',
      'Индекс на носивост': '51J (до 195 kg / 100 km/h)',
      'Сезона': 'All-Season (Сите сезони)'
    },
    rating: 4.8,
    reviewsCount: 47
  },
  {
    id: 'tire-kenda-enduro-21-18-set',
    name: 'KENDA К-270 Dual Sport Ендуро Сет Гуми (21" Предна + 18" Задна)',
    brand: 'KENDA',
    category: 'tires',
    categoryLabel: 'Мото Гуми',
    priceMkd: 6765,
    priceMkdFormatted: '6.765 ден.',
    priceEur: 110,
    priceEurFormatted: '110 €',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockCount: 16,
    compatibility: 'EnduroMax 200, EnduroMax 250, Kove 450 Rally, Yamaha XT, Honda CRF',
    description: 'Комплет сет од две гуми (80/100-21 предна и 110/90-18 задна). Сооднос 50% асфалт / 50% оф-роуд.',
    specifications: {
      'Предна димензија': '80/100-21 51M TT',
      'Задна димензија': '110/90-18 61M TT',
      'Тип на шара': '50/50 Dual Sport Крампон'
    },
    rating: 5.0,
    reviewsCount: 18
  },

  // ==========================================
  // КУФЕРИ & ДОДАТНА ОПРЕМА (ACCESSORIES)
  // ==========================================
  {
    id: 'box-hmc-topbox-32l',
    name: 'HAMACHI Заден Мото Куфер 32L со Плоча за Монтажа',
    brand: 'HAMACHI',
    category: 'accessories',
    categoryLabel: 'Куфери & Опрема',
    priceMkd: 2215,
    priceMkdFormatted: '2.215 ден.',
    priceEur: 36,
    priceEurFormatted: '36 €',
    oldPriceMkd: 2600,
    image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockCount: 32,
    compatibility: 'Универзална монтажа на сите скутери и мотори со заден носач',
    description: 'Водонепропусен куфер со капацитет од 32 литри, доволен за сместување на 1 full-face кацига и јакна. Вклучува универзална метална плоча и 2 клуча.',
    specifications: {
      'Капацитет': '32 Литри (1 Full-Face Кацига)',
      'Материјал': 'Ојачан PP пластичен полимер отпорен на удари',
      'Рефлектор': 'Голем црвен безбедносен рефлектор',
      'Вклучено': 'Универзална плоча за брзо вадење (Quick Release)'
    },
    rating: 4.8,
    reviewsCount: 35
  },
  {
    id: 'glove-hmc-leather-summer',
    name: 'HMC Pro-Biker Карбонски Заштитни Ракавици',
    brand: 'HMC',
    category: 'apparel',
    categoryLabel: 'Јакни & Ракавици',
    priceMkd: 1475,
    priceMkdFormatted: '1.475 ден.',
    priceEur: 24,
    priceEurFormatted: '24 €',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockCount: 40,
    compatibility: 'Touchscreen компатибилни за користење на телефон/GPS',
    description: 'Летни прозрачни ракавици со тврди карбонски штитници на зглобовите и силиконски додатоци на дланките против пролизгување на рачките.',
    specifications: {
      'Заштита': 'Real Carbon Fiber Knuckle Protector',
      'Материјал': '3D Mesh дишечка ткаенина + Amara кожа',
      'Touchscreen': 'На показалецот и палецот'
    },
    rating: 4.9,
    reviewsCount: 52
  },

  // ==========================================
  // ОЕМ ДЕЛОВИ (PARTS)
  // ==========================================
  {
    id: 'part-hmc-carburetor-gy6-50',
    name: 'ОЕМ Карбуратор GY6 50cc со Автоматски Чок',
    brand: 'HMC OEM',
    category: 'parts',
    categoryLabel: 'Резервни Делови',
    priceMkd: 1720,
    priceMkdFormatted: '1.720 ден.',
    priceEur: 28,
    priceEurFormatted: '28 €',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockCount: 25,
    compatibility: 'За сите 4T 50cc скутери (Hamachi Jog 3, Eagle, Sprint, Baotian, Kymco)',
    description: 'Фабрички прецизно калибриран карбуратор комплет со електричен автоматски чок за лесно палење на ладно време.',
    specifications: {
      'Дијаметар': '19mm дифузер',
      'Чок': 'Автоматски електричен 12V чок',
      'Гаранција': '12 Месеци'
    },
    rating: 4.9,
    reviewsCount: 29
  },
  {
    id: 'part-hmc-cylinder-kit-80',
    name: 'HMC Big-Bore Цилиндар & Клип Кит 80cc (за GY6 50)',
    brand: 'HMC OEM',
    category: 'parts',
    categoryLabel: 'Резервни Делови',
    priceMkd: 2765,
    priceMkdFormatted: '2.765 ден.',
    priceEur: 45,
    priceEurFormatted: '45 €',
    image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockCount: 18,
    compatibility: 'Тјунинг надградба за 50cc 4T скутери за добивање +40% повеќе моќност',
    description: 'Комплетен тјунинг кит со кован клип 47mm, карики, боцна, осигурачи и гарнитура дихтунзи. Го зголемува вртежниот момент за совладување на нагорнини со 2 лица.',
    specifications: {
      'Дијаметар на клип': '47.0 mm (80cc)',
      'Вклучено': 'Цилиндар, клип, карики, боцна, дихтунзи',
      'Материјал': 'Висококвалитетен леано железо со хонувани ѕидови'
    },
    rating: 5.0,
    reviewsCount: 41
  }
];
