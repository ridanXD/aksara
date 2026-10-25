function BarisTugas({ tugas, onHapus }) {
  let warna = 'black'
  if (tugas.status === 'Belum Dikerjakan') {
    warna = 'red'
  } else if (tugas.status === 'Sedang Dikerjakan') {
    warna = 'orange'
  } else if (tugas.status === 'Selesai') {
    warna = 'green'
  }

  return (
    <tr>
      <td>{tugas.kursus}</td>
      <td>{tugas.nama}</td>
      <td>{tugas.deadline}</td>
      <td style={{ fontWeight: 'bold', color: warna }}>{tugas.status}</td>
      <td>
        <button
          className="btn-hapus"
          onClick={() => onHapus(tugas.id)}
          style={{
            backgroundColor: '#e74c3c',
            padding: '5px 10px',
            fontSize: '12px'
          }}
        >
          Hapus
        </button>
      </td>
    </tr>
  )
}

export default BarisTugas
