/**
 * All app state lives here and is mirrored into localStorage, so closing the
 * iPad lid (or a stray refresh mid-service) never loses an order.
 *
 * Views never mutate state directly — they call a method and re-render from the
 * `subscribe` callback.
 */
window.Store = (function () {
  var STORAGE_KEY = 'samko-orders/v1';

  var defaults = {
    language: 'sk',
    sound: true,
    /** Table currently being served. */
    table: 1,
    /** Order in progress, as an ordered list of { id, qty }. */
    draft: [],
    /** Orders already sent to the kitchen, newest first. */
    orders: [],
    /** Incrementing ticket number, so the kitchen has something to shout. */
    nextTicket: 1
  };

  var state = load();
  var listeners = [];

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return Object.assign({}, defaults);
      var saved = JSON.parse(raw);
      var merged = Object.assign({}, defaults, saved);
      // Drop anything referring to menu items that no longer exist.
      merged.draft = sanitiseLines(merged.draft);
      merged.orders = (merged.orders || []).map(function (order) {
        return Object.assign({}, order, { items: sanitiseLines(order.items) });
      }).filter(function (order) {
        return order.items.length > 0;
      });
      return merged;
    } catch (err) {
      console.warn('Could not read saved orders, starting fresh.', err);
      return Object.assign({}, defaults);
    }
  }

  function sanitiseLines(lines) {
    if (!Array.isArray(lines)) return [];
    return lines.filter(function (line) {
      return line && window.MENU.byId[line.id] && line.qty > 0;
    });
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      // Private browsing or a full quota: the app still works for this session.
      console.warn('Could not save orders.', err);
    }
  }

  function emit() {
    save();
    listeners.forEach(function (fn) { fn(state); });
  }

  function findLine(id) {
    return state.draft.filter(function (line) { return line.id === id; })[0];
  }

  return {
    subscribe: function (fn) {
      listeners.push(fn);
      fn(state);
    },

    getState: function () { return state; },
    getLanguage: function () { return state.language; },
    isSoundOn: function () { return state.sound; },

    toggleLanguage: function () {
      var langs = window.I18N.languages;
      state.language = langs[(langs.indexOf(state.language) + 1) % langs.length];
      emit();
    },

    toggleSound: function () {
      state.sound = !state.sound;
      emit();
    },

    setTable: function (table) {
      state.table = table;
      emit();
    },

    addToDraft: function (itemId) {
      if (!window.MENU.byId[itemId]) return;
      var line = findLine(itemId);
      if (line) {
        line.qty += 1;
      } else {
        state.draft.push({ id: itemId, qty: 1 });
      }
      emit();
    },

    removeFromDraft: function (itemId) {
      var line = findLine(itemId);
      if (!line) return;
      line.qty -= 1;
      if (line.qty <= 0) {
        state.draft = state.draft.filter(function (l) { return l.id !== itemId; });
      }
      emit();
    },

    clearDraft: function () {
      state.draft = [];
      emit();
    },

    draftTotal: function () {
      return state.draft.reduce(function (sum, line) {
        return sum + window.MENU.byId[line.id].price * line.qty;
      }, 0);
    },

    draftCount: function () {
      return state.draft.reduce(function (sum, line) { return sum + line.qty; }, 0);
    },

    /** Move the draft to the kitchen. Returns the new order, or null if empty. */
    sendDraft: function () {
      if (state.draft.length === 0) return null;
      var order = {
        id: 'order-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        ticket: state.nextTicket,
        table: state.table,
        items: state.draft,
        status: 'new',
        // Paying is tracked separately from cooking: an order can be settled at
        // the till while the kitchen is still working on it.
        paid: false,
        createdAt: Date.now()
      };
      state.nextTicket += 1;
      state.orders.unshift(order);
      state.draft = [];
      emit();
      return order;
    },

    getOrder: function (orderId) {
      return state.orders.filter(function (order) { return order.id === orderId; })[0] || null;
    },

    markPaid: function (orderId, method) {
      state.orders.forEach(function (order) {
        if (order.id === orderId) {
          order.paid = true;
          order.paidWith = method;
        }
      });
      emit();
    },

    setOrderStatus: function (orderId, status) {
      state.orders.forEach(function (order) {
        if (order.id === orderId) order.status = status;
      });
      emit();
    },

    deleteOrder: function (orderId) {
      state.orders = state.orders.filter(function (order) { return order.id !== orderId; });
      emit();
    },

    clearOrders: function () {
      state.orders = [];
      emit();
    },

    /** Orders the kitchen still has work to do on. Drives the tab badge. */
    activeOrders: function () {
      return state.orders.filter(function (order) { return order.status !== 'served'; });
    },

    orderTotal: function (order) {
      return order.items.reduce(function (sum, line) {
        return sum + window.MENU.byId[line.id].price * line.qty;
      }, 0);
    }
  };
})();
