'use strict';
//
const fs = require('fs');
const { mkdirsSync } = require('fs-extra');
const egg = require('egg');
const commPath = '/Volumes/Lily/resource/huiben/机器猫/6/other/';
const folders = require('../data/folders');

module.exports = class CommController extends egg.Controller {
  // 文件名首字母大写
  async createFolders(ctx) {
    folders.forEach((item, index) => {
      let t = item.split('/');
      mkdirsSync(commPath + t[0] + '/' + index + '__' + t[1]);
    });
    ctx.body = {
      code: '00',
      data: {},
      msg: '重命名成功',
    };
  }
};