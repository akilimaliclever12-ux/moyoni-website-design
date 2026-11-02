(function () {
  'use strict';
  var D = window.MOYONI;
  var CUSTOM = 'https://moyoni.app/order';
  var byH = {};
  D.products.forEach(function (p) { byH[p.h] = p; });

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (n) { n = Math.round(n * 100) / 100; return '$' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }); };
  var im = function (u, w) { return u + (u.indexOf('?') > -1 ? '&' : '?') + 'width=' + w; };

  var ICON = {
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.4-6.5 8-6.5s7 2 8 6.5"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><path d="M4 8h16M4 16h16"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg>'
  };

  /* ---------- shared chrome ---------- */
  function chrome() {
    var h = $('#hdr-mount');
    if (h) h.innerHTML =
      '<div class="topbar">Handmade in Tanzania · Tracked worldwide delivery</div>' +
      '<header class="hdr"><div class="wrap hdr-in">' +
      '<div class="hdr-l"><button class="icon-btn hamb" data-open="menu" aria-label="Open menu">' + ICON.menu + '</button>' +
      '<nav class="nav" aria-label="Main"><a href="collection.html?c=all">Women</a><a href="collection.html?c=kids">Kids</a><a href="index.html#occasions">Occasions</a><a href="' + CUSTOM + '" target="_blank" rel="noopener">Custom order</a></nav></div>' +
      '<a class="logo" href="index.html" aria-label="Moyoní home"><span class="pf">MOYONÍ</span><small>MADE IN TANZANIA</small></a>' +
      '<div class="hdr-r"><button class="icon-btn" data-open="search" aria-label="Search">' + ICON.search + '</button>' +
      '<button class="icon-btn" data-toast="Accounts are not part of this demo" aria-label="Account">' + ICON.user + '</button>' +
      '<button class="icon-btn" data-open="cart" aria-label="Open cart">' + ICON.bag + '<span class="badge" id="cartcount">0</span></button></div>' +
      '</div></header>';

    var f = $('#ftr-mount');
    if (f) f.innerHTML =
      '<footer class="ftr"><div class="wrap"><div class="fg">' +
      '<div><span class="pf lg">MOYONÍ</span><span class="lbl" style="display:block;margin:8px 0 0;font-size:11px;letter-spacing:.36em">MADE IN TANZANIA</span><p style="color:#CFC6B8;margin-top:18px;max-width:280px">Elegance without compromise.</p><p style="margin-top:12px">www.moyoni.co</p></div>' +
      '<div><p class="lbl">Shop</p><ul><li><a href="collection.html?c=all">Women</a></li><li><a href="collection.html?c=kids">Kids</a></li><li><a href="collection.html?c=wedding-guest">Wedding guest</a></li><li><a href="collection.html?c=church">Church &amp; modest</a></li><li><a href="collection.html?c=gala">Gala &amp; evening</a></li></ul></div>' +
      '<div><p class="lbl">Help</p><ul><li><a href="' + CUSTOM + '" target="_blank" rel="noopener">Custom orders</a></li><li><a href="#" data-open="size">Size guide</a></li><li><a href="#" data-toast="Shipping &amp; returns page comes with the build">Shipping &amp; returns</a></li><li><a href="#" data-toast="Care page comes with the build">Care</a></li><li><a href="#" data-toast="Contact page comes with the build">Contact</a></li></ul></div>' +
      '<div><p class="lbl">Stay close</p><p style="color:#CFC6B8">New pieces and atelier news, sent rarely.</p><form class="nl" data-toast="Demo only: no email was sent"><label for="nlem" style="position:absolute;left:-9999px">Email address</label><input id="nlem" type="email" placeholder="Your email"><button class="btn btn-p" type="submit" style="min-height:48px;padding:0 20px">Join</button></form></div>' +
      '</div><div class="bot"><span>© Moyoní · Design demo, not the live store</span><span>Handmade in Tanzania</span></div></div></footer>';

    var ov = document.createElement('div');
    ov.innerHTML =
      '<div id="bd"></div>' +
      '<aside class="drawer" id="p-menu" aria-label="Menu"><div class="dh"><span class="pf" style="font-size:24px;letter-spacing:.2em">MOYONÍ</span><button class="icon-btn" data-close aria-label="Close menu">' + ICON.x + '</button></div><nav class="db mlinks" aria-label="Mobile">' +
      '<a href="collection.html?c=all">Women <span>→</span></a><a href="collection.html?c=kids">Kids <span>→</span></a>' +
      '<a href="index.html#occasions">Occasions <span>→</span></a>' +
      '<a class="sub" href="collection.html?c=wedding-guest">Wedding guest</a><a class="sub" href="collection.html?c=church">Church &amp; modest</a><a class="sub" href="collection.html?c=gala">Gala &amp; evening</a><a class="sub" href="collection.html?c=sets">Two-piece sets</a><a class="sub" href="collection.html?c=kaftans">Kaftans</a>' +
      '<a href="' + CUSTOM + '" target="_blank" rel="noopener">Custom order <span>→</span></a></nav></aside>' +
      '<section id="p-search" aria-label="Search"><div class="wrap"><div class="sq"><span aria-hidden="true">' + ICON.search.replace('<svg', '<svg width="26" height="26" fill="none" stroke="#1E1B1C" stroke-width="1.5"') + '</span><label for="sq" style="position:absolute;left:-9999px">Search</label><input id="sq" type="search" placeholder="Search pieces" autocomplete="off"><button class="icon-btn" data-close aria-label="Close search">' + ICON.x + '</button></div><div class="sr" id="sr"></div></div></section>' +
      '<aside class="drawer" id="p-cart" aria-label="Cart"><div class="dh"><h2 class="pf">Your cart</h2><button class="icon-btn" data-close aria-label="Close cart">' + ICON.x + '</button></div><div class="db" id="cbody"></div><div class="df" id="cfoot"></div></aside>' +
      sizeModal() +
      '<section class="modal" id="m-check" role="dialog" aria-label="Checkout"><button class="icon-btn x" data-close aria-label="Close">' + ICON.x + '</button><span class="lbl" style="color:#C4421F">Demo</span><h2 class="pf" style="font-size:38px;font-weight:500;line-height:1.1;margin:8px 0 10px">Checkout happens <em>on Shopify</em></h2><p class="muted" style="font-size:16px;line-height:1.7">This is a design demo, so it stops here. On the real store this button takes the customer to Shopify checkout with the cart you just built.</p><p style="margin-top:22px"><button class="btn btn-p" data-close>Back to the demo</button></p></section>' +
      '<div id="toast" role="status"></div>';
    document.body.appendChild(ov);
  }

  /* ---------- panels ---------- */
  var openEl = null;
  var MAP = { menu: 'p-menu', search: 'p-search', cart: 'p-cart', size: 'm-size', check: 'm-check' };
  function openPanel(id) {
    closePanel();
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.add('open');
    $('#bd').classList.add('on');
    document.body.classList.add('lock');
    openEl = el;
    if (id === 'p-search') { var q = $('#sq'); q.value = ''; searchRender(''); setTimeout(function () { q.focus(); }, 120); }
    if (id === 'p-cart') renderCart();
    if (id === 'm-size') drawFinder();
  }
  function closePanel() {
    if (openEl) openEl.classList.remove('open');
    openEl = null;
    var bd = $('#bd'); if (bd) bd.classList.remove('on');
    document.body.classList.remove('lock');
  }
  var toastT;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 2400);
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePanel(); });
  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); openPanel(MAP[o.getAttribute('data-open')]); return; }
    if (e.target.closest('[data-close]') || e.target.id === 'bd') { closePanel(); return; }
    var a = e.target.closest('[data-act]');
    if (a) { cartAct(a.getAttribute('data-act'), a.getAttribute('data-id')); return; }
    var tt = e.target.closest('[data-toast]');
    if (tt && tt.tagName !== 'FORM') { e.preventDefault(); toast(tt.getAttribute('data-toast')); }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target.closest('[data-toast]');
    if (f) { e.preventDefault(); toast(f.getAttribute('data-toast')); }
  });

  /* ---------- cart ---------- */
  function getCart() { try { return JSON.parse(localStorage.getItem('mo-demo-cart')) || []; } catch (e) { return []; } }
  function saveCart(c) { try { localStorage.setItem('mo-demo-cart', JSON.stringify(c)); } catch (e) {} renderCart(); }
  function addToCart(p, v, q) {
    var c = getCart(), f = c.filter(function (x) { return x.vid === v.id; })[0];
    if (f) f.q += q;
    else c.push({ h: p.h, vid: v.id, t: p.t, vt: v.o.filter(function (x) { return x !== 'Default Title'; }).join(' / '), p: v.p, im: p.im[0], q: q });
    saveCart(c);
  }
  function cartAct(act, id) {
    var c = getCart(), i = c.findIndex(function (x) { return String(x.vid) === String(id); });
    if (i < 0) return;
    if (act === 'inc') c[i].q++;
    if (act === 'dec') c[i].q = Math.max(1, c[i].q - 1);
    if (act === 'rm') c.splice(i, 1);
    saveCart(c);
  }
  function renderCart() {
    var c = getCart(), n = c.reduce(function (a, x) { return a + x.q; }, 0);
    var b = $('#cartcount'); if (b) { b.textContent = n; b.classList.toggle('on', n > 0); }
    var body = $('#cbody'), foot = $('#cfoot'); if (!body) return;
    if (!c.length) {
      body.innerHTML = '<div class="empty"><p class="pf" style="font-size:26px;color:#1E1B1C">Your cart is empty</p><p style="margin:8px 0 22px">Find something made for you.</p><a class="btn btn-o" href="collection.html?c=all">Shop the collection</a></div>';
      foot.innerHTML = ''; foot.style.display = 'none'; return;
    }
    foot.style.display = '';
    body.innerHTML = c.map(function (x) {
      return '<div class="ci"><a href="product.html?p=' + esc(x.h) + '"><img src="' + im(x.im, 200) + '" alt="" width="82" height="104"></a><div>' +
        '<h3 class="pf"><a href="product.html?p=' + esc(x.h) + '">' + esc(x.t) + '</a></h3>' + (x.vt ? '<p class="vt">' + esc(x.vt) + '</p>' : '') +
        '<p style="margin:6px 0 10px">' + money(x.p) + '</p><div style="display:flex;gap:16px;align-items:center"><div class="qty"><button data-act="dec" data-id="' + x.vid + '" aria-label="Decrease quantity">−</button><span>' + x.q + '</span><button data-act="inc" data-id="' + x.vid + '" aria-label="Increase quantity">+</button></div>' +
        '<button data-act="rm" data-id="' + x.vid + '" style="font-size:13px;text-decoration:underline;text-underline-offset:4px;color:#5B5350">Remove</button></div></div></div>';
    }).join('');
    var sub = c.reduce(function (a, x) { return a + x.p * x.q; }, 0);
    var disc = n >= 2 ? sub * 0.1 : 0;
    foot.innerHTML =
      '<div class="crow"><span>Subtotal</span><span>' + money(sub) + '</span></div>' +
      (disc ? '<div class="crow" style="color:#003D38"><span>Buy 2 or more: 10% off</span><span>−' + money(disc) + '</span></div><div class="crow"><span>Shipping</span><span>Free</span></div>' : '<div class="crow"><span>Shipping</span><span class="muted">At checkout</span></div>') +
      '<div class="crow tot"><span>Total</span><span>' + money(sub - disc) + '</span></div>' +
      '<p class="cnote">' + (disc ? 'Your 10% off and free shipping are applied.' : 'Add 1 more piece to get 10% off and free shipping.') + '</p>' +
      '<button class="btn btn-p" data-open="check" style="width:100%">Checkout</button>';
  }

  /* ---------- search ---------- */
  function searchRender(q) {
    q = q.trim().toLowerCase();
    var list = q ? D.products.filter(function (p) { return p.t.toLowerCase().indexOf(q) > -1; }) : D.products.filter(function (p) { return D.featured.indexOf(p.h) > -1; });
    var el = $('#sr');
    var head = q ? '' : '<p class="lbl muted" style="margin:6px 0 4px">Popular</p>';
    el.innerHTML = head + (list.length ? list.slice(0, 8).map(function (p) {
      return '<a href="product.html?p=' + esc(p.h) + '"><img src="' + im(p.im[0], 160) + '" alt="" width="56" height="70"><span class="pf" style="font-size:20px">' + esc(p.t) + '</span><span class="muted">' + money(p.p) + '</span></a>';
    }).join('') : '<p class="muted" style="padding:18px 0">No pieces match “' + esc(q) + '”. Try “kaftan” or “set”.</p>');
  }

  /* ---------- size finder ---------- */
  function sizeModal() {
    return '<section class="modal" id="m-size" role="dialog" aria-label="Find your size"><button class="icon-btn x" data-close aria-label="Close">' + ICON.x + '</button>' +
      '<span class="lbl" style="color:#C4421F">Size guide</span><h2 class="pf" style="font-size:42px;font-weight:500;line-height:1.08;letter-spacing:-.01em;margin-top:8px">Find your <em>size</em></h2>' +
      '<p class="muted" style="font-size:16px;line-height:1.65;margin-top:10px">Move the bars to your body measurements, in inches. We suggest the best fit.</p>' +
      '<div class="tabs" role="tablist"><button class="on" data-tab="f">Find my size</button><button data-tab="c">Size chart</button><button data-tab="m">How to measure</button></div>' +
      '<div class="tp on" id="tp-f"><div class="fgrid"><div>' +
      '<div class="srow"><label for="fb">Bust</label><b id="vb">37 in</b></div><input id="fb" type="range" min="32" max="46" step="0.5" value="37">' +
      '<div class="srow"><label for="fw">Waist</label><b id="vw">29.5 in</b></div><input id="fw" type="range" min="25" max="38" step="0.5" value="29.5">' +
      '<div class="srow"><label for="fh">Hips</label><b id="vh">40 in</b></div><input id="fh" type="range" min="35" max="48" step="0.5" value="40"></div>' +
      '<svg viewBox="0 0 120 230" style="width:100%;max-width:130px;margin:0 auto;display:block" role="img" aria-label="Figure that reshapes as you move the bars"><circle cx="60" cy="22" r="13" fill="none" stroke="#1E1B1C" stroke-width="1.6"/><polygon id="fig" fill="#EADBCF" stroke="#1E1B1C" stroke-width="1.6" stroke-linejoin="round"/><line id="lb" y1="78" y2="78" stroke="#C4421F" stroke-width="2" stroke-dasharray="3 3"/><line id="lw" y1="112" y2="112" stroke="#C4421F" stroke-width="2" stroke-dasharray="3 3"/><line id="lh" y1="150" y2="150" stroke="#C4421F" stroke-width="2" stroke-dasharray="3 3"/></svg></div>' +
      '<div class="res"><div class="circ"><small>Your size</small><b id="rl">M</b></div><div><h3 class="pf" id="rt">A good fit</h3><p class="muted" id="rn" style="font-size:15px;line-height:1.6;margin-top:4px"></p></div></div>' +
      '<div style="display:flex;gap:14px;align-items:center;margin-top:18px;flex-wrap:wrap"><button class="btn btn-p" id="fcta" style="flex:1;min-width:200px">Choose size M</button><a class="tl" href="' + CUSTOM + '" target="_blank" rel="noopener">Custom order</a></div></div>' +
      '<div class="tp" id="tp-c"><p class="muted" style="font-size:16px;line-height:1.65;margin-bottom:14px">Every Moyoní piece is handmade. These are body measurements, in inches, not garment measurements.</p>' +
      '<table><thead><tr><th scope="col">Size</th><th scope="col">Bust</th><th scope="col">Waist</th><th scope="col">Hips</th></tr></thead><tbody>' +
      '<tr data-s="0"><th scope="row">S</th><td>34–35</td><td>27–28</td><td>37–38</td></tr><tr data-s="1"><th scope="row">M</th><td>36–37</td><td>29–30</td><td>39–40</td></tr><tr data-s="2"><th scope="row">L</th><td>38–40</td><td>31–33</td><td>41–43</td></tr><tr data-s="3"><th scope="row">XL</th><td>41–43</td><td>34–36</td><td>44–46</td></tr></tbody></table>' +
      '<p class="muted" style="font-size:14px;margin-top:12px">Between sizes? We recommend sizing up, or contact us for custom sizing.</p></div>' +
      '<div class="tp" id="tp-m"><ol class="mlist"><li><b class="n">1</b><span><b style="color:#1E1B1C">Bust.</b> Around the fullest part of your bust, keeping the tape level.</span></li><li><b class="n">2</b><span><b style="color:#1E1B1C">Waist.</b> Around the narrowest part of your natural waistline.</span></li><li><b class="n">3</b><span><b style="color:#1E1B1C">Hips.</b> Around the fullest part of your hips.</span></li></ol><p class="muted" style="margin-top:18px;font-size:15px">Made to order means we can also tailor a piece to your exact measurements. <a class="tl" href="' + CUSTOM + '" target="_blank" rel="noopener" style="margin-left:4px">Start a custom order</a></p></div></section>';
  }
  var FS = { b: 37, w: 29.5, h: 40 };
  var CH = [{ s: 'S', b: [34, 35], w: [27, 28], h: [37, 38] }, { s: 'M', b: [36, 37], w: [29, 30], h: [39, 40] }, { s: 'L', b: [38, 40], w: [31, 33], h: [41, 43] }, { s: 'XL', b: [41, 43], w: [34, 36], h: [44, 46] }];
  function pick(v, k) { for (var i = 0; i < CH.length; i++) { if (v <= CH[i][k][1]) return i; } return 4; }
  function inside(v, r) { return v >= r[0] && v <= r[1]; }
  var fResult = { letter: 'M', idx: 1 };
  function drawFinder() {
    var st = FS, idx = Math.max(pick(st.b, 'b'), pick(st.w, 'w'), pick(st.h, 'h')), title, note, letter, cta, sm = false;
    if (idx > 3) { letter = 'Custom'; sm = true; title = 'Beyond our standard sizes'; note = 'Your measurements are larger than our XL. A custom order is tailored exactly to you in 7 to 14 days.'; cta = 'Start a custom order'; }
    else if (st.b < 34 && st.w < 27 && st.h < 37) { letter = 'S'; idx = 0; title = 'Closest fit: size S'; note = 'Your measurements are smaller than our size S. S is the closest fit, or have it made to your measurements.'; cta = 'Choose size S'; }
    else {
      var c = CH[idx]; letter = c.s;
      if (inside(st.b, c.b) && inside(st.w, c.w) && inside(st.h, c.h)) { title = 'A good fit in size ' + letter; note = 'Your bust, waist and hips all fall within our size ' + letter + '.'; }
      else { title = 'We suggest size ' + letter; note = 'Your measurements sit between sizes, so we suggest sizing up. Or have it made to your exact measurements.'; }
      cta = 'Choose size ' + letter;
    }
    fResult = { letter: letter, idx: idx };
    $('#vb').textContent = st.b + ' in'; $('#vw').textContent = st.w + ' in'; $('#vh').textContent = st.h + ' in';
    [['fb', 32, 46, st.b], ['fw', 25, 38, st.w], ['fh', 35, 48, st.h]].forEach(function (r) {
      var p = (r[3] - r[1]) / (r[2] - r[1]) * 100, el = document.getElementById(r[0]);
      el.style.backgroundImage = 'linear-gradient(to right,#1E1B1C ' + p + '%,#D8CDBE ' + p + '%)';
      el.style.backgroundSize = '100% 4px'; el.style.backgroundPosition = 'center'; el.style.backgroundRepeat = 'no-repeat';
    });
    var cx = 60, bh = 14 + (st.b - 32) * 1.7, wh = 9 + (st.w - 25) * 1.5, hh = 15 + (st.h - 35) * 1.6;
    var pts = [[cx - 19, 50], [cx + 19, 50], [cx + bh, 78], [cx + wh, 112], [cx + hh, 150], [cx + hh - 3, 218], [cx + 6, 218], [cx + 3, 160], [cx - 3, 160], [cx - 6, 218], [cx - hh + 3, 218], [cx - hh, 150], [cx - wh, 112], [cx - bh, 78]];
    $('#fig').setAttribute('points', pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '));
    [['lb', bh], ['lw', wh], ['lh', hh]].forEach(function (l) { var e = document.getElementById(l[0]); e.setAttribute('x1', (cx - l[1]).toFixed(1)); e.setAttribute('x2', (cx + l[1]).toFixed(1)); });
    var rl = $('#rl'); rl.textContent = letter; rl.className = sm ? 'sm' : '';
    $('#rt').textContent = title; $('#rn').textContent = note; $('#fcta').textContent = cta;
    $$('#tp-c tr[data-s]').forEach(function (tr) { tr.classList.toggle('hit', Number(tr.getAttribute('data-s')) === idx && idx < 4); });
  }
  function sizeEvents() {
    ['fb', 'fw', 'fh'].forEach(function (id) {
      var el = document.getElementById(id);
      el.addEventListener('input', function () { FS[id.charAt(1)] = parseFloat(el.value); drawFinder(); });
    });
    $$('#m-size [data-tab]').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('#m-size [data-tab]').forEach(function (x) { x.classList.toggle('on', x === b); });
        $$('#m-size .tp').forEach(function (t) { t.classList.toggle('on', t.id === 'tp-' + b.getAttribute('data-tab')); });
      });
    });
    $('#fcta').addEventListener('click', function () {
      if (fResult.idx > 3) { window.open(CUSTOM, '_blank', 'noopener'); return; }
      if (MO.pickSize) { MO.pickSize(fResult.letter); } else { closePanel(); toast('Open a product to choose size ' + fResult.letter); }
    });
  }

  /* ---------- cards ---------- */
  function cardHTML(p, w) {
    var a = p.im[1] ? '<img class="alt" src="' + im(p.im[1], w || 600) + '" alt="" loading="lazy">' : '';
    return '<a class="card" href="product.html?p=' + esc(p.h) + '"><div class="ph"><img src="' + im(p.im[0], w || 600) + '" alt="' + esc(p.t) + '" loading="lazy" width="300" height="400">' + a + (p.a ? '' : '<span class="so">Sold out</span>') + '</div><div class="nm"><h3 class="pf">' + esc(p.t) + '</h3><span class="pr">' + money(p.p) + '</span></div></a>';
  }

  /* ---------- pages ---------- */
  var MO = window.MO = { pickSize: null };

  function homePage() {
    var g = $('#loved'); if (g) g.innerHTML = D.featured.slice(0, 6).map(function (h) { return byH[h] ? cardHTML(byH[h]) : ''; }).join('');
    var v = $('#hv');
    if (v && window.matchMedia('(min-width:1100px)').matches && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
      v.muted = true; v.src = 'assets/hero.mp4'; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
    }
    var fan = $('.fan');
    if (fan) {
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { fan.classList.add('in'); io.disconnect(); } }); }, { threshold: .35 });
        io.observe(fan);
      } else fan.classList.add('in');
    }
  }

  var COLL = {
    all: { t: 'Women', e: 'Shop', d: 'Every piece, handmade to order in Tanzania.' },
    'wedding-guest': { t: 'Wedding guest', e: 'Shop by occasion', d: 'Pieces to be remembered at the celebration.' },
    church: { t: 'Church & modest', e: 'Shop by occasion', d: 'Elegant, modest pieces for church and special services.' },
    gala: { t: 'Gala & evening', e: 'Shop by occasion', d: 'Statement gowns for galas, receptions and red-carpet moments.' },
    work: { t: 'Work & business', e: 'Shop by occasion', d: 'Tailored African-print pieces for the office and business events.' },
    sets: { t: 'Two-piece sets', e: 'Shop', d: 'Matching tops and skirts, made to order and easy to style.' },
    kaftans: { t: 'Kaftans', e: 'Shop', d: 'Relaxed, flowing and modest.' },
    kids: { t: 'Kids', e: 'Shop', d: '' }
  };
  function collectionPage() {
    var c = new URLSearchParams(location.search).get('c') || 'all', info = COLL[c] || COLL.all;
    document.title = info.t + ' – Moyoní (demo)';
    $('#ce').textContent = info.e; $('#ct').textContent = info.t; $('#cd').textContent = info.d;
    var crumb = $('#ccr'); if (crumb) crumb.innerHTML = '<a href="index.html">Home</a><span aria-hidden="true">/</span><span aria-current="page" style="color:#1E1B1C">' + esc(info.t) + '</span>';
    if (c === 'kids') {
      $('#cwrap').innerHTML = '<div class="soon"><h2 class="pf" style="font-size:44px;font-weight:500;line-height:1.1">Kids is <em>coming soon</em></h2><p>Photos and pieces for children are on their way. In the meantime, explore the women’s collection.</p><a class="btn btn-p" href="collection.html?c=all">Shop women</a></div>';
      return;
    }
    var handles = D.collections[c] || D.collections.all, items = handles.map(function (h) { return byH[h]; }).filter(Boolean);
    function draw() {
      var s = $('#sort').value, list = items.slice();
      if (s === 'pa') list.sort(function (a, b) { return a.p - b.p; });
      if (s === 'pd') list.sort(function (a, b) { return b.p - a.p; });
      if (s === 'az') list.sort(function (a, b) { return a.t.localeCompare(b.t); });
      $('#cc').textContent = list.length + ' pieces';
      $('#cgrid').innerHTML = list.map(function (p) { return cardHTML(p); }).join('');
    }
    $('#sort').addEventListener('change', draw); draw();
  }

  function productPage() {
    var h = new URLSearchParams(location.search).get('p'), p = byH[h], root = $('#pdp');
    if (!p) { root.innerHTML = '<div class="soon"><h2 class="pf" style="font-size:40px;font-weight:500">We could not find that piece</h2><p>It may have been renamed.</p><a class="btn btn-p" href="collection.html?c=all">Shop women</a></div>'; return; }
    document.title = p.t + ' – Moyoní (demo)';
    var opts = p.o.filter(function (o) { return o.n !== 'Title'; });
    var first = p.v.filter(function (v) { return v.a; })[0] || p.v[0], sel = first.o.slice(), qty = 1, cur = 0;
    var kind = /kaftan/i.test(p.t) ? 'Kaftans' : /\bset\b/i.test(p.t) ? 'Two-piece sets' : 'Women';
    var cl = kind === 'Women' ? 'all' : kind === 'Kaftans' ? 'kaftans' : 'sets';
    $('#pcr').innerHTML = '<a href="index.html">Home</a><span aria-hidden="true">/</span><a href="collection.html?c=all">Women</a><span aria-hidden="true">/</span>' + (kind !== 'Women' ? '<a href="collection.html?c=' + cl + '">' + kind + '</a><span aria-hidden="true">/</span>' : '') + '<span aria-current="page" style="color:#1E1B1C">' + esc(p.t) + '</span>';

    function variant() { return p.v.filter(function (v) { return v.o.join('|') === sel.join('|'); })[0]; }
    function hasSizeGuide() { return opts.some(function (o) { return o.n === 'Size' && o.v.some(function (x) { return /^(xs|s|m|l|xl|small|medium|large|x-large|extra large)$/i.test(x.trim()); }); }); }
    function render() {
      var v = variant() || first, avail = v.a;
      var pairs = (D.pairs[p.h] || []).map(function (x) { return byH[x]; }).filter(Boolean);
      var ctlBlock = function (cls, id) { return pairs.length ? '<section class="ctl ' + cls + '" aria-labelledby="' + id + '"><h2 id="' + id + '" class="pf">Complete the <em>look</em></h2><div class="cg">' + pairs.map(function (x) { return cardHTML(x, 400); }).join('') + '</div></section>' : ''; };
      var thumbs = p.im.slice(0, 8).map(function (u, i) { return '<button class="' + (i === cur ? 'on' : '') + '" data-th="' + i + '" aria-label="View photo ' + (i + 1) + '"><img src="' + im(u, 200) + '" alt="" width="76" height="96" loading="' + (i ? 'lazy' : 'eager') + '"></button>'; }).join('');
      var optHTML = opts.map(function (o, oi) {
        return '<div><div class="olbl"><span>' + esc(o.n) + ' · <b style="color:#1E1B1C;text-transform:none;letter-spacing:.04em;font-size:13px;font-weight:700">' + esc(sel[oi]) + '</b></span>' + (o.n === 'Size' && hasSizeGuide() ? '<button data-open="size">Find your size</button>' : '') + '</div><div class="pills" role="group" aria-label="' + esc(o.n) + '">' +
          o.v.map(function (x) { var ok = p.v.some(function (vv) { return vv.o[oi] === x && vv.a; }); return '<button class="pill' + (sel[oi] === x ? ' on' : '') + (ok ? '' : ' off') + '" data-o="' + oi + '" data-v="' + esc(x) + '" aria-pressed="' + (sel[oi] === x) + '">' + esc(x) + '</button>'; }).join('') + '</div></div>';
      }).join('');
      root.innerHTML =
        '<div><div class="gal"><div class="thumbs">' + thumbs + '</div><div class="main-ph"><img id="mainimg" src="' + im(p.im[cur], 1000) + '" alt="' + esc(p.t) + '" width="667" height="890"></div></div>' +
        ctlBlock('ctl-d', 'ctlh') + '</div>' +
        '<div class="pinfo"><span class="lbl muted">Women · ' + esc(kind === 'Women' ? 'Pieces' : kind) + '</span><h1 class="pf">' + esc(p.t) + '</h1>' +
        '<div style="display:flex;align-items:baseline;gap:18px;margin-top:-8px"><span class="price" id="pp">' + money(v.p) + '</span><span class="lbl muted" style="font-size:11px">Made to order</span></div><div style="height:1px;background:rgba(30,27,28,.2)"></div>' +
        optHTML +
        '<div class="buyrow"><div class="qty"><button data-q="-1" aria-label="Decrease quantity">−</button><span id="qv">' + qty + '</span><button data-q="1" aria-label="Increase quantity">+</button></div>' +
        (avail ? '<button class="btn btn-p" id="addbtn">Add to cart</button>' : '<a class="btn btn-o" href="' + CUSTOM + '" target="_blank" rel="noopener">Sold out · request a custom order</a>') + '</div>' +
        '<p class="muted" style="font-size:14px;margin-top:-10px">Buy 2 or more: 10% off and free shipping.</p>' +
        '<a class="tl" href="' + CUSTOM + '" target="_blank" rel="noopener" style="align-self:flex-start">Want it customised? Start a custom order →</a>' +
        ctlBlock('ctl-m', 'ctlh2') +
        '<p class="note-i">Made to order and hand-stitched in Tanzania. In-stock colours ship in 1 to 3 business days. Custom colours or sizes are tailored to you in 7 to 14 days.</p>' +
        '<div class="ship"><div><span><b>United States</b> · FedEx<small>Tracked, door to door</small></span><b class="e">2–5 business days</b></div><div><span><b>International</b> · DHL<small>Tracked worldwide express</small></span><b class="e">6–14 business days</b></div></div>' +
        '<div><details open><summary>Description</summary><div class="dbody">' + (p.d || '<p>Handmade in Tanzania.</p>') + '</div></details><details><summary>Fabric &amp; care</summary><div class="dbody"><p>Hand wash in cold water. Iron on the reverse side of the garment. Do not dry clean.</p></div></details><details><summary>Shipping &amp; returns</summary><div class="dbody"><p>3-day returns. Delivery estimates are shown above.</p></div></details></div></div>';
      var st = $('#stick'); if (st) { $('#stickp').textContent = money(v.p); var sb = $('#stickbtn'); sb.textContent = avail ? 'Add to cart' : 'Sold out'; sb.disabled = !avail; }
    }
    function add() {
      var v = variant() || first; if (!v.a) return;
      addToCart(p, v, qty); toast('Added to your cart'); openPanel('p-cart');
    }
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-th]'); if (t) { cur = Number(t.getAttribute('data-th')); render(); return; }
      var o = e.target.closest('[data-o]');
      if (o) {
        var oi = Number(o.getAttribute('data-o')), val = o.getAttribute('data-v'); sel[oi] = val;
        if (!variant()) { var m = p.v.filter(function (vv) { return vv.o[oi] === val; })[0]; if (m) sel = m.o.slice(); }
        render(); return;
      }
      var q = e.target.closest('[data-q]'); if (q) { qty = Math.max(1, Math.min(9, qty + Number(q.getAttribute('data-q')))); $('#qv').textContent = qty; return; }
      if (e.target.closest('#addbtn') || e.target.closest('#stickbtn')) add();
    });
    MO.pickSize = function (letter) {
      var oi = opts.findIndex(function (o) { return o.n === 'Size'; });
      if (oi < 0) { closePanel(); return; }
      var SZ = { S: ['s', 'small'], M: ['m', 'medium'], L: ['l', 'large'], XL: ['xl', 'x-large', 'extra large'] }, names = SZ[letter] || [letter.toLowerCase()];
      var val = opts[oi].v.filter(function (x) { return names.indexOf(x.trim().toLowerCase()) > -1; })[0];
      if (!val) { closePanel(); toast('Size ' + letter + ' is not offered on this piece. Try a custom order.'); return; }
      sel[oi] = val; if (!variant()) { var m = p.v.filter(function (vv) { return vv.o[oi] === val; })[0]; if (m) sel = m.o.slice(); }
      render(); closePanel(); toast('Size ' + letter + ' selected');
    };
    var st = document.createElement('div'); st.className = 'stick'; st.id = 'stick';
    st.innerHTML = '<div><div class="pf" id="stickp"></div></div><button class="btn btn-p" id="stickbtn">Add to cart</button>';
    document.body.appendChild(st);
    window.addEventListener('scroll', function () { st.classList.toggle('on', window.scrollY > 520 && window.innerWidth <= 860); }, { passive: true });
    render();
  }

  /* ---------- boot ---------- */
  chrome();
  sizeEvents();
  var qi = $('#sq'); if (qi) qi.addEventListener('input', function () { searchRender(qi.value); });
  renderCart();
  var pg = document.body.getAttribute('data-page');
  if (pg === 'home') homePage();
  if (pg === 'collection') collectionPage();
  if (pg === 'product') productPage();
  if (location.hash === '#occasions') { var oc = document.getElementById('occasions'); if (oc) setTimeout(function () { oc.scrollIntoView(); }, 60); }
})();
