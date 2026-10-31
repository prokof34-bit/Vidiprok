import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Vidiprok',
  projectId: 'vyp1jzrr',
  dataset: 'production', // если у вас набор данных называется иначе, поменяйте здесь
  plugins: [
    structureTool({
      structure: (S) =>
        S.list().title('Контент').items([
          S.listItem().title('Настройки сайта').id('settings').child(S.document().schemaType('settings').documentId('settings')),
          S.divider(),
          ...S.documentTypeListItems().filter((i) => i.getId() !== 'settings'),
        ]),
    }),
  ],
  schema: {types: schemaTypes, templates: (t) => t.filter(({schemaType}) => schemaType !== 'settings')},
  document: {
    actions: (prev, {schemaType}) => (schemaType === 'settings' ? prev.filter(({action}) => action !== 'duplicate' && action !== 'delete') : prev),
  },
})
