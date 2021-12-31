'use strict';
const egg = require('egg');
const path = require('path');
const fs = require('fs');
const { constants } = require('fs');
const { rename } = require('fs').promises;
const commPath = path.resolve(__dirname, '../../../static');
const oldPath = commPath + '/old';
const newPath = commPath + '/new';
const oldFiles = require('../data/oldFiles');
const newFiles = require('../data/newFiles');

module.exports = class CommController extends egg.Controller {
  // 递归重命名
  async setAllFileNames(ctx) {
    let startTime = Date.now();
    await this.setFileNames(oldFiles, newFiles);
    let during = Date.now() - startTime;
    ctx.body = {
      code: '00',
      data: {
        during,
      },
      msg: '重命名成功',
    };
  }
  async setFileNames(oldChildren, newChildren) {
    let allPath = {};
    let tempArr, newParPath;
    // let filePath,children;
    for (let index = 0; index < oldChildren.length; index++) {
      let filePath = oldChildren[index];
      let newFilePath = newChildren[index];
      tempArr = newFilePath.split('/');
      tempArr.pop();
      newParPath = newPath + tempArr.join('/');
      if (!allPath[newParPath]) {
        fs.mkdirSync(newParPath, { recursive: true });
        allPath[newParPath] = true;
      }
      fs.access(oldPath + filePath, constants.F_OK, (err) => {
        if (!err) rename(oldPath + filePath, newPath + newFilePath);
      });
    }
  }
  // 递归获取文件夹下内容
  async getAllFiles(ctx) {
    // let oldPath = commPath + '/old';
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
        result.push(...children);
      } else {
        tempFile = {
          isDirectory: false,
          filePath: tempPath,
          size: (stats.size / 1024 / 1024).toFixed(2) + 'M',
        };
        if (file != '.DS_Store') result.push(tempFile);
      }
    }
    return result;
  }
};
