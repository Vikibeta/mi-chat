/**
 * Created by lavyun on 2017/4/15.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex);

import socketModule from './socketModule'

const store = new Vuex.Store({
  state: {
    user: {
      _id: '',
      avatar: 'default.jpg'
    },
    contacts: []
  },
  getters: {
    contacts: state => state.contacts,
    user: state => state.user,
    me_id: (state, getters) => getters.user._id
  },
  mutations: {
    ['SET_USER'](state, user){
      state.user = user;
    },
    ['SET_CONTACTS'](state, contacts){
      state.contacts = contacts;
    }
  },
  actions: {
    ['GET_USER']({commit}, token) {
      axios.get('/api/user').then(({data}) => {
        var {code, data} = data;
        if (code === '0') {
          commit('SET_USER', data);
        }
      })
    }
  },
  modules: {
    socketModule: socketModule
  }
});

export default store;
