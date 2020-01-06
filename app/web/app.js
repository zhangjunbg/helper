import Vue from 'vue';
import {
  sync
} from 'vuex-router-sync';
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(Mint);
import router from 'router'
import store from './store'
import {
  getToken
} from '@/utils/auth'
import * as filters from './filters' // global filters
import api from '@/utils/http';
import $ from "jquery";

window.$ = $;
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false
export default class App {
  constructor(config) {
    this.config = config;
  }
  initServer() {
    if (EASY_ENV_IS_NODE) {
      return this.server();
    }
    return this.client();
  }
  create() {
    const {
      index,
      options
    } = this.config;
    sync(store, router);
    return {
      ...index,
      ...options,
      router,
      store,
      render: h => h(index)
    };
  }

  client() {
    const options = this.create();
    const app = new Vue(options);
    // 发送post 请求
    Vue.prototype.$post = function (...params) {
      api.post(app, ...params)
    }
    Vue.prototype.$postAll = function (...params) {
      api.postAll(app, ...params)
    }
    const message = Vue.prototype.$message;
    Vue.prototype.$message = param => {
      param.duration = 1000
      message(param)
    }
    Vue.prototype.getUsername = function () {
      return getToken()
    }
    app.$mount('#app');
    return app;
  }
  server() {
    return context => {
      const options = this.create();
      const {
        store,
        router
      } = options;
      router.push(context.state.url);
      return new Promise((resolve, reject) => {
        router.onReady(() => {
          const matchedComponents = router.getMatchedComponents();
          if (!matchedComponents) {
            return reject({
              code: '404'
            });
          }
          return Promise.all(
            matchedComponents.map(component => {
              if (component.preFetch) {
                return component.preFetch(store);
              }
              return null;
            })
          ).then(() => {
            context.state = {
              ...store.state,
              ...context.state
            };
            return resolve(new Vue(options));
          });
        });
      });
    };
  }

}