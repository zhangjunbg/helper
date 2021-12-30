'use strict';

module.exports = (app) => {
  const { controller } = app;
  app.get('/', controller.file.getAllFiles);
};
