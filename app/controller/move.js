'use strict';
const fs = require('fs');
const egg = require('egg');
const { constants } = require('fs');
const { mkdirsSync } = require('fs-extra');
const { rename } = require('fs').promises;
const { oldPath, newPath, oldFiles, newFiles } = require('../data/move');

module.exports = class CommController extends egg.Controller {
  // 批量文件转移
  async moveFiles(ctx) {
    let startTime = Date.now();
    mkdirsSync(`${newPath}`);
    await this.doMoveFiles(oldFiles, newFiles);
    let during = Date.now() - startTime;
    ctx.body = {
      code: '00',
      data: {
        during,
      },
      msg: '移动成功',
    };
  }

  async doMoveFiles(oldChildren, newChildren) {
    for (let index = 0; index < oldChildren.length; index++) {
      fs.access(oldPath + oldChildren[index], constants.F_OK, (err) => {
        if (!err) rename(oldPath + oldChildren[index], newPath + newChildren[index]);
      });
    }
  }
};
