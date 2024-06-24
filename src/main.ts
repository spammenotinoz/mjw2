import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore } from './store'
import { router, setupRouter } from './router' // Ensure router is exported from './router'

async function setupApplication(app) {
  setupAssets()
  setupScrollbarStyle()
  setupI18n(app)
  await setupRouter(app)
  await setupStore(app)
}

async function bootstrap() {
  const app = createApp(App)

  // Setup application plugins and router
  await setupApplication(app)

  // Mount the Vue application
  app.mount('#app')
}

bootstrap()