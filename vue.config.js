const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  },

  devServer: {
    port: 1212
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/CS6131ProjectFrontend/' : '/'
})
