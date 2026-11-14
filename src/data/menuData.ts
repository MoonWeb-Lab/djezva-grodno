import type { MenuCategory, MenuItem, ModifierOption } from '../types/menu';

export const MENU_CATEGORIES: MenuCategory[] = [
  { id: 'all', label: 'Всё меню' },
  { id: 'pancakes', label: 'Блинная во дворике' },
  { id: 'breakfasts', label: 'Завтраки и драники' },
  { id: 'sand-coffee', label: 'Кофе на песке' },
  { id: 'author-bar', label: 'Авторский бар' },
];

export const COMMON_MILK_OPTIONS: ModifierOption[] = [
  { id: 'oat', label: 'Овсяное молоко', price: 1.5 },
  { id: 'coconut', label: 'Кокосовое молоко', price: 1.5 },
  { id: 'almond', label: 'Миндальное молоко', price: 1.5 },
];

export const COMMON_SYRUP_OPTIONS: ModifierOption[] = [
  { id: 'caramel', label: 'Солёная карамель', price: 1.5 },
  { id: 'lavender', label: 'Лавандовый сироп', price: 1.5 },
  { id: 'hazelnut', label: 'Ореховый фундук', price: 1.5 },
  { id: 'vanilla', label: 'Натуральная ваниль', price: 1.5 },
];

export const FOOD_ADDON_OPTIONS: ModifierOption[] = [
  { id: 'sour-cream', label: 'Домашняя сметана', price: 1.5 },
  { id: 'cheese-sauce', label: 'Сливочно-сырный соус', price: 1.5 },
  { id: 'onion-jam', label: 'Пряный луковый джем', price: 1.5 },
  { id: 'parmesan', label: 'Тертый пармезан', price: 1.5 },
];

