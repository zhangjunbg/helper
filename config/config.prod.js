const path = require('path');
const ip = require('ip');
module.exports = app => {
  const exports = {};

  exports.view = {
    cache: false
  };

  exports.static = {
    maxAge: 0 // maxAge 缓存，默认 1 年
  };

  exports.development = {
    watchDirs: [], // 指定监视的目录（包括子目录），当目录下的文件变化的时候自动重载应用，路径从项目根目录开始写
    ignoreDirs: ['app/web', 'public', 'config/manifest.json'] // 指定过滤的目录（包括子目录）
  };

  exports.logview = {
    dir: path.join(app.baseDir, 'logs')
  };

  // exports.webpack = {
  //   // browser: 'http://localhost:7001',
  //   // webpackConfigList: require('easywebpack-vue').getWebpackConfig()
  // };

  const localIP = ip.address();
  const domainWhiteList = [];
  [7001, 9000, 9001].forEach(port => {
    domainWhiteList.push(`http://localhost:${port}`);
    domainWhiteList.push(`http://127.0.0.1:${port}`);
    domainWhiteList.push(`http://${localIP}:${port}`);
  });

  exports.security = {
    domainWhiteList
  };
  exports.httpConfig = {
    // host:'http://10.21.22.44:8980'
    host: 'http://10.21.38.124:19022/manageService'
    // host: 'http://127.0.0.1:3000/manageService'
  }

  // 加解密的配置
  exports.decodeConfig = {
    pubKey: path.join(app.baseDir, "config/dev/rsa_2048_pub.pem"), // 公钥
    priKey: path.join(app.baseDir, "config/dev/rsa_2048.pem"), // 私钥
  }

  exports.redis = {
    client: {
      port: 6379, // Redis port
      host: "47.110.80.94", // Redis host
      password: "123456",
      db: 0
    },
    agent: true
  };
  // app.logger.info("**************&&&&&&&&    prod    &&&&&&&&&&&*************************");

  return exports;
};