import { dataBahanAjar } from "./data.js";
import { initTheme } from "./theme.js";

initTheme();

const tbody = document.getElementById('stok-body');
const tambahBtn = document.getElementById('tambah-btn');
const dropdown = document.querySelector('.dropdown')
const dropdownOption = document.querySelector('.option');

function activeDropdown() {
    dropdownOption.style.display = 'flex';
}

dropdown.addEventListener('click', ()=>{
    dropdownOption.classList.toggle('active');
    
})

function renderStok(data) {
  tbody.innerHTML = '';
  data.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.kodeLokasi}</td>
      <td>${item.kodeBarang}</td>
      <td>${item.namaBarang}</td>
      <td>${item.jenisBarang}</td>
      <td>${item.edisi}</td>
      <td>${item.stok}</td>
    `;
    tbody.appendChild(tr);
  });
}

renderStok(dataBahanAjar);

tambahBtn.addEventListener('click', () => {
  const newItem = {
    kodeLokasi: document.getElementById('kodeLokasi').value.trim(),
    kodeBarang: document.getElementById('kodeBarang').value.trim(),
    namaBarang: document.getElementById('namaBarang').value.trim(),
    jenisBarang: document.getElementById('jenisBarang').value.trim(),
    edisi: document.getElementById('edisi').value.trim(),
    stok: document.getElementById('stok').value.trim(),
  };

  // basic validation
  if (!newItem.kodeLokasi || !newItem.kodeBarang || !newItem.namaBarang) {
    alert('Harap isi semua kolom!');
    return;
  }

  dataBahanAjar.push(newItem); 
  renderStok(dataBahanAjar);   

  // clear inputs
  ['kodeLokasi', 'kodeBarang', 'namaBarang', 'jenisBarang', 'edisi', 'stok'].forEach(id => {
    document.getElementById(id).value = '';
  });
});