'use strict';

module.exports = (app) => {
  const { controller } = app;
  app.get('/removeImgsMargin', controller.split.removeImgsMargin);
  app.get('/splitImgs', controller.split.splitImgs);
  // 批量移动文件
  app.get('/moveFiles', controller.move.moveFiles);
  
};
