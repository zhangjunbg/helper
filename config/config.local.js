const path = require('path');
const ip = require('ip');
const serEnv = process.env.NODE_ENV == 'development' ? process.env.npm_lifecycle_script.split('egg-bin dev ')[1] : process.argv[4];

module.exports = app => {
  const exports = {};
  exports.webpack = {
    browser: false,
  };
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
  //   // webpackConfigList: require('easywebpack-vue's).getWebpackConfig()
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
  // 加解密的配置
  exports.decodeConfig = {
    pubKey: path.join(app.baseDir, "config/dev/rsa_2048_pub.pem"), // 公钥
    priKey: path.join(app.baseDir, "config/dev/rsa_2048.pem"), // 私钥
  }
  // junjun
  exports.redis = {
    client: {
      port: 6379, // Redis port
      host: "47.110.80.94", // Redis host
      password: "123456",
      db: serEnv == 'admin' ? 0 : 1
    },
    agent: true
  };
  return exports;
};