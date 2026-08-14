import { ServicePackage } from '../types';

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'dyno-tuning-pro',
    name: 'Овластен Сервис: Редовно Одржување & Дијагностика',
    category: 'maintenance',
    priceEstimateMkd: '2.400 - 4.800 ден.',
    priceEstimateEur: '€ 40 - € 80',
    duration: '2 - 3 Часа',
    isoStandard: 'ISO 9001:2015 / HEMIMOTOR Standard',
    description: 'Комплетна замена на моторно масло Motul 4T, OEM филтри за масло и воздух, проверка на свеќица, кочници, притисок во гуми и компјутерска дијагностика.',
    benefits: [
      'Оригинално моторно масло Motul 7100 / 5100 со фабрички стандард',
      'Проверка на 28 безбедносни точки и кочион систем',
      'Чистење и проверка на филтер за воздух и гориво',
      'Запис во електронската сервисна книшка на HEMIMOTOR'
    ],
    equipmentUsed: 'Texa Navigator TXB Diagnostic + Motul Oil Filling System',
    recommendedInterval: 'На секои 3.000 - 5.000 km или еднаш годишно',
    warrantyMonths: 12
  },
  {
    id: 'cvt-transmission-service',
    name: 'Ревизија & Замена на CVT Пренос (Скутери 50cc - 400cc)',
    category: 'maintenance',
    priceEstimateMkd: '1.800 - 3.900 ден.',
    priceEstimateEur: '€ 30 - € 65',
    duration: '1 - 2 Часа',
    isoStandard: 'OEM Hamachi / SYM Certified Protocol',
    description: 'Преглед и замена на погонски ремен (Bando/Mitsuboshi), варијаторски ролни, лизгачи, проверка на ламели и централна пружина за рамномерно забрзување.',
    benefits: [
      'Елиминирање на тресење и пролизгување при тргнување',
      'Оптимален преносен сооднос и максимална крајна брзина',
      'Оригинални кевларски и армирани погонски ремени',
      'Тестирање на преносот на валци пред предавање на возилото'
    ],
    equipmentUsed: 'Pneumatic Clutch Tool + Micrometer Pulley Gauge',
    recommendedInterval: 'На секои 6.000 - 10.000 km',
    warrantyMonths: 12
  },
  {
    id: 'ecu-telemetry-diagnostic',
    name: 'Компјутерска Дијагностика & Софтверски Update',
    category: 'ecu-telemetry',
    priceEstimateMkd: '1.200 - 2.500 ден.',
    priceEstimateEur: '€ 20 - € 40',
    duration: '45 Минути',
    isoStandard: 'Bosch / Delphi Electronic Diagnostic Protocol',
    description: 'Длабинско читање на грешки во контролните модули на Zontes, SYM, Kove, QJMotor, ресетирање на сервисен интервал и ажурирање на софтвер на EFI вбризгувањето.',
    benefits: [
      'Директно поврзување со овластените фабрички сервери',
      'Ажурирање на софтверски мапи за порамномерна работа на празен од',
      'Калибрација на TPS сензори и сонда за кислород',
      'Печатен дијагностички протокол'
    ],
    equipmentUsed: 'Texa & OEM Zontes/SYM KTS Diagnostic Tablets',
    recommendedInterval: 'При секој редовен сервис или при запалена сервисна ламбичка',
    warrantyMonths: 6
  },
  {
    id: 'brakes-suspension-overhaul',
    name: 'Кочион Систем, Суспензија & Сезонска Подготовка',
    category: 'overhaul',
    priceEstimateMkd: '2.800 - 5.500 ден.',
    priceEstimateEur: '€ 45 - € 90',
    duration: '2 - 4 Часа',
    isoStandard: 'ECE R78 Braking Safety Standard',
    description: 'Замена на предни и задни кочиони плочки, проверка на дискови, промена на кочиона течност Motul DOT 4/5.1 со вакуум, балансирање на тркала и тест на суспензија.',
    benefits: [
      'Максимална сопирачка моќ и скратен пат на сопирање',
      'Безбедност во сите временски услови со нова хидраулична течност',
      'Оригинални органски и синтерувани плочки',
      'Писмена потврда за исправност на сопирачките'
    ],
    equipmentUsed: 'Pneumatic Brake Bleeder + Dynamic Wheel Balancer',
    recommendedInterval: 'Сезонски (на пролет и есен) или на секои 8.000 km',
    warrantyMonths: 12
  }
];
