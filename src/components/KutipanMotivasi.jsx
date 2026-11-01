import { useState, useEffect } from 'react'

const API_URL = 'https://dummyjson.com/quotes?limit=5'
const POST_URL = 'https://dummyjson.com/quotes/add'

function KutipanMotivasi() {
  const [kutipan, setKutipan] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [inputQuote, setInputQuote] = useState('')
  const [inputAuthor, setInputAuthor] = useState('')
  const [posting, setPosting] = useState(false)
  const [postNotif, setPostNotif] = useState('')

  const ambilKutipan = () => {
    setLoading(true)
    setError(null)

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: Gagal mengambil data`)
        }
        return res.json()
      })
      .then((data) => {
        setKutipan(data.quotes)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    ambilKutipan()
  }, [])

  const handleSubmitKutipan = (e) => {
    e.preventDefault()
    if (!inputQuote.trim() || !inputAuthor.trim()) {
      alert('Isi kutipan dan penulis terlebih dahulu!')
      return
    }

    setPosting(true)
    fetch(POST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quote: inputQuote.trim(),
        author: inputAuthor.trim()
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Gagal mengirim kutipan')
        return res.json()
      })
      .then((data) => {
        setKutipan((prev) => [...prev, data])
        setInputQuote('')
        setInputAuthor('')
        setShowForm(false)
        setPosting(false)
        setPostNotif('Kutipan berhasil ditambahkan!')
        setTimeout(() => setPostNotif(''), 3000)
      })
      .catch(() => {
        setPosting(false)
        alert('Gagal mengirim kutipan. Coba lagi.')
      })
  }

  if (loading) {
    return (
      <section id="kutipan-motivasi">
        <h2>Kutipan Motivasi Belajar</h2>
        <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>
          Memuat kutipan...
        </p>
      </section>
    )
  }

  if (error) {
    return (
      <section id="kutipan-motivasi">
        <h2>Kutipan Motivasi Belajar</h2>
        <p style={{ color: '#e74c3c' }}>
          Gagal memuat kutipan: {error}
        </p>
        <button
          type="button"
          onClick={ambilKutipan}
          style={{ marginTop: '8px' }}
        >
          Coba Lagi
        </button>
      </section>
    )
  }

  return (
    <section id="kutipan-motivasi">
      <h2>Kutipan Motivasi Belajar</h2>

      {postNotif && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            marginBottom: '10px',
            borderRadius: '4px'
          }}
        >
          {postNotif}
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
        >
          + Tambah Kutipan
        </button>
        <button
          type="button"
          onClick={ambilKutipan}
          style={{ backgroundColor: '#27ae60' }}
        >
          Muat Ulang
        </button>
      </div>

      {showForm && (
        <div
          style={{
            marginBottom: '15px',
            border: '1px solid #bdc3c7',
            padding: '15px',
            borderRadius: '5px',
            backgroundColor: '#fafafa'
          }}
        >
          <h3>Kirim Kutipan Baru</h3>
          <form onSubmit={handleSubmitKutipan}>
            <div>
              <label htmlFor="input-kutipan">Kutipan</label>
              <input
                type="text"
                id="input-kutipan"
                placeholder="Tulis kutipan motivasi..."
                value={inputQuote}
                onChange={(e) => setInputQuote(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="input-penulis">Penulis</label>
              <input
                type="text"
                id="input-penulis"
                placeholder="Nama penulis"
                value={inputAuthor}
                onChange={(e) => setInputAuthor(e.target.value)}
              />
            </div>
            <div>
              <button type="submit" disabled={posting}>
                {posting ? 'Mengirim...' : 'Kirim'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{ backgroundColor: '#95a5a6' }}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <ul style={{ listStyle: 'none', marginLeft: 0 }}>
        {kutipan.map((item) => (
          <li
            key={item.id}
            style={{
              borderLeft: '3px solid #2c3e50',
              paddingLeft: '12px',
              marginBottom: '12px'
            }}
          >
            <p style={{ fontStyle: 'italic', marginBottom: '2px' }}>
              &ldquo;{item.quote}&rdquo;
            </p>
            <p style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: 0 }}>
              — {item.author}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default KutipanMotivasi
