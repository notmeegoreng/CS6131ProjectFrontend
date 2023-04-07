import { createApp } from 'vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { createPinia } from 'pinia'
import createRouter from './router'
import App from './App.vue'

loadFonts()

createApp(App)
  .use(createPinia())
  .use(createRouter())
  .use(vuetify)
  .mount('#app')
