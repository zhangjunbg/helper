"use strict";
const egg = require("egg");
const path = require("path");
var http = require('https');
const fs = require("fs");
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://yangyang:yangyang123@47.110.80.94:27017/yangyang')

const picPath = path.join(__dirname, '../../static/vimages/');
// const picPath = path.join(__dirname, '../../../../yyang/vimages');
// const picPath = path.join(__dirname, '../../../../yyang/vimages/');

const orignPicPath = 'https://www.youdict.com/images/words/';
const imgSuffix = ".jpg";

module.exports = class CommController extends egg.Controller {
  // 保存一张图片
  test(ctx) {
    this.beginSaveImages(ctx);
    ctx.body = {};

  }
  /**
   * key : 单词
   * startNo: 序号
   * orignPath: 源路径
   * savePath: 保存路径
   * suffix: 文件后缀名
   */
  async saveOneImage({
    startNo = 1,
    key = 'test',
    orignPath = orignPicPath,
    savePath = picPath,
    suffix = imgSuffix
  } = {}) {
    if (startNo > 10) return;

    var path = orignPath + key + startNo + suffix;
    var savePath = savePath + key + startNo + suffix;
    fs.exists(savePath, exists => {
      if (!exists) {
        http.get(path, (req, res) => { //path为网络图片地址
          var imgData = '';
          req.setEncoding('binary');
          req.on('data', function (chunk) {
            imgData += chunk
          })
          req.on('end', function () {
            fs.writeFile(savePath, imgData, 'binary', err => { //path为本地路径例如public/logo.png
              if (err) {
                console.log('保存出错！')
              }
            })
          })
        })
      }
    });


    // ctx.body = {};
  }
  // 获取每个key的所有图片
  async saveOneKeyImages({
    key = 'test'
  } = {}) {
    var startNo = 1;
    var totalNum = 10;
    // 设置定时器
    var timerepeat = () => {
      if (startNo > totalNum) clearInterval(interval);
      this.saveOneImage({
        key: key,
        startNo: startNo
      });
      startNo++;
    }
    var interval = setInterval(timerepeat, 60)
  }
  // 获取多个key的所有图片
  async saveKeysImages(ctx, {
    curPage = 0,
    pageSize = 10
  } = {}) {
    // 获取所有单词
    var allWord = await ctx.model.Vocabulary.find().sort({
      key: 1
    }).select('key -_id').skip(curPage * pageSize).limit(pageSize);
    var startNo = 0;
    // 设置定时器
    var timerepeat = () => {
      if (!allWord[startNo]) {
        clearInterval(interval);
        return
      }
      this.saveOneKeyImages({
        key: allWord[startNo].key,
      });
      startNo++;
    }
    var interval = setInterval(timerepeat, 60 * pageSize)
    return true;
  }

  async beginSaveImages(ctx) {
    var params = ctx.request.body;
    for (var j = parseInt(params.curPage); j < parseInt(params.curPage) + parseInt(params.pages); j++) {
      (() => {
        ctx.logger.info("((((((((((((((((((((params.curPage:", j, " ==== pageSize: ", params.pageSize);
        this.saveKeysImages(ctx, {
          curPage: parseInt(j),
          pageSize: parseInt(params.pageSize)
        });
      })()
    }
    ctx.body = {
      retCode: "success",
      data: {},
      message: "success"
    };
  }
};