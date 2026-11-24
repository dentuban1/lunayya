/* ===================================================
   app.js — Lunayya
=================================================== */
const WHATSAPP_NUMBER = "62881026285218";

/* ===== STATE ===== */
let products = [];
let cart     = [];

/* ===== HELPERS ===== */
const fmt        = n  => "Rp " + n.toLocaleString("id-ID");
const totalPrice = () => cart.reduce((s,i) => s + i.price * i.qty, 0);
const totalQty   = () => cart.reduce((s,i) => s + i.qty, 0);

/* ============================================================
   HERO CAROUSEL
============================================================ */
let currentSlide  = 0;
const totalSlides = 3;
let carouselTimer = null;

function goToSlide(n) {
  document.querySelectorAll(".hero-slide").forEach((s,i) => s.classList.toggle("active", i===n));
  document.querySelectorAll(".dot").forEach((d,i) => d.classList.toggle("active", i===n));
  currentSlide = n;
  resetCarouselTimer();
}

function moveCarousel(dir) {
  goToSlide((currentSlide + dir + totalSlides) % totalSlides);
}

function resetCarouselTimer() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => moveCarousel(1), 5000);
}

/* ============================================================
   NAVBAR
============================================================ */
function toggleMobileNav() {
  document.getElementById("mobileNav").classList.toggle("open");
}

window.addEventListener("scroll", () => {
  document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 20);
});

/* ============================================================
   SETTINGS (logo, hero images, testimoni)
============================================================ */
async function loadSettings() {
  try {
    const res = await fetch("settings.json?v=" + Date.now());
    if (!res.ok) return;
    const s = await res.json();

    // Logo
    if (s.logo) {
      const img  = document.getElementById("siteLogo");
      const fImg = document.getElementById("footerLogo");
      const txt  = document.getElementById("logoText");
      const fTxt = document.getElementById("footerLogoText");
      img.src  = s.logo; img.style.display  = "block"; txt.style.display  = "none";
      fImg.src = s.logo; fImg.style.display = "block"; fTxt.style.display = "none";
    }

    // Hero carousel images
    if (s.heroImages) {
      s.heroImages.forEach((url, i) => {
        const wrap = document.getElementById(`slideImg${i}`);
        if (!wrap || !url) return;
        wrap.innerHTML = `<img src="${url}" alt="hero ${i+1}" style="width:100%;height:100%;object-fit:cover"/>`;
      });
    }

    // Testimoni
    if (s.testimoni && s.testimoni.length) {
      const grid = document.getElementById("testiGrid");
      grid.innerHTML = s.testimoni.map(url =>
        `<div class="testi-card"><img src="${url}" alt="testimoni" loading="lazy"/></div>`
      ).join("");
    }
  } catch(e) {
    console.warn("settings.json tidak ditemukan, pakai default.");
  }
}

/* ============================================================
   KATALOG
============================================================ */
function renderProducts() {
  const track = document.getElementById("productTrack");
  if (!track) return;
  if (!products.length) {
    track.innerHTML = `<div style="padding:40px;color:#aaa;text-align:center;width:100%">Belum ada produk. Tambahkan di Admin Panel.</div>`;
    return;
  }
  track.innerHTML = products.map(p => `
    <div class="product-card" id="card-${p.id}">
      <div class="product-img">
        ${p.image
          ? `<img src="${p.image}" alt="${p.name}" loading="lazy"/>`
          : p.emoji}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${fmt(p.price)}</div>
        <div class="product-controls">
          <select id="size-${p.id}" aria-label="Pilih ukuran">
            <option value="">— Pilih Ukuran —</option>
            ${p.sizes.map(s=>`<option>${s}</option>`).join("")}
          </select>
          <select id="color-${p.id}" aria-label="Pilih warna">
            <option value="">— Pilih Warna —</option>
            ${p.colors.map(c=>`<option>${c}</option>`).join("")}
          </select>
          <button class="add-btn" onclick="addToCart(${p.id})">+ Tambah ke Pesanan</button>
        </div>
      </div>
    </div>`
  ).join("");
}

function initSlider() {
  const track = document.getElementById("productTrack");
  const prev  = document.getElementById("sliderPrev");
  const next  = document.getElementById("sliderNext");
  if (!track||!prev||!next) return;
  prev.addEventListener("click", () => track.scrollBy({left:-260,behavior:"smooth"}));
  next.addEventListener("click", () => track.scrollBy({left: 260,behavior:"smooth"}));
}

