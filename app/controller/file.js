'use strict';
const egg = require('egg');
const path = require('path');
const fs = require('fs');
const commPath = path.resolve(__dirname, '../../../files');
const oldFolder = require('../data/oldFolder');
const newFolder = require('../data/newFolder');

module.exports = class CommController extends egg.Controller {
  // 递归重命名
  async setAllFileNames(ctx) {}
  async setFileNames(oldPPath, oldChildren, newPPath, newChildren) {
    oldChildren.foeEach(({ filePath, children }, index) => {});
  }
  // 递归获取文件夹下内容
  async getAllFiles(ctx) {
    let oldPath = commPath + '/old';
    let allFiles = await this.getFiles(oldPath);
    ctx.body = {
      code: '00',
      data: allFiles,
      msg: null,
    };
  }
  // 获取文件夹下的文件夹及文件
  async getFiles(folderPatch) {
    if (!folderPatch) return [];
    console.log('folderPatch', folderPatch);
    let files = fs.readdirSync(folderPatch);
    let result = [];

    let stats, tempFile, tempPath, file;
    for (let i = 0; i < files.length; i++) {
      file = files[i];
      tempPath = folderPatch + '/' + file;
      tempFile = {};
      stats = fs.statSync(tempPath);
      // 判断是否为文件夹
      if (stats.isDirectory()) {
        let children = await this.getFiles(tempPath);

        tempFile = {
          isDirectory: true,
          filePath: tempPath,
          children: children,
        };
        result.push(tempFile);
      } else {
        tempFile = {
          isDirectory: false,
          filePath: tempPath,
        };
      }
      // if (file != '.DS_Store') result.push(tempFile);
    }
    return result;
  }
};
