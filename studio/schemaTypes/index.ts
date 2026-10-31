import {defineField, defineType} from 'sanity'

const orderField = defineField({name: 'order', title: 'Порядок (1, 2, 3…)', type: 'number'})
const byOrder = [{title: 'По порядку', name: 'byOrder', by: [{field: 'order', direction: 'asc' as const}]}]

export const settings = defineType({
  name: 'settings', title: 'Настройки сайта', type: 'document',
  fields: [
    defineField({name: 'telegram', title: 'Ссылка на Telegram', type: 'url'}),
    defineField({name: 'instagram', title: 'Ссылка на Instagram', type: 'url'}),
    defineField({name: 'vk', title: 'Ссылка на ВКонтакте', type: 'url'}),
    defineField({name: 'heroTags', title: 'Надписи внизу первого экрана', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'stats', title: 'Цифры в блоке «О нас»', type: 'array', of: [{type: 'object', fields: [
      {name: 'value', title: 'Цифра', type: 'string'}, {name: 'label', title: 'Подпись', type: 'string'}],
      preview: {select: {title: 'value', subtitle: 'label'}}}]}),
    defineField({name: 'priceNote', title: 'Пояснение над ценами', type: 'string'}),
  ],
  preview: {prepare: () => ({title: 'Настройки сайта'})},
})

export const service = defineType({
  name: 'service', title: 'Услуги', type: 'document', orderings: byOrder,
  fields: [
    defineField({name: 'title', title: 'Название', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'short', title: 'Короткая строка (видна в закрытой карточке)', type: 'string'}),
    defineField({name: 'description', title: 'Описание (видно при раскрытии)', type: 'text', rows: 4}),
    defineField({name: 'audience', title: 'Кому подойдёт', type: 'text', rows: 3}),
    defineField({name: 'icon', title: 'Иконка', type: 'string', initialValue: 'site', options: {list: [
      {title: 'Коробка (упаковка бизнеса)', value: 'pack'}, {title: 'Чек-лист (план)', value: 'plan'},
      {title: 'Окно сайта', value: 'site'}, {title: 'Визитки', value: 'print'}, {title: 'Телефон с профилем (соцсети)', value: 'social'},
      {title: 'Телефон с интерфейсом (приложение)', value: 'app'}, {title: 'Конверт (приглашение)', value: 'invite'}]}}),
    orderField,
  ],
  preview: {select: {title: 'title', subtitle: 'short'}},
})

export const price = defineType({
  name: 'price', title: 'Цены', type: 'document', orderings: byOrder,
  fields: [
    defineField({name: 'name', title: 'Услуга', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'term', title: 'Срок (например «от 5 дней»)', type: 'string'}),
    defineField({name: 'price', title: 'Цена (например «от 20 000 ₽»)', type: 'string'}),
    defineField({name: 'oldPrice', title: 'Старая цена (будет зачёркнута, можно оставить пустой)', type: 'string'}),
    orderField,
  ],
  preview: {select: {title: 'name', subtitle: 'price'}},
})

export const faq = defineType({
  name: 'faq', title: 'Вопрос-ответ', type: 'document', orderings: byOrder,
  fields: [
    defineField({name: 'question', title: 'Вопрос', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'answer', title: 'Ответ', type: 'text', rows: 3}),
    orderField,
  ],
  preview: {select: {title: 'question'}},
})

export const seo = defineType({
  name: 'seo', title: 'SEO', type: 'object', options: {collapsible: true, collapsed: true},
  fields: [
    defineField({name: 'title', title: 'SEO Title (до 60–70 символов; если пусто, возьмётся название проекта)', type: 'string', validation: (r) => r.max(70).warning('Слишком длинный заголовок обрежется в выдаче')}),
    defineField({name: 'description', title: 'Meta Description (120–160 символов)', type: 'text', rows: 3, validation: (r) => r.max(200).warning('Слишком длинное описание обрежется в выдаче')}),
    defineField({name: 'ogImage', title: 'Картинка для соцсетей и поиска (1200×630)', type: 'image'}),
    defineField({name: 'noIndex', title: 'Не показывать в поиске (noindex)', type: 'boolean', initialValue: false}),
    defineField({name: 'canonical', title: 'Canonical URL (оставьте пустым, если не нужен)', type: 'url'}),
  ],
})

export const caseImage = defineType({
  name: 'caseImage', title: 'Картинка', type: 'object',
  fields: [defineField({name: 'image', title: 'Картинка', type: 'image', validation: (r) => r.required()})],
  preview: {select: {media: 'image'}, prepare: ({media}) => ({title: 'Картинка', media})},
})

export const caseVideo = defineType({
  name: 'caseVideo', title: 'Видео', type: 'object',
  fields: [
    defineField({name: 'file', title: 'Видеофайл (mp4)', type: 'file', options: {accept: 'video/mp4'}, validation: (r) => r.required()}),
    defineField({name: 'narrow', title: 'Не на всю ширину (по центру, до 1400 px)', type: 'boolean', initialValue: false}),
  ],
  preview: {prepare: () => ({title: 'Видео'})},
})

export const caseEmbed = defineType({
  name: 'caseEmbed', title: 'Видео по ссылке (Kinescope, YouTube, Rutube…)', type: 'object',
  fields: [defineField({name: 'url', title: 'Ссылка из кода вставки (то, что в src="…")', type: 'url', validation: (r) => r.required().uri({scheme: ['https']})})],
  preview: {select: {subtitle: 'url'}, prepare: ({subtitle}) => ({title: 'Видео по ссылке', subtitle})},
})

export const caseBanner = defineType({
  name: 'caseBanner', title: 'Картинка-ссылка (баннер)', type: 'object',
  fields: [
    defineField({name: 'image', title: 'Картинка', type: 'image', validation: (r) => r.required()}),
    defineField({name: 'url', title: 'Куда ведёт', type: 'url'}),
  ],
  preview: {select: {media: 'image', subtitle: 'url'}, prepare: ({media, subtitle}) => ({title: 'Баннер', subtitle, media})},
})

export const project = defineType({
  name: 'project', title: 'Проекты', type: 'document', orderings: byOrder,
  fields: [
    defineField({name: 'title', title: 'Название', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Адрес кейса (латиницей)', type: 'slug', options: {source: 'title'}, validation: (r) => r.required()}),
    defineField({name: 'description', title: 'Описание под карточкой', type: 'string'}),
    defineField({name: 'cover', title: 'Обложка карточки', type: 'image', options: {hotspot: true}}),
    defineField({name: 'link', title: 'Внешняя ссылка (используется, если ниже нет слайдов кейса)', type: 'url'}),
    defineField({name: 'behanceUrl', title: 'Ссылка на Behance (кнопка внутри кейса)', type: 'url'}),
    defineField({name: 'bg', title: 'Цвет фона страницы кейса (например #080c18)', type: 'string'}),
    defineField({name: 'caseBlocks', title: 'Страница кейса: слайды по порядку (можно перетаскивать)', type: 'array',
      of: [{type: 'caseImage'}, {type: 'caseVideo'}, {type: 'caseEmbed'}, {type: 'caseBanner'}]}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
    orderField,
  ],
  preview: {select: {title: 'title', subtitle: 'description', media: 'cover'}},
})

export const schemaTypes = [seo, settings, service, price, faq, project, caseImage, caseVideo, caseEmbed, caseBanner]
