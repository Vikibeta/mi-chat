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
    contacts: [],
    messages: [],
    has_get: {
      contacts: false,
      messages: false
    }
  },
  getters: {
    user: state => state.user,
    me_id: (state, getters) => getters.user._id,
    contacts: state => state.contacts,
    messages: (state, getters) => {
      let id = getters.me_id;
      let messages = state.messages;
      let temp = [];
      messages.forEach(function (value) {
        let messages_list = value.messages;
        let messages_length = value.messages.length;

        temp.push({
          messages_list,
          messages_length,
          messages_info: value.small_id_info._id === id ? value.large_id_info : value.small_id_info,
          latest_message: messages_list[messages_length - 1]
        })
      });
      return temp;
    },
    has_get: state => state.has_get
  },
  mutations: {
    ['SET_USER'](state, user) {
      state.user = user;
    },
    ['SET_CONTACTS'](state, contacts) {
      state.contacts = contacts;
      // 已经获取过联系人了，之后再访问contacts组件时不会做http
      state.has_get.contacts = true;
    },
    ['SET_MESSAGES'](state, messages) {
      state.messages = messages;
      state.has_get.messages = true;
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
