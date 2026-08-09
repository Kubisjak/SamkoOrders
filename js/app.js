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
  var vesselsOpen = false;
  var settingsOpen = false;

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

  // --- Drawing the ice cream ------------------------------------------------

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function svg(tag, attrs) {
    var element = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (name) {
      element.setAttribute(name, attrs[name]);
    });
    return element;
  }

  /** Where the bottom scoop sits, and so the whole stack, per vessel. */
  var SCOOP_BASE = { cone: 64, waffle: 62, cup: 67 };
  var SCOOP_GAP = 17;
  var SCOOP_R = 19;

  function drawVessel(root, vesselId) {
    if (vesselId === 'cup') {
      root.appendChild(svg('path', {
        d: 'M31 72 H69 L63 122 Q50 128 37 122 Z',
        fill: '#fffaf0', stroke: '#e3d5bd', 'stroke-width': 2
      }));
      root.appendChild(svg('rect', {
        x: 28, y: 66, width: 44, height: 9, rx: 4.5, fill: '#f2e6d2'
      }));
      return;
    }

    var big = vesselId === 'waffle';
    var top = big ? 70 : 72;
    var halfWidth = big ? 26 : 20;
    var tip = big ? 130 : 126;

    root.appendChild(svg('polygon', {
      points: (50 - halfWidth) + ' ' + top + ' ' + (50 + halfWidth) + ' ' + top + ' 50 ' + tip,
      fill: big ? '#d59453' : '#e3aa64'
    }));

    // Waffle crosshatch, clipped to the cone by simply keeping it short.
    for (var i = 1; i <= 3; i++) {
      var y = top + i * ((tip - top) / 4.5);
      var w = halfWidth * (1 - (y - top) / (tip - top)) * 0.92;
      root.appendChild(svg('line', {
        x1: 50 - w, y1: y, x2: 50 + w, y2: y,
        stroke: 'rgba(120, 72, 26, .35)', 'stroke-width': 2, 'stroke-linecap': 'round'
      }));
    }
  }

  /**
   * The cone (or cup) with its scoops stacked up. Used big on the counter and
   * shrunk down on the ticket, the kitchen cards and anywhere else the order
   * shows up, so one drawing serves the whole app.
   */
  function coneSvg(build, width, onScoopClick) {
    var root = svg('svg', {
      viewBox: '0 0 100 134',
      width: width,
      height: Math.round(width * 1.34),
      class: 'cone',
      role: 'img'
    });

    drawVessel(root, build.vessel);

    var base = SCOOP_BASE[build.vessel] || SCOOP_BASE.cone;

    if (build.scoops.length === 0) {
      // A dashed ghost showing where the first scoop would land.
      root.appendChild(svg('circle', {
        cx: 50, cy: base, r: SCOOP_R - 2,
        fill: 'none', stroke: 'rgba(138, 116, 97, .45)',
        'stroke-width': 2.5, 'stroke-dasharray': '6 6'
      }));
      return root;
    }

    build.scoops.forEach(function (flavourId, index) {
      var flavour = window.MENU.flavourById[flavourId];
      var cy = base - index * SCOOP_GAP;
      var group = svg('g', { class: 'cone__scoop' });

      // Underside first, then the body slightly raised: cheap, readable depth.
      group.appendChild(svg('circle', { cx: 50, cy: cy, r: SCOOP_R, fill: flavour.shade }));
      group.appendChild(svg('circle', { cx: 50, cy: cy - 2.5, r: SCOOP_R - 1.5, fill: flavour.colour }));
      group.appendChild(svg('ellipse', {
        cx: 42, cy: cy - 9, rx: 5.5, ry: 3.6,
        fill: '#fff', opacity: 0.45, transform: 'rotate(-25 42 ' + (cy - 9) + ')'
      }));

      if (onScoopClick) {
        group.setAttribute('tabindex', '0');
        group.style.cursor = 'pointer';
        group.addEventListener('click', function () { onScoopClick(index); });

        // Any scoop can be tapped off, but only the top one is badged —
        // otherwise the cone turns into a wall of little crosses.
        if (index === build.scoops.length - 1) {
          var badge = svg('g', { class: 'cone__x' });
          badge.appendChild(svg('circle', {
            cx: 66, cy: cy - 13, r: 8,
            fill: '#fff', stroke: 'rgba(61,43,31,.25)', 'stroke-width': 1.5
          }));
          ['M62.5 ' + (cy - 16.5) + ' L69.5 ' + (cy - 9.5),
           'M69.5 ' + (cy - 16.5) + ' L62.5 ' + (cy - 9.5)].forEach(function (d) {
            badge.appendChild(svg('path', {
              d: d, stroke: '#8a7461', 'stroke-width': 2.2, 'stroke-linecap': 'round'
            }));
          });
          group.appendChild(badge);
        }
      }
      root.appendChild(group);
    });

    return root;
  }

  /** Small non-interactive version for order lines. */
  function conePreview(build, width) {
    var wrap = node('span', 'cone-mini');
    wrap.appendChild(coneSvg(build, width || 26));
    return wrap;
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
    el.soundLabel.textContent = window.I18N.t(soundOn ? 'soundOn' : 'soundOff');

    var lang = window.Store.getLanguage();
    el.langGlyph.textContent = lang === 'sk' ? '\u{1F1F8}\u{1F1F0}' : '\u{1F1EC}\u{1F1E7}';

    el.settings.hidden = !settingsOpen;
    el.settingsToggle.setAttribute('aria-expanded', String(settingsOpen));
  }

  /** The order as a row of pictures, plus the total and the send button. */
  function renderBasket() {
    var state = window.Store.getState();
    var empty = state.draft.length === 0;

    el.basketHint.hidden = !empty;
    el.basketItems.hidden = empty;
    el.sendDraft.disabled = empty;
    el.ticketTotal.textContent = window.Store.draftTotal();

    reconcile(
      el.basketItems,
      state.draft.map(function (line) { return line.key; }),
      function () {
        var chip = node('span', 'basket__chip');
        chip.appendChild(node('span', 'basket__chip-art'));
        chip.appendChild(node('span', 'basket__chip-qty'));
        return chip;
      },
      function (chip, key) {
        var line = state.draft.filter(function (l) { return l.key === key; })[0];
        var art = chip.children[0];
        art.textContent = '';
        if (line.build) {
          art.appendChild(conePreview(line.build, 22));
        } else {
          art.textContent = window.MENU.lineEmoji(line);
        }
        chip.children[1].textContent = line.qty > 1 ? '×' + line.qty : '';
        chip.children[1].hidden = line.qty <= 1;
        chip.title = window.I18N.name(window.MENU.lineName(line));
      }
    );
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

  function renderBuilder() {
    var cat = window.MENU.categories.filter(function (c) { return c.id === currentCategoryId; })[0];
    var showing = !!cat.builder;

    el.builder.hidden = !showing;
    el.foods.hidden = showing;
    if (!showing) return;

    var build = window.Store.getBuild();
    var ice = window.MENU.iceCream;

    // The cone itself. Tapping a scoop takes it back off.
    el.builderCone.textContent = '';
    el.builderCone.appendChild(coneSvg(build, 132, function (index) {
      window.Sound.remove();
      window.Store.removeScoop(index);
    }));

    el.builderUndo.hidden = build.scoops.length === 0;
    el.builderCount.textContent = build.scoops.length + '/' + ice.maxScoops + ' ' +
      window.I18N.t('scoops');
    // No price until there is something to price — an empty cone reading
    // "1 coin" is just noise.
    el.builderPrice.textContent = build.scoops.length
      ? window.Store.buildPrice() + ' \u{1FA99}'
      : '';
    el.builderAdd.disabled = build.scoops.length === 0;

    var vessel = window.MENU.vesselById[build.vessel];
    el.vesselToggle.textContent = vessel.emoji + ' ' + window.I18N.name(vessel.name) +
      (vesselsOpen ? ' ▴' : ' ▾');
    el.vesselToggle.setAttribute('aria-expanded', String(vesselsOpen));
    el.vessels.hidden = !vesselsOpen;

    reconcile(
      el.vessels,
      ice.vessels.map(function (v) { return v.id; }),
      function () {
        var button = node('button', 'vessel');
        button.type = 'button';
        button.setAttribute('role', 'radio');
        button.appendChild(node('span', 'vessel__emoji'));
        button.appendChild(node('span', 'vessel__name'));
        return button;
      },
      function (button, key) {
        var vessel = window.MENU.vesselById[key];
        var active = build.vessel === key;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-checked', String(active));
        button.children[0].textContent = vessel.emoji;
        button.children[1].textContent = window.I18N.name(vessel.name);
        button.onclick = function () {
          window.Sound.click();
          vesselsOpen = false;   // picking one rolls the row away again
          window.Store.setVessel(key);
        };
      }
    );

    reconcile(
      el.flavours,
      ice.flavours.map(function (f) { return f.id; }),
      function () {
        var button = node('button', 'flavour');
        button.type = 'button';
        var disc = node('span', 'flavour__disc');
        disc.appendChild(node('span', 'flavour__emoji'));
        button.appendChild(disc);
        button.appendChild(node('span', 'flavour__name'));
        return button;
      },
      function (button, key) {
        var flavour = window.MENU.flavourById[key];
        var scoopsOf = build.scoops.filter(function (id) { return id === key; }).length;

        button.children[0].style.background = flavour.colour;
        button.children[0].style.borderColor = flavour.shade;
        button.children[0].children[0].textContent = flavour.emoji;
        button.children[1].textContent = window.I18N.name(flavour.name);
        button.classList.toggle('is-chosen', scoopsOf > 0);
        button.setAttribute('aria-label', window.I18N.name(flavour.name));

        button.onclick = function () {
          var added = window.Store.addScoop(key);
          if (added) {
            window.Sound.scoop(window.Store.getBuild().scoops.length - 1);
          } else {
            window.Sound.remove();
            el.builderCount.textContent = window.I18N.t('coneFull');
          }
        };
      }
    );
  }

  function renderFoods() {
    var state = window.Store.getState();
    var cat = window.MENU.categories.filter(function (c) { return c.id === currentCategoryId; })[0];
    var gridKey = cat.id + '/' + state.language;

    if (cat.builder) return;

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
    el.sheetTotal.textContent = window.Store.draftTotal();
    el.sheetSend.disabled = state.draft.length === 0;
    el.clearDraft.disabled = state.draft.length === 0;

    reconcile(
      el.ticketLines,
      state.draft.map(function (line) { return line.key; }),
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
        var line = state.draft.filter(function (l) { return l.key === key; })[0];
        var name = window.I18N.name(window.MENU.lineName(line));

        // A built cone shows its actual scoops rather than a generic emoji.
        li.children[0].textContent = '';
        if (line.build) {
          li.children[0].appendChild(conePreview(line.build, 24));
        } else {
          li.children[0].textContent = window.MENU.lineEmoji(line);
        }

        li.children[1].children[0].textContent = name;
        li.children[1].children[1].textContent =
          window.MENU.linePrice(line) * line.qty + ' \u{1FA99}';

        var stepper = li.children[2];
        stepper.children[1].textContent = line.qty;
        stepper.children[0].setAttribute('aria-label', '− ' + name);
        stepper.children[2].setAttribute('aria-label', '+ ' + name);
        stepper.children[0].onclick = function () {
          window.Sound.remove();
          window.Store.removeFromDraft(key);
        };
        // Built cones are re-added through the store so the build travels too.
        stepper.children[2].onclick = function () {
          window.Sound.tap(line.qty);
          if (line.build) {
            window.Store.addBuiltLine(line.build);
          } else {
            window.Store.addToDraft(key);
          }
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
          var li = node('li', 'order__item');
          if (line.build) {
            // The kitchen needs to see which scoops, not just "an ice cream".
            li.appendChild(conePreview(line.build, 26));
          } else {
            li.appendChild(node('span', 'order__item-emoji', window.MENU.lineEmoji(line)));
          }
          li.appendChild(node('span', null, '×' + line.qty));
          li.title = window.I18N.name(window.MENU.lineName(line));
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
      var li = node('li', 'receipt__line');
      li.appendChild(node('span', 'receipt__line-emoji', window.MENU.lineEmoji(line)));
      li.appendChild(node('span', 'receipt__line-name', window.I18N.name(window.MENU.lineName(line))));
      li.appendChild(node('span', 'receipt__line-qty', '×' + line.qty));
      li.appendChild(node('span', 'receipt__line-sum', window.MENU.linePrice(line) * line.qty));
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
    renderBuilder();
    renderFoods();
    renderBasket();
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
      builder: $('builder'),
      builderCone: $('builder-cone'),
      builderUndo: $('builder-undo'),
      builderCount: $('builder-count'),
      builderPrice: $('builder-price'),
      builderAdd: $('builder-add'),
      vessels: $('vessels'),
      vesselToggle: $('vessel-toggle'),
      flavours: $('flavours'),
      basket: $('basket'),
      basketStrip: $('basket-strip'),
      basketItems: $('basket-items'),
      basketHint: $('basket-hint'),
      basketModal: $('basket-modal'),
      basketBackdrop: $('basket-backdrop'),
      basketClose: $('basket-close'),
      sheetTotal: $('sheet-total'),
      sheetSend: $('sheet-send'),
      settings: $('settings'),
      settingsToggle: $('settings-toggle'),
      soundLabel: $('sound-label'),
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

    el.vesselToggle.onclick = function () {
      vesselsOpen = !vesselsOpen;
      window.Sound.click();
      renderBuilder();
    };

    el.settingsToggle.onclick = function () {
      settingsOpen = !settingsOpen;
      window.Sound.click();
      renderToggles();
    };

    // Anywhere outside closes the grown-up menu again.
    document.addEventListener('pointerdown', function (event) {
      if (!settingsOpen) return;
      if (el.settings.contains(event.target) || el.settingsToggle.contains(event.target)) return;
      settingsOpen = false;
      renderToggles();
    });

    el.basketStrip.onclick = function () {
      window.Sound.click();
      el.basketModal.hidden = false;
    };

    function closeBasket() {
      el.basketModal.hidden = true;
      tablesOpen = false;
      renderTables();
    }

    el.basketClose.onclick = function () { window.Sound.click(); closeBasket(); };
    el.basketBackdrop.onclick = closeBasket;
    el.sheetSend.onclick = function () { closeBasket(); el.sendDraft.click(); };

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

    el.builderUndo.onclick = function () {
      window.Sound.remove();
      window.Store.removeScoop();
    };

    el.builderAdd.onclick = function () {
      var build = window.Store.addBuildToDraft();
      if (!build) return;
      window.Sound.send();
      confetti(['\u{1F366}', '✨', '\u{1F368}']);
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
      if (event.key !== 'Escape') return;
      if (!el.payModal.hidden) closePay();
      else if (!el.basketModal.hidden) closeBasket();
    });

    // Safari will not make a sound until audio starts inside a user gesture.
    document.addEventListener('pointerdown', function unlock() {
      window.Sound.unlock();
      document.removeEventListener('pointerdown', unlock);
    }, { once: true });

    // Coming back from the home screen or a locked iPad drops the audio
    // session, so claim it again on the way in.
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) window.Sound.resumeSession();
    });

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
