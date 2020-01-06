const axios = require('axios')
const apis = require('../../api/index')
// axios.defaults.baseURL = 'http://127.0.0.1:7001';
axios.defaults.timeout = 15000;
axios.defaults.xsrfHeaderName = 'x-csrf-token';
axios.defaults.xsrfCookieName = 'csrfToken';
import {
  removeToken
} from "@/utils/auth";

let api
// let headers = { 'Content-Type': 'application/json;charset=UTF-8' }
// axios.interceptors.request.use(function (config) {
//   config.headers['Content-Type'] = 'application/json;charset=UTF-8'
// })
axios.interceptors.response.use(
  res => {
    if (res.status >= 200 && res.status < 300) {
      return res
    }
    return Promise.reject(res)
  },
  err => {
    // 网络异常
    return Promise.reject(err)
  }
)

// urlKey
api = {
  /**
   * post 请求
   * @param {*vue实例} vm 
   * @param {*请求的数据参数  urlKey data} resData 
   * @param {*请求成功的回调函数} cb 
   */
  async post(vm, urlName, data, cb, errCb) {
    let target = apis[urlName].url
    try {
      let result = await axios.post(target, data)
      if (result.data.retCode === 'success' || result.data.retCode === 'again') {
        cb && cb(result.data)
      } else {

        vm.$message({
          type: "error",
          message: result.data.retMsg
        });
        if (result.data.retCode == '304') {
          removeToken();
          vm.$router.push('/login');
        }
        errCb && errCb(result.data);

      }
      //  黑框提示报错
    } catch (error) {
      console.log(error)
    }
  },
  async postAll(vm, resData, cb) {
    let reqList = []
    let resList = []
    resData.map(item => {
      reqList.push(axios.post(apis[item['urlKey']].url, item.data || {}))
    })

    let res = await Promise.all(reqList)
    res.map(item => {
      resList.push(item.data)
    })
    //  具体的判断 code 为哪种  才返回真正的函数
    cb && cb(resList)
    // axios.all(reqList).then(axios.spread((...datas)=>{
    // }))
  }

}
export default api