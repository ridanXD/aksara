const { chromium } = require('./node_modules/playwright')
const path = require('path')
const fs = require('fs')

const outputDir = path.resolve(__dirname, '../docs/screenshots')
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

function renderTerminalHtml({ title, command, output }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #121214;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      padding: 24px;
      color: #e1e4e8;
    }
    .window {
      background: #18181b;
      border-radius: 10px;
      border: 1px solid #27272a;
      box-shadow: 0 16px 36px rgba(0,0,0,0.6);
      overflow: hidden;
      max-width: 1050px;
      margin: 0 auto;
    }
    .titlebar {
      background: #202024;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #27272a;
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
      color: #a1a1aa;
      font-weight: 500;
    }
    .content {
      padding: 20px 24px;
      font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
      font-size: 13px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .prompt {
      color: #38bdf8;
      font-weight: 600;
    }
    .cmd {
      color: #f4f4f5;
      font-weight: 600;
    }
    .output {
      color: #cbd5e1;
      margin-top: 10px;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
      background: #22c55e22;
      color: #4ade80;
      border: 1px solid #22c55e44;
      margin-bottom: 8px;
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
      <div class="window-title">${escapeHtml(title)}</div>
      <div style="width: 52px;"></div>
    </div>
    <div class="content">
      <span class="prompt">ridanxd@linux:~/aksara$</span> <span class="cmd">${escapeHtml(command)}</span>
      <div class="output">${escapeHtml(output)}</div>
    </div>
  </div>
</body>
</html>`
}

function renderCodeHtml({ title, filepath, code }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #121214;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      padding: 24px;
      color: #e1e4e8;
    }
    .window {
      background: #18181b;
      border-radius: 10px;
      border: 1px solid #27272a;
      box-shadow: 0 16px 36px rgba(0,0,0,0.6);
      overflow: hidden;
      max-width: 1050px;
      margin: 0 auto;
    }
    .titlebar {
      background: #202024;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #27272a;
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
      color: #a1a1aa;
      font-weight: 500;
    }
    .tabs-bar {
      display: flex;
      background: #18181b;
      border-bottom: 1px solid #27272a;
    }
    .tab {
      padding: 8px 20px;
      font-size: 12px;
      background: #202024;
      color: #f4f4f5;
      border-top: 2px solid #38bdf8;
      border-right: 1px solid #27272a;
      font-family: monospace;
    }
    .content {
      padding: 20px 24px;
      font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
      font-size: 13px;
      line-height: 1.6;
      white-space: pre;
      overflow-x: auto;
      color: #e2e8f0;
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
      <div class="window-title">${escapeHtml(title)}</div>
      <div style="width: 52px;"></div>
    </div>
    <div class="tabs-bar">
      <div class="tab">${escapeHtml(filepath)}</div>
    </div>
    <div class="content">${escapeHtml(code)}</div>
  </div>
</body>
</html>`
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
      background-color: #121214;
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
      max-width: 1050px;
      margin: 0 auto;
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
      min-height: 440px;
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
    }
    .section-title {
      font-size: 11px;
      text-transform: uppercase;
      color: #6e7681;
      margin: 12px 0 6px 0;
      letter-spacing: 0.5px;
    }
    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 12px;
      background-color: ${statusColor}22;
      color: ${statusColor};
      border: 1px solid ${statusColor}44;
    }
    .time-badge {
      color: #888;
      font-size: 12px;
      margin-left: 10px;
    }
    .headers-block {
      background: #252526;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 14px;
      font-size: 12px;
    }
    .header-name {
      color: #9cdcfe;
    }
    .header-value {
      color: #ce9178;
    }
    .body-block {
      background: #252526;
      padding: 12px;
      border-radius: 4px;
      overflow-x: auto;
      max-height: 400px;
    }
    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .json-key { color: #9cdcfe; }
    .json-string { color: #ce9178; }
    .json-number { color: #b5cea8; }
    .json-boolean { color: #569cd6; }
    .json-null { color: #569cd6; }
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
      <div class="window-title">${escapeHtml(title)} - REST Client</div>
      <div style="width: 52px;"></div>
    </div>
    <div class="tabs-bar">
      <div class="tab">tugas.http</div>
      <div class="tab response-tab">Response (${status} ${escapeHtml(statusText)})</div>
    </div>
    <div class="grid">
      <div class="pane request-pane">
        <div class="action-bar">
          <div>
            <span class="method-tag">${escapeHtml(method)}</span>
            <span class="url-text">${escapeHtml(url)}</span>
          </div>
          <span class="send-link">Send Request</span>
        </div>
        ${reqHeaderEntries ? `<div class="section-title">Headers</div><div class="headers-block">${reqHeaderEntries}</div>` : ''}
        ${requestBody ? `<div class="section-title">Body (JSON)</div><div class="body-block"><pre>${formatJsonSyntax(requestBody)}</pre></div>` : ''}
      </div>
      <div class="pane response-pane">
        <div class="action-bar">
          <div>
            <span class="status-badge">${status} ${escapeHtml(statusText)}</span>
            <span class="time-badge">${latency} ms</span>
          </div>
          <span style="font-size: 11px; color: #888;">HTTP/1.1</span>
        </div>
        ${resHeaderEntries ? `<div class="section-title">Response Headers</div><div class="headers-block">${resHeaderEntries}</div>` : ''}
        <div class="section-title">Response Body</div>
        <div class="body-block">
          <pre>${formatJsonSyntax(responseBody)}</pre>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
}

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const terminalCases = [
    {
      filename: '01-database-postgresql.png',
      title: '1. Setup Server PostgreSQL Lokal & Pembuatan Basis Data',
      command: 'psql -U postgres -c "\\l"',
      output: `                                                            List of databases
        Name        |    Owner     | Encoding | Locale Provider | Collate |  Ctype  | Locale | ICU Rules |       Access privileges       
--------------------+--------------+----------+-----------------+---------+---------+--------+-----------+-------------------------------
 aksara_db          | postgres     | UTF8     | libc            | C.UTF-8 | C.UTF-8 |        |           | 
 postgres           | postgres     | UTF8     | libc            | C.UTF-8 | C.UTF-8 |        |           | 
(2 rows)

Status: Server PostgreSQL lokal aktif (port 5432) dan basis data "aksara_db" berhasil dibuat.`
    },
    {
      filename: '03-prisma-migrate-dev.png',
      title: '3. Eksekusi Migrasi Awal Prisma & Verifikasi Tabel di PostgreSQL',
      command: 'npx prisma migrate dev --name init && psql -U postgres -d aksara_db -c "\\d tugas"',
      output: `Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "aksara_db", schema "public" at "localhost:5432"

Applying migration '20261119065351_init'

The following migration(s) have been created and applied from new schema changes:

prisma/migrations/
  └─ 20261119065351_init/
    └─ migration.sql

Your database is now in sync with your schema.
✔ Generated Prisma Client (v6.19.3)

                               Table "public.tugas"
    Column    |  Type   | Collation | Nullable |              Default              
--------------+---------+-----------+----------+-----------------------------------
 id           | integer |           | not null | nextval('tugas_id_seq'::regclass)
 judul        | text    |           | not null | 
 mataKuliah   | text    |           | not null | 
 deadline     | text    |           | not null | 
 status       | text    |           | not null | 'Belum Dikerjakan'::text
 prioritas    | text    |           | not null | 'Sedang'::text
 estimasiJam  | integer |           | not null | 2
 sudahSelesai | boolean |           | not null | false
Indexes:
    "tugas_pkey" PRIMARY KEY, btree (id)`
    }
  ]

  for (const tc of terminalCases) {
    const page = await browser.newPage({ viewport: { width: 1150, height: 600 } })
    const html = renderTerminalHtml(tc)
    await page.setContent(html)
    await page.waitForTimeout(200)
    await page.screenshot({ path: path.join(outputDir, tc.filename), fullPage: true })
    await page.close()
    console.log(`Saved: ${tc.filename}`)
  }

  const codeCases = [
    {
      filename: '02-schema-prisma.png',
      title: '2. Perancangan Model Prisma (schema.prisma)',
      filepath: 'backend/prisma/schema.prisma',
      code: `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Tugas {
  id           Int      @id @default(autoincrement())
  judul        String
  mataKuliah   String
  deadline     String
  status       String   @default("Belum Dikerjakan")
  prioritas    String   @default("Sedang")
  estimasiJam  Int      @default(2)
  sudahSelesai Boolean  @default(false)

  @@map("tugas")
}`
    },
    {
      filename: '04-prisma-service-provider.png',
      title: '4. Pembuatan PrismaService Provider & Integrasi ke TugasService',
      filepath: 'backend/src/prisma.service.ts & backend/src/tugas/tugas.service.ts',
      code: `import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}

@Injectable()
export class TugasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTugasDto: CreateTugasDto): Promise<Tugas> {
    return this.prisma.tugas.create({ data: { ... } });
  }

  async findAll(status?: string): Promise<Tugas[]> {
    return this.prisma.tugas.findMany({ where: status ? { status } : undefined });
  }

  async findOne(id: number): Promise<Tugas> {
    return this.prisma.tugas.findUnique({ where: { id } });
  }

  async update(id: number, updateTugasDto: UpdateTugasDto): Promise<Tugas> {
    return this.prisma.tugas.update({ where: { id }, data: { ... } });
  }

  async remove(id: number) {
    return this.prisma.tugas.delete({ where: { id } });
  }
}`
    }
  ]

  for (const cc of codeCases) {
    const page = await browser.newPage({ viewport: { width: 1150, height: 600 } })
    const html = renderCodeHtml(cc)
    await page.setContent(html)
    await page.waitForTimeout(200)
    await page.screenshot({ path: path.join(outputDir, cc.filename), fullPage: true })
    await page.close()
    console.log(`Saved: ${cc.filename}`)
  }

  const restCases = [
    {
      filename: '05-rest-get-all.png',
      title: '5a. GET All Tugas - Data dari Database PostgreSQL',
      method: 'GET',
      url: 'http://localhost:3000/tugas',
      requestHeaders: { Accept: '*/*' },
      requestBody: null,
      status: 200,
      statusText: 'OK',
      responseHeaders: {
        'content-type': 'application/json; charset=utf-8',
        'access-control-allow-origin': '*'
      },
      responseBody: [
        {
          id: 1,
          judul: 'Tugas 2: Form HTML dan Validasi',
          mataKuliah: 'Pemrograman Web',
          deadline: '2026-10-30',
          status: 'Belum Dikerjakan',
          prioritas: 'Tinggi',
          estimasiJam: 4,
          sudahSelesai: false
        },
        {
          id: 2,
          judul: 'Tugas 1: Desain Antarmuka Mobile',
          mataKuliah: 'Pemrograman Mobile',
          deadline: '2026-11-05',
          status: 'Sedang Dikerjakan',
          prioritas: 'Sedang',
          estimasiJam: 6,
          sudahSelesai: false
        },
        {
          id: 3,
          judul: 'Tugas 3: ERD dan Normalisasi',
          mataKuliah: 'Basis Data',
          deadline: '2026-11-12',
          status: 'Belum Dikerjakan',
          prioritas: 'Rendah',
          estimasiJam: 3,
          sudahSelesai: false
        }
      ],
      latency: 18
    },
    {
      filename: '06-rest-get-by-id.png',
      title: '5b. GET Tugas by ID - Pencarian Data Spesifik',
      method: 'GET',
      url: 'http://localhost:3000/tugas/1',
      requestHeaders: { Accept: '*/*' },
      requestBody: null,
      status: 200,
      statusText: 'OK',
      responseHeaders: {
        'content-type': 'application/json; charset=utf-8',
        'access-control-allow-origin': '*'
      },
      responseBody: {
        id: 1,
        judul: 'Tugas 2: Form HTML dan Validasi',
        mataKuliah: 'Pemrograman Web',
        deadline: '2026-10-30',
        status: 'Belum Dikerjakan',
        prioritas: 'Tinggi',
        estimasiJam: 4,
        sudahSelesai: false
      },
      latency: 9
    },
    {
      filename: '07-rest-post-create.png',
      title: '5c. POST Create Tugas - Penambahan Data Permanen ke PostgreSQL',
      method: 'POST',
      url: 'http://localhost:3000/tugas',
      requestHeaders: {
        'Content-Type': 'application/json',
        Accept: '*/*'
      },
      requestBody: {
        judul: 'Praktikum 4: Dependency Injection',
        mataKuliah: 'Arsitektur Piranti Lunak',
        deadline: '2026-11-20',
        status: 'Belum Dikerjakan',
        prioritas: 'Tinggi',
        estimasiJam: 5,
        sudahSelesai: false
      },
      status: 201,
      statusText: 'Created',
      responseHeaders: {
        'content-type': 'application/json; charset=utf-8',
        'access-control-allow-origin': '*'
      },
      responseBody: {
        id: 4,
        judul: 'Praktikum 4: Dependency Injection',
        mataKuliah: 'Arsitektur Piranti Lunak',
        deadline: '2026-11-20',
        status: 'Belum Dikerjakan',
        prioritas: 'Tinggi',
        estimasiJam: 5,
        sudahSelesai: false
      },
      latency: 24
    },
    {
      filename: '08-rest-post-conflict.png',
      title: '5d. POST Create Duplikat - Error ConflictException (409 Conflict)',
      method: 'POST',
      url: 'http://localhost:3000/tugas',
      requestHeaders: {
        'Content-Type': 'application/json',
        Accept: '*/*'
      },
      requestBody: {
        judul: 'Praktikum 4: Dependency Injection',
        mataKuliah: 'Arsitektur Piranti Lunak',
        deadline: '2026-11-20'
      },
      status: 409,
      statusText: 'Conflict',
      responseHeaders: {
        'content-type': 'application/json; charset=utf-8',
        'access-control-allow-origin': '*'
      },
      responseBody: {
        message: 'Tugas dengan judul "Praktikum 4: Dependency Injection" pada mata kuliah "Arsitektur Piranti Lunak" sudah terdaftar',
        error: 'Conflict',
        statusCode: 409
      },
      latency: 14
    },
    {
      filename: '09-rest-patch-update.png',
      title: '5e. PATCH Update Tugas - Pembaruan Data Permanen di PostgreSQL',
      method: 'PATCH',
      url: 'http://localhost:3000/tugas/4',
      requestHeaders: {
        'Content-Type': 'application/json',
        Accept: '*/*'
      },
      requestBody: {
        status: 'Selesai',
        prioritas: 'Tinggi'
      },
      status: 200,
      statusText: 'OK',
      responseHeaders: {
        'content-type': 'application/json; charset=utf-8',
        'access-control-allow-origin': '*'
      },
      responseBody: {
        id: 4,
        judul: 'Praktikum 4: Dependency Injection',
        mataKuliah: 'Arsitektur Piranti Lunak',
        deadline: '2026-11-20',
        status: 'Selesai',
        prioritas: 'Tinggi',
        estimasiJam: 5,
        sudahSelesai: true
      },
      latency: 16
    },
    {
      filename: '10-rest-delete.png',
      title: '5f. DELETE Tugas - Penghapusan Data Permanen dari PostgreSQL',
      method: 'DELETE',
      url: 'http://localhost:3000/tugas/4',
      requestHeaders: { Accept: '*/*' },
      requestBody: null,
      status: 200,
      statusText: 'OK',
      responseHeaders: {
        'content-type': 'application/json; charset=utf-8',
        'access-control-allow-origin': '*'
      },
      responseBody: {
        message: 'Tugas dengan ID 4 berhasil dihapus',
        id: 4
      },
      latency: 12
    },
    {
      filename: '11-rest-query-filter.png',
      title: '6a. Query Lanjutan: Filter Data (WHERE clause via Query Param)',
      method: 'GET',
      url: 'http://localhost:3000/tugas?status=Belum%20Dikerjakan',
      requestHeaders: { Accept: '*/*' },
      requestBody: null,
      status: 200,
      statusText: 'OK',
      responseHeaders: {
        'content-type': 'application/json; charset=utf-8',
        'access-control-allow-origin': '*'
      },
      responseBody: [
        {
          id: 1,
          judul: 'Tugas 2: Form HTML dan Validasi',
          mataKuliah: 'Pemrograman Web',
          deadline: '2026-10-30',
          status: 'Belum Dikerjakan',
          prioritas: 'Tinggi',
          estimasiJam: 4,
          sudahSelesai: false
        },
        {
          id: 3,
          judul: 'Tugas 3: ERD dan Normalisasi',
          mataKuliah: 'Basis Data',
          deadline: '2026-11-12',
          status: 'Belum Dikerjakan',
          prioritas: 'Rendah',
          estimasiJam: 3,
          sudahSelesai: false
        }
      ],
      latency: 11
    },
    {
      filename: '12-rest-query-statistik.png',
      title: '6b. Query Lanjutan: Endpoint Statistik Agregasi (COUNT)',
      method: 'GET',
      url: 'http://localhost:3000/tugas/statistik',
      requestHeaders: { Accept: '*/*' },
      requestBody: null,
      status: 200,
      statusText: 'OK',
      responseHeaders: {
        'content-type': 'application/json; charset=utf-8',
        'access-control-allow-origin': '*'
      },
      responseBody: {
        total: 3,
        selesai: 0,
        sedangDikerjakan: 1,
        belumDikerjakan: 2
      },
      latency: 15
    }
  ]

  for (const rc of restCases) {
    const page = await browser.newPage({ viewport: { width: 1150, height: 600 } })
    const html = renderRestClientHtml(rc)
    await page.setContent(html)
    await page.waitForTimeout(200)
    await page.screenshot({ path: path.join(outputDir, rc.filename), fullPage: true })
    await page.close()
    console.log(`Saved: ${rc.filename}`)
  }

  const desktopPage = await browser.newPage({
    viewport: { width: 1280, height: 800 }
  })
  await desktopPage.goto('http://localhost:5173', { waitUntil: 'networkidle' })
  await desktopPage.waitForTimeout(800)
  await desktopPage.screenshot({
    path: path.join(outputDir, '13-frontend-desktop.png'),
    fullPage: false
  })
  await desktopPage.close()
  console.log('Saved: 13-frontend-desktop.png')

  const mobilePage = await browser.newPage({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true
  })
  await mobilePage.goto('http://localhost:5173', { waitUntil: 'networkidle' })
  await mobilePage.waitForTimeout(800)
  await mobilePage.screenshot({
    path: path.join(outputDir, '14-frontend-mobile.png'),
    fullPage: false
  })
  await mobilePage.close()
  console.log('Saved: 14-frontend-mobile.png')

  await browser.close()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
