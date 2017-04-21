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
    msg_in_chat: {},
    contacter_is_online: "",
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
        let from_and_to = value._id.split('-');

        //格式化msg的from，因为数据库中的from是's'或者'l'，格式化成id
        let msgList = value.messages.map(function (value) {
          value.from = value.from === 's' ? from_and_to[0] : from_and_to[1];
          return value;
        });
        let msgListInfo = value.small_id_info._id === id ? value.large_id_info : value.small_id_info;

        temp.push({
          to_Id: msgListInfo._id,
          msgList,
          msgListInfo,
          msgListLen: msgList.length,
          latestMsg: msgList[0]
        })
      });
      return temp;
    },
    has_get: state => state.has_get,
    msg_in_chat: state => state.msg_in_chat,
    contacter_is_online: state => state.contacter_is_online
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
    },
    ['SET_MSG_IN_CHAT'](state, msg_in_chat) {
      state.msg_in_chat = msg_in_chat;
    },
    ['SET_CONTACTER_IS_ONLINE'](state, is_online) {
      state.contacter_is_online = is_online
    }
  },
  actions: {
    ['GET_USER']({commit}) {
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
