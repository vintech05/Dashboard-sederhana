import { createApp } from 'vue'
import { initTheme } from './theme.js'
import { dataBahanAjar, dataTracking, paket, pengirimanList } from './data.js'

initTheme()

createApp({
  data() {
    // Convert dataTracking object to array
    const trackingArray = Object.values(dataTracking)

    return {
      // ── Data ──────────────────────────────────────────────
      trackingList: trackingArray,
      paketList: paket,
      pengirimanList,
      stokList: dataBahanAjar,

      // ── Form state ─────────────────────────────────────────
      showForm: false,
      formError: {},
      form: {
        nim: '',
        nama: '',
        ekspedisi: '',
        paketKode: '',
        tanggalKirim: new Date().toISOString().split('T')[0],
      },

      // ── Detail modal ───────────────────────────────────────
      selectedDO: null,
    }
  },

  computed: {
    // Auto-generate nomor DO berdasarkan tahun + sequence
    nextNomorDO() {
      const year = new Date().getFullYear()
      const existing = this.trackingList
        .map(t => t.nomorDO)
        .filter(n => n.startsWith(`DO${year}-`))
        .map(n => parseInt(n.split('-')[1]))
        .filter(n => !isNaN(n))

      const nextSeq = existing.length > 0 ? Math.max(...existing) + 1 : 1
      return `DO${year}-${String(nextSeq).padStart(3, '0')}`
    },

    // Paket yang dipilih
    selectedPaket() {
      if (!this.form.paketKode) return null
      return this.paketList.find(p => p.kode === this.form.paketKode) || null
    },

    // Detail isi paket — cocokkan kode dengan dataBahanAjar
    selectedPaketDetail() {
      if (!this.selectedPaket) return []
      return this.selectedPaket.isi.map(kode => {
        const found = this.stokList.find(s => s.kodeBarang === kode)
        return found || { kodeBarang: kode, namaBarang: '(Data tidak ditemukan)', harga: 0 }
      })
    },

    // Total harga otomatis dari paket
    totalHarga() {
      if (!this.selectedPaket) return 0
      return this.selectedPaket.harga
    },
  },

  watch: {
    // Watcher 1: reset form saat form ditutup
    showForm(val) {
      if (!val) {
        this.resetForm()
        console.log('[Watcher] Form ditutup, data direset.')
      }
    },

    // Watcher 2: log nomor DO berikutnya setiap kali berubah
    nextNomorDO(val) {
      console.log(`[Watcher] Nomor DO berikutnya: ${val}`)
    },
  },

  methods: {
    formatHarga(val) {
      return 'Rp ' + Number(val).toLocaleString('id-ID')
    },

    formatTanggal(val) {
      if (!val) return '-'
      return new Date(val).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    },

    getStatusClass(status) {
      if (status === 'Terkirim' || status === 'Dikirim') return 'status-aman'
      if (status === 'Dalam Perjalanan' || status === 'Diproses') return 'status-menipis'
      return 'status-kosong'
    },

    getStatusIcon(status) {
      if (status === 'Terkirim' || status === 'Dikirim') return '✅'
      if (status === 'Dalam Perjalanan' || status === 'Diproses') return '🚚'
      return '📋'
    },

    getNamaEkspedisi(kode) {
      const found = this.pengirimanList.find(p => p.kode === kode)
      return found ? found.nama : kode
    },

    getNamaPaket(kode) {
      const found = this.paketList.find(p => p.kode === kode)
      return found ? found.nama : kode
    },

    // ── Validasi ─────────────────────────────────────────────
    validateForm() {
      const errors = {}
      if (!this.form.nim.trim()) errors.nim = 'NIM wajib diisi'
      if (!this.form.nama.trim()) errors.nama = 'Nama wajib diisi'
      if (!this.form.ekspedisi) errors.ekspedisi = 'Pilih ekspedisi'
      if (!this.form.paketKode) errors.paketKode = 'Pilih paket bahan ajar'
      if (!this.form.tanggalKirim) errors.tanggalKirim = 'Tanggal kirim wajib diisi'
      return errors
    },

    // ── Tambah DO baru ────────────────────────────────────────
    tambahDO() {
      this.formError = this.validateForm()
      if (Object.keys(this.formError).length > 0) return

      this.trackingList.push({
        nomorDO: this.nextNomorDO,
        nim: this.form.nim,
        nama: this.form.nama,
        status: 'Diproses',
        ekspedisi: this.form.ekspedisi,
        tanggalKirim: this.form.tanggalKirim,
        paket: this.form.paketKode,
        total: this.totalHarga,
        perjalanan: [
          {
            waktu: new Date().toLocaleString('id-ID'),
            keterangan: `DO dibuat. Paket: ${this.getNamaPaket(this.form.paketKode)}`
          }
        ]
      })

      this.showForm = false // watcher akan reset form
    },

    resetForm() {
      this.form = {
        nim: '',
        nama: '',
        ekspedisi: '',
        paketKode: '',
        tanggalKirim: new Date().toISOString().split('T')[0],
      }
      this.formError = {}
    },

    // ── Detail modal ──────────────────────────────────────────
    lihatDetail(do_) {
      this.selectedDO = do_
    },

    tutupDetail() {
      this.selectedDO = null
    },
  }
}).mount('#app')