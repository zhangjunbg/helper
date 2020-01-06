let newApiObj;
module.exports = {
  formatApi(apis) {
    
    if (!newApiObj) {
      newApiObj = {};
      let item;
      for (let key in apis) {
        item = apis[key];
        if (!item.url) continue;
        newApiObj[item.url] = item;
        // delete newApiObj[item.url].url;
      }
    }
    
    return newApiObj;
  }
};
