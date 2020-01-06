"use strict";
const apis = require("./api/index");
const { formatApi } = require("./helper/api");
const severApis = formatApi(apis);

module.exports = app => {
  const { controller } = app;

  // app.get('/',controller.file.test);
  // app.get('/getNum',controller.comm.getTotal);
  // app.get('/putTags',controller.comm.putTags);
  // app.get('/getPages',controller.comm.getPages);
  // app.get('/gushiwen/*',controller.comm.gushiwen);
  // app.get('/mongodb/insert',controller.comm.insert);
  // app.get('/mongodb/findeee',controller.comm.findeee);
  // app.get('/*',controller.comm.finde2);
  app.get(/^\/api\/*/,controller.comm.render);
  // 页面 请求
  app.get(/^\/(?!(api\/))\S*/, controller.comm.render);
  // 接口 请求
  let t;
  for (let url in severApis) {
   
    t = severApis[url];
    app.post(url, controller[t.fileName || "comm"][t.methName || "handleAjax"]);
  }
};
