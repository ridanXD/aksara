import { useState } from 'react'
import Header from './components/Header.jsx'
import KursusSaatIni from './components/KursusSaatIni.jsx'
import DaftarTugas from './components/DaftarTugas.jsx'
import RingkasanKehadiran from './components/RingkasanKehadiran.jsx'
import NilaiTerbaru from './components/NilaiTerbaru.jsx'
import Footer from './components/Footer.jsx'
import './App.css'

const dataTugasAwal = [
  {
    id: 1,
    kursus: 'Pemrograman Web',
    nama: 'Tugas 2: Form HTML dan Validasi',
    deadline: '30 September 2026',
    status: 'Belum Dikerjakan'
  },
  {
    id: 2,
    kursus: 'Pemrograman Mobile',
    nama: 'Tugas 1: Desain Antarmuka Mobile',
    deadline: '5 Oktober 2026',
    status: 'Sedang Dikerjakan'
  },
  {
    id: 3,
    kursus: 'Basis Data',
    nama: 'Tugas 3: ERD dan Normalisasi',
    deadline: '12 Oktober 2026',
    status: 'Belum Dikerjakan'
  }
]

function App() {
  const [dataTugas, setDataTugas] = useState(dataTugasAwal)
  const [notif, setNotif] = useState('')

  const tampilkanNotif = (pesan) => {
    setNotif(pesan)
    setTimeout(() => {
      setNotif('')
    }, 3000)
  }

  const handleTambahTugas = (tugasBaru) => {
    setDataTugas([...dataTugas, tugasBaru])
    tampilkanNotif('Tugas baru berhasil ditambahkan!')
  }

  const handleHapusTugas = (id) => {
    setDataTugas(dataTugas.filter((tugas) => tugas.id !== id))
    tampilkanNotif('Tugas berhasil dihapus!')
  }

  return (
    <div>
      <Header />
      <main>
        <KursusSaatIni />
        <DaftarTugas
          dataTugas={dataTugas}
          onTambahTugas={handleTambahTugas}
          onHapusTugas={handleHapusTugas}
          notif={notif}
        />
        <RingkasanKehadiran />
        <NilaiTerbaru />
      </main>
      <Footer />
    </div>
  )
}

export default App
