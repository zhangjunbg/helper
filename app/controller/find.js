"use strict";
const egg = require("egg");
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://yangyang:yangyang123@47.110.80.94:27017/yangyang')
var envNumObj = {};
// mongoose.set('debug', true)
module.exports = class CommController extends egg.Controller {

  // 模糊查询
  async like(ctx) {
    console.log("========== like ============", ctx.request.body);
    let res = await ctx.model.Vocabulary.find({
      key: new RegExp('.*' + ctx.request.body.key + '.*')
    });
    ctx.body = {
      retCode: 'success',
      data: res,
      message: ""
    }
  }

  // 最多返回100条 limit(20)
  // 模糊查询
  async likelimit(ctx) {
    console.log("========== like ============", ctx.request.body);
    let res = await ctx.model.Vocabulary.find({
      key: new RegExp('.*' + ctx.request.body.key + '.*')
    }).limit(100);
    ctx.body = {
      retCode: 'success',
      data: res,
      message: ""
    }
  }

  // 正则查询
  async regular(ctx) {
    let query = ctx.request.body;
    let keyword = query.keyword;
    let regl = null;
    //'正则'
    if (query.type == '1') {
      regl = {
        key: new RegExp(keyword)
      }
      // '前缀'
    } else if (query.type == '2') {
      regl = {
        key: new RegExp(keyword + '.*')
      }
      //'后缀'
    } else if (query.type == '3') {
      regl = {
        key: new RegExp('.*' + keyword)
      }
      // '长度'
    } else if (query.type == '4') {
      regl = {
        key: {
          $exists: true
        },
        $where: "(this.key.length > " + keyword + ")"
      };
      // 模糊
    } else if (query.type == '5') {
      regl = {
        key: new RegExp('.*' + keyword + '.*')
      }
      // '长度'
    }

    console.log("========== like ============", regl);
    let res = await ctx.model.Vocabulary.find(regl);
    ctx.body = {
      retCode: 'success',
      data: res,
      message: ""
    }
  }


  // 精确查询
  async keyword(ctx) {
    let res = await ctx.model.Vocabulary.find({
      key: ctx.request.body.key
    });
    ctx.body = {
      retCode: 'success',
      data: res,
      message: ""
    }
  }


  async findeee(ctx) {

    let a = await ctx.service.user.findeee({});
    console.log("------------3-------------------");
    console.log(a);
    ctx.body = a;
  }

  async finde2(ctx) {
    let a = await ctx.model.Article.find();
    console.log("000000000000000000000000000000000000000000000000000000000000000");
    // console.log(a);
    ctx.body = a;
  }

  async test(ctx) {
    let url = 'http://www.youdict.com/ciku/id_0_0_0_0_';
    let totalNum = 2238;
    // let totalNum = 2237;
    // let period = 100;
    // let startNum = parseInt(queryParam.page) * period;
    let startNum = 0;
    var timerepeat = () => {
      if (startNum > totalNum) clearInterval(interval);
      ctx.curl(url + startNum + '.html', {
        dataType: 'text',
        timeout: 1000 * 60 * 60
      }).then(res => {
        var reg = /<h3 style=\"margin-top: 10px;\"><a style=\"color:#333;\" target=\"_blank\" href=\".*\">(.*?)<\/a>[.\s\S]*?<\/h3>[\s]*?<p>([\s\S]*?)<\/p>/gi;
        // 获取页面数据
        let content = res.data
        let wordArr = [];
        // 匹配内容
        while (reg.exec(content) != null) {
          wordArr.push({
            key: RegExp.$1,
            detail: RegExp.$2
          });
        }
        ctx.model.Vocabulary.insertMany(wordArr, (err, data) => {
          // ctx.model.Word.insertMany(wordArr, (err, data) => {
          if (!data.length) {
            envNumObj[startNum] = true;
            console.log("================ ", startNum, "  ==================");
          }
        })
      });
      startNum++;
    }
    var interval = setInterval(timerepeat, 600)
    // for (let i = startNum; i < totalNum; i++) {
    //   setTimeout(() => {
    //     timerepeat
    //   }, 1000);
    // }
    ctx.body = {};

  }
  // 查询页数
  async getPages(ctx) {
    let a = await ctx.model.Catalog.find({}).sort({
      'bigV': 1
    });
    ctx.body = a;
  }
  //  // 词汇添加标签
  //  async putTags(ctx) {
  //   // var vocabularyProperty = [{
  //   //   "_id": "5d80969980f64178d54832e0",
  //   //   "key": "4",
  //   //   "name": "哺乳动物",
  //   //   "pages": "3",
  //   //   "bigV": "3",
  //   //   "__v": 0
  //   // }, {
  //   //   "_id": "5d80969a80f64178d54832e3",
  //   //   "key": "10",
  //   //   "name": "昆虫",
  //   //   "pages": "1",
  //   //   "bigV": "3",
  //   //   "__v": 0
  //   // }]
  //   var vocabularyProperty = [{
  //     "_id": "5d80969480f64178d54832c7",
  //     "key": "5",
  //     "name": "考研词汇",
  //     "pages": "273",
  //     "bigV": "0",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969480f64178d54832c9",
  //     "key": "7",
  //     "name": "雅思词汇",
  //     "pages": "226",
  //     "bigV": "0",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969480f64178d54832c8",
  //     "key": "1",
  //     "name": "英语四级词汇",
  //     "pages": "291",
  //     "bigV": "0",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969480f64178d54832ca",
  //     "key": "4",
  //     "name": "英专八级词汇",
  //     "pages": "198",
  //     "bigV": "0",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969480f64178d54832cb",
  //     "key": "2",
  //     "name": "英语六级词汇",
  //     "pages": "401",
  //     "bigV": "0",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969580f64178d54832cc",
  //     "key": "8",
  //     "name": "GRE词汇",
  //     "pages": "374",
  //     "bigV": "0",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969580f64178d54832cd",
  //     "key": "3",
  //     "name": "英专四级词汇",
  //     "pages": "442",
  //     "bigV": "0",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969980f64178d54832e1",
  //     "key": "6",
  //     "name": "托福词汇",
  //     "pages": "243",
  //     "bigV": "0",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969680f64178d54832cf",
  //     "key": "4",
  //     "name": "中低频词",
  //     "pages": "182",
  //     "bigV": "1",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969680f64178d54832d0",
  //     "key": "3",
  //     "name": "中频词",
  //     "pages": "93",
  //     "bigV": "1",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969680f64178d54832d2",
  //     "key": "5",
  //     "name": "低频词",
  //     "pages": "395",
  //     "bigV": "1",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969780f64178d54832d9",
  //     "key": "1",
  //     "name": "高频词",
  //     "pages": "39",
  //     "bigV": "1",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969880f64178d54832df",
  //     "key": "2",
  //     "name": "中高频词",
  //     "pages": "63",
  //     "bigV": "1",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969580f64178d54832ce",
  //     "key": "5",
  //     "name": "畅通词汇",
  //     "pages": "397",
  //     "bigV": "2",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969680f64178d54832d1",
  //     "key": "2",
  //     "name": "核心词汇",
  //     "pages": "100",
  //     "bigV": "2",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969780f64178d54832d6",
  //     "key": "1",
  //     "name": "基本词汇",
  //     "pages": "61",
  //     "bigV": "2",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969880f64178d54832da",
  //     "key": "4",
  //     "name": "扩展词汇",
  //     "pages": "188",
  //     "bigV": "2",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969980f64178d54832e2",
  //     "key": "3",
  //     "name": "常用词汇",
  //     "pages": "146",
  //     "bigV": "2",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969680f64178d54832d3",
  //     "key": "3",
  //     "name": "花",
  //     "pages": "2",
  //     "bigV": "3",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969780f64178d54832d4",
  //     "key": "9",
  //     "name": "壳类动物",
  //     "pages": "0",
  //     "bigV": "3",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969780f64178d54832d5",
  //     "key": "6",
  //     "name": "爬行两栖",
  //     "pages": "1",
  //     "bigV": "3",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969780f64178d54832d7",
  //     "key": "7",
  //     "name": "禽鸟",
  //     "pages": "2",
  //     "bigV": "3",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969780f64178d54832d8",
  //     "key": "11",
  //     "name": "树",
  //     "pages": "2",
  //     "bigV": "3",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969880f64178d54832db",
  //     "key": "2",
  //     "name": "蔬菜",
  //     "pages": "2",
  //     "bigV": "3",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969880f64178d54832dc",
  //     "key": "8",
  //     "name": "鱼类",
  //     "pages": "1",
  //     "bigV": "3",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969880f64178d54832dd",
  //     "key": "5",
  //     "name": "家畜家禽",
  //     "pages": "2",
  //     "bigV": "3",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969880f64178d54832de",
  //     "key": "1",
  //     "name": "水果",
  //     "pages": "1",
  //     "bigV": "3",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969980f64178d54832e0",
  //     "key": "4",
  //     "name": "哺乳动物",
  //     "pages": "3",
  //     "bigV": "3",
  //     "__v": 0
  //   }, {
  //     "_id": "5d80969a80f64178d54832e3",
  //     "key": "10",
  //     "name": "昆虫",
  //     "pages": "1",
  //     "bigV": "3",
  //     "__v": 0
  //   }]

  //   let url = 'http://www.youdict.com/ciku/id_';
  //   let totalNumObj = {};
  //   let startNum = 0;
  //   var timerepeat = () => {
  //     if (startNum > vocabularyProperty.length) clearInterval(interval);
  //     let paramArr = ['0', '0', '0', '0', '0'];
  //     let ttt = startNum;
  //     let tst = vocabularyProperty[ttt];
  //     if (!tst) return;
  //     let key = tst.bigV + '_' + tst.key;
  //     if (!totalNumObj[key]) totalNumObj[key] = {};
  //     if (!totalNumObj[key].totalNum) totalNumObj[key].totalNum = vocabularyProperty[ttt].pages;
  //     paramArr[tst.bigV] = tst.key;
  //     paramArr[4] = totalNumObj[key].totalNum;
  //     let cur_url = url + paramArr.join('_') + '.html';
  //     ctx.curl(cur_url, {
  //       dataType: 'text',
  //       timeout: 1000 * 60 * 60
  //     }).then(res => {
  //       var reg = /<h3 style=\"margin-top: 10px;\"><a style=\"color:#333;\" target=\"_blank\" href=\".*\">(.*?)<\/a>[.\s\S]*?<\/h3>[\s]*?<p>([\s\S]*?)<\/p>/gi;
  //       // 获取页面数据
  //       let content = res.data
  //       let wordArr = [];
  //       // 匹配内容
  //       while (reg.exec(content) != null) {
  //         wordArr.push(
  //           RegExp.$1
  //         );
  //       }

  //       // 更新数据库

  //       var setOption;
  //       if (tst.bigV == '0') {
  //         setOption = {
  //           $set: {
  //             'v1': tst.key
  //           }
  //         }
  //       } else if (tst.bigV == '1') {
  //         setOption = {
  //           $set: {
  //             'v2': tst.key
  //           }
  //         }
  //       } else if (tst.bigV == '2') {
  //         setOption = {
  //           $set: {
  //             'v3': tst.key
  //           }
  //         }
  //       } else if (tst.bigV == '3') {
  //         setOption = {
  //           $set: {
  //             'v4': tst.key
  //           }
  //         }
  //       }



  //       ctx.model.Vocabulary.updateMany({
  //         'key': {
  //           $in: wordArr
  //         }
  //       }, setOption, (err, data) => {
  //         console.log("=======", key, "====== ", err, "  ==================");
  //       })
  //     });
  //     if (totalNumObj[key].totalNum < 1 || totalNumObj[key].totalNum == 1) {
  //       startNum++;
  //       console.log("+++++++++++++++++++++");
  //     } else {
  //       totalNumObj[key].totalNum--;
  //       console.log("-------------------------");

  //     }
  //   }

  //   var interval = setInterval(timerepeat, 300)

  //   ctx.body = {};

  // }
  // // // 词汇添加标签
  // // async putTags(ctx) {
  // //   var vocabularyProperty = [
  // //     [{
  // //         key: '1',
  // //         name: '英语四级词汇',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '2',
  // //         name: '英语六级词汇',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '3',
  // //         name: '英专四级词汇',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '4',
  // //         name: '英专八级词汇',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '5',
  // //         name: '考研词汇',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '6',
  // //         name: '托福词汇',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '7',
  // //         name: '雅思词汇',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '8',
  // //         name: 'GRE词汇',
  // //         pages: ''
  // //       },
  // //     ],
  // //     [{
  // //         key: '1',
  // //         name: '高频词',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '2',
  // //         name: '中高频词',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '3',
  // //         name: '中频词',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '4',
  // //         name: '中低频词',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '5',
  // //         name: '低频词',
  // //         pages: ''
  // //       },
  // //     ],
  // //     [{
  // //         key: '1',
  // //         name: '基本词汇',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '2',
  // //         name: '核心词汇',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '3',
  // //         name: '常用词汇',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '4',
  // //         name: '扩展词汇',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '5',
  // //         name: '畅通词汇',
  // //         pages: ''
  // //       },
  // //     ],
  // //     [{
  // //         key: '1',
  // //         name: '水果',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '2',
  // //         name: '蔬菜',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '3',
  // //         name: '花',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '4',
  // //         name: '哺乳动物',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '5',
  // //         name: '家畜家禽',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '6',
  // //         name: '爬行两栖',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '7',
  // //         name: '禽鸟',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '8',
  // //         name: '鱼类',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '9',
  // //         name: '壳类动物',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '10',
  // //         name: '昆虫',
  // //         pages: ''
  // //       },
  // //       {
  // //         key: '11',
  // //         name: '树',
  // //         pages: ''
  // //       }
  // //     ]
  // //   ]

  // //   let url = 'http://www.youdict.com/ciku/id_';
  // //   let startNum = 0;
  // //   var timerepeat = () => {
  // //     if (startNum > vocabularyProperty.length || startNum == vocabularyProperty.length) clearInterval(interval);
  // //     // if (startNum > 1 || startNum == 1) clearInterval(interval);
  // //     let paramArr = ['0', '0', '0', '0', '0'];
  // //     paramArr[startNum] = 1;

  // //     // ctx.curl(url + paramArr.join('_') + '.html', {
  // //     //   dataType: 'text',
  // //     //   timeout: 1000 * 60 * 60
  // //     // }).then(res => {
  // //     var secondType = vocabularyProperty[startNum];
  // //     if (secondType) {
  // //       for (let i = 0; i < secondType.length; i++) {
  // //         let tt = startNum;
  // //         paramArr[startNum] = i + 1;
  // //         console.log("--------------------------------------");
  // //         let cur_url = url + paramArr.join('_') + '.html';
  // //         console.log(cur_url);
  // //         console.log("--------------------------------------");
  // //         ctx.curl(cur_url, {
  // //           dataType: 'text',
  // //           timeout: 1000 * 60 * 60
  // //         }).then(res => {


  // //           // this.curl().then(res=>{
  // //           // console.log("========================================");
  // //           // console.log(res.data);
  // //           // console.log("========================================");
  // //           var reg = />下一页<\/a><a href=\".*?id_(.*?).html\">尾页<\/a>/gi;
  // //           // 获取页面数据
  // //           let content = res.data
  // //           let wordArr = [];
  // //           let page;
  // //           // 匹配内容
  // //           while (reg.exec(content) != null) {
  // //             page = RegExp.$1;
  // //             // console.log("=======", tt, "======", i, "=======", page, "====================");
  // //             ctx.model.Catalog.create({
  // //               ...vocabularyProperty[tt][i],
  // //               pages: page.split('_')[4],
  // //               bigV: tt + ''
  // //             }, (err, data) => {

  // //               console.log("=======", tt, "======", i, "=======", page, "============", err, "========");
  // //             })
  // //             // wordArr.push({
  // //             //     pages:page
  // //             //   });
  // //           }
  // //           // console.log("========================================");
  // //           // console.log(wordArr);


  // //         })
  // //       }
  // //     }
  // //     // var reg = /<a href=\".*?id_(.*?).html\">尾页<\/a>/gi;
  // //     // // 获取页面数据
  // //     // let content = res.data
  // //     // let wordArr = [];
  // //     // // 匹配内容
  // //     // while (reg.exec(content) != null) {
  // //     //   wordArr.push({
  // //     //     bigV: startNum+1 +"",
  // //     //     key: vocabularyProperty[startNum].key,
  // //     //     name: {
  // //     //         type: String,
  // //     //     },
  // //     //     // 页数 
  // //     //     pages: {
  // //     //         type: String,
  // //     //     }});
  // //     // }
  // //     // ctx.model.Vocabulary.create(wordArr, (err, data) => {
  // //     //   // ctx.model.Word.insertMany(wordArr, (err, data) => {
  // //     //   if (!data.length) {
  // //     //     envNumObj[startNum] = true;
  // //     //     console.log("================ ", startNum, "  ==================");
  // //     //   }
  // //     // })
  // //     // });
  // //     startNum++;
  // //   }
  // //   var interval = setInterval(timerepeat, 600)
  // //   // for (let i = startNum; i < totalNum; i++) {
  // //   //   setTimeout(() => {
  // //   //     timerepeat
  // //   //   }, 1000);
  // //   // }
  // //   ctx.body = {};

  // // }
  // 词汇添加标签
  async putTags(ctx) {

    var vocabularyProperty = [{
      "_id": "5d80969480f64178d54832c7",
      "key": "5",
      "name": "考研词汇",
      "pages": "273",
      "bigV": "0",
      "__v": 0
    }, {
      "_id": "5d80969480f64178d54832c9",
      "key": "7",
      "name": "雅思词汇",
      "pages": "226",
      "bigV": "0",
      "__v": 0
    }, {
      "_id": "5d80969480f64178d54832c8",
      "key": "1",
      "name": "英语四级词汇",
      "pages": "291",
      "bigV": "0",
      "__v": 0
    }, {
      "_id": "5d80969480f64178d54832ca",
      "key": "4",
      "name": "英专八级词汇",
      "pages": "198",
      "bigV": "0",
      "__v": 0
    }, {
      "_id": "5d80969480f64178d54832cb",
      "key": "2",
      "name": "英语六级词汇",
      "pages": "401",
      "bigV": "0",
      "__v": 0
    }, {
      "_id": "5d80969580f64178d54832cc",
      "key": "8",
      "name": "GRE词汇",
      "pages": "374",
      "bigV": "0",
      "__v": 0
    }, {
      "_id": "5d80969580f64178d54832cd",
      "key": "3",
      "name": "英专四级词汇",
      "pages": "442",
      "bigV": "0",
      "__v": 0
    }, {
      "_id": "5d80969980f64178d54832e1",
      "key": "6",
      "name": "托福词汇",
      "pages": "243",
      "bigV": "0",
      "__v": 0
    }, {
      "_id": "5d80969680f64178d54832cf",
      "key": "4",
      "name": "中低频词",
      "pages": "182",
      "bigV": "1",
      "__v": 0
    }, {
      "_id": "5d80969680f64178d54832d0",
      "key": "3",
      "name": "中频词",
      "pages": "93",
      "bigV": "1",
      "__v": 0
    }, {
      "_id": "5d80969680f64178d54832d2",
      "key": "5",
      "name": "低频词",
      "pages": "395",
      "bigV": "1",
      "__v": 0
    }, {
      "_id": "5d80969780f64178d54832d9",
      "key": "1",
      "name": "高频词",
      "pages": "39",
      "bigV": "1",
      "__v": 0
    }, {
      "_id": "5d80969880f64178d54832df",
      "key": "2",
      "name": "中高频词",
      "pages": "63",
      "bigV": "1",
      "__v": 0
    }, {
      "_id": "5d80969580f64178d54832ce",
      "key": "5",
      "name": "畅通词汇",
      "pages": "397",
      "bigV": "2",
      "__v": 0
    }, {
      "_id": "5d80969680f64178d54832d1",
      "key": "2",
      "name": "核心词汇",
      "pages": "100",
      "bigV": "2",
      "__v": 0
    }, {
      "_id": "5d80969780f64178d54832d6",
      "key": "1",
      "name": "基本词汇",
      "pages": "61",
      "bigV": "2",
      "__v": 0
    }, {
      "_id": "5d80969880f64178d54832da",
      "key": "4",
      "name": "扩展词汇",
      "pages": "188",
      "bigV": "2",
      "__v": 0
    }, {
      "_id": "5d80969980f64178d54832e2",
      "key": "3",
      "name": "常用词汇",
      "pages": "146",
      "bigV": "2",
      "__v": 0
    }, {
      "_id": "5d80969680f64178d54832d3",
      "key": "3",
      "name": "花",
      "pages": "2",
      "bigV": "3",
      "__v": 0
    }, {
      "_id": "5d80969780f64178d54832d4",
      "key": "9",
      "name": "壳类动物",
      "pages": "0",
      "bigV": "3",
      "__v": 0
    }, {
      "_id": "5d80969780f64178d54832d5",
      "key": "6",
      "name": "爬行两栖",
      "pages": "1",
      "bigV": "3",
      "__v": 0
    }, {
      "_id": "5d80969780f64178d54832d7",
      "key": "7",
      "name": "禽鸟",
      "pages": "2",
      "bigV": "3",
      "__v": 0
    }, {
      "_id": "5d80969780f64178d54832d8",
      "key": "11",
      "name": "树",
      "pages": "2",
      "bigV": "3",
      "__v": 0
    }, {
      "_id": "5d80969880f64178d54832db",
      "key": "2",
      "name": "蔬菜",
      "pages": "2",
      "bigV": "3",
      "__v": 0
    }, {
      "_id": "5d80969880f64178d54832dc",
      "key": "8",
      "name": "鱼类",
      "pages": "1",
      "bigV": "3",
      "__v": 0
    }, {
      "_id": "5d80969880f64178d54832dd",
      "key": "5",
      "name": "家畜家禽",
      "pages": "2",
      "bigV": "3",
      "__v": 0
    }, {
      "_id": "5d80969880f64178d54832de",
      "key": "1",
      "name": "水果",
      "pages": "1",
      "bigV": "3",
      "__v": 0
    }, {
      "_id": "5d80969980f64178d54832e0",
      "key": "4",
      "name": "哺乳动物",
      "pages": "3",
      "bigV": "3",
      "__v": 0
    }, {
      "_id": "5d80969a80f64178d54832e3",
      "key": "10",
      "name": "昆虫",
      "pages": "1",
      "bigV": "3",
      "__v": 0
    }]

    let url = 'http://www.youdict.com/ciku/id_';
    // let totalNumObj = 0;
    let startNum = 0;
    var timerepeat = () => {
      if (startNum > vocabularyProperty.length) clearInterval(interval);
      let paramArr = ['0', '0', '0', '0', '0'];
      let ttt = startNum;
      let tst = vocabularyProperty[ttt];
      if (!tst) return;
      paramArr[tst.bigV] = tst.key;
      // paramArr[4] = totalNumObj[key].totalNum;
      let cur_url = url + paramArr.join('_') + '.html';
      ctx.curl(cur_url, {
        dataType: 'text',
        timeout: 1000 * 60 * 60
      }).then(res => {
        var reg = /<h3 style=\"margin-top: 10px;\"><a style=\"color:#333;\" target=\"_blank\" href=\".*\">(.*?)<\/a>[.\s\S]*?<\/h3>[\s]*?<p>([\s\S]*?)<\/p>/gi;
        // 获取页面数据
        let content = res.data
        let wordArr = [];
        // 匹配内容
        while (reg.exec(content) != null) {
          wordArr.push(
            RegExp.$1
          );
        }

        // 更新数据库

        var setOption;
        if (tst.bigV == '0') {
          setOption = {
            $set: {
              'v1': tst.key
            }
          }
        } else if (tst.bigV == '1') {
          setOption = {
            $set: {
              'v2': tst.key
            }
          }
        } else if (tst.bigV == '2') {
          setOption = {
            $set: {
              'v3': tst.key
            }
          }
        } else if (tst.bigV == '3') {
          setOption = {
            $set: {
              'v4': tst.key
            }
          }
        }



        ctx.model.Vocabulary.updateMany({
          'key': {
            $in: wordArr
          }
        }, setOption, (err, data) => {
          console.log("=======", startNum, "====== ", err, "  ==================");
        })
      });
      // if (totalNumObj[key].totalNum < 1 || totalNumObj[key].totalNum == 1) {
      startNum++;
      console.log("+++++++++++++++++++++");
      // } else {
      //   totalNumObj[key].totalNum--;
      //   console.log("-------------------------");

      // }
    }

    var interval = setInterval(timerepeat, 300)

    ctx.body = {};

  }
  // // 词汇添加标签
  // async putTags(ctx) {
  //   var vocabularyProperty = [
  //     [{
  //         key: '1',
  //         name: '英语四级词汇',
  //         pages: ''
  //       },
  //       {
  //         key: '2',
  //         name: '英语六级词汇',
  //         pages: ''
  //       },
  //       {
  //         key: '3',
  //         name: '英专四级词汇',
  //         pages: ''
  //       },
  //       {
  //         key: '4',
  //         name: '英专八级词汇',
  //         pages: ''
  //       },
  //       {
  //         key: '5',
  //         name: '考研词汇',
  //         pages: ''
  //       },
  //       {
  //         key: '6',
  //         name: '托福词汇',
  //         pages: ''
  //       },
  //       {
  //         key: '7',
  //         name: '雅思词汇',
  //         pages: ''
  //       },
  //       {
  //         key: '8',
  //         name: 'GRE词汇',
  //         pages: ''
  //       },
  //     ],
  //     [{
  //         key: '1',
  //         name: '高频词',
  //         pages: ''
  //       },
  //       {
  //         key: '2',
  //         name: '中高频词',
  //         pages: ''
  //       },
  //       {
  //         key: '3',
  //         name: '中频词',
  //         pages: ''
  //       },
  //       {
  //         key: '4',
  //         name: '中低频词',
  //         pages: ''
  //       },
  //       {
  //         key: '5',
  //         name: '低频词',
  //         pages: ''
  //       },
  //     ],
  //     [{
  //         key: '1',
  //         name: '基本词汇',
  //         pages: ''
  //       },
  //       {
  //         key: '2',
  //         name: '核心词汇',
  //         pages: ''
  //       },
  //       {
  //         key: '3',
  //         name: '常用词汇',
  //         pages: ''
  //       },
  //       {
  //         key: '4',
  //         name: '扩展词汇',
  //         pages: ''
  //       },
  //       {
  //         key: '5',
  //         name: '畅通词汇',
  //         pages: ''
  //       },
  //     ],
  //     [{
  //         key: '1',
  //         name: '水果',
  //         pages: ''
  //       },
  //       {
  //         key: '2',
  //         name: '蔬菜',
  //         pages: ''
  //       },
  //       {
  //         key: '3',
  //         name: '花',
  //         pages: ''
  //       },
  //       {
  //         key: '4',
  //         name: '哺乳动物',
  //         pages: ''
  //       },
  //       {
  //         key: '5',
  //         name: '家畜家禽',
  //         pages: ''
  //       },
  //       {
  //         key: '6',
  //         name: '爬行两栖',
  //         pages: ''
  //       },
  //       {
  //         key: '7',
  //         name: '禽鸟',
  //         pages: ''
  //       },
  //       {
  //         key: '8',
  //         name: '鱼类',
  //         pages: ''
  //       },
  //       {
  //         key: '9',
  //         name: '壳类动物',
  //         pages: ''
  //       },
  //       {
  //         key: '10',
  //         name: '昆虫',
  //         pages: ''
  //       },
  //       {
  //         key: '11',
  //         name: '树',
  //         pages: ''
  //       }
  //     ]
  //   ]

  //   let url = 'http://www.youdict.com/ciku/id_';
  //   let startNum = 0;
  //   var timerepeat = () => {
  //     if (startNum > vocabularyProperty.length || startNum == vocabularyProperty.length) clearInterval(interval);
  //     // if (startNum > 1 || startNum == 1) clearInterval(interval);
  //     let paramArr = ['0', '0', '0', '0', '0'];
  //     paramArr[startNum] = 1;

  //     // ctx.curl(url + paramArr.join('_') + '.html', {
  //     //   dataType: 'text',
  //     //   timeout: 1000 * 60 * 60
  //     // }).then(res => {
  //     var secondType = vocabularyProperty[startNum];
  //     if (secondType) {
  //       for (let i = 0; i < secondType.length; i++) {
  //         let tt = startNum;
  //         paramArr[startNum] = i + 1;
  //         console.log("--------------------------------------");
  //         let cur_url = url + paramArr.join('_') + '.html';
  //         console.log(cur_url);
  //         console.log("--------------------------------------");
  //         ctx.curl(cur_url, {
  //           dataType: 'text',
  //           timeout: 1000 * 60 * 60
  //         }).then(res => {


  //           // this.curl().then(res=>{
  //           // console.log("========================================");
  //           // console.log(res.data);
  //           // console.log("========================================");
  //           var reg = />下一页<\/a><a href=\".*?id_(.*?).html\">尾页<\/a>/gi;
  //           // 获取页面数据
  //           let content = res.data
  //           let wordArr = [];
  //           let page;
  //           // 匹配内容
  //           while (reg.exec(content) != null) {
  //             page = RegExp.$1;
  //             // console.log("=======", tt, "======", i, "=======", page, "====================");
  //             ctx.model.Catalog.create({
  //               ...vocabularyProperty[tt][i],
  //               pages: page.split('_')[4],
  //               bigV: tt + ''
  //             }, (err, data) => {

  //               console.log("=======", tt, "======", i, "=======", page, "============", err, "========");
  //             })
  //             // wordArr.push({
  //             //     pages:page
  //             //   });
  //           }
  //           // console.log("========================================");
  //           // console.log(wordArr);


  //         })
  //       }
  //     }
  //     // var reg = /<a href=\".*?id_(.*?).html\">尾页<\/a>/gi;
  //     // // 获取页面数据
  //     // let content = res.data
  //     // let wordArr = [];
  //     // // 匹配内容
  //     // while (reg.exec(content) != null) {
  //     //   wordArr.push({
  //     //     bigV: startNum+1 +"",
  //     //     key: vocabularyProperty[startNum].key,
  //     //     name: {
  //     //         type: String,
  //     //     },
  //     //     // 页数 
  //     //     pages: {
  //     //         type: String,
  //     //     }});
  //     // }
  //     // ctx.model.Vocabulary.create(wordArr, (err, data) => {
  //     //   // ctx.model.Word.insertMany(wordArr, (err, data) => {
  //     //   if (!data.length) {
  //     //     envNumObj[startNum] = true;
  //     //     console.log("================ ", startNum, "  ==================");
  //     //   }
  //     // })
  //     // });
  //     startNum++;
  //   }
  //   var interval = setInterval(timerepeat, 600)
  //   // for (let i = startNum; i < totalNum; i++) {
  //   //   setTimeout(() => {
  //   //     timerepeat
  //   //   }, 1000);
  //   // }
  //   ctx.body = {};

  // }
  getTotal(ctx) {
    ctx.body = envNumObj;
  }


  // async getDetail(){
  //   let url = "http://www.youdict.com/ciku/id_5_1_0_0_0.html"
  // }

  // test(ctx) {
  //   let abc = [
  //     "<a class=\"navbar-brand visible-xs-inline\" href=\"/\">",
  //     "<a href=\"/\" target=\"_blank\">",
  //      "<a href=\"/etym\" target=\"_blank\">",
  //      "<a href=\"/ciyuan\" target=\"_blank\">",
  //      "<a href=\"/root\" target=\"_blank\">",
  //      "<a href=\"https://movie.douban.com/tv/?from=gaia#!type=tv&tag=美剧&sort=recommend\" target=\"_blank\">",
  //      "<a href=\"/novel\" target=\"_blank\">",
  //      "<a href=\"http://www.chinadaily.com.cn/\" target=\"_blank\">",
  //      "<a href=\"http://www.cnn.com/\" target=\"_blank\">",
  //      "<a href=\"/kankan\" target=\"_blank\">",
  //      "<a href=\"/test\" target=\"_blank\">",
  //      "<a href=\"/study/course.html\" target=\"_blank\">",
  //      "<a href=\"/chengyu\" target=\"_blank\">",
  //      "<a href=\"/cidian\" target=\"_blank\">",
  //      "<a href=\"/redpack.png\" target=\"_blank\" style=\"font-size: 15px;color: #f00;\">",
  //      "<a href=\"/read\" target=\"_blank\">",
  //      "<a href=\"/game\" target=\"_blank\">",
  //      "<a href=\"/site\" target=\"_blank\">",
  //      "<a href=\"/news\" target=\"_blank\">",
  //      "<a href=\"/vipmlzl/sLtE.html\" target=\"_blank\">",
  //      "<a href=\"/vipytxar/REs7.html\" target=\"_blank\">", "<a href=\"/vipaaka/ajuN.html\" target=\"_blank\">", "<a href=\"/vipkewj/w8c.html\" target=\"_blank\">", "<a href=\"/viplcqai/m2Fq.html\" target=\"_blank\">", "<a href=\"/vipgsngy/DCo.html\" target=\"_blank\">", "<a href=\"/vip88278/993.html\" target=\"_blank\">", "<a href=\"/vip90805/95.html\" target=\"_blank\">", "<a href=\"/vip93261329/583.html\" target=\"_blank\">",
  //       "<a href=\"/vippcsf/0EH.html\" target=\"_blank\">",
  //       "<a href=\"/vipgclhqg/jRi5.html\" target=\"_blank\">",
  //       "<a href=\"/vipbcddb/YWh.html\" target=\"_blank\">",
  //       "<a href=\"/vipzptub/R43.html\" target=\"_blank\">",
  //       "<a href=\"/vipommsn/3vr.html\" target=\"_blank\">",
  //       "<a href=\"/vip287816/718.html\" target=\"_blank\">",
  //       "<a href=\"/vip2973/68.html\" target=\"_blank\">",
  //       "<a href=\"/vip37686866/017.html\" target=\"_blank\">",
  //       "<a href=\"/vip304506/732.html\" target=\"_blank\">",
  //       "<a href=\"javascript:void(0);\" id=\"sttrans\">",
  //       "<a href=\"/login\" target=\"_blank\">",
  //       "<a href=\"/register\" target=\"_blank\">",
  //       "<a href=\"/\" title=\"YouDict 优词\">",
  //       "<a href=\"/\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">",
  //       "<a href=\"//dict.youdao.com/search?q=snub\" target=\"_blank\">",
  //       "<a href=\"//www.iciba.com/snub\" target=\"_blank\">", "<a href=\"//dict.cn/snub\" target=\"_blank\">", "<a href=\"//cn.bing.com/dict/search?q=snub\" target=\"_blank\">", "<a href=\"/\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">", "<a href=\"https://en.oxforddictionaries.com/definition/snub\" target=\"_blank\">", "<a href=\"https://en.wiktionary.org/wiki/snub\" target=\"_blank\">", "<a href=\"https://www.google.com/search?q=define+snub\" target=\"_blank\">", "<a href=\"//dictionary.reference.com/browse/snub\" target=\"_blank\">", "<a href=\"//www.thefreedictionary.com/snub\" target=\"_blank\">", "<a href=\"//www.yourdictionary.com/snub\" target=\"_blank\">", "<a href=\"//www.urbandictionary.com/define.php?term=snub\" target=\"_blank\">", "<a href=\"//www.onelook.com/?w=snub\" target=\"_blank\">", "<a href=\"/etym/s/snub\" target=\"_blank\">", "<a href=\"/ciyuan/s/snub\" target=\"_blank\">", "<a href=\"/root/search?wd=snub\" target=\"_blank\">", "<a href=\"/\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">", "<a href=\"https://image.baidu.com/search/index?tn=baiduimage&ie=utf-8&word=snub\" target=\"_blank\">", "<a href=\"https://image.so.com/i?q=snub\" target=\"_blank\">", "<a href=\"https://pic.sogou.com/pics?query=snub\" target=\"_blank\">", "<a href=\"https://cn.bing.com/images/search?q=snub\" target=\"_blank\">", "<a href=\"https://www.google.com/search?tbm=isch&q=snub\" target=\"_blank\">", "<a href=\"/\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">", "<a href=\"https://www.baidu.com/s?ie=utf-8&wd=snub\" target=\"_blank\">", "<a href=\"https://www.so.com/s?q=snub\" target=\"_blank\">", "<a href=\"https://www.sogou.com/web?query=snub\" target=\"_blank\">", "<a href=\"https://cn.bing.com/search?q=snub\" target=\"_blank\">", "<a href=\"https://www.google.com/search?q=snub\" target=\"_blank\">", "<a href=\"/\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">", "<a href=\"http://wordo.co/snub\" target=\"_blank\">", "<a href=\"http://www.dictionaryinstant.com/dictionary/definition/snub\" target=\"_blank\">", "<a href=\"/\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">", "<a href=\"https://fanyi.baidu.com/#en/zh/snub\" target=\"_blank\">", "<a href=\"https://translate.google.com/#en/zh-CN/snub\" target=\"_blank\">", "<a href=\"https://fanyi.youdao.com/\" target=\"_blank\">", "<a href=\"https://www.bing.com/translator/\" target=\"_blank\">", "<a href=\"/\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">", "<a href=\"https://so.iqiyi.com/so/q_snub\" target=\"_blank\">", "<a href=\"https://v.qq.com/search.html?pagetype=3&stj2=search.search&stag=txt.index&ms_key=snub\" target=\"_blank\">", "<a href=\"https://www.hulu.com/search?q=snub\" target=\"_blank\">", "<a href=\"https://www.youtube.com/results?search_query=snub&search_sort=video_view_count\" target=\"_blank\">", "<a href=\"//search.mtime.com/search/?q=snub\" target=\"_blank\">", "<a href=\"//www.imdb.com/find?q=snub\" target=\"_blank\">", "<a href=\"#\" target=\"_blank\">", "<a href=\"#\" target=\"_blank\">", "<a href=\"#\" target=\"_blank\">", "<a href=\"#\" target=\"_blank\">", "<a target=\"_blank\" href=\"/ciyuan/s/snub\">", "<a target=\"_blank\" href=\"/etym/s/snub\">", "<a href=\"/etym/s/snip\" target=\"_blank\">", "<a target=\"_blank\" href=\"/etym/s/snub\">", "<a href=\"/etym/s/snub\" target=\"_blank\">", "<a target=\"_blank\" href=\"/etym/s/snub\">", "<a href=\"/etym/s/snub\" target=\"_blank\">", "<a href=\"/liju/w/snub\">", "<a href=\"/liju/w/snub\">", "<a href=\"/tags/CET4\" target=\"_blank\">", "<a href=\"/tags/CET4\" target=\"_blank\">", "<a href=\"/tags/CET6\" target=\"_blank\">", "<a href=\"/tags/CET6\" target=\"_blank\">", "<a href=\"/tags/TEM4\" target=\"_blank\">", "<a href=\"/tags/TEM4\" target=\"_blank\">", "<a href=\"/tags/TEM8\" target=\"_blank\">", "<a href=\"/tags/TEM8\" target=\"_blank\">", "<a href=\"/tags/kaoyan\" target=\"_blank\">", "<a href=\"/tags/GRE\" target=\"_blank\">", "<a href=\"/tags/TOEFL\" target=\"_blank\">", "<a href=\"/tags/IELTS\" target=\"_blank\">", "<a href=\"/kankan\" target=\"_blank\">", "<a href=\"/verbs\" target=\"_blank\">", "<a href=\"/ciku\" target=\"_blank\">", "<a href=\"/test\" target=\"_blank\">", "<a href=\"/root/root.php\" target=\"_blank\">", "<a href=\"/chengyu\" target=\"_blank\">", "<a href=\"/cidian\" target=\"_blank\">", "<a href=\"http://zh.youdict.com/\" target=\"_blank\">", "<a href=\"http://weibo.com/youdict\" target=\"_blank\">", "<a href=\"#\" target=\"_blank\">", "<a href=\"#\" target=\"_blank\">", "<a href=\"/tags/水果\" target=\"_blank\">", "<a href=\"/tags/蔬菜\" target=\"_blank\">", "<a href=\"/tags/花\" target=\"_blank\">", "<a href=\"/tags/哺乳动物\" target=\"_blank\">", "<a href=\"/tags/家畜家禽\" target=\"_blank\">", "<a href=\"/tags/爬行两栖\" target=\"_blank\">", "<a href=\"/tags/禽鸟\" target=\"_blank\">", "<a href=\"/tags/鱼类\" target=\"_blank\">", "<a href=\"/tags/壳类动物\" target=\"_blank\">", "<a href=\"/tags/昆虫\" target=\"_blank\">", "<a href=\"/tags/树\" target=\"_blank\">", "<a target=\"_blank\" href=\"/w/tambourine\">", "<a target=\"_blank\" href=\"/w/tame\">", "<a target=\"_blank\" href=\"/w/tamed\">", "<a target=\"_blank\" href=\"/w/tameness\">", "<a target=\"_blank\" href=\"/w/tamer\">", "<a target=\"_blank\" href=\"/w/tamp\">", "<a target=\"_blank\" href=\"/w/tamper\">", "<a target=\"_blank\" href=\"/w/tampon\">", "<a target=\"_blank\" href=\"/w/tan\">", "<a target=\"_blank\" href=\"/w/tandem\">", "<a target=\"_blank\" href=\"/etym/s/boucl%C3%A9\">", "<a target=\"_blank\" href=\"/etym/s/bough\">", "<a target=\"_blank\" href=\"/etym/s/boulder\">", "<a target=\"_blank\" href=\"/etym/s/boulevard\">", "<a target=\"_blank\" href=\"/etym/s/bounce\">", "<a target=\"_blank\" href=\"/etym/s/bound\">", "<a target=\"_blank\" href=\"/etym/s/bounty\">", "<a target=\"_blank\" href=\"/etym/s/bouquet\">", "<a target=\"_blank\" href=\"/etym/s/bourgeois\">", "<a target=\"_blank\" href=\"/etym/s/bout\">", "<a target=\"_blank\" href=\"/ciyuan/s/flounce\">", "<a target=\"_blank\" href=\"/ciyuan/s/flounder\">", "<a target=\"_blank\" href=\"/ciyuan/s/flounder\">", "<a target=\"_blank\" href=\"/ciyuan/s/flour\">", "<a target=\"_blank\" href=\"/ciyuan/s/flourish\">", "<a target=\"_blank\" href=\"/ciyuan/s/flout\">", "<a target=\"_blank\" href=\"/ciyuan/s/flow\">", "<a target=\"_blank\" href=\"/ciyuan/s/flower\">", "<a target=\"_blank\" href=\"/ciyuan/s/flu\">", "<a target=\"_blank\" href=\"/ciyuan/s/flub\">", "<a href=\"/ciyuan\" target=\"_blank\" title=\"英语词源字典\">", "<a href=\"/root\" target=\"_blank\" title=\"英语词根字典\">", "<a href=\"/articles\" target=\"_blank\" title=\"文章列表\">", "<a href=\"/archive.php\" target=\"_blank\" title=\"词语索引\">", "<a href=\"/ciku\" target=\"_blank\" title=\"英语单词大全\">", "<a href=\"/root/root.php\" target=\"_blank\" title=\"英语词根表\">", "<a href=\"/novel\" target=\"_blank\" title=\"英文小说网\">", "<a href=\"/map/index.html\" target=\"_blank\">", "<a target=\"_blank\" href=\"https://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=XzImNT48NCwwMR8uLnE8MDI\">", "<a href=\"http://www.miibeian.gov.cn\" target=\"_blank\">"
  //   ];
  //   ctx.body = abc;
  // }

};