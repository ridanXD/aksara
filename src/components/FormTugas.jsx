import { useState } from 'react'

function FormTugas({ onTambahTugas, onBatal }) {
  const [kursus, setKursus] = useState('')
  const [nama, setNama] = useState('')
  const [deadline, setDeadline] = useState('')
  const [status, setStatus] = useState('Belum Dikerjakan')
  const [prioritas, setPrioritas] = useState('Sedang')
  const [estimasiJam, setEstimasiJam] = useState(2)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!kursus.trim() || !nama.trim() || !deadline.trim()) {
      alert('Semua field wajib harus diisi!')
      return
    }

    const tugasBaru = {
      judul: nama.trim(),
      mataKuliah: kursus.trim(),
      deadline: deadline.trim(),
      status: status,
      prioritas: prioritas,
      estimasiJam: Number(estimasiJam) || 2
    }

    onTambahTugas(tugasBaru)
    setKursus('')
    setNama('')
    setDeadline('')
    setStatus('Belum Dikerjakan')
    setPrioritas('Sedang')
    setEstimasiJam(2)
  }

  return (
    <div
      id="box-form-tambah"
      style={{
        marginBottom: '15px',
        border: '1px solid #bdc3c7',
        padding: '15px',
        borderRadius: '5px',
        backgroundColor: '#fafafa'
      }}
    >
      <h3>Tambah Tugas Baru</h3>
      <form id="form-tambah-tugas" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="input-kursus">Mata Kuliah / Kursus</label>
          <input
            type="text"
            id="input-kursus"
            placeholder="Nama mata kuliah"
            value={kursus}
            onChange={(e) => setKursus(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="input-nama-tugas">Nama / Judul Tugas</label>
          <input
            type="text"
            id="input-nama-tugas"
            placeholder="Judul tugas"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="input-deadline">Batas Waktu</label>
          <input
            type="text"
            id="input-deadline"
            placeholder="Contoh: 2026-11-20"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="input-status">Status</label>
          <select
            id="input-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Belum Dikerjakan">Belum Dikerjakan</option>
            <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
        <div>
          <label htmlFor="input-prioritas">Prioritas</label>
          <select
            id="input-prioritas"
            value={prioritas}
            onChange={(e) => setPrioritas(e.target.value)}
          >
            <option value="Rendah">Rendah</option>
            <option value="Sedang">Sedang</option>
            <option value="Tinggi">Tinggi</option>
          </select>
        </div>
        <div>
          <button type="submit">Simpan</button>
          <button type="button" id="btn-batal-tambah" onClick={onBatal}>
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormTugas
