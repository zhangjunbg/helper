'use strict';
const fs = require('fs');
const { constants } = require('fs');
const { rename } = require('fs').promises;
const { bigFirst } = require('../utils/index');
const egg = require('egg');
// const newPath = commPath + '/new';
const titles = require('../data/sentence/titles');
const chinese = require('../data/sentence/chinese');
const english = require('../data/sentence/english');

module.exports = class CommController extends egg.Controller {
  // 递归重命名
  async makeSql(ctx) {
    let results = [];
    let temp;
    english.forEach((item, index) => {
      temp = [];
      item.forEach((it, ii) => {
        // (pId,id,content,descr)
        temp.push([...titles[index], it, chinese[index][ii]]);
      });
      results.push(...temp);
    });
    ctx.body = results;
  }
};
