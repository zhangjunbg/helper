"use strict";
const path = require("path");
const fs = require("fs");
module.exports = app => {
  let startTime = new Date();
  const exports = {};
  exports.siteFile = {
    "/favicon.ico": fs.readFileSync(
      path.join(app.baseDir, "app/web/assets/images/favicon.ico")
    )
  };

  exports.vuessr = {
    layout: path.join(app.baseDir, "app/web/index.html"),
    renderOptions: {
      basedir: path.join(app.baseDir, "app/view")
    }
  };

  exports.sessionRedis = {
    enable: true,
    package: "egg-session-redis"
  };
  exports.session = {
    key: 'SESSIONID',
    // maxAge: 24 * 60 * 60 * 1000, // 1 天
    maxAge: 60 * 60 * 1000, // 1 小时
    httpOnly: true,
    encrypt: true,
  };

  exports.logger = {
    consoleLevel: "ERROR",
    dir: path.join(app.baseDir, "logs"),
    appLogName: `${app.name}-web.log`,
    coreLogName: "egg-web.log",
    agentLogName: "egg-agent.log",
    errorLogName: "common-error.log"
  };
  exports.static = {
    prefix: "/public/",
    dir: path.join(app.baseDir, "public")
  };

  exports.keys = "123456";

  exports.security = {
    csrf: {
      ignoreJSON: false,
      cookieName: "csrfToken",
      sessionName: "csrfToken",
      // useSession: true,
      headerName: "x-csrf-token"
    },
    xframe: {
      enable: false
    }
  };
  // exports.middleware = ["locals", "access", "auth"];
  exports.middleware = ["locals", "access"];
  return exports;
};