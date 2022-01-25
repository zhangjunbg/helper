'use strict';
const fs = require('fs');
const egg = require('egg');
const { mkdirsSync } = require('fs-extra');
const gm = require('gm');
const miniList = require('../data/png_dora');
const cropData = require('../data/convert/cropData');
const cropDataKeys = Object.keys(cropData);
const oldPath = '/Volumes/Lily/resource/On_Our_Way_to_English/png';
const newPath = '/Volumes/Lily/resource/On_Our_Way_to_English/jpgCon1';
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
      // .resize(2475, 1750)
      // width: 1836, height: 1547
      .crop(1836 + 106, 1547, 192, 0)
      .write(newPath + newFilePath, (err) => {
        console.log(err);
        this.allPng2jpg(++index);
      });
  }
  cropImg(ctx) {
    this.allCropImg(0);
    ctx.body = {};
  }
  allCropImg(index) {
    let singleData = cropData[cropDataKeys[index]];
    let { width, height, x, orient } = singleData;
    let filePath = singleData.path;
    let oldFolder = oldPath + filePath;
    let newFolder = newPath + filePath;
    let w = 0,
      h = 0,
      xx = 0,
      yy = 0;

    if (width > height) {
      w = 490;
      if (orient == 'left') {
        w = w - 2 * x;
        xx = x;
      } else if (orient == 'top') {
        h = -2 * x;
        yy = x;
      } else if (orient == 'bottom') {
        h = -x;
        // yy = x;
      }
    } else {
      h = 490;
      if (orient == 'left') {
        w = -2 * x;
        xx = x;
      } else if (orient == 'top') {
        h = h - 2 * x;
        yy = x;
      }
    }

    let opt = { width: width + w, height: height + h, x: xx, y: yy, oWidth: width, oHeight: height };
    mkdirsSync(newFolder);
    // 获取文件夹下文件
    let files = fs.readdirSync(oldFolder);
    console.log(opt);
    let temp;
    for (let i = 0; i < files.length; i++) {
      temp = files[i].replace('.png', '.jpg');
      if (files[i].endsWith('.png')) {
        this.cropImg2(oldFolder + '/' + files[i], newFolder + '/' + temp, opt);
      }
    }
    setTimeout(() => {
      this.allCropImg(++index);
    }, 300 * files.length);
  }
  cropImg2(oldFile, newFile, opt = {}) {
    let { width, height, x, y, oWidth, oHeight } = opt;
    gm(oldFile)
      .crop(width, height, x, y)
      .resize(oWidth, oHeight, '!')
      .write(newFile, (err) => {
        console.log(err);
      });
  }
};
