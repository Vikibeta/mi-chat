/**
 * Created by lavyun on 2017/4/15.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    id: '',
    contacts: []
  },
  getters: {
    contacts: state => state.contacts
  },
  mutations: {
    setID(state, id){
      state.id = id;
    },
    ['SET_CONTACTS'](state, contacts){
      state.contacts = contacts;
    }
  }
});

export default store;
