'use strict';
const {
  VueLoaderPlugin
} = require('vue-loader')
const serEnv = 'admin'
console.log("--------------------当前：------------ : ", serEnv);
module.exports = {
  egg: true,
  framework: 'vue',
  entry: {
    app: 'app/web/index.js'
  },
  alias: {
    component: 'app/web/component',
    store: 'app/web/store',
    vue: 'vue/dist/vue.esm.js',
    router: 'app/web/router/' + serEnv + '.js',
    '@': 'app/web'
  },
  dll: ['vue', 'axios', 'vue-router', 'vuex', 'vuex-router-sync'],
  loaders: {
    css: true,
    sass: true,
    scss: true,
    urlimage: true,
    urlfont: true
  },
  rules: [{
    'vue-loader': new VueLoaderPlugin()
  }],
  plugins: {
    imagemini: false,

  },
  done() {
    console.log("--------------------当前：------------ : ", serEnv);
  }
};