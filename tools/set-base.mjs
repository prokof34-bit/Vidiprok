// Смена адреса сайта во всех файлах (canonical, sitemap, robots, JSON-LD).
// Пример: node tools/set-base.mjs https://vidiprok.layero.app https://vidiprok.ru
import fs from 'node:fs'; import path from 'node:path'
const [, , from, to] = process.argv
if (!from || !to) { console.log('Использование: node tools/set-base.mjs СТАРЫЙ_АДРЕС НОВЫЙ_АДРЕС'); process.exit(1) }
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..')
let n = 0
const walk = (d) => { for (const f of fs.readdirSync(d, {withFileTypes: true})) {
  if (['.git', 'node_modules', 'studio', 'import', 'img', 'media'].includes(f.name)) continue
  const p = path.join(d, f.name)
  if (f.isDirectory()) walk(p)
  else if (/\.(html|xml|txt|js)$/.test(f.name)) { const s = fs.readFileSync(p, 'utf8'); if (s.includes(from)) { fs.writeFileSync(p, s.split(from).join(to)); n++ } }
} }
walk(root); console.log('Обновлено файлов:', n)
