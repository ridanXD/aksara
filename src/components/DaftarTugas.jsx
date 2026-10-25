import { useState } from 'react'
import BarisTugas from './BarisTugas.jsx'
import FormTugas from './FormTugas.jsx'
import RingkasanTugas from './RingkasanTugas.jsx'

function DaftarTugas({ dataTugas, onTambahTugas, onHapusTugas, notif }) {
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState('Semua')

  const tugasTerfilter = dataTugas.filter((tugas) => {
    if (filterStatus === 'Semua') return true
    return tugas.status === filterStatus
  })

  const handleSimpanTugas = (tugasBaru) => {
    onTambahTugas(tugasBaru)
    setShowForm(false)
  }

  return (
    <section id="tugas-mendatang">
      <h2>Tugas Mendatang</h2>

      {notif && (
        <div
          id="notif-box"
          style={{
            padding: '10px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            marginBottom: '10px',
            borderRadius: '4px'
          }}
        >
          {notif}
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <button
          type="button"
          id="btn-toggle-tambah"
          onClick={() => setShowForm(!showForm)}
        >
          + Tambah Tugas
        </button>
        <label
          htmlFor="filter-status"
          style={{ display: 'inline', marginLeft: '10px', marginRight: '5px' }}
        >
          Filter Status:
        </label>
        <select
          id="filter-status"
          style={{ width: 'auto', display: 'inline-block' }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="Semua">Semua</option>
          <option value="Belum Dikerjakan">Belum Dikerjakan</option>
          <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
          <option value="Selesai">Selesai</option>
        </select>
      </div>

      {showForm && (
        <FormTugas
          onTambahTugas={handleSimpanTugas}
          onBatal={() => setShowForm(false)}
        />
      )}

      <RingkasanTugas dataTugas={dataTugas} />

      <table border="1">
        <caption>Daftar tugas yang akan datang</caption>
        <thead>
          <tr>
            <th scope="col">Kursus</th>
            <th scope="col">Nama Tugas</th>
            <th scope="col">Batas Waktu</th>
            <th scope="col">Status</th>
            <th scope="col">Aksi</th>
          </tr>
        </thead>
        <tbody id="tabel-tugas">
          {tugasTerfilter.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '15px', color: '#777' }}>
                Belum ada data tugas
              </td>
            </tr>
          ) : (
            tugasTerfilter.map((tugas) => (
              <BarisTugas key={tugas.id} tugas={tugas} onHapus={onHapusTugas} />
            ))
          )}
        </tbody>
      </table>
    </section>
  )
}

export default DaftarTugas
