function RingkasanKehadiran() {
  return (
    <section id="kehadiran">
      <h2>Ringkasan Kehadiran</h2>
      <table border="1">
        <caption>Rekap kehadiran</caption>
        <thead>
          <tr>
            <th scope="col">Kursus</th>
            <th scope="col">Hadir</th>
            <th scope="col">Izin</th>
            <th scope="col">Alpha</th>
            <th scope="col">Persentase</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Pemrograman Web</td>
            <td>8</td>
            <td>1</td>
            <td>0</td>
            <td>89%</td>
          </tr>
          <tr>
            <td>Pemrograman Mobile</td>
            <td>9</td>
            <td>0</td>
            <td>0</td>
            <td>100%</td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}

export default RingkasanKehadiran
