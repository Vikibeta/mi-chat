// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import FastClick from 'fastclick'
import Axios from 'axios'
import IO from 'socket.io-client'

import router from './router'
import store from './store'
import ramPolyfill from './utils/requestAnimationFramePolyfill';
import { ToastPlugin } from 'vux'

import './assets/css/neat-min.css'
import './assets/css/style.css'

ramPolyfill();  // requestAnimationFrame的Polyfill

Vue.config.productionTip = false;

Vue.use(ToastPlugin);

Axios.defaults.params = {
  token: window.localStorage ? window.localStorage.getItem('MI-token') : ''
};

Vue.prototype.$http = Axios;
Vue.prototype.$io = IO;

FastClick.attach(document.body);

/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router: router,
  store: store,
  template: '<App/>',
  components: { App }
});

vm.__proto__.$toast = function (value) {
  vm.$vux.toast.show({
    type: 'text',
    position: 'middle',
    text: value
  });

  setTimeout(() => {
    vm.$vux.toast.hide();
  },2000);
};


