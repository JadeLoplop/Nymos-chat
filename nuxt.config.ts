import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import path from 'path'
export default defineNuxtConfig({
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