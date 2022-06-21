const config = require('./config');
const oldFiles = require('./oldFiles');
const newFiles = require('./newFiles');
module.exports = {
  ...config,
  oldFiles,
  newFiles,
};
