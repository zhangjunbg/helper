'use strict';
const fs = require('fs');
const { constants } = require('fs');
const { rename } = require('fs').promises;
const { bigFirst } = require('../utils/index');
const egg = require('egg');
const path = require('path');
const commPath = path.resolve(__dirname, '../../../static');
// const oldPath = commPath + '/old/红火箭分级读物';
const oldPath = '/Volumes/Lily/resource/On_Our_Way_to_English/pdf';
const newPath = commPath + '/new';
const oldFiles = require('../data/oldFiles');
const newFiles = require('../data/newFiles');

module.exports = class CommController extends egg.Controller {
  // 递归重命名
  async setAllFileNames(ctx) {
    let startTime = Date.now();
    await this.setFileNames(oldFiles, newFiles);
    // await this.setFileNames(newFiles, oldFiles);
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
      console.log('newFilePath: ', newFilePath);
      tempArr = newFilePath.split('/');
      tempArr.pop();
      // newParPath = newPath + tempArr.join('/');
      newParPath = tempArr.join('/');
      if (!allPath[newParPath]) {
        fs.mkdirSync(newParPath, { recursive: true });
        allPath[newParPath] = true;
      }
      fs.access(filePath, constants.F_OK, (err) => {
        if (!err) rename(filePath, newFilePath);
      });
    }
  }
  // 文件名首字母大写
  async upperAllNames(ctx) {
    oldFiles.forEach((item) => {
      this.upperNames(item);
    });
    ctx.body = {
      code: '00',
      data: {},
      msg: '重命名成功',
    };
  }
  async upperNames(filePath) {
    let tempArr = filePath.split('.');
    let subfix = tempArr.pop(); // 文件后缀
    let tempArr2 = tempArr.join('.').split('/');
    let fileName = bigFirst(tempArr2.pop());
    let newFileName = tempArr2.join('/') + '/' + fileName + '.' + subfix;
    console.log(filePath, newFileName);
    fs.access(oldPath + filePath, constants.F_OK, (err) => {
      if (!err) rename(oldPath + filePath, oldPath + newFileName);
    });
  }
  // 递归获取文件夹下内容
  async getAllFiles(ctx) {
    // let oldPath = commPath;
    let { isFolder } = ctx.request.query;
    console.log('isFolder: ', isFolder);
    let allFiles = await this.getFiles(oldPath, isFolder);
    ctx.body = allFiles;
  }
  // 获取文件夹下的文件夹及文件
  async getFiles(folderPath, isFolder) {
    if (!folderPath) return [];
    let files = fs.readdirSync(folderPath);
    let result = [];

    let stats, tempPath, file;
    for (let i = 0; i < files.length; i++) {
      file = files[i];
      tempPath = folderPath + '/' + file;
      stats = fs.statSync(tempPath);
      // 判断是否为文件夹
      if (stats.isDirectory()) {
        let children = await this.getFiles(tempPath, isFolder);
        result.push(...children);
        if (isFolder) result.push(tempPath);
      } else if (!isFolder) {
        if (file != '.DS_Store') result.push(tempPath);
      }
    }
    return result;
  }
  // 递归获取文件夹下总文件数
  async getAllFolderPageNum(ctx) {
    let allFiles = await this.getFileNums(oldPath);
    ctx.body = allFiles;
  }
  // 获取文件夹下的文件夹及文件
  async getFileNums(folderPath) {
    if (!folderPath) return [];
    let files = fs.readdirSync(folderPath);
    let result = [];
    let result2 = {};
    let stats, tempPath, file;
    for (let i = 0; i < files.length; i++) {
      file = files[i];
      tempPath = folderPath + '/' + file;
      stats = fs.statSync(tempPath);
      // 判断是否为文件夹
      if (stats.isDirectory()) {
        let children = await this.getFileNums(tempPath);
        console.log('children: ', children);
        result2 = { ...result2, ...children };
      } else {
        if (file != '.DS_Store') {
          result.push(tempPath);
        }
      }
    }
    result2 = { ...result2, [folderPath]: result.length };
    return result2;
  }
};
