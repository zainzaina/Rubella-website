/* Simple cart & UI interactions (static demo) */
const CART_KEY = 'rubella_cart_v1';

const PRODUCTS = [
  {
    id: 'p1',
    name: 'عباية كلاسيك',
    price: 120,
    category: 'abayas',
    colors: ['بني', 'بيج', 'أسود'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'تصميم كلاسيكي بخامة ناعمة وتفاصيل أنيقة، مناسب للإطلالات اليومية والمناسبات.',
    images: [
      'assets/images/classic abaya.jpg',
      'assets/images/classic abaya.jpg',
      'assets/images/classic abaya.jpg'
    ]
  },
  {
    id: 'p2',
    name: 'فستان ساتان',
    price: 199,
    category: 'dresses',
    colors: ['خمري', 'بيج'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'فستان ساتان بلمعة هادئة وقصّة راقية تمنحك حضوراً فاخراً.',
    images: [
      'assets/images/satin dress.jpg',
      'assets/images/satin dress.jpg',
      'assets/images/satin dress.jpg'
    ]
  },
  {
    id: 'p3',
    name: 'قميص حرير',
    price: 120,
    category: 'modest',
    colors: ['عاجي', 'بيج', 'بني'],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'قميص حرير بخفة عالية ولمسة ناعمة، يناسب التنسيقات اليومية الراقية.',
    images: [
      'assets/images/silk shirt.jpg',
      'assets/images/silk shirt.jpg',
      'assets/images/silk shirt.jpg'
    ]
  },
  {
    id: 'p4',
    name: 'عباية مطرزة',
    price: 150,
    category: 'abayas',
    colors: ['بني', 'أسود'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'عباية مطرزة بتفاصيل دقيقة وتطريز ناعم يضيف فخامة بدون مبالغة.',
    images: [
      'assets/images/hand made abaya.jpg',
      'assets/images/hand made abaya.jpg',
      'assets/images/hand made abaya.jpg'
    ]
  },
  {
    id: 'p5',
    name: 'جاكيت كتان',
    price: 200,
    category: 'modest',
    colors: ['بيج', 'بني'],
    sizes: ['S', 'M', 'L'],
    description: 'جاكيت كتان عملي بقصّة مستقيمة ولمسة طبيعية، مثالي للأيام المعتدلة.',
    images: [
      'assets/images/linen jacket.jpg',
      'assets/images/linen jacket.jpg',
      'assets/images/linen jacket.jpg'
    ]
  }
];

function getProductById(id){return PRODUCTS.find(p=>p.id===id)}
function formatMoney(n){return `${Number(n).toFixed(2)} JD`}
function getQueryParam(name){try{return new URLSearchParams(window.location.search).get(name)}catch(e){return null}}
function getCart(){try{return JSON.parse(localStorage.getItem(CART_KEY))||[];}catch(e){return []}}

function renderShopProducts(){
  const grid=document.getElementById('shop-grid');
  if(!grid) return;

  const sizeEl=document.getElementById('filter-size');
  const colorEl=document.getElementById('filter-color');
  const priceEl=document.getElementById('filter-price');
  const priceValue=document.getElementById('filter-price-value');
  const sortEl=document.getElementById('sort-select');

  const size=sizeEl ? sizeEl.value : 'all';
  const color=colorEl ? colorEl.value : 'all';
  const maxPrice=priceEl ? Number(priceEl.value||'999999') : 999999;
  const sort=sortEl ? sortEl.value : 'newest';
  if(priceEl && priceValue){priceValue.textContent=String(maxPrice)}

  let items=[...PRODUCTS];
  items=items.filter(p=>p.price<=maxPrice);
  if(size!=='all') items=items.filter(p=>p.sizes.includes(size));
  if(color!=='all') items=items.filter(p=>p.colors.includes(color));

  if(sort==='price_asc') items.sort((a,b)=>a.price-b.price);
  if(sort==='price_desc') items.sort((a,b)=>b.price-a.price);

  grid.innerHTML='';
  items.forEach(p=>{
    const card=document.createElement('div');
    card.className='product-card reveal';
    const img=p.images[0];
    card.innerHTML=`
      <div class="product-media"><img src="${img}" alt="${p.name}" loading="lazy"></div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="price">${formatMoney(p.price)}</div>
        <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap">
          <a class="btn btn-secondary" href="product.html?id=${p.id}">عرض</a>
          <a class="btn" href="cart.html" onclick="addToCart('${p.id}','${p.name}',${p.price})">أضف إلى السلة</a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  setupReveal();
}

function setupShopFilters(){
  const sizeEl=document.getElementById('filter-size');
  const colorEl=document.getElementById('filter-color');
  const priceEl=document.getElementById('filter-price');
  const sortEl=document.getElementById('sort-select');

  if(sizeEl) sizeEl.addEventListener('change',()=>applyFilters());
  if(colorEl) colorEl.addEventListener('change',()=>applyFilters());
  if(priceEl) priceEl.addEventListener('change',()=>applyFilters());
  if(priceEl) priceEl.addEventListener('input',()=>applyFilters());
  if(sortEl) sortEl.addEventListener('change',()=>applyFilters());
}

function initProductPage(){
  const root=document.getElementById('product-root');
  if(!root) return;

  const id=getQueryParam('id') || 'p1';
  const p=getProductById(id) || getProductById('p1');

  const nameEl=document.getElementById('product-name');
  const priceEl=document.getElementById('product-price');
  const descEl=document.getElementById('product-desc');
  const imgEl=document.getElementById('product-image');
  const thumbsEl=document.getElementById('product-thumbs');
  const sizesEl=document.getElementById('product-sizes');
  const colorsEl=document.getElementById('product-colors');
  const addBtn=document.getElementById('add-to-cart-btn');

  if(nameEl) nameEl.textContent=p.name;
  if(priceEl) priceEl.textContent=formatMoney(p.price);
  if(descEl) descEl.textContent=p.description;
  if(imgEl) imgEl.src=p.images[0];

  if(thumbsEl){
    thumbsEl.innerHTML='';
    p.images.slice(0,3).forEach((src,idx)=>{
      const t=document.createElement('img');
      t.src=src;
      t.alt='';
      t.loading='lazy';
      t.addEventListener('click',()=>{if(imgEl) imgEl.src=src});
      if(idx===0) t.style.outline='2px solid rgba(88,15,15,0.25)';
      thumbsEl.appendChild(t);
    });
  }

  if(colorsEl){
    colorsEl.innerHTML='';
    p.colors.forEach(c=>{
      const o=document.createElement('option');
      o.textContent=c;
      colorsEl.appendChild(o);
    });
  }

  if(sizesEl){
    sizesEl.innerHTML='';
    p.sizes.forEach((s,idx)=>{
      const b=document.createElement('button');
      b.type='button';
      b.className='pill';
      b.dataset.active=idx===0?'true':'false';
      b.textContent=s;
      sizesEl.appendChild(b);
    });
  }

  setupPills();
  setupReveal();

  if(addBtn){
    addBtn.addEventListener('click',()=>addToCart(p.id,p.name,p.price));
  }
}
function saveCart(c){localStorage.setItem(CART_KEY,JSON.stringify(c));updateCartCount();}
function addToCart(id,name,price){let c=getCart();let item=c.find(i=>i.id===id);if(item){item.qty+=1}else{c.push({id,name,price,qty:1})}saveCart(c)}
function updateCartCount(){const el=document.querySelector('#cart-count');if(!el) return;const c=getCart();const total=c.reduce((s,i)=>s+i.qty,0);el.textContent=total}
function removeItem(id){let c=getCart();c=c.filter(i=>i.id!==id);saveCart(c);renderCart();}
function changeQty(id,delta){let c=getCart();let item=c.find(i=>i.id===id);if(!item) return;item.qty=Math.max(1,item.qty+delta);saveCart(c);renderCart();}
function renderCart(){
  const list=document.querySelector('#cart-list');
  const totalEl=document.querySelector('#cart-total');
  if(!list) return;

  const c=getCart();
  list.innerHTML='';
  let total=0;

  if(c.length===0){
    list.innerHTML='<div class="muted">لا توجد منتجات في السلة.</div>';
    if(totalEl) totalEl.textContent='0.00';
    updateCartCount();
    return;
  }

  c.forEach(i=>{
    total+=i.price*i.qty;
    const row=document.createElement('div');
    row.className='cart-row reveal';
    row.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;flex:1;min-width:220px">
        <div>
          <div style="font-weight:900;color:var(--accent)">${i.name}</div>
          <div class="muted">${i.price.toFixed(2)} JD</div>
        </div>
      </div>
      <div class="qty" style="margin-right:auto">
        <button type="button" onclick="changeQty('${i.id}',-1)">-</button>
        <span style="min-width:24px;text-align:center;font-weight:900">${i.qty}</span>
        <button type="button" onclick="changeQty('${i.id}',1)">+</button>
      </div>
      <button type="button" onclick="removeItem('${i.id}')">حذف</button>
    `;
    list.appendChild(row);
  });

  if(totalEl) totalEl.textContent=total.toFixed(2);
  updateCartCount();
  setupReveal();
}

function setupReveal(){
  const nodes=[...document.querySelectorAll('.reveal:not(.in-view)')];
  if(nodes.length===0) return;

  if(!('IntersectionObserver' in window)){
    nodes.forEach(n=>n.classList.add('in-view'));
    return;
  }

  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  },{threshold:0.12,rootMargin:'0px 0px -10% 0px'});

  nodes.forEach(n=>io.observe(n));
}

function setupPills(){
  const groups=[...document.querySelectorAll('[data-pill-group]')];
  groups.forEach(group=>{
    const pills=[...group.querySelectorAll('.pill')];
    pills.forEach(p=>{
      p.addEventListener('click',()=>{
        pills.forEach(x=>x.dataset.active='false');
        p.dataset.active='true';
      });
    });
  });
}

function setupBrandLogo(){
  const logos=[...document.querySelectorAll('.brand-logo')];
  logos.forEach(img=>{
    const brand=img.closest('.brand');
    if(!brand) return;

    const markLoaded=()=>brand.classList.add('has-logo');

    if(img.complete && img.naturalWidth>0){
      markLoaded();
      return;
    }

    img.addEventListener('load',markLoaded,{once:true});
  });
}

function ensureHeaderOverlays(){
  if(document.getElementById('search-overlay')) return;

  const tpl=`
  <div class="overlay" id="search-overlay" data-open="false" aria-hidden="true">
    <div class="overlay-backdrop" data-overlay-backdrop></div>
    <div class="overlay-panel" role="dialog" aria-modal="true" aria-label="بحث">
      <div class="overlay-head">
        <h3 class="overlay-title">بحث</h3>
        <button class="overlay-close" type="button" data-overlay-close aria-label="إغلاق">✕</button>
      </div>
      <div class="search-input">
        <input id="search-input" type="search" placeholder="ابحث عن منتج…" autocomplete="off">
      </div>
      <div id="search-results" class="search-results"></div>
    </div>
  </div>

  <div class="overlay" id="user-overlay" data-open="false" aria-hidden="true">
    <div class="overlay-backdrop" data-overlay-backdrop></div>
    <div class="overlay-panel" role="dialog" aria-modal="true" aria-label="User">
      <div class="overlay-head">
        <h3 class="overlay-title">User</h3>
        <button class="overlay-close" type="button" data-overlay-close aria-label="إغلاق">✕</button>
      </div>
      <div class="user-card">
        <div class="user-avatar">U</div>
        <div class="user-meta">
          <div class="u">User</div>
          <div class="s">تجربة واجهة فقط (بدون تسجيل حقيقي)</div>
        </div>
      </div>
      <div class="user-actions">
        <a class="btn btn-secondary" href="shop.html">المتجر</a>
        <a class="btn btn-secondary" href="policies.html">السياسات</a>
        <a class="btn" href="#" data-user-close>إغلاق</a>
      </div>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML('beforeend', tpl);
}

function setOverlayOpen(overlay, open){
  if(!overlay) return;
  overlay.dataset.open=open?'true':'false';
  overlay.setAttribute('aria-hidden', open?'false':'true');
}

function renderSearchResults(query){
  const resultsEl=document.getElementById('search-results');
  if(!resultsEl) return;

  const q=String(query||'').trim();
  let items=[...PRODUCTS];

  if(q){
    const ql=q.toLowerCase();
    items=items.filter(p=>{
      const name=(p.name||'').toLowerCase();
      const cat=(p.category||'').toLowerCase();
      return name.includes(ql) || cat.includes(ql);
    });
  }

  items=items.slice(0,6);

  if(items.length===0){
    resultsEl.innerHTML='<div class="search-empty">لا توجد نتائج.</div>';
    return;
  }

  resultsEl.innerHTML=items.map(p=>{
    const img=(p.images && p.images[0]) ? p.images[0] : '';
    return `
      <a class="search-item" href="product.html?id=${p.id}">
        <img src="${img}" alt="${p.name}" loading="lazy">
        <div class="meta">
          <div class="name">${p.name}</div>
          <div class="sub">${formatMoney(p.price)}</div>
        </div>
        <span class="btn btn-secondary" style="pointer-events:none">عرض</span>
      </a>
    `;
  }).join('');
}

function initHeaderOverlays(){
  ensureHeaderOverlays();

  const searchOverlay=document.getElementById('search-overlay');
  const userOverlay=document.getElementById('user-overlay');
  const searchInput=document.getElementById('search-input');

  const closeAll=()=>{setOverlayOpen(searchOverlay,false);setOverlayOpen(userOverlay,false)};

  document.querySelectorAll('[data-action="search"]').forEach(btn=>{
    btn.addEventListener('click',(e)=>{
      e.preventDefault();
      closeAll();
      setOverlayOpen(searchOverlay,true);
      renderSearchResults('');
      setTimeout(()=>{if(searchInput) searchInput.focus()},0);
    });
  });

  document.querySelectorAll('[data-action="user"]').forEach(btn=>{
    btn.addEventListener('click',(e)=>{
      e.preventDefault();
      closeAll();
      setOverlayOpen(userOverlay,true);
    });
  });

  document.querySelectorAll('[data-overlay-close]').forEach(b=>b.addEventListener('click',()=>closeAll()));
  document.querySelectorAll('[data-overlay-backdrop]').forEach(b=>b.addEventListener('click',()=>closeAll()));
  document.querySelectorAll('[data-user-close]').forEach(b=>b.addEventListener('click',(e)=>{e.preventDefault();closeAll()}));

  if(searchInput){
    searchInput.addEventListener('input',()=>renderSearchResults(searchInput.value));
  }

  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape') closeAll();
  });
}

document.addEventListener('DOMContentLoaded',()=>{updateCartCount();renderCart();setupReveal();setupPills();setupBrandLogo();renderShopProducts();initProductPage();setupShopFilters();initHeaderOverlays();});
function applyFilters(){renderShopProducts();}
