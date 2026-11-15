import { useState, useEffect, useRef } from 'react'
import Header from './components/Header.jsx'
import KursusSaatIni from './components/KursusSaatIni.jsx'
import DaftarTugas from './components/DaftarTugas.jsx'
import RingkasanKehadiran from './components/RingkasanKehadiran.jsx'
import NilaiTerbaru from './components/NilaiTerbaru.jsx'
import KutipanMotivasi from './components/KutipanMotivasi.jsx'
import Footer from './components/Footer.jsx'
import './App.css'

const API_BASE = 'http://localhost:3000/tugas'

function App() {
  const [dataTugas, setDataTugas] = useState([])
  const [notif, setNotif] = useState('')
  const timerRef = useRef(null)

  const tampilkanNotif = (pesan) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setNotif(pesan)
    timerRef.current = setTimeout(() => {
      setNotif('')
    }, 3000)
  }

  const muatDataTugas = async () => {
    try {
      const res = await fetch(API_BASE)
      if (res.ok) {
        const data = await res.json()
        setDataTugas(data)
      }
    } catch {
      tampilkanNotif('Gagal menghubungkan ke backend NestJS')
    }
  }

  useEffect(() => {
    muatDataTugas()
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const handleTambahTugas = async (tugasBaru) => {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tugasBaru)
      })
      if (!res.ok) {
        const errData = await res.json()
        const errMsg = Array.isArray(errData.message)
          ? errData.message.join(', ')
          : errData.message || 'Gagal menambahkan tugas'
        tampilkanNotif(`Error: ${errMsg}`)
        return
      }
      const data = await res.json()
      setDataTugas((prev) => [...prev, data])
      tampilkanNotif('Tugas baru berhasil ditambahkan!')
    } catch {
      tampilkanNotif('Gagal mengirim data ke backend')
    }
  }

  const handleUbahStatus = async (id, statusBaru) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: statusBaru })
      })
      if (!res.ok) {
        tampilkanNotif('Gagal mengubah status tugas')
        return
      }
      const dataUpdated = await res.json()
      setDataTugas((prev) =>
        prev.map((t) => (t.id === id ? dataUpdated : t))
      )
      tampilkanNotif(`Status tugas diperbarui: ${statusBaru}`)
    } catch {
      tampilkanNotif('Gagal memperbarui status di backend')
    }
  }

  const handleHapusTugas = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) {
        tampilkanNotif('Gagal menghapus tugas dari backend')
        return
      }
      setDataTugas((prev) => prev.filter((t) => t.id !== id))
      tampilkanNotif('Tugas berhasil dihapus!')
    } catch {
      tampilkanNotif('Gagal menghapus tugas dari backend')
    }
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
          onUbahStatus={handleUbahStatus}
          notif={notif}
        />
        <RingkasanKehadiran />
        <NilaiTerbaru />
        <KutipanMotivasi />
      </main>
      <Footer />
    </div>
  )
}

export default App
