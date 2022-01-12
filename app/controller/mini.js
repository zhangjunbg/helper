'use strict';
const fs = require('fs');
const egg = require('egg');
const path = require('path');
const { mkdirsSync } = require('fs-extra');
const gm = require('gm');
const miniList = require('../data/png_dora');
const oldPath = '/Volumes/Lily/绘本/洪恩识字卡彩色';
const newPath = '/Volumes/Lily/绘本/洪恩识字卡彩色/jpg';
module.exports = class MiniController extends egg.Controller {
  png2jpg(ctx) {
    this.allPng2jpg(0);
    ctx.body = {};
  }
  allPng2jpg(index) {
    let filePath = miniList[index];
    let reg = /(\d)\/(\d{2})\.png/;
    let [a, level, pageIndex] = reg.exec(filePath);

    let newFilePath = `/${level}/${pageIndex}.jpg`;
    mkdirsSync(`${newPath}/${level}`);

    gm(oldPath + filePath)
      .resize(841, 595)
      .write(newPath + newFilePath, (err) => {
        console.log(err);
        this.allPng2jpg(++index);
      });
  }
};
