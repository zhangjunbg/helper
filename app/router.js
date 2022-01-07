'use strict';

module.exports = (app) => {
  const { controller } = app;
  app.get('/setAllFileNames', controller.file.setAllFileNames);
  app.get('/getAllFiles', controller.file.getAllFiles);
  app.get('/pdf2pic2', controller.book.pdf2pic2);
  app.get('/upperAllNames', controller.file.upperAllNames);
};
