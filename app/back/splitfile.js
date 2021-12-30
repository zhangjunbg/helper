"use strict";
const egg = require("egg");
const path = require("path");
const fs = require("fs");
const bookPath = path.join(__dirname, '../../static/books/');

const bookSuffix = ".html";
const egg = require("egg");
const path = require("path");
const fs = require("fs");
const bookPath = path.join(__dirname, '../../static/book/');
const bookPath2 = path.join(__dirname, '../../static/book2/');
const wordPath = path.join(__dirname, '../../static/word/');
var sha256 = require('js-sha256');
const uuidv1 = require('uuid/v1');
Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
module.exports = class SplitfileController extends egg.Controller {
  async getAllFiles(ctx) {
    var allFilenames = [];
    var files = fs.readdirSync(bookPath);
    for (var i = 0; i < files.length; i++) {
      if (files[i].endsWith('txt')) {
        console.log(files[i]);
        allFilenames.push(files[i].split(".txt")[0].replace(/_/g, ' '));

      }
    }
    ctx.body = {
      retCode: 'success',
      retObj: {
        fileArr: allFilenames
      }
    };
  }
  async saveWords(ctx) {
    let today = new Date().Format("yyyy-MM-dd");
    let word = ctx.request.body.word;
    var queryParam = ctx.request.body;
    var filename = queryParam.bookName;
    console.log("word", word);
    if (word) {
      // 总文档
      fs.appendFile(wordPath + "1.txt", word + '\r', (error) => {
        if (error) return console.log("追加文件失败" + error.message);
      });
      // 按书分类
      fs.appendFile(wordPath + 'book/' + filename + ".txt", word + '\r', (error) => {
        if (error) return console.log("追加文件失败" + error.message);
      });
      // 按日期存档
      fs.appendFile(wordPath + 'date/' + today + ".txt", word + '\r', (error) => {
        if (error) return console.log("追加文件失败" + error.message);
      });
    }
    ctx.body = {
      retCode: 'success',
      retObj: {}
    };
  }
  async findWord(ctx) {
    let ww = ctx.request.body.word;
    let salt = uuidv1();
    let appKey = "00706c8e001d0c7f";
    let curtime = Math.round(new Date().getTime()/1000);
    let appSecret = "dJK1MVRZTGQaeVcdzQDDMFyKOjkMjLTD";
    let sign = sha256(appKey + ww + salt + curtime + appSecret);
    let params = {
      q: ww,
      from: 'en',
      to: 'zh-CHS',
      appKey: appKey,
      salt: salt,
      sign: sign,
      signType: "v3",
      curtime: curtime
    }
    let url = 'https://openapi.youdao.com/api';
    const getResult = await ctx.curl(url,{
      method:'post',
      dataType: 'jsonp',
      data:params
    } );
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    let buf = Buffer.from(getResult.data).toString();
    console.log(buf);

    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    ctx.body = {
      retCode: 'success',
      retObj: JSON.parse(buf) 
    };
  }
  async getWords(ctx) {
    var queryParam = ctx.request.body;
    var date;
    var filename = '1';
    // 日期
    if (queryParam.type == 3) {
      filename = 'date/' + queryParam.name;
    } else if (queryParam.type == 2) {
      filename = 'book/' + queryParam.name;
    }
    date = fs.readFileSync(wordPath + filename + '.txt', 'utf-8');
    let shotData = date.split('\r');
    ctx.body = {
      retCode: "success",
      retObj: {
        words: shotData
      }
    };
  }
  // 获取词汇文件目录
  async getWordCatalog(ctx) {
    var allFilenames = [];
    var allFilenames2 = [];
    var files = fs.readdirSync(wordPath + 'book');
    var files2 = fs.readdirSync(wordPath + 'date');
    for (var i = 0; i < files.length; i++) {
      if (files[i].endsWith('txt')) {
        allFilenames.push(files[i].split(".txt")[0].replace(/_/g, ' '));
      }
    }
    for (var i = 0; i < files2.length; i++) {
      if (files2[i].endsWith('txt')) {
        allFilenames2.push(files2[i].split(".txt")[0].replace(/_/g, ' '));
      }
    }
    ctx.body = {
      retCode: "success",
      retObj: {
        book: allFilenames,
        date: allFilenames2
      }
    };
  }
  async getFileCatalog(ctx) {
    var queryParam = ctx.request.body;
    var filename = queryParam.bookName;
    var allFilenames = [];
    var files = fs.readdirSync(bookPath2 + filename);
    for (var i = 0; i < files.length; i++) {
      if (files[i].endsWith('txt')) {
        console.log(files[i]);
        allFilenames.push(files[i].split(".txt")[0].replace(/_/g, ' '));
      }
    }
    ctx.body = {
      retCode: "success",
      retObj: {
        files: allFilenames
      }
    };
  }
  async getFileDetail(ctx) {
    const returnFlag = '\r\n\r\n';
    var queryParam = ctx.request.body;
    var filename = queryParam.bookName;
    var curChapter = queryParam.curChapter;
    var date = fs.readFileSync(bookPath2 + filename + '/' + curChapter + '.txt', 'utf-8');

    date = date.replace(/(\b\w+\b)/g, "<span onclick='test(this)'>$1</span>")
    date = date.replace(/\r\n\r\n/g, '</p><p>')
    date = date.replace(/\r\n /g, '</p><p>')

    date = '<p>' + date + '</p>'
    date = date.replace(/\<p\>\<\/p\>/g, '');



    ctx.body = {
      retCode: "success",
      retObj: {
        contentArr: date,
      }
    };
  }
  // async getFileDetail(ctx) {
  //   const returnFlag = '\r\n\r\n';
  //   var queryParam = ctx.request.body;
  //   var filename = queryParam.bookName || 'The_Hound_of_the_Baskervilles';
  //   let lastIndex = queryParam.lastIndex || 0
  //   let pageSize = queryParam.pageSize || 0;
  //   let contentArr = [];
  //   let wordsNum = 5000;
  //   let lastLength;
  //   let allFlag = false;
  //   let shotData;
  //   let leftWords = "";
  //   let allLastIndex;
  //   var date = fs.readFileSync(bookPath + filename + '.txt', 'utf-8');
  //   date = date.substring(lastIndex, lastIndex + wordsNum * pageSize);
  //   let ll = date.lastIndexOf(returnFlag);
  //   date = date.substring(0, ll);
  //   allLastIndex = ll + lastIndex;
  //   wordsNum = parseInt(date.length/10);

  //   for (let i = 0; i < pageSize; i++) {
  //     if (date.length < (i + 1) * wordsNum) {
  //       lastLength = date.length;
  //       allFlag = true
  //     } else {
  //       lastLength = (i + 1) * wordsNum;
  //     }
  //     console.log("*****************************");
  //     console.log(lastLength);
  //     shotData = date.substring(i * wordsNum, lastLength);
  //     shotData = leftWords + shotData;
  //     leftWords = shotData.substring(shotData.lastIndexOf(returnFlag), shotData.length);
  //     shotData = shotData.substring(0, shotData.length - leftWords.length)
  //     shotData = shotData.replace(/(\b\w+\b)/g, "<span onclick='test(this)'>$1</span>")
  //     shotData = shotData.replace(/\r\n\r\n/g, '</p><p>')
  //     shotData = shotData.replace(/\r\n /g, '</p><p>')

  //     shotData = '<p>' + shotData + '</p>'
  //     shotData = shotData.replace(/\<p\>\<\/p\>/g,'');
  //     contentArr.push(shotData);
  //   }
  //   ctx.body = {
  //     retCode: "success",
  //     retObj: {
  //       allFlag: allFlag,
  //       contentArr: contentArr,
  //       allLastIndex: allLastIndex
  //     }
  //   };
  // }
  // 文章分段
  // async getFileDetail(ctx) {
  //   const returnFlag = `\r\n`;
  //   var queryParam = ctx.request.body;
  //   var filename = queryParam.bookName || 'The_Hound_of_the_Baskervilles';
  //   var CHAPTERNum,data;
  //   var date = fs.readFileSync(bookPath + filename + '.txt', 'utf-8');
  //   date = date.replace(/(Unit\d+)/g,'XXXXXXXXXXXXXXXXXXX$1')
  //   var charpterArr = date.split('XXXXXXXXXXXXXXXXXXX');
  //   console.log("charpterArr:",charpterArr.length);
  //   fs.mkdirSync(bookPath2 + filename , { recursive: true });
  //   for(let m = 0 ; m < charpterArr.length; m++){
  //     CHAPTERNum = charpterArr[m].substring(0,5);
  //     data = charpterArr[m].substring(5,charpterArr[m].length);
  //     console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&:",CHAPTERNum);
  //     fs.writeFileSync(bookPath2 + filename + '/' + CHAPTERNum+ '.txt', data);
  //   }
  //   ctx.body = {
  //     retCode: "success",
  //     retObj: {
  //     }
  //   };
  // }
  async getCatalog(ctx) {
    const returnFlag = '\r\n\r\n';
    var queryParam = ctx.request.body;
    var filename = queryParam.bookName || 'The_Hound_of_the_Baskervilles';
    let lastIndex = queryParam.lastIndex || 0
    let pageSize = queryParam.pageSize || 0;
    let contentArr = [];
    let wordsNum = 5000;
    let lastLength;
    let allFlag = false;
    let shotData;
    let leftWords = "";
    let allLastIndex;
    var date = fs.readFileSync(bookPath + filename + '.txt', 'utf-8');
    date = date.substring(lastIndex, lastIndex + wordsNum * pageSize);
    let ll = date.lastIndexOf(returnFlag);
    date = date.substring(0, ll);
    allLastIndex = ll + lastIndex;
    wordsNum = parseInt(date.length / 10);
    for (let i = 0; i < pageSize; i++) {
      if (date.length < (i + 1) * wordsNum) {
        lastLength = date.length;
        allFlag = true
      } else {
        lastLength = (i + 1) * wordsNum;
      }
      console.log("*****************************");
      console.log(lastLength);
      shotData = date.substring(i * wordsNum, lastLength);
      shotData = leftWords + shotData;
      leftWords = shotData.substring(shotData.lastIndexOf(returnFlag), shotData.length);
      shotData = shotData.substring(0, shotData.length - leftWords.length)
      shotData = shotData.replace(/(\b\w+\b)/g, "<span onclick='test(this)'>$1</span>")
      shotData = shotData.replace(/\r\n\r\n/g, '</p><p>')
      shotData = shotData.replace(/\r\n /g, '</p><p>')

      shotData = '<p>' + shotData + '</p>'
      shotData = shotData.replace(/\<p\>\<\/p\>/g, '');
      contentArr.push(shotData);
    }
    ctx.body = {
      retCode: "success",
      retObj: {
        allFlag: allFlag,
        contentArr: contentArr,
        allLastIndex: allLastIndex
      }
    };
  }
};