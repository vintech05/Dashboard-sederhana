import { createApp, computed, watch } from 'vue'
import { dataBahanAjar, upbjjList, kategoriList } from './data.js'
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

initTheme()

createApp({
  data() {
    return {
      // ── Data utama ───────────────────────────────────────────
      stokList: [...dataBahanAjar],
      upbjjList,
      kategoriList,

      // ── Filter & Sort ────────────────────────────────────────
      filterUpbjj: '',
      filterKategori: '',
      filterReorder: false,
      sortBy: '',

      // ── Form tambah baru ─────────────────────────────────────
      showForm: false,
      formBaru: {
        kodeLokasi: '',
        kodeBarang: '',
        namaBarang: '',
        jenisBarang: '',
        edisi: '',
        stok: '',
        safety: '',
        kategori: '',
        upbjj: '',
        harga: '',
        catatanHTML: '',
      },
      formError: {},

      // ── Edit ─────────────────────────────────────────────────
      editIndex: null,
      editData: {},
    }
  },

  computed: {
    // Kategori yang tersedia hanya untuk upbjj yang dipilih (dependent options)
    // Di-cache Vue, tidak recompute kalau filterUpbjj tidak berubah
    filteredKategoriList() {
      if (!this.filterUpbjj) return []
      const found = new Set(
        this.stokList
          .filter(item => item.upbjj === this.filterUpbjj)
          .map(item => item.kategori)
      )
      return this.kategoriList.filter(k => found.has(k))
    },

    // List utama setelah filter + sort
    // Di-cache Vue, tidak recompute kalau data tidak berubah
    filteredStok() {
      let result = this.stokList

      if (this.filterUpbjj) {
        result = result.filter(item => item.upbjj === this.filterUpbjj)
      }
      if (this.filterKategori) {
        result = result.filter(item => item.kategori === this.filterKategori)
      }
      if (this.filterReorder) {
        result = result.filter(item => Number(item.stok) < Number(item.safety) || Number(item.stok) === 0)
      }

      if (this.sortBy === 'namaBarang') {
        result = [...result].sort((a, b) => a.namaBarang.localeCompare(b.namaBarang))
      } else if (this.sortBy === 'stok') {
        result = [...result].sort((a, b) => Number(a.stok) - Number(b.stok))
      } else if (this.sortBy === 'harga') {
        result = [...result].sort((a, b) => Number(a.harga) - Number(b.harga))
      }

      return result
    },

    // Jumlah item yang perlu reorder
    reorderCount() {
      return this.stokList.filter(item => Number(item.stok) < Number(item.safety)).length
    },
  },

  watch: {
    // Watcher 1: reset filterKategori kalau filterUpbjj berubah
    filterUpbjj(newVal) {
      this.filterKategori = ''
      if (newVal) {
        console.log(`[Watcher] Filter UT-Daerah berubah: ${newVal}`)
      }
    },

    // Watcher 2: pantau jumlah reorder, log warning kalau ada
    reorderCount(newVal) {
      if (newVal > 0) {
        console.warn(`[Watcher] ${newVal} bahan ajar perlu di-reorder!`)
      }
    },
  },

  methods: {
    // ── Status stok ───────────────────────────────────────────
    getStatus(item) {
      if (Number(item.stok) === 0) return 'Kosong'
      if (Number(item.stok) < Number(item.safety)) return 'Menipis'
      return 'Aman'
    },

    getStatusClass(item) {
      const s = this.getStatus(item)
      if (s === 'Kosong') return 'status-kosong'
      if (s === 'Menipis') return 'status-menipis'
      return 'status-aman'
    },

    getStatusIcon(item) {
      const s = this.getStatus(item)
      if (s === 'Kosong') return '🔴'
      if (s === 'Menipis') return '🟠'
      return '🟢'
    },

    formatHarga(val) {
      return 'Rp ' + Number(val).toLocaleString('id-ID')
    },

    // ── Reset filter ──────────────────────────────────────────
    resetFilter() {
      this.filterUpbjj = ''
      this.filterKategori = ''
      this.filterReorder = false
      this.sortBy = ''
    },

    // ── Validasi form ─────────────────────────────────────────
    validateForm() {
      const errors = {}
      if (!this.formBaru.kodeLokasi.trim()) errors.kodeLokasi = 'Wajib diisi'
      if (!this.formBaru.kodeBarang.trim()) errors.kodeBarang = 'Wajib diisi'
      if (!this.formBaru.namaBarang.trim()) errors.namaBarang = 'Wajib diisi'
      if (!this.formBaru.jenisBarang.trim()) errors.jenisBarang = 'Wajib diisi'
      if (!this.formBaru.edisi.trim()) errors.edisi = 'Wajib diisi'
      if (this.formBaru.stok === '') errors.stok = 'Wajib diisi'
      if (this.formBaru.safety === '') errors.safety = 'Wajib diisi'
      if (!this.formBaru.kategori) errors.kategori = 'Wajib dipilih'
      if (!this.formBaru.upbjj) errors.upbjj = 'Wajib dipilih'
      return errors
    },

    // ── Tambah item baru ──────────────────────────────────────
    tambahBaru() {
      this.formError = this.validateForm()
      if (Object.keys(this.formError).length > 0) return

      this.stokList.push({
        ...this.formBaru,
        stok: Number(this.formBaru.stok),
        safety: Number(this.formBaru.safety),
        harga: Number(this.formBaru.harga),
      })

      // Reset form
      Object.keys(this.formBaru).forEach(k => this.formBaru[k] = '')
      this.formError = {}
      this.showForm = false
    },

    // ── Edit item ─────────────────────────────────────────────
    startEdit(item) {
      this.editIndex = this.stokList.indexOf(item)
      this.editData = { ...item }
    },

    saveEdit() {
      if (this.editIndex !== null) {
        this.stokList[this.editIndex] = {
          ...this.editData,
          stok: Number(this.editData.stok),
          safety: Number(this.editData.safety),
        }
        this.editIndex = null
        this.editData = {}
      }
    },

    cancelEdit() {
      this.editIndex = null
      this.editData = {}
    },
  }
}).mount('#app')
 

// function renderStok(data) {
//   tbody.innerHTML = '';
//   data.forEach(item => {
//     const tr = document.createElement('tr');
//     tr.innerHTML = `
//       <td>${item.kodeLokasi}</td>
//       <td>${item.kodeBarang}</td>
//       <td>${item.namaBarang}</td>
//       <td>${item.jenisBarang}</td>
//       <td>${item.edisi}</td>
//       <td>${item.stok}</td>
//     `;
//     tbody.appendChild(tr);
//   });
// }

// renderStok(dataBahanAjar);

// tambahBtn.addEventListener('click', () => {
//   const newItem = {
//     kodeLokasi: document.getElementById('kodeLokasi').value.trim(),
//     kodeBarang: document.getElementById('kodeBarang').value.trim(),
//     namaBarang: document.getElementById('namaBarang').value.trim(),
//     jenisBarang: document.getElementById('jenisBarang').value.trim(),
//     edisi: document.getElementById('edisi').value.trim(),
//     stok: document.getElementById('stok').value.trim(),
//   };

//   // basic validation
//   if (!newItem.kodeLokasi || !newItem.kodeBarang || !newItem.namaBarang) {
//     alert('Harap isi semua kolom!');
//     return;
//   }

//   dataBahanAjar.push(newItem); 
//   renderStok(dataBahanAjar);   

//   // clear inputs
//   ['kodeLokasi', 'kodeBarang', 'namaBarang', 'jenisBarang', 'edisi', 'stok'].forEach(id => {
//     document.getElementById(id).value = '';
//   });
// });