const { chromium } = require('./node_modules/playwright')
const path = require('path')
const fs = require('fs')

const outputDir = path.resolve(__dirname, '../docs/screenshots/week6')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

;(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox']
  })
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 }
  })

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })
  await page.screenshot({
    path: path.join(outputDir, '1-tampilan-awal.png'),
    fullPage: true
  })
  console.log('Saved 1-tampilan-awal.png')

  await page.click('#btn-toggle-tambah')
  await page.waitForTimeout(300)
  await page.screenshot({
    path: path.join(outputDir, '2-form-tambah-terbuka.png'),
    fullPage: true
  })
  console.log('Saved 2-form-tambah-terbuka.png')

  await page.fill('#input-kursus', 'Kecerdasan Buatan')
  await page.fill('#input-nama-tugas', 'Tugas 1: Algoritma Pencarian BFS dan DFS')
  await page.fill('#input-deadline', '25 Oktober 2026')
  await page.selectOption('#input-status', 'Sedang Dikerjakan')
  await page.click('button[type="submit"]')

  await page.waitForTimeout(500)
  await page.screenshot({
    path: path.join(outputDir, '3-setelah-tambah-tugas.png'),
    fullPage: true
  })
  console.log('Saved 3-setelah-tambah-tugas.png')

  await page.selectOption('#filter-status', 'Sedang Dikerjakan')
  await page.waitForTimeout(300)
  await page.screenshot({
    path: path.join(outputDir, '4-filter-status.png'),
    fullPage: true
  })
  console.log('Saved 4-filter-status.png')

  await page.selectOption('#filter-status', 'Semua')
  await page.waitForTimeout(300)

  let deleteButtons = await page.$$('button.btn-hapus')
  while (deleteButtons.length > 0) {
    await deleteButtons[0].click()
    await page.waitForTimeout(200)
    deleteButtons = await page.$$('button.btn-hapus')
  }

  await page.waitForTimeout(500)
  await page.screenshot({
    path: path.join(outputDir, '5-conditional-rendering-kosong.png'),
    fullPage: true
  })
  console.log('Saved 5-conditional-rendering-kosong.png')

  await browser.close()
})()
