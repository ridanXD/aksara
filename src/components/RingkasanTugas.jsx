function RingkasanTugas({ dataTugas }) {
  const total = dataTugas.length
  const belumSelesai = dataTugas.filter((t) => t.status !== 'Selesai').length

  return (
    <p id="info-tugas-ringkasan" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
      Total tugas: {total} | Tugas belum selesai: {belumSelesai}
    </p>
  )
}

export default RingkasanTugas
