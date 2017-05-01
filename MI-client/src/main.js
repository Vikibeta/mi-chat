// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import FastClick from 'fastclick'
import Axios from 'axios'
import io from 'socket.io-client'

import router from './router'
import store from './store'
import ramPolyfill from './utils/requestAnimationFramePolyfill';
import { ToastPlugin, cookie, ConfirmPlugin } from 'vux'

import './assets/css/neat-min.css'
import './assets/css/style.less'

ramPolyfill();  // requestAnimationFrame的Polyfill

Vue.config.productionTip = false;

Vue.use(ToastPlugin);
Vue.use(ConfirmPlugin);

Axios.defaults.params = {
  token: cookie.get('mi_afdaefe95e9d7e12') || ''
};

Vue.prototype.$http = Axios;
Vue.prototype.$io = io;

FastClick.attach(document.body);

router.beforeEach((to, from, next) => {
  // socket断线重连  登录，注册，忘记密码页面除外
  // 刷新页面重新获取个人信息
  if(to.path !== ('/login' || '/register' || '/forget') && store.state.socketModule.socket === null) {
    let token = cookie.get('mi_afdaefe95e9d7e12') || '';
    if(token === '') next('/login');
    else {
      store.dispatch('GET_USER');
      store.dispatch('SOCKET_CON', token);
    }
  }
  next();
});

/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router: router,
  store: store,
  template: '<App/>',
  components: { App }
});

vm.__proto__.$toast = function (value, back) {
  vm.$vux.toast.show({
    type: 'text',
    position: 'middle',
    text: value
  });

  setTimeout(() => {
    vm.$vux.toast.hide();
    if(back) router.go(-1);
  },2000);
};


