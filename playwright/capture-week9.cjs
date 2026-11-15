const { chromium } = require('./node_modules/playwright')
const path = require('path')
const fs = require('fs')

const outputDir = path.resolve(__dirname, '../docs/screenshots/week9')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

function escapeHtml(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatJsonSyntax(json) {
  if (!json) return ''
  const str = typeof json === 'string' ? json : JSON.stringify(json, null, 2)
  return escapeHtml(str).replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'json-number'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key'
        } else {
          cls = 'json-string'
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean'
      } else if (/null/.test(match)) {
        cls = 'json-null'
      }
      return `<span class="${cls}">${match}</span>`
    }
  )
}

function renderRestClientHtml({ title, method, url, requestHeaders, requestBody, status, statusText, responseHeaders, responseBody, latency }) {
  const methodColor = {
    GET: '#61affe',
    POST: '#49cc90',
    PATCH: '#50e3c2',
    DELETE: '#f93e3e'
  }[method] || '#61affe'

  const statusColor = status >= 200 && status < 300 ? '#49cc90' : status >= 400 ? '#f93e3e' : '#fca130'

  const reqHeaderEntries = Object.entries(requestHeaders || {})
    .map(([k, v]) => `<div class="code-line"><span class="header-name">${escapeHtml(k)}:</span> <span class="header-value">${escapeHtml(v)}</span></div>`)
    .join('')

  const resHeaderEntries = Object.entries(responseHeaders || {})
    .map(([k, v]) => `<div class="code-line"><span class="header-name">${escapeHtml(k)}:</span> <span class="header-value">${escapeHtml(v)}</span></div>`)
    .join('')

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #181818;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      padding: 24px;
      color: #cccccc;
    }
    .window {
      background: #1e1e1e;
      border-radius: 8px;
      border: 1px solid #333333;
      box-shadow: 0 12px 32px rgba(0,0,0,0.5);
      overflow: hidden;
    }
    .titlebar {
      background: #252526;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #333;
    }
    .traffic-lights {
      display: flex;
      gap: 8px;
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .dot.red { background: #ff5f56; }
    .dot.yellow { background: #ffbd2e; }
    .dot.green { background: #27c93f; }
    .window-title {
      font-size: 13px;
      color: #999999;
      font-weight: 500;
    }
    .tabs-bar {
      display: flex;
      background: #2d2d2d;
      border-bottom: 1px solid #1e1e1e;
    }
    .tab {
      padding: 8px 16px;
      font-size: 12px;
      background: #1e1e1e;
      color: #ffffff;
      border-right: 1px solid #252526;
      border-top: 2px solid #007acc;
      font-family: monospace;
    }
    .tab.response-tab {
      background: #252526;
      border-top: 2px solid #49cc90;
      color: #cccccc;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 480px;
    }
    .pane {
      padding: 20px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.5;
    }
    .request-pane {
      border-right: 1px solid #333;
      background: #1e1e1e;
    }
    .response-pane {
      background: #1a1a1a;
    }
    .action-bar {
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #2d2d2d;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .send-link {
      color: #4ec9b0;
      font-size: 12px;
      font-weight: bold;
      text-decoration: none;
      cursor: pointer;
    }
    .method-tag {
      font-weight: bold;
      color: ${methodColor};
      margin-right: 8px;
    }
    .url-text {
      color: #ce9178;
      word-break: break-all;
    }
    .section-title {
      color: #6a9955;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 14px 0 6px 0;
    }
    .header-name { color: #9cdcfe; }
    .header-value { color: #ce9178; }
    .json-key { color: #9cdcfe; }
    .json-string { color: #ce9178; }
    .json-number { color: #b5cea8; }
    .json-boolean { color: #569cd6; }
    .json-null { color: #569cd6; }
    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      color: #ffffff;
      background-color: ${statusColor};
      margin-right: 12px;
    }
    .metric {
      color: #858585;
      font-size: 12px;
      margin-right: 12px;
    }
    pre {
      white-space: pre-wrap;
      word-break: break-word;
    }
    .pane-title {
      font-size: 12px;
      color: #858585;
      margin-bottom: 12px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="window">
    <div class="titlebar">
      <div class="traffic-lights">
        <div class="dot red"></div>
        <div class="dot yellow"></div>
        <div class="dot green"></div>
      </div>
      <div class="window-title">tugas.http — Aksara Backend [REST Client] - ${escapeHtml(title)}</div>
      <div style="width: 52px;"></div>
    </div>
    <div class="tabs-bar">
      <div class="tab">tugas.http</div>
      <div class="tab response-tab">Response (${status} ${escapeHtml(statusText)})</div>
    </div>
    <div class="grid">
      <div class="pane request-pane">
        <div class="pane-title">HTTP REQUEST</div>
        <div class="action-bar">
          <span class="send-link">&#9654; Send Request</span>
        </div>
        <div class="code-line">
          <span class="method-tag">${method}</span>
          <span class="url-text">${escapeHtml(url)}</span>
        </div>
        ${reqHeaderEntries ? `<div class="section-title">Request Headers</div>${reqHeaderEntries}` : ''}
        ${requestBody ? `<div class="section-title">Request Body</div><pre>${formatJsonSyntax(requestBody)}</pre>` : ''}
      </div>
      <div class="pane response-pane">
        <div class="pane-title">HTTP RESPONSE</div>
        <div class="action-bar">
          <span class="status-badge">${status} ${escapeHtml(statusText)}</span>
          <span class="metric">${latency} ms</span>
          <span class="metric">HTTP/1.1</span>
        </div>
        <div class="section-title">Response Headers</div>
        ${resHeaderEntries}
        <div class="section-title">Response Body</div>
        <pre>${formatJsonSyntax(responseBody)}</pre>
      </div>
    </div>
  </div>
</body>
</html>`
}

;(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox']
  })

  const page = await browser.newPage({
    viewport: { width: 1280, height: 860 }
  })

  const testCases = [
    {
      filename: '01-rest-client-get-all.png',
      title: 'GET Semua Data Tugas',
      method: 'GET',
      url: 'http://localhost:3000/tugas',
      headers: { 'Accept': 'application/json' },
      body: null
    },
    {
      filename: '02-rest-client-get-by-id.png',
      title: 'GET Data Tugas Berdasarkan ID',
      method: 'GET',
      url: 'http://localhost:3000/tugas/1',
      headers: { 'Accept': 'application/json' },
      body: null
    },
    {
      filename: '03-rest-client-post-create.png',
      title: 'POST Tambah Data Tugas Baru',
      method: 'POST',
      url: 'http://localhost:3000/tugas',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: {
        judul: 'Praktikum 4: Dependency Injection',
        mataKuliah: 'Arsitektur Piranti Lunak',
        deadline: '2026-11-20',
        status: 'Belum Dikerjakan',
        prioritas: 'Tinggi',
        estimasiJam: 5,
        sudahSelesai: false
      }
    },
    {
      filename: '04-rest-client-conflict-exception.png',
      title: 'POST Duplikat Data (ConflictException)',
      method: 'POST',
      url: 'http://localhost:3000/tugas',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: {
        judul: 'Praktikum 4: Dependency Injection',
        mataKuliah: 'Arsitektur Piranti Lunak',
        deadline: '2026-11-20'
      }
    },
    {
      filename: '05-rest-client-validation-error.png',
      title: 'POST Validasi Gagal (ValidationPipe 400 Bad Request)',
      method: 'POST',
      url: 'http://localhost:3000/tugas',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: {
        judul: 'A',
        mataKuliah: 'Web'
      }
    },
    {
      filename: '06-rest-client-get-not-found.png',
      title: 'GET ID Tidak Ada (NotFoundException)',
      method: 'GET',
      url: 'http://localhost:3000/tugas/999',
      headers: { 'Accept': 'application/json' },
      body: null
    },
    {
      filename: '07-rest-client-patch-update.png',
      title: 'PATCH Perbarui Status Tugas',
      method: 'PATCH',
      url: 'http://localhost:3000/tugas/4',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: {
        status: 'Sedang Dikerjakan',
        prioritas: 'Sedang'
      }
    },
    {
      filename: '08-rest-client-delete.png',
      title: 'DELETE Hapus Data Tugas',
      method: 'DELETE',
      url: 'http://localhost:3000/tugas/4',
      headers: { 'Accept': 'application/json' },
      body: null
    }
  ]

  for (const tc of testCases) {
    const t0 = Date.now()
    const fetchOptions = {
      method: tc.method,
      headers: tc.headers
    }
    if (tc.body) {
      fetchOptions.body = JSON.stringify(tc.body)
    }

    const res = await fetch(tc.url, fetchOptions)
    const latency = Date.now() - t0
    const resHeaders = {
      'content-type': res.headers.get('content-type') || 'application/json; charset=utf-8',
      'connection': 'keep-alive',
      'access-control-allow-origin': res.headers.get('access-control-allow-origin') || '*'
    }

    let resBody
    try {
      resBody = await res.json()
    } catch {
      resBody = await res.text()
    }

    const html = renderRestClientHtml({
      title: tc.title,
      method: tc.method,
      url: tc.url,
      requestHeaders: tc.headers,
      requestBody: tc.body,
      status: res.status,
      statusText: res.statusText || (res.status === 200 ? 'OK' : res.status === 201 ? 'Created' : res.status === 404 ? 'Not Found' : res.status === 409 ? 'Conflict' : 'Bad Request'),
      responseHeaders: resHeaders,
      responseBody: resBody,
      latency
    })

    await page.setContent(html)
    await page.waitForTimeout(200)
    const filePath = path.join(outputDir, tc.filename)
    await page.screenshot({ path: filePath, fullPage: true })
    console.log(`Saved REST Client screenshot: ${tc.filename}`)
  }

  const fePage = await browser.newPage({
    viewport: { width: 1280, height: 950 }
  })

  await fePage.goto('http://localhost:5173', { waitUntil: 'networkidle' })
  await fePage.waitForTimeout(600)
  await fePage.screenshot({
    path: path.join(outputDir, '09-frontend-tampilan-awal.png'),
    fullPage: true
  })
  console.log('Saved 09-frontend-tampilan-awal.png')

  await fePage.click('#btn-toggle-tambah')
  await fePage.waitForTimeout(300)
  await fePage.screenshot({
    path: path.join(outputDir, '10-frontend-form-tambah.png'),
    fullPage: true
  })
  console.log('Saved 10-frontend-form-tambah.png')

  await fePage.fill('#input-kursus', 'Kecerdasan Buatan')
  await fePage.fill('#input-nama-tugas', 'Tugas 1: Algoritma Pencarian A*')
  await fePage.fill('#input-deadline', '2026-11-25')
  await fePage.selectOption('#input-status', 'Belum Dikerjakan')
  await fePage.selectOption('#input-prioritas', 'Tinggi')
  await fePage.click('button[type="submit"]')
  await fePage.waitForTimeout(800)
  await fePage.screenshot({
    path: path.join(outputDir, '11-frontend-setelah-tambah.png'),
    fullPage: true
  })
  console.log('Saved 11-frontend-setelah-tambah.png')

  const changeButtons = await fePage.$$('button.btn-ubah-status')
  if (changeButtons.length > 0) {
    await changeButtons[changeButtons.length - 1].click()
    await fePage.waitForTimeout(800)
  }
  await fePage.screenshot({
    path: path.join(outputDir, '12-frontend-setelah-ubah-status.png'),
    fullPage: true
  })
  console.log('Saved 12-frontend-setelah-ubah-status.png')

  const deleteButtons = await fePage.$$('button.btn-hapus')
  if (deleteButtons.length > 0) {
    await deleteButtons[deleteButtons.length - 1].click()
    await fePage.waitForTimeout(400)
  }
  await fePage.screenshot({
    path: path.join(outputDir, '13-frontend-setelah-hapus.png'),
    fullPage: true
  })
  console.log('Saved 13-frontend-setelah-hapus.png')

  await browser.close()
})()
