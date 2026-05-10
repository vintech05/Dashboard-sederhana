import { dataPengguna } from "./data.js";

const form = document.querySelector('form');
const lupaBtn = document.querySelector('.lupa-password');
const daftarBtn = document.querySelector('.cta-register a');

const lupaModal = document.getElementById('lupa-modal');
const daftarModal = document.getElementById('daftar-modal');

// validasi login
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  const user = dataPengguna.find(u => u.email === email && u.password === password);

  if (user) {
    window.location.href = 'dashboard.html';
  } else {
    alert('Email/password yang anda masukkan salah');
  }
});

// buka modal 
lupaBtn.addEventListener('click', (e) => {
  e.preventDefault();
  lupaModal.classList.add('active');
});

daftarBtn.addEventListener('click', (e) => {
  e.preventDefault();
  daftarModal.classList.add('active');
});

// tutup modal
document.getElementById('close-lupa').addEventListener('click', () => {
  lupaModal.classList.remove('active');
});

document.getElementById('close-daftar').addEventListener('click', () => {
  daftarModal.classList.remove('active');
});

// klik untuk tutup
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
});