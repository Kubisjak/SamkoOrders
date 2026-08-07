/**
 * The restaurant menu.
 *
 * Every item is emoji-first on purpose: a kid who cannot read yet should still
 * be able to take an order. `name` holds both languages; see js/i18n.js.
 * Prices are play money ("coins"), always whole numbers so counting stays easy.
 */
window.MENU = {
  categories: [
    {
      id: 'drinks',
      emoji: '\u{1F964}',
      name: { sk: 'Nápoje', en: 'Drinks' },
      color: 'blue',
      items: [
        { id: 'water', emoji: '\u{1F4A7}', name: { sk: 'Voda', en: 'Water' }, price: 1 },
        { id: 'juice', emoji: '\u{1F9C3}', name: { sk: 'Džús', en: 'Juice' }, price: 2 },
        { id: 'milk', emoji: '\u{1F95B}', name: { sk: 'Mlieko', en: 'Milk' }, price: 2 },
        { id: 'lemonade', emoji: '\u{1F34B}', name: { sk: 'Limonáda', en: 'Lemonade' }, price: 3 },
        { id: 'cocoa', emoji: '☕', name: { sk: 'Kakao', en: 'Cocoa' }, price: 3 },
        { id: 'smoothie', emoji: '\u{1F9CB}', name: { sk: 'Smoothie', en: 'Smoothie' }, price: 4 }
      ]
    },
    {
      id: 'mains',
      emoji: '\u{1F355}',
      name: { sk: 'Hlavné jedlá', en: 'Main dishes' },
      color: 'red',
      items: [
        { id: 'pizza', emoji: '\u{1F355}', name: { sk: 'Pizza', en: 'Pizza' }, price: 8 },
        { id: 'burger', emoji: '\u{1F354}', name: { sk: 'Burger', en: 'Burger' }, price: 7 },
        { id: 'spaghetti', emoji: '\u{1F35D}', name: { sk: 'Špagety', en: 'Spaghetti' }, price: 7 },
        { id: 'hotdog', emoji: '\u{1F32D}', name: { sk: 'Hot dog', en: 'Hot dog' }, price: 5 },
        { id: 'chicken', emoji: '\u{1F357}', name: { sk: 'Kurča', en: 'Chicken' }, price: 8 },
        { id: 'sushi', emoji: '\u{1F363}', name: { sk: 'Suši', en: 'Sushi' }, price: 9 },
        { id: 'taco', emoji: '\u{1F32E}', name: { sk: 'Taco', en: 'Taco' }, price: 6 },
        { id: 'sandwich', emoji: '\u{1F96A}', name: { sk: 'Sendvič', en: 'Sandwich' }, price: 5 },
        { id: 'soup', emoji: '\u{1F372}', name: { sk: 'Polievka', en: 'Soup' }, price: 4 },
        { id: 'pancakes', emoji: '\u{1F95E}', name: { sk: 'Palacinky', en: 'Pancakes' }, price: 6 }
      ]
    },
    {
      id: 'sides',
      emoji: '\u{1F35F}',
      name: { sk: 'Prílohy', en: 'Sides' },
      color: 'green',
      items: [
        { id: 'fries', emoji: '\u{1F35F}', name: { sk: 'Hranolky', en: 'Fries' }, price: 3 },
        { id: 'salad', emoji: '\u{1F957}', name: { sk: 'Šalát', en: 'Salad' }, price: 3 },
        { id: 'bread', emoji: '\u{1F956}', name: { sk: 'Chlieb', en: 'Bread' }, price: 2 },
        { id: 'corn', emoji: '\u{1F33D}', name: { sk: 'Kukurica', en: 'Corn' }, price: 2 },
        { id: 'egg', emoji: '\u{1F373}', name: { sk: 'Vajíčko', en: 'Egg' }, price: 2 },
        { id: 'cheese', emoji: '\u{1F9C0}', name: { sk: 'Syr', en: 'Cheese' }, price: 3 }
      ]
    },
    {
      id: 'sweets',
      emoji: '\u{1F366}',
      name: { sk: 'Sladkosti', en: 'Sweets' },
      color: 'pink',
      items: [
        { id: 'icecream', emoji: '\u{1F366}', name: { sk: 'Zmrzlina', en: 'Ice cream' }, price: 4 },
        { id: 'cake', emoji: '\u{1F370}', name: { sk: 'Torta', en: 'Cake' }, price: 5 },
        { id: 'donut', emoji: '\u{1F369}', name: { sk: 'Šiška', en: 'Donut' }, price: 3 },
        { id: 'cookie', emoji: '\u{1F36A}', name: { sk: 'Sušienka', en: 'Cookie' }, price: 2 },
        { id: 'candy', emoji: '\u{1F36C}', name: { sk: 'Cukrík', en: 'Candy' }, price: 1 },
        { id: 'chocolate', emoji: '\u{1F36B}', name: { sk: 'Čokoláda', en: 'Chocolate' }, price: 4 },
        { id: 'strawberry', emoji: '\u{1F353}', name: { sk: 'Jahody', en: 'Strawberries' }, price: 4 },
        { id: 'watermelon', emoji: '\u{1F349}', name: { sk: 'Melón', en: 'Watermelon' }, price: 3 }
      ]
    }
  ],

  /** Tables the little waiter can serve. Each gets an animal so it is recognisable without reading. */
  tables: [
    { id: 1, emoji: '\u{1F984}' },
    { id: 2, emoji: '\u{1F98A}' },
    { id: 3, emoji: '\u{1F433}' },
    { id: 4, emoji: '\u{1F996}' },
    { id: 5, emoji: '\u{1F438}' },
    { id: 6, emoji: '\u{1F41D}' }
  ]
};

/** Flat id -> item lookup, so a saved order only has to store ids and quantities. */
window.MENU.byId = window.MENU.categories.reduce(function (acc, cat) {
  cat.items.forEach(function (item) {
    acc[item.id] = Object.assign({ categoryId: cat.id, color: cat.color }, item);
  });
  return acc;
}, {});
