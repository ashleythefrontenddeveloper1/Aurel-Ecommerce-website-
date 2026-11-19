const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const money = n => `$${Number(n).toFixed(2)}`;
const readStore = (key, fallback=[]) => { try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback} };
const saveStore = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const getProduct = id => PRODUCTS.find(p=>p.id===Number(id));
const cart = () => readStore("aurel-cart",[]);
const wishlist = () => readStore("aurel-wishlist",[]);
const cartCount = () => cart().reduce((n,item)=>n+item.qty,0);
const cartSubtotal = () => cart().reduce((n,item)=>{const p=getProduct(item.id);return n+(p?p.price*item.qty:0)},0);
const shipping = subtotal => subtotal===0||subtotal>=150?0:12;

function updateHeaderCounts(){
  const c=$("#bag-count"),w=$("#wish-count");
  if(c)c.textContent=cartCount();
  if(w)w.textContent=wishlist().length;
}

function header(){
  const host=$("#site-header");
  if(!host)return;
  host.className="site-header";
  host.innerHTML=`
<button class="menu-toggle" id="menu-toggle" aria-label="Open menu">☰</button>
<nav class="nav-left"><a class="nav-link" href="shop.html">Shop</a><a class="nav-link" href="collections.html">Collections</a><a class="nav-link" href="about.html">Our story</a></nav>
<a class="wordmark" href="index.html" aria-label="AUREL home">AUREL</a>
<nav class="nav-right"><a class="icon-link" href="#" id="search-open"><span class="icon-label">Search</span>⌕</a><a class="icon-link" href="wishlist.html">♡ <span class="icon-label">Saved</span><span class="count" id="wish-count">0</span></a><a class="icon-link" href="cart.html">♧ <span class="icon-label">Bag</span><span class="count" id="bag-count">0</span></a></nav>
<nav class="mobile-nav" id="mobile-nav"><a href="index.html">HOME</a><a href="shop.html">SHOP ALL</a><a href="collections.html">COLLECTIONS</a><a href="about.html">OUR STORY</a><a href="contact.html">CONTACT</a></nav>
<div class="search-overlay hidden" id="search-overlay"><div class="search-panel"><button class="search-close" id="search-close" aria-label="Close search">×</button><p class="eyebrow">FIND YOUR AUREL PIECE</p><form id="search-form"><input id="search-input" type="search" placeholder="Search clothing, bags, accessories…" autocomplete="off"><button type="submit">SEARCH ↗</button></form><div id="search-results"></div></div></div>`;

  $("#menu-toggle")?.addEventListener("click",()=>$("#mobile-nav").classList.toggle("open"));
  $("#search-open")?.addEventListener("click",e=>{
    e.preventDefault();
    $("#search-overlay").classList.remove("hidden");
    $("#search-input").focus();
  });
  $("#search-close")?.addEventListener("click",()=>$("#search-overlay").classList.add("hidden"));
  $("#search-overlay")?.addEventListener("click",e=>{
    if(e.target.id==="search-overlay")e.currentTarget.classList.add("hidden");
  });
  $("#search-form")?.addEventListener("submit",e=>{
    e.preventDefault();
    location.href=`shop.html?q=${encodeURIComponent($("#search-input").value.trim())}`;
  });
  $("#search-input")?.addEventListener("input",e=>{
    const q=e.target.value.toLowerCase().trim();
    const matches=PRODUCTS.filter(p=>(p.name+" "+p.category).toLowerCase().includes(q)).slice(0,4);
    $("#search-results").innerHTML=q?matches.map(p=>`<a class="search-result" href="product.html?id=${p.id}"><img src="${p.image}" alt=""><span>${p.name}<small>${money(p.price)}</small></span></a>`).join(""):"";
  });
  updateHeaderCounts();
}

function footer(){
  const f=$("#site-footer");
  if(!f)return;
  f.innerHTML=`<div class="footer-main"><div class="footer-brand"><a class="wordmark" href="index.html">AUREL</a><p>The art of everyday elegance. Considered pieces for a life well lived.</p></div><div class="footer-col"><h4>EXPLORE</h4><a href="shop.html">Shop all</a><a href="collections.html">Collections</a><a href="about.html">Our story</a><a href="contact.html">Contact</a></div><div class="footer-col"><h4>CLIENT CARE</h4><a href="contact.html">Get in touch</a><a href="cart.html">Your bag</a><a href="wishlist.html">Wishlist</a><a href="contact.html">Delivery & returns</a></div><div class="footer-col"><h4>FOLLOW AUREL</h4><a href="#">Instagram ↗</a><a href="#">Pinterest ↗</a><a href="mailto:hello@aurel.example">Email us ↗</a></div></div><div class="footer-bottom"><span>© 2026 AUREL. ALL RIGHTS RESERVED.</span><span>THE ART OF EVERYDAY ELEGANCE.</span><span>USD · DEMO STORE</span></div>`;
}

