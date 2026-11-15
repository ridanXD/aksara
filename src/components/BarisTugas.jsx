function BarisTugas({ tugas, onHapus, onUbahStatus }) {
  let warna = 'black'
  if (tugas.status === 'Belum Dikerjakan') {
    warna = 'red'
  } else if (tugas.status === 'Sedang Dikerjakan') {
    warna = 'orange'
  } else if (tugas.status === 'Selesai') {
    warna = 'green'
  }

  const nextStatusMap = {
    'Belum Dikerjakan': 'Sedang Dikerjakan',
    'Sedang Dikerjakan': 'Selesai',
    'Selesai': 'Belum Dikerjakan'
  }

  const handleNextStatus = () => {
    if (onUbahStatus) {
      onUbahStatus(tugas.id, nextStatusMap[tugas.status] || 'Sedang Dikerjakan')
    }
  }

  return (
    <tr>
      <td>{tugas.mataKuliah || tugas.kursus}</td>
      <td>{tugas.judul || tugas.nama}</td>
      <td>{tugas.deadline}</td>
      <td style={{ fontWeight: 'bold', color: warna }}>{tugas.status}</td>
      <td>
        <button
          type="button"
          className="btn-ubah-status"
          onClick={handleNextStatus}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            padding: '5px 10px',
            fontSize: '12px',
            cursor: 'pointer',
            marginRight: '6px'
          }}
        >
          Ubah Status
        </button>
        <button
          type="button"
          className="btn-hapus"
          onClick={() => onHapus(tugas.id)}
          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            padding: '5px 10px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Hapus
        </button>
      </td>
    </tr>
  )
}

export default BarisTugas
