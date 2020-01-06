// 获取白名单
const white = {
  '/verify/pic/code': true,
  '/api/logout': true,
  '/api/get/piccode': true,
  '/menu/queryMenu':true,
  '/user/queryOrganList':true
}
/**
 * 权限拦截器
 * 1.记录ajax请求
 * 2.校验session
 */
module.exports = () => {
  return async function (ctx, next) {
    const {
      request
    } = ctx;
    const url = request.url.split("?")[0];
    let isLogin = !!ctx.session['userId'];
    let meth = request.method.toUpperCase()
    // // ajax 请求
    // if (meth == 'POST' && !white[url]) {
    //   if (!isLogin) {
    //     // 销毁session
    //     ctx.session = null;
    //     ctx.body = {
    //       retCode: "304",
    //       retMsg: "请重新登录",
    //       data: {}
    //     };
    //     return;
    //   } else {
    //     let curAuth = {
    //       ...white,
    //       '/api/userinfo': true,
    //       '/user/updateUserPasswd': true,
    //       ...ctx.session['auth']
    //     };
    //     if (!curAuth[url]) {
    //       ctx.body = {
    //         retCode: "403",
    //         retMsg: "没有权限",
    //         data: {}
    //       };
    //       return;
    //     } else {
    //       await next();
    //     }
    //   }
    // } else {
      await next();
    // }
  };
};