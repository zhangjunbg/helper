"use strict";
const egg = require("egg");
const formatApi = require('../api/help');

// const getAuthBtn = require("../web/utils/help");

const {
  getRandomNumberByRange,
  getRandomImg,
  verify
} = require("../helper");
const getInitPic = () => {
  const l = 42, // 滑块边长
    r = 10, // 滑块半径
    w = 310, // canvas宽度
    h = 155, // canvas高度
    PI = Math.PI

  const L = l + r * 2 // 滑块实际边长
  let options = {
    x: getRandomNumberByRange(L + 10, w - (L + 10)),
    y: getRandomNumberByRange(10 + r * 2, h - (L + 10)),
    imgUrl: getRandomImg(getRandomNumberByRange(0, 100))
  };

  return options;
}
module.exports = class UserController extends egg.Controller {
  /**
   * 登录
   * @param {*} ctx 
   */
  async login(ctx) {
    let requestParams = {
      ...ctx.request.body
    }
    if (ctx.session['userId']) {
      ctx.body = {
        retCode: 'success',
        retMsg: '登录成功'
      }
    } else {
      // 向后台发起请求
      let res = await this.service.user.login(requestParams);
      console.log("^^^^^^^^^^^^^^^^^^^^^^^",res);
      if (res.retCode == 'success') {
        ctx.session['userId'] = {userId:requestParams.username};
      }
      ctx.body = res;
    }
    // ctx.session['userId'] = 'sdfdsfdsf';
    // ctx.body = {
    //       retCode: 'success',
    //       retMsg: '登录成功'
    //     }
  }
  /**
   * 生成图片验证
   * @param {*} ctx 
   */
  async piccode(ctx) {
    let opt = getInitPic();
    ctx.session['piccode'] = opt;

    ctx.body = {
      retCode: 'success',
      retMsg: '',
      data: opt
    };
  }
  /**
   * 验证图片验证
   * @param {*} ctx 
   */
  async verify(ctx) {
    let options = ctx.session['piccode'];
    const {
      spliced,
      TuringTest
    } = verify(ctx.request.body, options.x);
    let returnObj = {
      retCode: 'success',
      retMsg: '验证成功！',
      data: {}
    };
    if (spliced && TuringTest) {
      // 验证登录
      let requestParams = {
        ...ctx.request.body
      }
      if (ctx.session['userId']) {
        ctx.body = {
          retCode: 'success',
          retMsg: '登录成功'
        }
      } else {
        // 向后台发起请求
        let res = await this.service.user.login(requestParams);
        console.log();
        if (res.retCode == 'success') {
          ctx.session['userId'] = {userId:requestParams.username,}
        } else if (res.retCode == 'failure') {
          options = getInitPic();
          res.retCode = 'other'
          res.data = options;
        }
        ctx.body = res;
      }

    } else {
      options = getInitPic();
      returnObj.retCode = 'again';
      returnObj.retMsg = '验证失败';
      ctx.session['piccode'] = options;
      returnObj.data = options;
      ctx.body = returnObj;

    }
    // ctx.body = returnObj;
  }

  /**
   * 登出
   * @param {*} ctx 
   */
  async logout(ctx) {
    ctx.session['userId'] = null;
    ctx.body = {
      retCode: 'success',
      retMsg: '登出成功！',
      data: {}
    };
  }

  /**
   *  获取登录用户信息
   * @param {*} ctx 
   */

  async userInfo(ctx) {
    let lUserInfo = {
      retCode: '304',
      retMsg: '未登录',
      data: {}
    };
    if (ctx.session['userId']) {
      lUserInfo = await this.service.user.userIfo({
        userId: ctx.session['userId'].userId,
        ...this.ctx.request.body
      });
      if(lUserInfo.retCode == "success"){
        ctx.session['auth'] = 
         formatApi(lUserInfo.retObj.userMenu);
         ctx.session['userId'].custId = lUserInfo.retObj.custId

        // ctx.session['auth'] = getAuthBtn(lUserInfo.retObj.userMenu);
      }else{
        ctx.session['auth'] = {};
      }
    }

    // lUserInfo = {
    //   retCode: 'success',
    //   retMsg: '登录成功',
    //   retObj :{
    //     userId:'sldfll'
    //   }
    // }

    let testData = {
      "retCode": "success",
      "retMsg": "获取菜单成功",
      "retObj": {
        "userMenu": [{
            "upMenuCode": "",
            "menuUrl": "",
            "menuIcon": "",
            "children": [{
              "upMenuCode": "ACTIVITY",
              "menuUrl": "",
              "menuIcon": "",
              "children": [{
                  "upMenuCode": "ACTIVITYINDEX",
                  "menuUrl": "",
                  "menuIcon": "",
                  "menuCode": "optActAprv",
                  "menuName": "复核",
                  "isMenu": false
                },
                {
                  "upMenuCode": "ACTIVITYINDEX",
                  "menuUrl": "",
                  "menuIcon": "",
                  "menuCode": "optActAdd",
                  "menuName": "新增",
                  "isMenu": false
                }
              ],
              "menuCode": "ACTIVITYINDEX",
              "menuName": "活动列表",
              "isMenu": true
            }],
            "menuCode": "ACTIVITY",
            "menuName": "活动管理",
            "isMenu": true
          },
          {
            "upMenuCode": "",
            "menuUrl": "",
            "menuIcon": "",
            "children": [{
              "upMenuCode": "SUPPLIER",
              "menuUrl": "",
              "menuIcon": "",
              "menuCode": "SUPPLIERINDEX",
              "menuName": "供应商列表",
              "isMenu": true
            }],
            "menuCode": "SUPPLIER",
            "menuName": "供应商管理",
            "isMenu": true
          },
          {
            "upMenuCode": "",
            "menuUrl": "",
            "menuIcon": "",
            "children": [{
              "upMenuCode": "PRODUCT",
              "menuUrl": "",
              "menuIcon": "",
              "menuCode": "PRODUCTINDEX",
              "menuName": "产品列表",
              "isMenu": true
            }],
            "menuCode": "PRODUCT",
            "menuName": "产品管理",
            "isMenu": true
          },
          {
            "upMenuCode": "",
            "menuUrl": "",
            "menuIcon": "",
            "children": [{
              "upMenuCode": "MENU",
              "menuUrl": "",
              "menuIcon": "",
              "children": [{
                  "upMenuCode": "PERMISSION_USER_QUERY",
                  "menuUrl": "",
                  "menuIcon": "",
                  "menuCode": "PERMISSION_USER_QUERY",
                  "menuName": "查询",
                  "isMenu": false
                },
                {
                  "upMenuCode": "PERMISSION_USER_ADD",
                  "menuUrl": "",
                  "menuIcon": "",
                  "menuCode": "PERMISSION_USER_ADD",
                  "menuName": "新增",
                  "isMenu": false
                }
              ],
              "menuCode": "MENUINDEX",
              "menuName": "菜单列表",
              "isMenu": true
            }],
            "menuCode": "MENU",
            "menuName": "菜单管理",
            "isMenu": true
          },
          {
            "upMenuCode": "",
            "menuUrl": "",
            "menuIcon": "",
            "menuCode": "STOCK",
            "menuName": "库存管理",
            "isMenu": true
          },
          {
            "upMenuCode": "",
            "menuUrl": "",
            "menuIcon": "",
            "menuCode": "BANNER",
            "menuName": "banner管理",
            "isMenu": true
          },
          {
            "upMenuCode": "",
            "menuUrl": "",
            "menuIcon": "",
            "menuCode": "001",
            "menuName": "测试菜单",
            "isMenu": true
          },
          {
            "upMenuCode": "",
            "menuUrl": "",
            "menuIcon": "",
            "menuCode": "1003",
            "isMenu": true
          }
        ]
      }
    }
    ctx.body = lUserInfo;

  }
};