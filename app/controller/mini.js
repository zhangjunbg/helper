'use strict';
const egg = require('egg');
const { mkdirsSync } = require('fs-extra');
const gm = require('gm');
const miniList = require('../data/png_dora');
const oldPath = '/Volumes/Lily/resource/flash';
const newPath = '/Volumes/Lily/resource/flash/chinese';
module.exports = class MiniController extends egg.Controller {
  png2jpg(ctx) {
    this.allPng2jpg(0);
    ctx.body = {};
  }
  allPng2jpg(index) {
    let filePath = miniList[index];
    let reg = /(\/.*)\/(.*?)\.png/;
    let [a, otherFolder, pageIndex] = reg.exec(filePath);

    let newFilePath = `/${otherFolder}/${pageIndex}.jpg`;
    mkdirsSync(`${newPath}/${otherFolder}`);
    // 1275 × 1755
    // width: 1035,
    // height: 1455,
    // 1450, 1877
    // 2550 / 2, 3300 / 2
    // 2475 × 1750
    gm(oldPath + filePath)
      .resize(2475, 1750)
      .write(newPath + newFilePath, (err) => {
        console.log(err);
        this.allPng2jpg(++index);
      });
  }
};
