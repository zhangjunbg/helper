/**
 * create
 * 后台服务接口
 */
/**
 *  url:'/api/login',内部接口
    sUrl:'/api/login', 后台服务接口，如果与 url一致可以不写，
    fileName:'user', 控制器文件 ，如果只是转发不做处理，可以不写
    methName:'login'  控制器方法，如果只是转发不做处理，可以不写
 */
module.exports = {
  // 条件模糊查询
  "API_FIND_LIKE": {
    url: "/api/find/like",
    fileName: 'find',
    methName: 'like'
  },
  // 条件模糊查询
  "API_FIND_LIKE_LIMIT": {
    url: "/api/find/likelimit",
    fileName: 'find',
    methName: 'likelimit'
  },
    // 条件查询
    "API_FIND_REGULAR": {
      url: "/api/find/regular",
      fileName: 'find',
      methName: 'regular'
    },
  // 条件精确查询
  "API_FIND_KEYWORD": {
    url: "/api/find/keyword",
    fileName: 'find',
    methName: 'keyword'
  },

  // 跑批保存图片
  "API_SAVE_IMAGES": {
    url: "/api/save/images",
    fileName: 'file',
    methName: 'beginSaveImages'
  }

}