export const MENU_ITEMS: MenuItem[] = [
  // -----------------------------------------------------------
  // Блинная во дворике
  // -----------------------------------------------------------
  {
    id: 'crepe-bolognese',
    title: 'Креп Болоньезе с печеными черри, пармезаном и моцареллой',
    category: 'pancakes',
    description: 'Сытный французский креп с домашним мясным соусом болоньезе, запечёнными томатами черри, тягучей моцареллой и выдержанным пармезаном.',
    weight: '400 г',
    basePrice: 25,
    badge: '★ ВЫБОР ДЖЕЗВЫ',
    pairing: 'Идеально с: Капучино 300 мл',
    image: '/images/crepe-bolognese.jpg',
    imagePosition: 'center 40%',
    options: {
      addons: FOOD_ADDON_OPTIONS,
    },
  },
  {
    id: 'crepe-salmon',
    title: 'Креп с лососем гравлакс, шпинатом и сливочным муссом',
    category: 'pancakes',
    description: 'Тончайший креп с нежным слабосоленым лососем гравлакс собственного посола, свежими листьями шпината и взбитым сливочным муссом с цедрой лайма.',
    weight: '200 г',
    basePrice: 18,
    pairing: 'Идеально с: Флэт Уайт',
    image: '/images/crepe-salmon.jpg',
    imagePosition: 'center 50%',
    options: {
      addons: FOOD_ADDON_OPTIONS,
    },
  },
  {
    id: 'crepe-suzette',
    title: 'Креп Сюзетт с апельсиновым соусом и карамелизированным грецким орехом',
    category: 'pancakes',
    description: 'Классические французские крепы, пропитанные густым апельсиновым соусом с карамелью и хрустящим пряным грецким орехом.',
    weight: '400 г',
    basePrice: 20,
    pairing: 'Идеально с: Джезва на песке',
    options: {
      addons: [
        { id: 'extra-nuts', label: 'Доп. карамельные орехи', price: 2.0 },
        { id: 'extra-sauce', label: 'Доп. апельсиновый соус', price: 1.5 },
      ],
    },
  },
  {
    id: 'pancakes-bacon',
    title: 'Панкейки с беконом, жареным яйцом и кукурузой в сырном соусе',
    category: 'pancakes',
    description: 'Пышные американские панкейки с хрустящими полосками обжаренного бекона, глазуньей и сладкой кукурузой под теплым сырным соусом.',
    weight: '360 г',
    basePrice: 18,
    pairing: 'Идеально с: Фильтр-кофе',
    image: '/images/pancakes-bacon.jpg',
    imagePosition: 'center 60%',
    options: {
      addons: FOOD_ADDON_OPTIONS,
    },
  },
  {
    id: 'pancakes-cinnabon',
    title: 'Панкейки Синнабон с карамелизированной грушей',
    category: 'pancakes',
    description: 'Воздушная стопка панкейков с ванильно-сливочным кремом, томленой в корице грушей и стружкой ароматной корицы.',
    weight: '320 г',
    basePrice: 18,
    pairing: 'Идеально с: Раф с розовой солью',
    image: '/images/pancakes-cinnabon.jpg',
    imagePosition: 'center 65%',
    options: {
      addons: [
        { id: 'extra-cream', label: 'Доп. ванильный крем', price: 1.5 },
        { id: 'extra-pear', label: 'Доп. томленая груша', price: 2.0 },
      ],
    },
  },
  {
    id: 'pancake-cake',
    title: 'Блинный торт в ассортименте',
    category: 'pancakes',
    description: 'Многослойный десерт из нежнейших крепов со сливочно-заварным кремом и ягодными прослойками. Выпекается шеф-кондитером по выходным.',
    weight: '150 г',
    basePrice: 12,
    badge: 'ТОЛЬКО ПТ–ВС',
    pairing: 'Идеально с: Матча малина-фисташка',
    options: {
      addons: [
        { id: 'berry-coulis', label: 'Ягодный кули', price: 1.5 },
      ],
    },
  },

  // -----------------------------------------------------------
  // Завтраки и драники
  // -----------------------------------------------------------
  {
    id: 'draniki-mushrooms',
    title: 'Драники с грибами в сливочном соусе и луковым джемом',
    category: 'breakfasts',
    description: 'Золотистые хрустящие драники по фирменному гродненскому рецепту с лесными грибами в густых сливках и пряным карамельным луковым джемом.',
    weight: '310 г',
    basePrice: 25,
    badge: '★ ВЫБОР ДЖЕЗВЫ',
    pairing: 'Идеально с: Крафтовый чай',
    image: '/images/draniki-mushrooms.jpg',
    imagePosition: 'center 60%',
    options: {
      addons: FOOD_ADDON_OPTIONS,
    },
  },
  {
    id: 'draniki-pork',
    title: 'Драники с томленой свининой в горчичном соусе',
    category: 'breakfasts',
    description: 'Стопка румяных драников со сочной рваной свининой длительного томления, пикантным французским горчичным соусом и хрустящим маринованным огурчиком.',
    weight: '350 г',
    basePrice: 22,
    pairing: 'Идеально с: Питерский фильтр-кофе',
    image: '/images/draniki-pork.jpg',
    imagePosition: 'center 50%',
    options: {
      addons: FOOD_ADDON_OPTIONS,
    },
  },
  {
    id: 'bagel-salmon',
    title: 'Нью-Йоркский бейгл с лососем-терияки, сыром рикотта и миксом зелени',
    category: 'breakfasts',
    description: 'Свежеиспеченный бейгл собственного производства, посыпанный кунжутом, с нежным лососем в соусе терияки, фермерской рикоттой и свежей руколой.',
    weight: '260 г',
    basePrice: 18,
    pairing: 'Идеально с: Капучино с карамелью',
    image: '/images/bagel-salmon.jpg',
    imagePosition: 'center 45%',
    options: {
      addons: FOOD_ADDON_OPTIONS,
    },
  },
  {
    id: 'syrniki-cherry',
    title: 'Сырники от Энди с пряной вишней и взбитой сгущенкой',
    category: 'breakfasts',
    description: 'Нежные творожные сырники с бархатистой серединкой, подаются на подушке из взбитой вареной сгущенки с пряной вишней и тертым шоколадом.',
    weight: '280 г',
    basePrice: 16,
    pairing: 'Идеально с: Латте 350 мл',
    image: '/images/syrniki-cherry.jpg',
    imagePosition: 'center 55%',
    options: {
      addons: [
        { id: 'sour-cream', label: 'Домашняя сметана', price: 1.5 },
        { id: 'extra-cherry', label: 'Доп. порция вишни', price: 2.0 },
      ],
    },
  },
  {
    id: 'croissant-salmon',
    title: 'Французский круассан с лососем-терияки и рикоттой',
    category: 'breakfasts',
    description: 'Хрустящий масляный слоеный круассан, наполненный нежным лососем терияки, сливочной рикоттой и свежей салатной зеленью.',
    weight: '210 г',
    basePrice: 12,
    badge: 'ВЫПЕКАЕМ ДО 14:00',
    pairing: 'Идеально с: Флэт Уайт',
    image: '/images/croissant-salmon.jpg',
    imagePosition: 'center 50%',
    options: {
      addons: FOOD_ADDON_OPTIONS,
    },
  },

  // -----------------------------------------------------------
  // Кофе на песке
  // -----------------------------------------------------------
  {
    id: 'cezve-classic',
    title: 'Джезва Классика (кофе по-восточному на песке)',
    category: 'sand-coffee',
    description: 'Свежемолотые зерна тонкого помола, сваренные в медной джезве на раскаленном кварцевом песке. Плотное тело, бархатная пенка и долгое послевкусие.',
    volume: '130 мл',
    basePrice: 7,
    badge: 'ТОЛЬКО У НАС',
    pairing: 'Классическая подача на горячем песке',
    options: {
      syrups: COMMON_SYRUP_OPTIONS,
    },
  },
  {
    id: 'cezve-caramel',
    title: 'Джезва с тростниковой карамелью',
    category: 'sand-coffee',
    description: 'Кофе на раскаленном песке с добавлением нерафинированного тростникового сахара, образующего карамельный оттенок в процессе медленного закипания.',
    volume: '130 мл',
    basePrice: 8,
    pairing: 'Сварен в турке на песке',
    options: {
      syrups: COMMON_SYRUP_OPTIONS,
    },
  },
  {
    id: 'cappuccino',
    title: 'Капучино',
    category: 'sand-coffee',
    description: 'Идеальный баланс насыщенного эспрессо и шелковистой молочной пены с естественной сладостью.',
    volume: '180 / 300 мл',
    basePrice: 6,
    pairing: 'Идеальная классика к сырникам и круассанам',
    options: {
      volumes: [
        { label: 'Стандарт', volume: '180 мл', price: 6 },
        { label: 'Большой', volume: '300 мл', price: 8 },
      ],
      milk: COMMON_MILK_OPTIONS,
      syrups: COMMON_SYRUP_OPTIONS,
    },
  },
  {
    id: 'pine-cappuccino',
    title: 'Кедровый капучино',
    category: 'sand-coffee',
    description: 'Фирменный хит кофейни: двойной эспрессо с кедровым молочком, нежной пенкой и дроблеными сибирскими кедровыми орешками.',
    volume: '180 / 300 мл',
    basePrice: 8,
    pairing: 'Неповторимый смолисто-ореховый аромат',
    options: {
      volumes: [
        { label: 'Стандарт', volume: '180 мл', price: 8 },
        { label: 'Большой', volume: '300 мл', price: 10 },
      ],
      milk: COMMON_MILK_OPTIONS,
      syrups: COMMON_SYRUP_OPTIONS,
    },
  },

  // -----------------------------------------------------------
  // Авторский бар
  // -----------------------------------------------------------
  {
    id: 'raf-borovik',
    title: 'Раф «Боровик»',
    category: 'author-bar',
    description: 'Уникальный авторский напиток на сливках с экстрактом белого гриба, тростниковым сахаром и щепоткой лесной соли.',
    volume: '220 мл',
    basePrice: 8.5,
    badge: 'СЕЗОННОЕ',
    pairing: 'Фирменный осенний рецепт',
    options: {
      milk: COMMON_MILK_OPTIONS,
      syrups: COMMON_SYRUP_OPTIONS,
    },
  },
  {
    id: 'black-latte',
    title: 'Black латте с кунжутной пастой',
    category: 'author-bar',
    description: 'Эффектный темный латте с пастой из черного кунжута тахини, сливочным молоком и легкой карамельной ноткой.',
    volume: '250 мл',
    basePrice: 9,
    badge: 'ХИТ',
    pairing: 'Насыщенный ореховый профиль',
    options: {
      milk: COMMON_MILK_OPTIONS,
      syrups: COMMON_SYRUP_OPTIONS,
    },
  },
  {
    id: 'lemon-poppy-coffee',
    title: 'Лимонно-маковый крем-кофе',
    category: 'author-bar',
    description: 'Сливочный кофе с добавлением лимонного курда и маковых зерен. Текстурный, шелковистый и освежающе-десертный.',
    volume: '250 мл',
    basePrice: 9.5,
    pairing: 'Нежная цитрусово-маковая пенка',
    options: {
      milk: COMMON_MILK_OPTIONS,
    },
  },
  {
    id: 'matcha-raspberry-pistachio',
    title: 'Матча малина-фисташка',
    category: 'author-bar',
    description: 'Церемониальный японский чай матча с натуральной фисташковой пастой и ярким соусом из свежей малины.',
    volume: '220 мл',
    basePrice: 11,
    pairing: 'Ягодный баланс и фисташковая паста',
    options: {
      milk: COMMON_MILK_OPTIONS,
    },
  },
  {
    id: 'seabuckthorn-punch',
    title: 'Пунш облепиховый безалкогольный',
    category: 'author-bar',
    description: 'Натуральная алтайская облепиха, свежий имбирь, корица, бадьян и цитрусовый мед. Подается согревающим и ароматным.',
    volume: '250 мл',
    basePrice: 8,
    pairing: 'Согревающий витаминный напиток',
    options: {
      addons: [
        { id: 'extra-honey', label: 'Доп. порция меда', price: 1.0 },
      ],
    },
  },
];
