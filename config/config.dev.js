const path = require('path');
const ip = require('ip');
module.exports = (app) => {
  const exports = {};
  exports.logview = {
    dir: path.join(app.baseDir, 'logs'),
  };
  const localIP = ip.address();
  const domainWhiteList = [];
  [7001, 9000, 9001].forEach((port) => {
    domainWhiteList.push(`http://localhost:${port}`);
    domainWhiteList.push(`http://127.0.0.1:${port}`);
    domainWhiteList.push(`http://${localIP}:${port}`);
  });

  exports.security = {
    domainWhiteList,
  };

  return exports;
};
