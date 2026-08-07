/**
 * Interface strings. Slovak is the default; the flag button in the header flips
 * to English. Grown-up labels only — the kid-facing parts of the UI are emoji.
 */
window.I18N = {
  languages: ['sk', 'en'],

  strings: {
    sk: {
      appName: 'Samkova reštaurácia',
      tabOrder: 'Objednávka',
      tabKitchen: 'Kuchyňa',
      table: 'Stôl',
      pickTable: 'Vyber stôl',
      yourOrder: 'Objednávka',
      emptyOrder: 'Klikni na jedlo a pridaj ho sem!',
      total: 'Spolu',
      coins: 'mincí',
      send: 'Poslať do kuchyne',
      clear: 'Vymazať',
      noOrders: 'Zatiaľ žiadne objednávky.',
      statusNew: 'Nová',
      statusCooking: 'Varí sa',
      statusReady: 'Hotovo!',
      statusServed: 'Podané',
      startCooking: 'Začať variť',
      markReady: 'Je hotové!',
      markServed: 'Podané',
      deleteOrder: 'Zmazať',
      soundOn: 'Zvuk zapnutý',
      soundOff: 'Zvuk vypnutý',
      language: 'Jazyk',
      sent: 'Objednávka odoslaná!',
      confirmClearAll: 'Zmazať všetky objednávky?',
      clearAll: 'Zmazať všetko',
      pay: 'Zaplatiť',
      payCard: 'Kartou',
      payCash: 'Hotovosť',
      payLater: 'Zaplatiť neskôr',
      paid: 'Zaplatené',
      howPay: 'Ako chceš zaplatiť?',
      tapCard: 'Prilož kartu',
      processing: 'Spracúva sa',
      approved: 'SCHVÁLENÉ',
      thanks: 'Ďakujeme!',
      done: 'Hotovo',
      receiptFor: 'Účet č.'
    },
    en: {
      appName: "Samko's Restaurant",
      tabOrder: 'Order',
      tabKitchen: 'Kitchen',
      table: 'Table',
      pickTable: 'Pick a table',
      yourOrder: 'Your order',
      emptyOrder: 'Tap some food to add it here!',
      total: 'Total',
      coins: 'coins',
      send: 'Send to kitchen',
      clear: 'Clear',
      noOrders: 'No orders yet.',
      statusNew: 'New',
      statusCooking: 'Cooking',
      statusReady: 'Ready!',
      statusServed: 'Served',
      startCooking: 'Start cooking',
      markReady: "It's ready!",
      markServed: 'Served',
      deleteOrder: 'Delete',
      soundOn: 'Sound on',
      soundOff: 'Sound off',
      language: 'Language',
      sent: 'Order sent!',
      confirmClearAll: 'Delete all orders?',
      clearAll: 'Clear all',
      pay: 'Pay',
      payCard: 'Card',
      payCash: 'Cash',
      payLater: 'Pay later',
      paid: 'Paid',
      howPay: 'How do you want to pay?',
      tapCard: 'Tap your card',
      processing: 'Processing',
      approved: 'APPROVED',
      thanks: 'Thank you!',
      done: 'Done',
      receiptFor: 'Bill no.'
    }
  },

  /** Look up a UI string in the active language. */
  t: function (key) {
    var lang = window.Store.getLanguage();
    return (this.strings[lang] && this.strings[lang][key]) || this.strings.sk[key] || key;
  },

  /** Pick the right side of a `{ sk, en }` name from the menu data. */
  name: function (nameObj) {
    var lang = window.Store.getLanguage();
    return nameObj[lang] || nameObj.sk;
  }
};