function productCard(p){
  const saved=wishlist().includes(p.id);
  return `<article class="product-card"><div class="product-image-wrap"><a href="product.html?id=${p.id}"><img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.opacity='.15'"></a>${p.tag?`<span class="product-badge">${p.tag}</span>`:""}<button class="wish-button ${saved?"active":""}" data-wish="${p.id}" aria-label="Add ${p.name} to wishlist">${saved?"♥":"♡"}</button><button class="quick-add" data-quick="${p.id}">QUICK ADD +</button></div><div class="product-info"><div><a class="product-name" href="product.html?id=${p.id}">${p.name}</a><div class="product-category">${p.category}</div></div><span class="product-price">${money(p.price)}</span></div></article>`;
}

function renderProducts(host,products){
  if(host)host.innerHTML=products.map(productCard).join("");
}

function addToCart(id,size="One size",color="Default",qty=1){
  const items=cart();
  const found=items.find(i=>i.id===Number(id)&&i.size===size&&i.color===color);
  if(found)found.qty+=qty;
  else items.push({id:Number(id),size,color,qty});
  saveStore("aurel-cart",items);
  updateHeaderCounts();
  toast("Added to your bag.");
}

function toggleWish(id){
  let list=wishlist();
  list=list.includes(Number(id))?list.filter(x=>x!==Number(id)):[...list,Number(id)];
  saveStore("aurel-wishlist",list);
  updateHeaderCounts();
  document.querySelectorAll(`[data-wish="${id}"]`).forEach(b=>{
    b.classList.toggle("active",list.includes(Number(id)));
    b.textContent=list.includes(Number(id))?"♥":"♡";
  });
  if(location.pathname.endsWith("wishlist.html"))renderWishlist();
}

function toast(message){
  let t=$("#toast");
  if(!t){
    t=document.createElement("div");
    t.id="toast";
    t.className="toast";
    document.body.append(t);
  }
  t.textContent=message;
  t.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>t.classList.remove("show"),2200);
}

document.addEventListener("click",e=>{
  const w=e.target.closest("[data-wish]");
  if(w){
    e.preventDefault();
    toggleWish(w.dataset.wish);
  }
  const q=e.target.closest("[data-quick]");
  if(q){
    const p=getProduct(q.dataset.quick);
    if(p)addToCart(p.id,p.sizes[0],p.colors[0]);
  }
});

function home(){
  renderProducts($("#featured-products"),PRODUCTS.slice(0,4));
  $("#newsletter-form")?.addEventListener("submit",e=>{
    e.preventDefault();
    $("#newsletter-message").textContent="Thank you — you're on the list.";
    e.target.reset();
  });
}

function shop(){
  const host=$("#shop-products");
  if(!host)return;
  const params=new URLSearchParams(location.search);
  let category=params.get("category")||"All",query=params.get("q")||"";
  const chips=$("#category-filters");
  function draw(){
    let list=PRODUCTS.filter(p=>(category==="All"||p.category===category)&&(`${p.name} ${p.category} ${p.description}`).toLowerCase().includes(query.toLowerCase()));
    const sort=$("#sort-select").value;
    if(sort==="price-low")list.sort((a,b)=>a.price-b.price);
    if(sort==="price-high")list.sort((a,b)=>b.price-a.price);
    if(sort==="name")list.sort((a,b)=>a.name.localeCompare(b.name));
    renderProducts(host,list);
    $("#result-count").textContent=`${list.length} PIECES`;
    $("#no-products").classList.toggle("hidden",list.length!==0);
    $$(".chip",chips).forEach(b=>b.classList.toggle("active",b.dataset.category===category));
  }
  chips?.addEventListener("click",e=>{
    const b=e.target.closest("[data-category]");
    if(!b)return;
    category=b.dataset.category;
    draw();
  });
  $("#sort-select")?.addEventListener("change",draw);
  draw();
}

