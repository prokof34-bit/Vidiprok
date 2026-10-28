// Использование: node import.mjs "путь\к\папке\сайта" ТОКЕН [набор_данных]
import {createClient} from '@sanity/client'
import fs from 'node:fs'
import path from 'node:path'
import {randomBytes} from 'node:crypto'

const [, , site, token, dataset = 'production'] = process.argv
if (!site || !token) { console.log('Использование: node import.mjs "путь\\к\\папке\\сайта" ТОКЕН [набор_данных]'); process.exit(1) }
const client = createClient({projectId: 'vyp1jzrr', dataset, apiVersion: '2025-02-19', token, useCdn: false})
const seed = JSON.parse(fs.readFileSync(new URL('./seed.json', import.meta.url), 'utf8'))
const cache = {}
const key = () => randomBytes(4).toString('hex')
async function up(kind, rel) {
  const f = path.join(site, rel)
  if (!cache[f]) {
    console.log('  загрузка', rel)
    const a = await client.assets.upload(kind, fs.createReadStream(f), {filename: path.basename(f)})
    cache[f] = a._id
  }
  return {_type: kind, asset: {_type: 'reference', _ref: cache[f]}}
}
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined))

console.log('Настройки…')
await client.createOrReplace({_id: 'settings', _type: 'settings', ...seed.settings, stats: seed.settings.stats.map((s) => ({_key: key(), ...s}))})
console.log('Услуги…')
for (const [i, x] of seed.services.entries()) await client.createOrReplace({_id: 'service-' + (i + 1), _type: 'service', order: i + 1, ...x})
console.log('Цены…')
for (const [i, x] of seed.prices.entries()) await client.createOrReplace({_id: 'price-' + (i + 1), _type: 'price', order: i + 1, ...x})
console.log('Вопросы-ответы…')
for (const [i, x] of seed.faq.entries()) await client.createOrReplace({_id: 'faq-' + (i + 1), _type: 'faq', order: i + 1, ...x})
console.log('Проекты…')
for (const [i, x] of seed.projects.entries()) {
  console.log(' ', x.title)
  const blocks = []
  for (const b of x.blocks || []) {
    if (b.t === 'img') blocks.push({_key: key(), _type: 'caseImage', image: await up('image', b.f)})
    if (b.t === 'vid') blocks.push({_key: key(), _type: 'caseVideo', file: await up('file', b.f), narrow: !!b.narrow})
    if (b.t === 'emb') blocks.push({_key: key(), _type: 'caseEmbed', url: b.url})
    if (b.t === 'ban') blocks.push({_key: key(), _type: 'caseBanner', image: await up('image', b.f), url: b.url})
  }
  await client.createOrReplace(clean({
    _id: 'project-' + x.slug, _type: 'project', order: i + 1, title: x.title, slug: {_type: 'slug', current: x.slug},
    description: x.description, link: x.link, behanceUrl: x.behanceUrl, bg: x.bg,
    cover: await up('image', x.cover), caseBlocks: blocks.length ? blocks : undefined,
  }))
}
console.log('Готово. Теперь можно удалить токен в sanity.io/manage.')
