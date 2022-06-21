'use strict';
const fs = require('fs');
const egg = require('egg');
const { mkdirsSync } = require('fs-extra');
const gm = require('gm');

const { top, left2,top2, left, width, height, oldPath, newPath, originImgList, split } = require('../data/split/index');

module.exports = class MiniController extends egg.Controller {
  // 去除白边
  removeImgsMargin(ctx) {
    this.doRemove(0);
    ctx.body = {};
  }
  doRemove(index) {
    let filePath = originImgList[index];
    mkdirsSync(`${newPath}`);
    gm(oldPath + filePath)
      .crop(width - 2 * left, height - 2 * top, left2, top2)
      .write(newPath + filePath, (err) => {
        console.log(err);
        if (index + 1 < originImgList.length) this.doRemove(++index);
      });
  }
  // 分割图片
  splitImgs(ctx) {
    // 按几行几列裁剪
    const { row, col } = split;
    // 裁剪后小图的宽
    let smallImgW = Math.floor((width - 2 * left) / col);
    // 裁剪后小图的高
    let smallImgH = Math.floor((height - 2 * top) / row);
    mkdirsSync(`${newPath}`);
    this.splitImg(0, smallImgW, smallImgH, row, col);
    ctx.body = {};
  }
  // 按规则分割一张图片
  splitImg(index, w, h, row, col) {
    let filePath = originImgList[index];
    let reg = /\/(.*?)\.jpg/;
    let [a, pageIndex] = reg.exec(filePath);

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        this.doSplit(oldPath + filePath, `${newPath}/${pageIndex}_${i}_${j}.jpg`, w, h, w * j, h * i);
      }
    }
    if (index + 1 < originImgList.length) {
      setTimeout(() => {
        this.splitImg(index + 1, w, h, row, col);
      }, 8000);
    }
  }
  doSplit(oldFilePath, newFilePath, w, h, l, t) {
    // console.log(oldFilePath, newFilePath, w, h, l, t);
    gm(oldFilePath)
      .crop(w, h, l, t)
      .write(newFilePath, (err) => {
        if (err) console.log(err);
      });
  }
};