function productPage(){
  const host=$("#product-detail");
  if(!host)return;
  const p=getProduct(new URLSearchParams(location.search).get("id"));
  if(!p){
    host.innerHTML='<p class="empty-state">We could not find that piece. <a href="shop.html">Return to the collection ↗</a></p>';
    return;
  }
  document.title=`${p.name} — AUREL`;
  const pics=p.images?.length?p.images:[p.image,p.image];
  let selectedSize=p.sizes[0],selectedColor=p.colors[0];
  host.innerHTML=`<div class="product-detail-layout"><div class="product-gallery">${pics.slice(0,3).map(src=>`<img src="${src}" alt="${p.name}" onerror="this.style.opacity='.15'">`).join("")}</div><div class="product-detail-info"><p class="eyebrow">${p.category.toUpperCase()} · AUREL</p><h1>${p.name}</h1><div class="detail-price">${money(p.price)}</div><p class="detail-description">${p.description}</p><span class="option-label">SELECT SIZE · <span id="selected-size">${selectedSize}</span></span><div class="size-options">${p.sizes.map((s,i)=>`<button class="size-option ${i===0?"selected":""}" data-size="${s}">${s}</button>`).join("")}</div><span class="option-label">COLOUR · <span id="selected-color">${selectedColor}</span></span><div class="color-options">${p.colors.map((c,i)=>`<button class="color-dot ${i===0?"selected":""}" style="background:${({Sand:"#c7b59e",Black:"#242321",Ivory:"#eee9df",Blue:"#7c91a3",Espresso:"#49372d",Tan:"#b68b61",Chocolate:"#594236",Oat:"#cbbda7",Charcoal:"#454440",White:"#fff",Stone:"#aaa092",Olive:"#73755a",Brown:"#76513a",Gold:"#c6a45e",Silver:"#b9b9b9",Tortoise:"#73533c",Taupe:"#9b8979",Camel:"#b28a60"})[c]||"#aaa"}" data-color="${c}" aria-label="${c}"></button>`).join("")}</div><div class="detail-actions"><button class="button button-dark" id="add-detail">ADD TO BAG — ${money(p.price)}</button><button class="detail-wish" id="detail-wish" aria-label="Add to wishlist">${wishlist().includes(p.id)?"♥":"♡"}</button></div><div class="detail-meta">COMPLIMENTARY SHIPPING ON ORDERS OVER $150<br>CAREFULLY CONSIDERED. MADE FOR EVERY DAY.</div><details class="detail-accordion"><summary>PRODUCT DETAILS</summary><p>${p.description} Designed to become part of your everyday rotation.</p></details><details class="detail-accordion"><summary>DELIVERY & RETURNS</summary><p>Demo store information: shipping is complimentary over $150. Please contact our team for order and return enquiries.</p></details></div></div>`;
  $$("[data-size]",host).forEach(b=>b.addEventListener("click",()=>{
    selectedSize=b.dataset.size;
    $$("[data-size]",host).forEach(x=>x.classList.toggle("selected",x===b));
    $("#selected-size").textContent=selectedSize;
  }));
  $$("[data-color]",host).forEach(b=>b.addEventListener("click",()=>{
    selectedColor=b.dataset.color;
    $$("[data-color]",host).forEach(x=>x.classList.toggle("selected",x===b));
    $("#selected-color").textContent=selectedColor;
  }));
  $("#add-detail").addEventListener("click",()=>addToCart(p.id,selectedSize,selectedColor));
  $("#detail-wish").addEventListener("click",()=>{
    toggleWish(p.id);
    $("#detail-wish").textContent=wishlist().includes(p.id)?"♥":"♡";
  });
  renderProducts($("#related-products"),PRODUCTS.filter(x=>x.category===p.category&&x.id!==p.id).slice(0,4));
}

function renderWishlist(){
  const host=$("#wishlist-products");
  if(!host)return;
  const items=PRODUCTS.filter(p=>wishlist().includes(p.id));
  renderProducts(host,items);
  $("#wishlist-empty").classList.toggle("hidden",items.length!==0);
}

