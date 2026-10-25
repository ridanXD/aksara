function Header() {
  return (
    <header>
      <nav aria-label="Navigasi utama">
        <h1>Aksara</h1>
        <ul>
          <li><a href="#beranda">Beranda</a></li>
          <li><a href="#dashboard" aria-current="page">Dashboard</a></li>
          <li><a href="#kursus">Kursus</a></li>
          <li><a href="#keluar">Keluar</a></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
