/**
 * View layer. Reads from Store, writes back through Store methods, and
 * re-renders on every change.
 *
 * Lists are reconciled by key rather than rebuilt, so the "pop" and "slide-in"
 * animations only fire for genuinely new things — otherwise every tap would
 * make the whole order jump.
 */
(function () {
  var el = {};
  var currentView = 'order';
  var currentCategoryId = window.MENU.categories[0].id;
  /** Guards the food grid rebuild: only category and language change its markup. */
  var renderedGrid = null;
  var tablesOpen = false;

  /** Order currently on the terminal, and how far through paying it is. */
  var payingOrderId = null;
  var payPhase = 'idle'; // idle | busy | done
  var payTimers = [];

  var STATUS_FLOW = {
    new: { next: 'cooking', actionKey: 'startCooking', labelKey: 'statusNew' },
    cooking: { next: 'ready', actionKey: 'markReady', labelKey: 'statusCooking' },
    ready: { next: 'served', actionKey: 'markServed', labelKey: 'statusReady' },
    served: { next: null, actionKey: null, labelKey: 'statusServed' }
  };

  // --- Small DOM helpers ----------------------------------------------------

  function $(id) { return document.getElementById(id); }

  function node(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text != null) element.textContent = text;
    return element;
  }

  /**
   * Keyed list update: keeps existing elements (and their animation state) for
   * keys that are still present, creates the new ones, drops the gone ones, and
   * puts everything back in the given order.
   */
  function reconcile(container, keys, create, update) {
    var existing = {};
    Array.prototype.slice.call(container.children).forEach(function (child) {
      if (keys.indexOf(child.dataset.key) === -1) {
        container.removeChild(child);
      } else {
        existing[child.dataset.key] = child;
      }
    });

    keys.forEach(function (key, index) {
      var child = existing[key];
      if (!child) {
        child = create(key);
        child.dataset.key = key;
      }
      update(child, key);
      if (container.children[index] !== child) {
        container.insertBefore(child, container.children[index] || null);
      }
    });
  }

  function confetti(emojis) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (var i = 0; i < 26; i++) {
      var bit = node('span', 'confetti__bit', emojis[i % emojis.length]);
      var duration = 1.4 + Math.random() * 1.2;
      bit.style.left = Math.random() * 100 + 'vw';
      bit.style.animationDuration = duration + 's';
      bit.style.animationDelay = Math.random() * 0.4 + 's';
      bit.style.fontSize = 20 + Math.random() * 24 + 'px';
      el.confetti.appendChild(bit);
      (function (n) {
        setTimeout(function () { n.remove(); }, (duration + 0.6) * 1000);
      })(bit);
    }
  }

  function tableFor(id) {
    return window.MENU.tables.filter(function (t) { return t.id === id; })[0];
  }

  /** How many of this item are already on the ticket — drives the rising pitch. */
  function draftQty(itemId) {
    var line = window.Store.getState().draft.filter(function (l) { return l.id === itemId; })[0];
    return line ? line.qty : 0;
  }

  // --- Rendering ------------------------------------------------------------

  function renderStaticStrings() {
    document.documentElement.lang = window.Store.getLanguage();
    document.title = window.I18N.t('appName');
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (element) {
      element.textContent = window.I18N.t(element.dataset.i18n);
    });
  }

  function renderToggles() {
    var soundOn = window.Store.isSoundOn();
    el.soundGlyph.textContent = soundOn ? '\u{1F50A}' : '\u{1F507}';
    el.soundToggle.classList.toggle('is-off', !soundOn);
    el.soundToggle.setAttribute('aria-pressed', String(soundOn));
    el.soundToggle.setAttribute('aria-label', window.I18N.t(soundOn ? 'soundOn' : 'soundOff'));

    var lang = window.Store.getLanguage();
    el.langGlyph.textContent = lang === 'sk' ? '\u{1F1F8}\u{1F1F0}' : '\u{1F1EC}\u{1F1E7}';
    el.langToggle.setAttribute('aria-label', window.I18N.t('language'));
  }

  function renderTables() {
    var state = window.Store.getState();
    var current = tableFor(state.table);

    el.tableToggle.textContent = current.emoji + ' ' + window.I18N.t('table') + ' ' + current.id +
      (tablesOpen ? ' ▴' : ' ▾');
    el.tableToggle.setAttribute('aria-expanded', String(tablesOpen));
    el.tables.hidden = !tablesOpen;

    reconcile(
      el.tables,
      window.MENU.tables.map(function (table) { return String(table.id); }),
      function () {
        var button = node('button', 'table-btn');
        button.type = 'button';
        button.setAttribute('role', 'radio');
        button.appendChild(node('span', 'table-btn__emoji'));
        button.appendChild(node('span', 'table-btn__num'));
        return button;
      },
      function (button, key) {
        var table = tableFor(Number(key));
        var active = state.table === table.id;
        button.children[0].textContent = table.emoji;
        button.children[1].textContent = table.id;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-checked', String(active));
        button.setAttribute('aria-label', window.I18N.t('table') + ' ' + table.id);
        button.onclick = function () {
          window.Sound.click();
          tablesOpen = false;   // picking one folds the row away again
          window.Store.setTable(table.id);
        };
      }
    );
  }

  function renderCategories() {
    reconcile(
      el.cats,
      window.MENU.categories.map(function (cat) { return cat.id; }),
      function () {
        var button = node('button', 'cat');
        button.type = 'button';
        button.setAttribute('role', 'tab');
        button.appendChild(node('span', 'cat__emoji'));
        button.appendChild(node('span', 'cat__label'));
        return button;
      },
      function (button, key) {
        var cat = window.MENU.categories.filter(function (c) { return c.id === key; })[0];
        var active = cat.id === currentCategoryId;
        button.className = 'cat cat--' + cat.color + (active ? ' is-active' : '');
        button.children[0].textContent = cat.emoji;
        button.children[1].textContent = window.I18N.name(cat.name);
        button.setAttribute('aria-selected', String(active));
        button.onclick = function () {
          currentCategoryId = cat.id;
          window.Sound.click();
          render();
        };
      }
    );
  }

  function renderFoods() {
    var state = window.Store.getState();
    var cat = window.MENU.categories.filter(function (c) { return c.id === currentCategoryId; })[0];
    var gridKey = cat.id + '/' + state.language;

    if (renderedGrid !== gridKey) {
      renderedGrid = gridKey;
      el.foods.textContent = '';
      cat.items.forEach(function (item) {
        var button = node('button', 'food food--' + cat.color);
        button.type = 'button';
        button.dataset.itemId = item.id;
        button.setAttribute('aria-label', window.I18N.name(item.name));
        button.appendChild(node('span', 'food__emoji', item.emoji));
        button.appendChild(node('span', 'food__name', window.I18N.name(item.name)));
        button.appendChild(node('span', 'food__price', item.price + ' \u{1FA99}'));
        button.onclick = function () {
          window.Sound.tap(draftQty(item.id));
          window.Store.addToDraft(item.id);
        };
        el.foods.appendChild(button);
      });
    }

    // Quantity badges are patched in place so only the tapped tile animates.
    Array.prototype.forEach.call(el.foods.children, function (button) {
      var line = state.draft.filter(function (l) { return l.id === button.dataset.itemId; })[0];
      var badge = button.querySelector('.food__qty');
      if (!line) {
        if (badge) badge.remove();
        return;
      }
      if (!badge) {
        badge = node('span', 'food__qty');
        button.appendChild(badge);
      }
      badge.textContent = '×' + line.qty;
    });
  }

  function renderTicket() {
    var state = window.Store.getState();

    el.ticketEmpty.hidden = state.draft.length > 0;
    el.ticketLines.hidden = state.draft.length === 0;
    el.ticketTotal.textContent = window.Store.draftTotal();
    el.sendDraft.disabled = state.draft.length === 0;
    el.clearDraft.disabled = state.draft.length === 0;

    reconcile(
      el.ticketLines,
      state.draft.map(function (line) { return line.id; }),
      function () {
        var li = node('li', 'line');
        li.appendChild(node('span', 'line__emoji'));
        var text = node('div', 'line__text');
        text.appendChild(node('div', 'line__name'));
        text.appendChild(node('div', 'line__price'));
        li.appendChild(text);

        var stepper = node('div', 'line__stepper');
        var minus = node('button', 'step', '−');
        minus.type = 'button';
        var qty = node('span', 'line__qty');
        var plus = node('button', 'step', '+');
        plus.type = 'button';
        stepper.appendChild(minus);
        stepper.appendChild(qty);
        stepper.appendChild(plus);
        li.appendChild(stepper);
        return li;
      },
      function (li, key) {
        var item = window.MENU.byId[key];
        var line = state.draft.filter(function (l) { return l.id === key; })[0];
        li.children[0].textContent = item.emoji;
        li.children[1].children[0].textContent = window.I18N.name(item.name);
        li.children[1].children[1].textContent = item.price * line.qty + ' \u{1FA99}';

        var stepper = li.children[2];
        stepper.children[1].textContent = line.qty;
        stepper.children[0].setAttribute('aria-label', '− ' + window.I18N.name(item.name));
        stepper.children[2].setAttribute('aria-label', '+ ' + window.I18N.name(item.name));
        stepper.children[0].onclick = function () {
          window.Sound.remove();
          window.Store.removeFromDraft(key);
        };
        stepper.children[2].onclick = function () {
          window.Sound.tap(draftQty(key));
          window.Store.addToDraft(key);
        };
      }
    );
  }

  function renderKitchen() {
    var state = window.Store.getState();
    var active = window.Store.activeOrders().length;

    el.kitchenBadge.hidden = active === 0;
    el.kitchenBadge.textContent = active;
    el.kitchenEmpty.hidden = state.orders.length > 0;
    el.clearOrders.hidden = state.orders.length === 0;

    reconcile(
      el.orders,
      state.orders.map(function (order) { return order.id; }),
      function () {
        var card = node('article', 'order');
        var head = node('div', 'order__head');
        head.appendChild(node('span', 'order__ticket'));
        head.appendChild(node('span', 'order__table'));
        head.appendChild(node('span', 'order__paid'));
        head.appendChild(node('span', 'order__status'));
        card.appendChild(head);
        card.appendChild(node('ul', 'order__items'));

        var foot = node('div', 'order__foot');
        foot.appendChild(node('span', 'order__total'));
        var pay = node('button', 'order__pay');
        pay.type = 'button';
        var action = node('button', 'order__action');
        action.type = 'button';
        var del = node('button', 'order__delete', '\u{1F5D1}\u{FE0F}');
        del.type = 'button';
        foot.appendChild(pay);
        foot.appendChild(action);
        foot.appendChild(del);
        card.appendChild(foot);
        return card;
      },
      function (card, key) {
        var order = window.Store.getOrder(key);
        var flow = STATUS_FLOW[order.status] || STATUS_FLOW.new;
        var table = tableFor(order.table);

        card.className = 'order order--' + order.status;

        var head = card.children[0];
        head.children[0].textContent = '#' + order.ticket;
        head.children[1].textContent = (table ? table.emoji + ' ' : '') +
          window.I18N.t('table') + ' ' + order.table;
        head.children[2].textContent = '\u{1F4B3} ' + window.I18N.t('paid');
        head.children[2].hidden = !order.paid;
        head.children[3].textContent = window.I18N.t(flow.labelKey);

        var items = card.children[1];
        items.textContent = '';
        order.items.forEach(function (line) {
          var item = window.MENU.byId[line.id];
          var li = node('li', 'order__item');
          li.appendChild(node('span', 'order__item-emoji', item.emoji));
          li.appendChild(node('span', null, '×' + line.qty));
          li.title = window.I18N.name(item.name);
          items.appendChild(li);
        });

        var foot = card.children[2];
        foot.children[0].textContent = window.Store.orderTotal(order) + ' \u{1FA99}';

        var pay = foot.children[1];
        pay.hidden = order.paid;
        pay.textContent = '\u{1F4B3} ' + window.I18N.t('pay');
        pay.onclick = function () {
          window.Sound.terminal();
          openPay(order.id);
        };

        var action = foot.children[2];
        action.hidden = !flow.next;
        if (flow.next) {
          action.textContent = window.I18N.t(flow.actionKey);
          action.onclick = function () {
            if (flow.next === 'cooking') window.Sound.cooking();
            if (flow.next === 'ready') {
              window.Sound.bell();
              confetti(['\u{1F514}', '✨', '\u{1F37D}\u{FE0F}']);
            }
            if (flow.next === 'served') window.Sound.click();
            window.Store.setOrderStatus(order.id, flow.next);
          };
        }

        var del = foot.children[3];
        del.setAttribute('aria-label', window.I18N.t('deleteOrder'));
        del.onclick = function () {
          window.Sound.remove();
          window.Store.deleteOrder(order.id);
        };
      }
    );
  }

  // --- Pay: receipt + card terminal -----------------------------------------

  function openPay(orderId) {
    if (!window.Store.getOrder(orderId)) return;
    payingOrderId = orderId;
    payPhase = window.Store.getOrder(orderId).paid ? 'done' : 'idle';
    el.payModal.hidden = false;
    renderPay();
  }

  function closePay() {
    payTimers.forEach(clearTimeout);
    payTimers = [];
    payingOrderId = null;
    payPhase = 'idle';
    el.payModal.hidden = true;
    el.terminalCard.classList.remove('is-tapping');
  }

  function renderPay() {
    if (el.payModal.hidden) return;
    var order = window.Store.getOrder(payingOrderId);
    if (!order) { closePay(); return; }

    var table = tableFor(order.table);
    var total = window.Store.orderTotal(order);

    el.receiptTicket.textContent = window.I18N.t('receiptFor') + ' ' + order.ticket;
    el.receiptTable.textContent = (table ? table.emoji + ' ' : '') +
      window.I18N.t('table') + ' ' + order.table;
    el.receiptTotal.textContent = total;
    el.receiptStamp.hidden = !order.paid;
    el.terminalAmount.textContent = total + ' \u{1FA99}';

    el.receiptLines.textContent = '';
    order.items.forEach(function (line) {
      var item = window.MENU.byId[line.id];
      var li = node('li', 'receipt__line');
      li.appendChild(node('span', 'receipt__line-emoji', item.emoji));
      li.appendChild(node('span', 'receipt__line-name', window.I18N.name(item.name)));
      li.appendChild(node('span', 'receipt__line-qty', '×' + line.qty));
      li.appendChild(node('span', 'receipt__line-sum', item.price * line.qty));
      el.receiptLines.appendChild(li);
    });

    el.terminalButtons.hidden = order.paid || payPhase === 'busy';
    el.payClose.textContent = window.I18N.t(order.paid ? 'done' : 'payLater');

    // While the terminal is "thinking", the flow owns the screen text.
    if (payPhase === 'busy') return;

    el.terminalMsg.classList.toggle('is-approved', !!order.paid);
    el.terminalMsg.textContent = order.paid
      ? window.I18N.t('approved') + ' ✓'
      : window.I18N.t('howPay');
  }

  function payWith(method) {
    var order = window.Store.getOrder(payingOrderId);
    if (!order || order.paid || payPhase === 'busy') return;

    payPhase = 'busy';
    el.terminalButtons.hidden = true;
    window.Sound.terminal();

    if (method === 'cash') {
      el.terminalMsg.classList.remove('is-approved');
      el.terminalMsg.textContent = window.I18N.t('thanks');
      window.Sound.coins();
      payTimers.push(setTimeout(function () { settle('cash'); }, 700));
      return;
    }

    el.terminalMsg.classList.remove('is-approved');
    el.terminalMsg.textContent = window.I18N.t('tapCard');
    el.terminalCard.classList.remove('is-tapping');
    // Reading offsetWidth restarts the animation on a repeat payment.
    void el.terminalCard.offsetWidth;
    el.terminalCard.classList.add('is-tapping');

    // The clack lands at 45% of the 0.9s animation, where the card reaches the
    // reader — the sound has to hit the picture, not the button press.
    payTimers.push(setTimeout(function () { window.Sound.cardClick(); }, 410));

    payTimers.push(setTimeout(function () {
      el.terminalMsg.textContent = window.I18N.t('processing') + '…';
      window.Sound.terminal();
    }, 900));
    payTimers.push(setTimeout(function () { settle('card'); }, 1600));
  }

  function settle(method) {
    payPhase = 'done';
    el.terminalCard.classList.remove('is-tapping');
    window.Sound.approved();
    confetti(['\u{1FA99}', '✨', '\u{1F4B3}', '\u{1F389}']);
    window.Store.markPaid(payingOrderId, method);   // re-renders through Store
  }

  function renderView() {
    el.viewOrder.hidden = currentView !== 'order';
    el.viewKitchen.hidden = currentView !== 'kitchen';
    el.tabOrder.classList.toggle('is-active', currentView === 'order');
    el.tabKitchen.classList.toggle('is-active', currentView === 'kitchen');
  }

  function render() {
    renderStaticStrings();
    renderToggles();
    renderTables();
    renderCategories();
    renderFoods();
    renderTicket();
    renderKitchen();
    renderPay();
    renderView();
  }

  // --- Wiring ---------------------------------------------------------------

  function showView(view) {
    currentView = view;
    window.Sound.click();
    renderView();
  }

  function init() {
    el = {
      tables: $('tables'),
      tableToggle: $('table-toggle'),
      cats: $('cats'),
      foods: $('foods'),
      ticketLines: $('ticket-lines'),
      ticketEmpty: $('ticket-empty'),
      ticketTotal: $('ticket-total'),
      sendDraft: $('send-draft'),
      clearDraft: $('clear-draft'),
      orders: $('orders'),
      kitchenEmpty: $('kitchen-empty'),
      kitchenBadge: $('kitchen-badge'),
      clearOrders: $('clear-orders'),
      viewOrder: $('view-order'),
      viewKitchen: $('view-kitchen'),
      tabOrder: $('tab-order'),
      tabKitchen: $('tab-kitchen'),
      soundToggle: $('sound-toggle'),
      soundGlyph: $('sound-glyph'),
      langToggle: $('lang-toggle'),
      langGlyph: $('lang-glyph'),
      confetti: $('confetti'),
      payModal: $('pay-modal'),
      payBackdrop: $('pay-backdrop'),
      payClose: $('pay-close'),
      payCard: $('pay-card'),
      payCash: $('pay-cash'),
      receiptTicket: $('receipt-ticket'),
      receiptTable: $('receipt-table'),
      receiptLines: $('receipt-lines'),
      receiptTotal: $('receipt-total'),
      receiptStamp: $('receipt-stamp'),
      terminalAmount: $('terminal-amount'),
      terminalMsg: $('terminal-msg'),
      terminalCard: $('terminal-card'),
      terminalButtons: $('terminal-buttons')
    };

    el.tabOrder.onclick = function () { showView('order'); };
    el.tabKitchen.onclick = function () { showView('kitchen'); };

    el.tableToggle.onclick = function () {
      tablesOpen = !tablesOpen;
      window.Sound.click();
      renderTables();
    };

    el.soundToggle.onclick = function () {
      window.Store.toggleSound();
      // Play *after* toggling, so switching on gives immediate feedback.
      window.Sound.click();
    };

    el.langToggle.onclick = function () {
      window.Store.toggleLanguage();
      // Language changes every label in the food grid, so force a rebuild.
      renderedGrid = null;
      window.Sound.click();
      render();
    };

    el.clearDraft.onclick = function () {
      window.Sound.remove();
      window.Store.clearDraft();
    };

    el.sendDraft.onclick = function () {
      var order = window.Store.sendDraft();
      if (!order) return;
      window.Sound.send();
      confetti(['\u{1F389}', '⭐', '\u{1F355}', '\u{1F366}', '\u{1F35F}']);
      openPay(order.id);
    };

    el.clearOrders.onclick = function () {
      if (!window.confirm(window.I18N.t('confirmClearAll'))) return;
      window.Sound.remove();
      window.Store.clearOrders();
    };

    el.payCard.onclick = function () { payWith('card'); };
    el.payCash.onclick = function () { payWith('cash'); };
    el.payClose.onclick = function () { window.Sound.click(); closePay(); };
    el.payBackdrop.onclick = function () { closePay(); };

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !el.payModal.hidden) closePay();
    });

    // Safari will not make a sound until audio starts inside a user gesture.
    document.addEventListener('pointerdown', function unlock() {
      window.Sound.unlock();
      document.removeEventListener('pointerdown', unlock);
    }, { once: true });

    window.Store.subscribe(render);

    if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function (err) {
          console.warn('Offline mode unavailable.', err);
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