function renderCart(){
  const host=$("#cart-content");
  if(!host)return;
  const items=cart();
  if(!items.length){
    host.innerHTML='<div class="empty-state">Your bag is currently empty.<br><br><a class="button button-dark" href="shop.html">DISCOVER THE COLLECTION ↗</a></div>';
    return;
  }
  const subtotal=cartSubtotal(),ship=shipping(subtotal);
  host.innerHTML=`<div class="cart-layout"><div>${items.map(i=>{const p=getProduct(i.id);if(!p)return"";return `<div class="cart-row"><a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a><div><h3>${p.name}</h3><p>${i.color} · ${i.size}</p><p>${money(p.price)}</p><div class="qty-control"><button data-qty="${p.id}" data-size="${i.size}" data-color="${i.color}" data-delta="-1">−</button><span>${i.qty}</span><button data-qty="${p.id}" data-size="${i.size}" data-color="${i.color}" data-delta="1">+</button></div><button class="remove-button" data-remove="${p.id}" data-size="${i.size}" data-color="${i.color}">REMOVE</button></div><b>${money(p.price*i.qty)}</b></div>`}).join("")}</div><aside class="cart-summary"><h2>Order summary</h2><div class="summary-line"><span>Subtotal</span><span>${money(subtotal)}</span></div><div class="summary-line"><span>Shipping</span><span>${ship===0?"Complimentary":money(ship)}</span></div><div class="summary-line summary-total"><span>Total</span><span>${money(subtotal+ship)}</span></div><p class="shipping-note">${subtotal>=150?"You've unlocked complimentary shipping.":"Complimentary shipping on orders over $150."}</p><a class="button button-dark full-button" href="checkout.html">CONTINUE TO CHECKOUT ↗</a><a class="text-link" style="display:inline-block;margin-top:20px" href="shop.html">CONTINUE SHOPPING</a></aside></div>`;
  $$("[data-qty]",host).forEach(b=>b.addEventListener("click",()=>{
    let a=cart(),i=a.find(x=>x.id===Number(b.dataset.qty)&&x.size===b.dataset.size&&x.color===b.dataset.color);
    if(i){
      i.qty+=Number(b.dataset.delta);
      if(i.qty<=0)a=a.filter(x=>x!==i);
      saveStore("aurel-cart",a);
      updateHeaderCounts();
      renderCart();
    }
  }));
  $$("[data-remove]",host).forEach(b=>b.addEventListener("click",()=>{
    saveStore("aurel-cart",cart().filter(x=>!(x.id===Number(b.dataset.remove)&&x.size===b.dataset.size&&x.color===b.dataset.color)));
    updateHeaderCounts();
    renderCart();
  }));
}

function checkout(){
  const form=$("#checkout-form");
  if(!form)return;
  const items=cart();
  if(!items.length){
    $("#checkout-summary").innerHTML='<p>Your bag is empty. <a href="shop.html">Shop the collection ↗</a></p>';
    form.classList.add("hidden");
    return;
  }
  const subtotal=cartSubtotal(),ship=shipping(subtotal);
  $("#checkout-summary").innerHTML=`<h2>Your order</h2>${items.map(i=>{const p=getProduct(i.id);return `<div class="order-item"><span>${p.name} × ${i.qty}<br><small>${i.color} · ${i.size}</small></span><b>${money(p.price*i.qty)}</b></div>`}).join("")}<div class="summary-line"><span>Subtotal</span><span>${money(subtotal)}</span></div><div class="summary-line"><span>Shipping</span><span>${ship===0?"Complimentary":money(ship)}</span></div><div class="summary-line summary-total"><span>Total</span><span>${money(subtotal+ship)}</span></div>`;
  form.addEventListener("submit",e=>{
    e.preventDefault();
    if(!form.reportValidity())return;
    const order="AUR-"+Math.random().toString(36).slice(2,8).toUpperCase();
    saveStore("aurel-last-order",{order,total:subtotal+ship,email:form.email.value});
    saveStore("aurel-cart",[]);
    location.href="success.html";
  });
}

function success(){
  const n=$("#order-number");
  if(!n)return;
  const o=readStore("aurel-last-order",null);
  n.textContent=o?`DEMO ORDER ${o.order} · ${money(o.total)}`:"DEMO ORDER CONFIRMED";
}

function contact(){
  const f=$("#contact-form");
  f?.addEventListener("submit",e=>{
    e.preventDefault();
    $("#contact-message").textContent="Thank you for your message. This demo form is ready to be connected to an email service.";
    f.reset();
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  header();
  footer();
  home();
  shop();
  productPage();
  renderWishlist();
  renderCart();
  checkout();
  success();
  contact();
});