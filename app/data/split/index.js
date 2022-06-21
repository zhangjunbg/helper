const config = require('./config');
const split = require('./split');
const originImgList = require('./imgList');
module.exports = {
  ...config,
  split,
  originImgList,
};
