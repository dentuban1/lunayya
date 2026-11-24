/* ===================================================
   app.js — John Clothes
   Ganti WHATSAPP_NUMBER dengan nomor WA penjual (tanpa +)
   Contoh: "628123456789"
=================================================== */
const WHATSAPP_NUMBER = "6281234567890"; // ← GANTI DI SINI

/* ===== DATA PRODUK ===== */
const products = [
  {
    id: 1,
    name: "Dress Floral Chic",
    price: 185000,
    emoji: "👗",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Pink", "Putih", "Kuning"],
  },
  {
    id: 2,
    name: "Blouse Casual Linen",
    price: 135000,
    emoji: "👚",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Putih", "Cream", "Biru Muda"],
  },
  {
    id: 3,
    name: "Rok Plisket Midi",
    price: 155000,
    emoji: "🩱",
    sizes: ["S", "M", "L"],
    colors: ["Hitam", "Coklat", "Dusty Pink"],
  },
  {
    id: 4,
    name: "Kemeja Tie-Dye",
    price: 120000,
    emoji: "🎨",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Lavender", "Mint", "Peach"],
  },
  {
    id: 5,
    name: "Cardigan Knit Soft",
    price: 210000,
    emoji: "🧥",
    sizes: ["S", "M", "L"],
    colors: ["Cream", "Abu", "Mauve"],
  },
  {
    id: 6,
    name: "Celana Kulot Rayon",
    price: 145000,
    emoji: "👖",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Hitam", "Navy", "Coklat"],
  },
];

/* ===== STATE ===== */
let cart = [];

/* ===== HELPERS ===== */
const fmt = (n) =>
  "Rp " + n.toLocaleString("id-ID");

const totalPrice = () =>
  cart.reduce((s, i) => s + i.price * i.qty, 0);

const totalQty = () =>
  cart.reduce((s, i) => s + i.qty, 0);

/* ===== RENDER KATALOG ===== */
function renderProducts() {
  const track = document.getElementById("productTrack");
  if (!track) return;
  track.innerHTML = products
    .map(
      (p) => `
    <div class="product-card" id="card-${p.id}">
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${fmt(p.price)}</div>
        <div class="product-controls">
          <select id="size-${p.id}" aria-label="Pilih ukuran">
            <option value="">— Pilih Ukuran —</option>
            ${p.sizes.map((s) => `<option>${s}</option>`).join("")}
          </select>
          <select id="color-${p.id}" aria-label="Pilih warna">
            <option value="">— Pilih Warna —</option>
            ${p.colors.map((c) => `<option>${c}</option>`).join("")}
          </select>
          <button class="add-btn" onclick="addToCart(${p.id})">
            + Tambah ke Pesanan
          </button>
        </div>
      </div>
    </div>`
    )
    .join("");
}

/* ===== SLIDER ===== */
function initSlider() {
  const track = document.getElementById("productTrack");
  const prev = document.getElementById("sliderPrev");
  const next = document.getElementById("sliderNext");
  if (!track || !prev || !next) return;
  const scrollBy = 250;
  prev.addEventListener("click", () =>
    track.scrollBy({ left: -scrollBy, behavior: "smooth" })
  );
  next.addEventListener("click", () =>
    track.scrollBy({ left: scrollBy, behavior: "smooth" })
  );
}

/* ===== CART ===== */
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const size = document.getElementById(`size-${id}`).value;
  const color = document.getElementById(`color-${id}`).value;
  if (!size) { alert("Pilih ukuran dulu ya! 😊"); return; }
  if (!color) { alert("Pilih warna dulu ya! 😊"); return; }

  const key = `${id}-${size}-${color}`;
  const existing = cart.find((i) => i.key === key);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ key, id, name: product.name, emoji: product.emoji, price: product.price, size, color, qty: 1 });
  }
  updateCart();
  flashCard(id);
}

function removeFromCart(key) {
  cart = cart.filter((i) => i.key !== key);
  updateCart();
}

function flashCard(id) {
  const card = document.getElementById(`card-${id}`);
  if (!card) return;
  card.style.outline = "3px solid #e91e8c";
  setTimeout(() => (card.style.outline = ""), 600);
}

function updateCart() {
  const qty = totalQty();
  const total = totalPrice();

  // navbar badge
  document.getElementById("cartCount").textContent = qty;

  // sticky cart
  const sticky = document.getElementById("stickyCart");
  document.getElementById("stickyCount").textContent = qty;
  document.getElementById("stickyTotal").textContent = fmt(total);
  sticky.classList.toggle("show", qty > 0);

  // order list
  const list = document.getElementById("orderList");
  if (cart.length === 0) {
    list.innerHTML = `<p class="empty-msg">Belum ada produk ditambahkan.</p>`;
  } else {
    list.innerHTML = cart
      .map(
        (i) => `
      <div class="order-item">
        <div class="order-item-emoji">${i.emoji}</div>
        <div class="order-item-info">
          <div class="order-item-name">${i.name}</div>
          <div class="order-item-detail">${i.size} · ${i.color} · ${i.qty} pcs</div>
        </div>
        <div class="order-item-price">${fmt(i.price * i.qty)}</div>
        <button class="remove-btn" onclick="removeFromCart('${i.key}')" title="Hapus">×</button>
      </div>`
      )
      .join("");
  }

  // total
  document.getElementById("orderTotal").textContent = fmt(total);
}

/* ===== FORM VALIDATION ===== */
function validate() {
  const nama = document.getElementById("nama").value.trim();
  const wa = document.getElementById("wa").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  let ok = true;

  const setErr = (id, errId, cond) => {
    document.getElementById(errId).classList.toggle("visible", cond);
    if (cond) ok = false;
  };

  setErr("nama", "namaErr", nama.length < 2);
  setErr("wa", "waErr", !/^(\+62|62|0)[0-9]{8,13}$/.test(wa));
  setErr("alamat", "alamatErr", alamat.length < 10);
  return ok;
}

/* ===== WHATSAPP SUBMIT ===== */
function buildWAMessage() {
  const nama = document.getElementById("nama").value.trim();
  const wa = document.getElementById("wa").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  const catatan = document.getElementById("catatan").value.trim();

  let msg = `🛍️ *Pesanan Baru – John Clothes*\n\n`;
  msg += `👤 *Nama:* ${nama}\n`;
  msg += `📱 *WhatsApp:* ${wa}\n`;
  msg += `📦 *Alamat:* ${alamat}\n`;
  if (catatan) msg += `📝 *Catatan:* ${catatan}\n`;
  msg += `\n🛒 *Daftar Pesanan:*\n`;
  cart.forEach((i, idx) => {
    msg += `${idx + 1}. ${i.emoji} ${i.name} – ${i.size} – ${i.color} x${i.qty} = ${fmt(i.price * i.qty)}\n`;
  });
  msg += `\n💰 *Total: ${fmt(totalPrice())}*\n`;
  msg += `\nMohon konfirmasi pesanan saya. Terima kasih! 🙏`;
  return msg;
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  initSlider();
  updateCart();
  document.getElementById("year").textContent = new Date().getFullYear();

  document.getElementById("orderForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (cart.length === 0) { alert("Tambah produk dulu ke pesanan ya! 😊"); return; }
    if (!validate()) return;

    const msg = encodeURIComponent(buildWAMessage());
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    document.getElementById("waFallback").href = url;
    window.open(url, "_blank");
    document.getElementById("modalOverlay").classList.add("show");
  });
});

/* ===== UTILS ===== */
function scrollToOrder() {
  document.getElementById("pesanan").scrollIntoView({ behavior: "smooth" });
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("show");
}
