"use strict";
const egg = require("egg");
const apis = require("../api/index");
const fs = require('fs');

const {
  formatApi
} = require("../helper/api");
const severApis = formatApi(apis);
const serEnv =  process.env.NODE_ENV == 'development'? process.env.npm_lifecycle_script.split('egg-bin dev ')[1] : process.argv[4];
const npmArg = process.env.npm_config_argv;
console.log("***************************",serEnv);

module.exports = class httpService extends egg.Service {
  /**
   * 
   * @param {*} ctx 
   * @param {Object} options 
   * url 后台接口
   * host 后台服务器
   * data 请求传参
   */
  async $post(ctx, options = {}) {
    const pubKey = fs.readFileSync(this.config.decodeConfig.pubKey);
    const priKey = fs.readFileSync(this.config.decodeConfig.priKey);


    let url = options.url || ctx.url.split('?')[0];
    url = severApis[url].sUrl || url;
    let host = (severApis[url] && severApis[url].host && this.config.httpConfig[severApis[url].host]) || options.host || this.config.httpConfig.host;
    let data = options.data || ctx.request.body;
    if((serEnv == 'enterprise'|| npmArg.indexOf("startE") != -1) && ctx.session['userId']){
      data.cust_id = ctx.session['userId'].custId;
    }

    this.logger.info("&&&&&&&&&&&&&&&&&&");
    this.logger.info(data);
    this.logger.info("&&&&&&&&&&&&&&&&&&");

    // 请求数据加密
    let resData, origRes;
    try {
      origRes = await ctx.curl(`${host}${url}`, {
        method: "POST",
        contentType: "json",
        data: data,
        headers: ctx.request.header
      });
      if (origRes.status == 200) {
        // 接收数据解密
        let newData = origRes.data.toString('utf-8');
      } else if (origRes.status == 401) {
        resData = {
          retCode: "403",
          retMsg: "请重新登录！",
          retObj: {}
        };
      } else {
        resData = {
          retCode: "" + origRes.status,
          retMsg: "其他状态",
          retObj: {}
        };
      }
      return resData;
    } catch (error) {
      this.logger.error(error);
      return {
        retCode: "500",
        retMsg: "服务器开小差",
        retObj: {}
      }
    }
  }
  async $get(ctx) {
    const getResult = await ctx.curl(`${this.config.httpConfig.host}/hello`, {
      data: ctx.request.body
    });
    ctx.status = getResult.status;
    // ctx.set(getResult.headers);
    return getResult;
  }
};