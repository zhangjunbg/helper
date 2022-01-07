'use strict';
const egg = require('egg');
const path = require('path');
const commPath = path.resolve(__dirname, '../../../static');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const miniList = require('../data/jiqimao');
module.exports = class MiniController extends egg.Controller {
  // pdf 转图片
  minPng(ctx) {
    let result = this.handleMiniPng();
    ctx.body = {
      code: '00',
      data: result,
      msg: null,
    };
  }
  handleMiniPng() {}
  minSinglePng(index) {
    imagemin(png, {
      destination: newpng,
      plugins: [
        imageminPngquant({
          quality: [0.6, 0.7], //压缩质量（0,1）
        }),
      ],
    })
      .then(() => {
        console.log('压缩成功');
      })
      .catch((err) => {
        console.log('压缩失败：' + err);
      });
  }
};
