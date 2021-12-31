'use strict';

module.exports = (app) => {
  const { controller } = app;
  app.get('/setAllFileNames', controller.file.setAllFileNames);
  app.get('/', controller.file.getAllFiles);
};
