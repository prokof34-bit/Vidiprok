// Проверка SEO-метаданных и ссылок, без зависимостей: node tools/check-seo.mjs [запрещённая_подстрока_в_<head>]
// Пример: node tools/check-seo.mjs старый-домен.ru
import fs from 'node:fs'
import path from 'node:path'
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..')
const forbidden = process.argv[2]
const skip = new Set(['.git', 'node_modules', 'studio', 'import', 'tools'])
const files = []
;(function walk(d) { for (const f of fs.readdirSync(d, {withFileTypes: true})) { if (skip.has(f.name)) continue; const p = path.join(d, f.name); f.isDirectory() ? walk(p) : /\.html$/.test(f.name) && files.push(p) } })(root)
const read = (p) => fs.readFileSync(p, 'utf8')
const rel = (p) => path.relative(root, p).split(path.sep).join('/')
const BASE = ((read(path.join(root, 'index.html')).match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || '').replace(/\/$/, '')
const problems = []
const bad = (f, m) => problems.push(rel(f) + ': ' + m)
const canon = new Map(), indexable = new Map()
console.log('Основной адрес:', BASE, '\n')
for (const f of files) {
  const s = read(f), head = s.split('</head>')[0]
  const robots = (head.match(/<meta name="robots" content="([^"]+)"/) || [])[1] || ''
  const noindex = /noindex/i.test(robots)
  const title = (head.match(/<title>([^<]*)<\/title>/) || [])[1]
  const desc = (head.match(/<meta name="description" content="([^"]*)"/) || [])[1]
  const cn = (head.match(/<link rel="canonical" href="([^"]+)"/) || [])[1]
  const h1 = (s.match(/<h1[ >]/g) || []).length
  if (!title) bad(f, 'нет title'); if (!desc) bad(f, 'нет description')
  if (!noindex) {
    indexable.set(f, cn)
    if (h1 !== 1) bad(f, 'H1 должно быть ровно одно, найдено ' + h1)
    if (!cn) bad(f, 'нет canonical')
    else {
      if (!cn.startsWith(BASE)) bad(f, 'canonical не с основного адреса: ' + cn)
      if (canon.has(cn)) bad(f, 'canonical повторяется на ' + canon.get(cn)); canon.set(cn, rel(f))
      const target = cn.slice(BASE.length).replace(/^\//, '') || 'index.html'
      if (!fs.existsSync(path.join(root, target.endsWith('/') ? target + 'index.html' : target))) bad(f, 'canonical ведёт на несуществующий файл: ' + cn)
    }
    for (const t of ['og:title', 'og:description', 'og:image', 'og:url', 'twitter:card', 'twitter:image']) if (!head.includes(t)) bad(f, 'нет ' + t)
    const ogu = (head.match(/property="og:url" content="([^"]+)"/) || [])[1]; if (ogu && ogu !== cn) bad(f, 'og:url не совпадает с canonical')
    const ogi = (head.match(/property="og:image" content="([^"]+)"/) || [])[1]
    if (ogi && ogi.startsWith(BASE) && !fs.existsSync(path.join(root, ogi.slice(BASE.length + 1)))) bad(f, 'нет файла og:image: ' + ogi)
  }
  if (forbidden && head.includes(forbidden)) bad(f, 'в <head> найден «' + forbidden + '»')
  for (const m of s.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) { try { JSON.parse(m[1].replace(/<\\\//g, '</')) } catch (e) { bad(f, 'ошибка JSON-LD: ' + e.message) } }
  for (const i of s.match(/<img [^>]*>/g) || []) { if (!/ alt="/.test(i)) bad(f, 'img без alt: ' + i.slice(0, 70)); if (!/ width=/.test(i) && !/ class="shot"/.test(i)) bad(f, 'img без width/height: ' + i.slice(0, 70)) }
  for (const m of s.matchAll(/(?:src|href|poster)="([^"#?]+)"/g)) {
    let u = m[1]; if (/^(mailto:|tel:|data:|\/\/)/.test(u)) continue
    if (/^https?:/.test(u)) { if (!u.startsWith(BASE)) continue; u = u.slice(BASE.length) || '/'; if (u === '/' || u.endsWith('/')) u += 'index.html'; u = path.join(root, u) } else u = path.resolve(path.dirname(f), u)
    if (/[a-z0-9]$/i.test(u) && !fs.existsSync(u)) bad(f, 'нет файла: ' + m[1])
  }
  console.log(rel(f).padEnd(50), 'H1:' + h1, 'title:' + (title || '').length, 'desc:' + (desc || '').length, noindex ? 'noindex' : 'index')
}
const sm = path.join(root, 'sitemap.xml')
if (!fs.existsSync(sm)) bad(sm, 'нет sitemap.xml')
else {
  const locs = [...read(sm).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  if (new Set(locs).size !== locs.length) bad(sm, 'в sitemap есть дубли')
  for (const u of locs) { if (!u.startsWith(BASE)) bad(sm, 'не с основного адреса: ' + u); if (!canon.has(u)) bad(sm, 'адрес без индексируемой страницы или не совпадает с canonical: ' + u) }
  for (const c of canon.keys()) if (!locs.includes(c)) bad(sm, 'страницы нет в sitemap: ' + c)
  console.log('\nsitemap.xml: адресов', locs.length)
}
const rb = path.join(root, 'robots.txt')
if (!fs.existsSync(rb)) bad(rb, 'нет robots.txt'); else if (!read(rb).includes('Sitemap: ' + BASE + '/sitemap.xml')) bad(rb, 'нет строки Sitemap с основным адресом')
console.log(problems.length ? '\nПРОБЛЕМЫ (' + problems.length + '):\n' + problems.join('\n') : '\nПроблем не найдено.')
process.exit(problems.length ? 1 : 0)
