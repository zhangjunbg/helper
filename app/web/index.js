'use strict';
import App from './app.js';
import index from './index.vue';
const options = { base: '/' };

export default new App({
  index,
  options
}).initServer();