/* ============================================================
   CART
============================================================ */
function addToCart(id) {
  const p     = products.find(x => x.id===id);
  const size  = document.getElementById(`size-${id}`).value;
  const color = document.getElementById(`color-${id}`).value;
  if (!size)  { alert("Pilih ukuran dulu ya! 😊"); return; }
  if (!color) { alert("Pilih warna dulu ya! 😊"); return; }
  const key      = `${id}-${size}-${color}`;
  const existing = cart.find(i => i.key===key);
  if (existing) { existing.qty++; }
  else { cart.push({key,id,name:p.name,emoji:p.emoji||"👗",image:p.image||null,price:p.price,size,color,qty:1}); }
  updateCart();
  flashCard(id);
}

function removeFromCart(key) { cart = cart.filter(i => i.key!==key); updateCart(); }

function flashCard(id) {
  const card = document.getElementById(`card-${id}`);
  if (!card) return;
  card.style.outline = "3px solid #7c3aed";
  setTimeout(() => card.style.outline = "", 700);
}

function updateCart() {
  const qty   = totalQty();
  const total = totalPrice();
  document.getElementById("cartCount").textContent   = qty;
  document.getElementById("stickyCount").textContent = qty;
  document.getElementById("stickyTotal").textContent = fmt(total);
  document.getElementById("stickyCart").classList.toggle("show", qty>0);

  const list = document.getElementById("orderList");
  if (!cart.length) {
    list.innerHTML = `<p class="empty-msg">Belum ada produk ditambahkan.</p>`;
  } else {
    list.innerHTML = cart.map(i => `
      <div class="order-item">
        <div class="order-item-emoji">
          ${i.image ? `<img src="${i.image}" style="width:36px;height:36px;object-fit:cover;border-radius:8px"/>` : i.emoji}
        </div>
        <div class="order-item-info">
          <div class="order-item-name">${i.name}</div>
          <div class="order-item-detail">${i.size} · ${i.color} · ${i.qty} pcs</div>
        </div>
        <div class="order-item-price">${fmt(i.price*i.qty)}</div>
        <button class="remove-btn" onclick="removeFromCart('${i.key}')" title="Hapus">×</button>
      </div>`
    ).join("");
  }
  document.getElementById("orderTotal").textContent = fmt(total);
}

/* ============================================================
   FORM & WA
============================================================ */
function validate() {
  const nama   = document.getElementById("nama").value.trim();
  const wa     = document.getElementById("wa").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  let ok = true;
  const setErr = (errId, cond) => { document.getElementById(errId).classList.toggle("visible",cond); if(cond) ok=false; };
  setErr("namaErr",   nama.length < 2);
  setErr("waErr",     !/^(\+62|62|0)[0-9]{8,13}$/.test(wa));
  setErr("alamatErr", alamat.length < 10);
  return ok;
}

function buildWAMessage() {
  const nama    = document.getElementById("nama").value.trim();
  const wa      = document.getElementById("wa").value.trim();
  const alamat  = document.getElementById("alamat").value.trim();
  const catatan = document.getElementById("catatan").value.trim();
  let msg  = `🌙 *Pesanan Baru – Lunayya*\n\n`;
  msg += `👤 *Nama:* ${nama}\n📱 *WhatsApp:* ${wa}\n📦 *Alamat:* ${alamat}\n`;
  if (catatan) msg += `📝 *Catatan:* ${catatan}\n`;
  msg += `\n🛒 *Daftar Pesanan:*\n`;
  cart.forEach((i,idx) => { msg += `${idx+1}. ${i.name} – ${i.size} – ${i.color} ×${i.qty} = ${fmt(i.price*i.qty)}\n`; });
  msg += `\n💰 *Total: ${fmt(totalPrice())}*\n\nMohon konfirmasi pesanan saya. Terima kasih! 🙏`;
  return msg;
}

/* ============================================================
   INIT
============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  // Load products
  try {
    const res = await fetch("products.json?v=" + Date.now());
    const data = await res.json();
    products = data.filter(p => p.active !== false);
  } catch(e) { console.warn("Gagal memuat products.json", e); }

  // Load settings (logo, hero, testimoni)
  await loadSettings();

  renderProducts();
  initSlider();
  updateCart();
  resetCarouselTimer();
  document.getElementById("year").textContent = new Date().getFullYear();

  document.getElementById("orderForm").addEventListener("submit", e => {
    e.preventDefault();
    if (!cart.length) { alert("Tambah produk dulu ke pesanan ya! 😊"); return; }
    if (!validate()) return;
    const msg = encodeURIComponent(buildWAMessage());
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    document.getElementById("waFallback").href = url;
    window.open(url, "_blank");
    document.getElementById("modalOverlay").classList.add("show");
  });
});

/* ============================================================
   UTILS
============================================================ */
function scrollToOrder() { document.getElementById("pesanan").scrollIntoView({behavior:"smooth"}); }
function closeModal()    { document.getElementById("modalOverlay").classList.remove("show"); }
