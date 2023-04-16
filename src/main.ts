import { createApp } from 'vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import createRouter from './router'
import App from './App.vue'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import 'quill-emoji'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import QuillMarkdownShortcuts from 'quill-markdown-shortcuts'
import { Quill, QuillEditor } from '@vueup/vue-quill'

loadFonts().then(r => r)

Quill.register('modules/markdownShortcuts', QuillMarkdownShortcuts)
const globalVueQuillOptions = {
  placeholder: 'test',
  modules: {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['clean'],
        ['emoji'],
        ['link', 'image', 'video']
      ],
      handlers: {
        emoji: () => undefined
      }
    },
    markdownShortcuts: true,
    'emoji-toolbar': true,
    'emoji-textarea': true,
    'emoji-shortname': true
  }
}

QuillEditor.props.globalOptions.default = () => globalVueQuillOptions

createApp(App)
  .use(createPinia().use(piniaPluginPersistedState))
  .use(createRouter())
  .use(vuetify)
  .component('QuillEditor', QuillEditor)
  .mount('#app')
