'use strict';
const fs = require('fs');
const egg = require('egg');
const pdfData = require('../data/pdf');
const oldPath = '/Volumes/Lily/resource/On_Our_Way_to_English/pdf';
const PDFParser = require('pdf2json');
var allFile = {};
module.exports = class MiniController extends egg.Controller {
  pdfParser(ctx) {
    this.pdfParser2(0);
    ctx.body = {};
  }
  pdfParser2(index) {
    let temp = pdfData[index];
    let filePath = temp ? oldPath + temp : null;
    if (filePath) {
      const pdfParser = new PDFParser();
      pdfParser.on('pdfParser_dataError', (errData) => console.error(errData.parserError));
      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        console.log(pdfData);
        let { Width, Height } = pdfData.Pages[0];
        allFile[temp] = { width: Width, height: Height };
        console.log(temp);
        this.pdfParser2(++index);
      });
      pdfParser.loadPDF(filePath);
    } else {
      console.log(JSON.stringify(allFile));
    }
  }
};
