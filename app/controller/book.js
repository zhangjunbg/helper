'use strict';
const { fromPath } = require('pdf2pic');
const { mkdirsSync } = require('fs-extra');
const rimraf = require('rimraf');
const egg = require('egg');
const path = require('path');
const commPath = path.resolve(__dirname, '../../../static');
// const oldPath = commPath + '/old';
// const newPath = commPath + '/new';
const oldPath = '/Volumes/Lily/绘本/牛津树1-9级/pdf';
const newPath = '/Volumes/Lily/绘本/牛津树1-9级/img';
const hong = require('../data/1_9');
module.exports = class CommController extends egg.Controller {
  // pdf 转图片
  pdf2pic2(ctx) {
    let result = this.pdf2pic(0);
    ctx.body = {
      code: '00',
      data: result,
      msg: null,
    };
  }

  pdf2pic(index) {
    if (hong[index]) {
      let filePath = hong[index];
      let fileName = filePath.replace('.pdf', '');
      // 删除当前文件夹
      rimraf.sync(newPath + fileName);
      // 创建文件
      mkdirsSync(newPath + fileName);
      fromPath(oldPath + filePath, {
        width: 2550,
        height: 3300,
        // width: 3364,
        // height: 2380,
        saveFilename: 'test',
        density: 330,
        savePath: newPath + fileName,
      })
        .bulk(-1)
        .then((data) => {
          console.log(newPath + fileName, ':完成');
          setTimeout(() => {
            this.pdf2pic(++index);
          }, 1000);
        });
    } else {
      return null;
    }
  }
};
