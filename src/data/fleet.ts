import { FleetTier, CaseStudy, Testimonial } from '../types';

export const FLEET_TIERS: FleetTier[] = [
  {
    id: 'starter-fleet',
    name: 'Logistics Fleet 5-15',
    subtitle: 'За курирски служби и локална брза достава',
    targetAudience: 'Курирски компании, ресторани со сопствена достава, патроли',
    baseMonthlyRatePerUnit: '€ 149 / месечно по мотор',
    recommendedFleetSize: '5 - 15 Мотори',
    slaResponseTime: 'Максимум 4 часа на локација',
    features: [
      'Вклучен редовен сервис на секои 4,000 km',
      'Замена на потрошни материјали (плочки, гуми, филтри, свеќици)',
      'GPS & CAN-Bus телеметрија за следење на флотата',
      'Заменско возило во рок од 6 часа при поголем дефект',
      'Квартален безбедносен извештај за секој возач'
    ],
    includedMaintenance: '100% Вклучени Работни Часови и OEM Делови',
    telemetryIntegration: true
  },
  {
    id: 'enterprise-fleet',
    name: 'Enterprise Fleet 16-50+',
    subtitle: 'Индустриски пакет за корпорации и логистички центри',
    targetAudience: 'Големи дистрибутивни мрежи, телеком оператори, полициски единици',
    baseMonthlyRatePerUnit: '€ 119 / месечно по мотор',
    recommendedFleetSize: '16 - 50+ Мотори',
    slaResponseTime: 'Гарантиран SLA од 2 часа + 24/7 Мобилна Работилница',
    features: [
      'Директна мобилна сервисна единица на вашата локација за превентивен сервис',
      'Постојана резерва од 10% заменски мотори во вашиот двор',
      'Целосно покриени сите трошоци за редовно и вонредно одржување',
      'Интеграција на API со вашиот ERP/TMS логистички софтвер',
      'Годишна обука за безбедно и економично возење од овластени инструктори'
    ],
    includedMaintenance: 'Сеопфатен Full-Cover + Заменски Возила на Лице Место',
    telemetryIntegration: true
  },
  {
    id: 'custom-institutional',
    name: 'Institutional & Government Tender',
    subtitle: 'Специјализирани флоти за државни органи и спасувачки тимови',
    targetAudience: 'Министерства, полициски патроли, итни медицински служби',
    baseMonthlyRatePerUnit: 'Индивидуална Тендерска Спецификација',
    recommendedFleetSize: 'Неограничено',
    slaResponseTime: 'Критичен приоритет (1 час во Скопје / 2 часа низ државата)',
    features: [
      'Монтажа на специјална полициска/медицинска сигнализација и радио-врска',
      'Балистичка и механичка заштита на виталните склопови на агрегатот',
      'Обука за тактичко возење во екстремни временски услови',
      'Депо на оригинални OEM делови гарантирано достапни во секој момент',
      'Официјален ISO 9001 & NATO сертифициран протокол за одржување'
    ],
    includedMaintenance: '24/7 Дежурен Инженерски Тим & Посебен Корпоративен Менаџер',
    telemetryIntegration: true
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'dhl-regional-fleet',
    client: 'DHL Express Regional Logistics',
    logoText: 'DHL EXPRESS',
    industry: 'Меѓународна Логистика & Экспрес Достава',
    projectScope: 'Имплементација на 32 Metropolis Fleet 400 PRO моторцикли со целосен 36-месечен Full-Service договор и телеметриско следење.',
    unitsDeployed: 32,
    uptimeAchieved: '99.84%',
    maintenanceCostSaved: '38.5%',
    quote: '„Соработката со HEMIMOTOR го револуционизираше нашиот возен парк. Времето на застој на моторите се намали од 14 дена годишно на практично нула благодарение на нивната превентивна телеметрија и брза замена.“',
    author: 'Александар Стојановски',
    authorRole: 'Head of Regional Fleet Operations'
  },
  {
    id: 'rapid-medical-response',
    client: 'Национална Служба за Итна Медицинска Помош',
    logoText: 'MED-RAPID MK',
    industry: 'Итни Медицински Интервенции',
    projectScope: 'Набавка и специјална модификација на 14 Expedition 1290 мотори со дефибрилатори, кислородни системи и ласерски калибрирана суспензија.',
    unitsDeployed: 14,
    uptimeAchieved: '100.0%',
    maintenanceCostSaved: '42.0%',
    quote: '„Кога секоја секунда е прашање на живот или смрт, не смее да има сомнеж во сигурноста на моторот. HEMIMOTOR обезбеди европски стандард кој спасува животи на секојдневна основа.“',
    author: 'Д-р Марко Василев',
    authorRole: 'Координатор на Единица за Брз Одговор'
  },
  {
    id: 'balkan-superbike-team',
    client: 'Apex Balkan Racing Team',
    logoText: 'APEX RACING',
    industry: 'Професионален Мотоспорт (FIM Europe Superstock 1000)',
    projectScope: 'Dyno развој на агрегат, ECU мапирање и ласерска геометрија на шасија за 4 натпреварувачки HEMIMOTOR Corsa 1100 RR мотори.',
    unitsDeployed: 4,
    uptimeAchieved: '100% Finish Rate',
    maintenanceCostSaved: '5 Победнички Подиуми во 2024',
    quote: '„Нивната сервисна лабораторија и SuperFlow дино-бенчот се рамо до рамо со најдобрите тимови во Италија. Прецизноста во подесувањето ни донесе 3 шампионски титули.“',
    author: 'Петар Ѓорѓиев',
    authorRole: 'Chief Race Engineer & Team Principal'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    author: 'Игор Митревски',
    role: 'Сопственик на транспортна флота',
    organization: 'SpeedBox Express',
    comment: 'Купивме 12 комерцијални мотори за нашиот логистички центар. Нивното B2B одржување е без конкуренција во Македонија и регионот. Секој сервис се завршува за помалку од 3 часа.',
    rating: 5,
    projectType: 'B2B Возен Парк'
  },
  {
    id: 'test-2',
    author: 'Бојан Костов',
    role: 'Професионален Возач & Ентузијаст',
    organization: 'Superbike Club Skopje',
    comment: 'Мојот Corsa 1100 RR помина низ нивниот Dyno тјунинг центар. Разликата во мазноста на гасот и моќта на задниот точак е неверојатна. Навистина европско ниво на стручност.',
    rating: 5,
    projectType: 'Dyno Tuning & Сервис'
  },
  {
    id: 'test-3',
    author: 'Дамјан Трајков',
    role: 'Директор за Набавки',
    organization: 'Securitas Guarding MK',
    comment: 'Транспарентност во фактурирањето, 100% оригинални OEM делови со декларација и беспрекорна комуникација. Секој денар инвестиран во HEMIMOTOR вреди повеќекратно.',
    rating: 5,
    projectType: 'Корпоративна Флота'
  }
];

