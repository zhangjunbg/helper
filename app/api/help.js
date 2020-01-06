const newApi = require("./index")
var returnApi = {};
var returnApi2 = {};
let k;
function getAuthBtn(authArr) {

  let t1, t2 = {};
  for (let i = 0; i < authArr.length; i++) {
    t1 = authArr[i];
    if (!t1.isMenu && returnApi[t1.menuCode]) {
      t2[returnApi[t1.menuCode]] = true;
    }
    if (t1.children && t1.children.length) {
      t2 = {
        ...t2,
        ...getAuthBtn(t1.children)
      };
    }
  }
  return t2;
}
for (var key in newApi) {
  k = newApi[key];
  if (k&&k.keyCode) {
    returnApi[k.keyCode] = k.url;
    returnApi2[k.url] = true;
  }
}
module.exports = function formatApi(userMenu){
  let abc = getAuthBtn(userMenu);
  return abc;
}