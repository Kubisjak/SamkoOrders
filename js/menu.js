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
        { id: 'smoothie', emoji: '\u{1F9CB}', name: { sk: 'Smoothie', en: 'Smoothie' }, price: 4 },
        { id: 'cola', emoji: '\u{1F964}', name: { sk: 'Kola', en: 'Cola' }, price: 3 }
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
      // Not the ice cream cone any more — that belongs to the counter below,
      // and on phones (where category labels are hidden) two identical emoji
      // would be indistinguishable.
      emoji: '\u{1F36C}',
      name: { sk: 'Sladkosti', en: 'Sweets' },
      color: 'pink',
      items: [
        { id: 'cake', emoji: '\u{1F370}', name: { sk: 'Torta', en: 'Cake' }, price: 5 },
        { id: 'donut', emoji: '\u{1F369}', name: { sk: 'Šiška', en: 'Donut' }, price: 3 },
        { id: 'cookie', emoji: '\u{1F36A}', name: { sk: 'Sušienka', en: 'Cookie' }, price: 2 },
        { id: 'candy', emoji: '\u{1F36C}', name: { sk: 'Cukrík', en: 'Candy' }, price: 1 },
        { id: 'chocolate', emoji: '\u{1F36B}', name: { sk: 'Čokoláda', en: 'Chocolate' }, price: 4 },
        { id: 'strawberry', emoji: '\u{1F353}', name: { sk: 'Jahody', en: 'Strawberries' }, price: 4 },
        { id: 'watermelon', emoji: '\u{1F349}', name: { sk: 'Melón', en: 'Watermelon' }, price: 3 }
      ]
    },
    {
      // No item list: this category opens the ice cream builder instead of a
      // grid. Kept last so the other four never move — Samko navigates by
      // position as much as by picture.
      id: 'icecream',
      emoji: '\u{1F366}',
      name: { sk: 'Zmrzlina', en: 'Ice cream' },
      color: 'cream',
      builder: true,
      items: []
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

/**
 * The ice cream counter. Flavours carry a colour as well as an icon, because
 * the whole point is that a scoop of pistachio is recognisably green in the
 * cone being built on screen.
 *
 * `colour` is the body of the scoop and `shade` its underside — the pair is
 * what stops the stack looking like flat circles.
 */
window.MENU.iceCream = {
  maxScoops: 3,
  scoopPrice: 2,

  vessels: [
    { id: 'cone', emoji: '\u{1F366}', name: { sk: 'Kornútok', en: 'Cone' }, price: 1 },
    { id: 'waffle', emoji: '\u{1F9C7}', name: { sk: 'Veľký kornútok', en: 'Big cone' }, price: 2 },
    { id: 'cup', emoji: '\u{1F963}', name: { sk: 'Pohár', en: 'Cup' }, price: 1 }
  ],

  flavours: [
    { id: 'vanilla', emoji: '\u{1F33C}', name: { sk: 'Vanilková', en: 'Vanilla' }, colour: '#f7e7b6', shade: '#e3cd8d' },
    { id: 'chocolate', emoji: '\u{1F36B}', name: { sk: 'Čokoládová', en: 'Chocolate' }, colour: '#7b4a2d', shade: '#5d3520' },
    { id: 'pistachio', emoji: '\u{1F95C}', name: { sk: 'Pistáciová', en: 'Pistachio' }, colour: '#aed894', shade: '#87b76c' },
    { id: 'rice', emoji: '\u{1F35A}', name: { sk: 'Ryžová', en: 'Rice' }, colour: '#fdf7ea', shade: '#e4d9c2' },
    // Šmolková — named after Šmolkovia (Šmoulové, the Smurfs), and so bright
    // blue. Kept in the adjective form the other flavours use.
    { id: 'smolkova', emoji: '\u{1F499}', name: { sk: 'Šmolková', en: 'Smurf' }, colour: '#4fb3f0', shade: '#2b87c9' },
    { id: 'strawberry', emoji: '\u{1F353}', name: { sk: 'Jahodová', en: 'Strawberry' }, colour: '#f7a8ba', shade: '#e07d95' },
    { id: 'blueberry', emoji: '\u{1FAD0}', name: { sk: 'Čučoriedková', en: 'Blueberry' }, colour: '#9b86d4', shade: '#7963b3' },
    { id: 'lemon', emoji: '\u{1F34B}', name: { sk: 'Citrónová', en: 'Lemon' }, colour: '#fbeb8f', shade: '#e6d158' },
    { id: 'mint', emoji: '\u{1F33F}', name: { sk: 'Mätová', en: 'Mint' }, colour: '#a6e3ce', shade: '#7cc7ac' },
    { id: 'caramel', emoji: '\u{1F36E}', name: { sk: 'Karamelová', en: 'Caramel' }, colour: '#dda45f', shade: '#bd8340' },
    { id: 'cookies', emoji: '\u{1F36A}', name: { sk: 'Oreo', en: 'Cookies & cream' }, colour: '#e9e3d8', shade: '#b9b0a2' },
    { id: 'mango', emoji: '\u{1F96D}', name: { sk: 'Mangová', en: 'Mango' }, colour: '#ffcb61', shade: '#e8a733' }
  ]
};

window.MENU.flavourById = window.MENU.iceCream.flavours.reduce(function (acc, f) {
  acc[f.id] = f;
  return acc;
}, {});

window.MENU.vesselById = window.MENU.iceCream.vessels.reduce(function (acc, v) {
  acc[v.id] = v;
  return acc;
}, {});

/** Flat id -> item lookup, so a saved order only has to store ids and quantities. */
window.MENU.byId = window.MENU.categories.reduce(function (acc, cat) {
  cat.items.forEach(function (item) {
    acc[item.id] = Object.assign({ categoryId: cat.id, color: cat.color }, item);
  });
  return acc;
}, {});

/* --- Order lines ----------------------------------------------------------
   A line is either a plain menu item or a built ice cream carrying a `build`
   of { vessel, scoops }. Everything downstream — ticket, kitchen, receipt,
   totals — goes through these four helpers so neither kind is a special case.
   -------------------------------------------------------------------------- */

/** Stable identity for a line. Identical cones stack instead of listing twice. */
window.MENU.buildKey = function (build) {
  return 'ice:' + build.vessel + ':' + build.scoops.join('+');
};

window.MENU.lineKey = function (line) {
  return line.build ? window.MENU.buildKey(line.build) : line.id;
};

window.MENU.linePrice = function (line) {
  if (line.build) {
    var vessel = window.MENU.vesselById[line.build.vessel];
    return (vessel ? vessel.price : 0) +
      line.build.scoops.length * window.MENU.iceCream.scoopPrice;
  }
  var item = window.MENU.byId[line.id];
  return item ? item.price : 0;
};

/** Returns the `{ sk, en }` pair; callers run it through I18N.name(). */
window.MENU.lineName = function (line) {
  if (!line.build) return window.MENU.byId[line.id].name;

  var vessel = window.MENU.vesselById[line.build.vessel];
  return ['sk', 'en'].reduce(function (out, lang) {
    var flavours = line.build.scoops.map(function (id) {
      return window.MENU.flavourById[id].name[lang];
    });
    out[lang] = vessel.name[lang] + ': ' + flavours.join(', ');
    return out;
  }, {});
};

window.MENU.lineEmoji = function (line) {
  if (!line.build) return window.MENU.byId[line.id].emoji;
  var vessel = window.MENU.vesselById[line.build.vessel];
  return vessel ? vessel.emoji : '\u{1F366}';
};

/** Guards against saved data referring to items or flavours that no longer exist. */
window.MENU.isValidLine = function (line) {
  if (!line || !(line.qty > 0)) return false;

  if (line.build) {
    var build = line.build;
    if (!window.MENU.vesselById[build.vessel]) return false;
    if (!Array.isArray(build.scoops)) return false;
    if (build.scoops.length < 1 || build.scoops.length > window.MENU.iceCream.maxScoops) return false;
    return build.scoops.every(function (id) { return !!window.MENU.flavourById[id]; });
  }

  return !!window.MENU.byId[line.id];
};
