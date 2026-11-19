// Kunci penyimpanan di browser (localStorage)
const KUNCI = "daftar-tugas";

const input = document.getElementById("input-tugas");
const tombolTambah = document.getElementById("tombol-tambah");
const daftar = document.getElementById("daftar");
const kosong = document.getElementById("kosong");
const ringkasan = document.getElementById("ringkasan");
const hapusSelesai = document.getElementById("hapus-selesai");
const tombolFilter = document.querySelectorAll(".filter button");

let tugas = muat();
let filterAktif = "semua";

// ---------- Penyimpanan ----------
function muat() {
  try {
    return JSON.parse(localStorage.getItem(KUNCI)) || [];
  } catch (e) {
    return [];
  }
}

function simpan() {
  localStorage.setItem(KUNCI, JSON.stringify(tugas));
}

// ---------- Aksi ----------
function tambahTugas() {
  const teks = input.value.trim();
  if (teks === "") return;
  tugas.push({ id: Date.now(), teks: teks, selesai: false });
  input.value = "";
  simpan();
  tampilkan();
}

function ubahStatus(id) {
  const item = tugas.find((t) => t.id === id);
  if (item) item.selesai = !item.selesai;
  simpan();
  tampilkan();
}

function hapusTugas(id) {
  tugas = tugas.filter((t) => t.id !== id);
  simpan();
  tampilkan();
}

function hapusYangSelesai() {
  tugas = tugas.filter((t) => !t.selesai);
  simpan();
  tampilkan();
}

// ---------- Tampilan ----------
function tampilkan() {
  daftar.innerHTML = "";

  const terlihat = tugas.filter((t) => {
    if (filterAktif === "belum") return !t.selesai;
    if (filterAktif === "selesai") return t.selesai;
    return true;
  });

  terlihat.forEach((t) => {
    const li = document.createElement("li");
    li.className = "item" + (t.selesai ? " selesai" : "");

    const cek = document.createElement("input");
    cek.type = "checkbox";
    cek.checked = t.selesai;
    cek.setAttribute("aria-label", "Tandai selesai: " + t.teks);
    cek.addEventListener("change", () => ubahStatus(t.id));

    const span = document.createElement("span");
    span.className = "teks";
    span.textContent = t.teks;

    const hapus = document.createElement("button");
    hapus.type = "button";
    hapus.className = "hapus";
    hapus.textContent = "Hapus";
    hapus.setAttribute("aria-label", "Hapus tugas: " + t.teks);
    hapus.addEventListener("click", () => hapusTugas(t.id));

    li.append(cek, span, hapus);
    daftar.appendChild(li);
  });

  kosong.hidden = terlihat.length > 0;

  const jumlahSelesai = tugas.filter((t) => t.selesai).length;
  ringkasan.textContent =
    tugas.length === 0
      ? "Belum ada tugas."
      : jumlahSelesai + " dari " + tugas.length + " tugas selesai.";
}

// ---------- Event ----------
tombolTambah.addEventListener("click", tambahTugas);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tambahTugas();
});
hapusSelesai.addEventListener("click", hapusYangSelesai);

tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", () => {
    filterAktif = tombol.dataset.filter;
    tombolFilter.forEach((b) => b.classList.toggle("aktif", b === tombol));
    tampilkan();
  });
});

tampilkan();