export const COMPARISON_POINTS = [
  {
    feature: 'Сертификација & Стандарди',
    standard: 'Обични локални мајстори без меѓународна сертификација',
    hemimotor: 'Официјален ISO 9001:2015 + TÜV Rheinland Овластен Сервисен Центар',
    important: true
  },
  {
    feature: 'Дијагностичка Опрема',
    standard: 'Универзални OBD читачи со ограничен софтверски пристап',
    hemimotor: 'Фабрички BOSCH KTS 590 Pro + Овластени OEM дијагностички софтвери за директно ECU кодирање',
    important: true
  },
  {
    feature: 'Тестирање на Моќност & Агрегат',
    standard: 'Тестирање „на уво“ и пробно возење на улица',
    hemimotor: 'Роботизиран SuperFlow AutoDyn дино-бенч со широкопојасна телеметрија и печатен извештај',
    important: true
  },
  {
    feature: 'Потекло на Резервни Делови',
    standard: 'Непроверени замени од трети страни со непознат квалитет',
    hemimotor: '100% Фабрички Оригинални OEM и Racing компоненти со сертификат за потекло и фабричка гаранција',
    important: true
  },
  {
    feature: 'Геометрија на Шасија',
    standard: 'Визуелна оцена со линијар или канап',
    hemimotor: 'Scheibner 3D Ласерско Мерење на рамка и вилушки со точност до 0.05 mm',
    important: true
  },
  {
    feature: 'B2B Договори & SLA',
    standard: 'Без гаранција за време на поправка и без заменски мотори',
    hemimotor: 'Писмен SLA со интервенција во рок од 2-4 часа и обезбедени заменски возила на лице место',
    important: true
  },
  {
    feature: 'Писмена Гаранција',
    standard: 'Усна гаранција без правна сигурност',
    hemimotor: 'Официјална писмена гаранција од 12 до 36 месеци за секој сервис и вграден дел',
    important: true
  }
];
