import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import path from 'path'
export default defineNuxtConfig({
  runtimeConfig:{
    public:{
      apiKey: process.env.NUXT_PUBLIC_API_KEY,
      authDomain: process.env.NUXT_PUBLIC_AUTH_DOMAIN,
      databaseUrl: process.env.NUXT_PUBLIC_DATABASE_URL,
      projectId: process.env.NUXT_PUBLIC_PROJECT_ID,
      storageBuck: process.env.NUXT_PUBLIC_STORAGE_BUCK,
      messagingSenderId: process.env.NUXT_PUBLIC_MESSAGING_SENDER_ID,
      appId: process.env.NUXT_PUBLIC_APP_ID,
      measurementId: process.env.NUXT_PUBLIC_MEASUREMENT_ID,
    }
  },
  css: [
    '~/assets/main.css',
  ],
  alias: {
    '@components': path.resolve(__dirname, './components'),
    '@stores': path.resolve(__dirname, './stores'),
  },

  build: {
    transpile: ['vuetify'],
  },

  modules: [
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({
          autoImport: true,
        }))
      })
    },
  ],
  plugins: [
    { src: '~/plugins/firebase.ts', mode: 'client' },
  ],
  // ssr: false,
  vite: {
    ssr: {
      noExternal: ['vuetify']
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },


  compatibilityDate: '2024-07-13',
})