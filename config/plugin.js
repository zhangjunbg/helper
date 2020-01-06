exports.vuessr = {
  enable: true,
  package: 'egg-view-vue-ssr'
};

// exports.ejs = {
//   enable: true,
//   package: 'egg-view-ejs',
// }
// exports.view = {
//   enable:true,
//   package:'egg-view',
//   mapping: {'.html': 'ejs'}
// }
exports.redis = {
  enable: true,
  package: 'egg-redis',
};
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

exports.session = true;
exports.cors = {
  enable: true,
  package: 'egg-cors'
};

exports.webpack = {
  enable: true,
  package: 'egg-webpack'
};

exports.webpackvue = {
  enable: true,
  package: 'egg-webpack-vue'
};