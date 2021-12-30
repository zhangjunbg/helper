'use strict';
const path = require('path');
module.exports = (app) => {
  const exports = {};
  exports.keys = 'my-cookie-secret-key';
  return exports;
};
