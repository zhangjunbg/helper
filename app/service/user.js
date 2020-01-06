'use strict';
const egg = require('egg');
module.exports = class ArticeService extends egg.Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
  }
  async login(data = {}) {
    let res = await this.service.http.$post(this.ctx, {
      url: '',
      data: {
        user_id: data.username,
        user_password: data.password
      }
    });
    return res;
  }
  async userIfo(data = {}) {
    let res = await this.service.http.$post(this.ctx, {
      url: '',
      data: {
        user_id: data.userId
      }
    })
    return res;
  }


  async catchErr() {
    try {
      const errRes = await new Promise((resolve, reject) => {

      });
      //平常我们也可以在await请求成功后通过判断当前status是不是200来判断请求是否成功
      // console.log(errRes.status, errRes.statusText);
    } catch (err) {
      console.log(err);
    }
  }





  async findeee(data = {}) {
    // console.log(errRes.status, errRes.statusText);
    const errRes = await new Promise((resolve, reject) => {
      this.ctx.model.Article.find().exec(function (err, ddd) {
        console.log("------------2-------------------");
        console.log(ddd);
        resolve(ddd);
      });
    });

    // console.log("------------3-ddd------------------");
    // let res = yield this.ctx.model.Article.find().exec(function (err, ddd) {
    //   console.log("------------2-------------------");
    //   console.log(ddd);
    //   return ddd;
    // });
    return errRes;
    // console.log("------------3-ddd------------------", res);
  }


};