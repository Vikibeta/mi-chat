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

var calculateOnlineCount = function (groupArray) {
  for (let i = 0, len1 = groupArray.length; i < len1; i++) {

    let contactsArray = groupArray[i].contacts;
    let onlineCount = 0;

    for (let j = 0, len2 = contactsArray.length; j < len2; j++) {
      if (contactsArray[j].is_online === 0) {
        break;
      }
      onlineCount++;
    }

    groupArray[i].onlineCount = onlineCount;
  }
};

const store = new Vuex.Store({
  modules: {
    socketModule: socketModule
  },
  state: {
    // 个人的信息
    user: {
      _id: '',
      avatar: 'default.jpg',
      groups: ['']
    },
    // 联系人列表
    contacts: null,
    // 未做修改的messages,即从后台获取的
    native_messages: [],
    // 消息列表
    messages: [],
    // 聊天页的消息显示列表
    msg_in_chat: {
      msgList: [],
      msgListInfo: {
        nickname: '',
        avatar: '',
        is_online: -1
      }
    },
    // 对方是否在线
    contacter_is_online: "",
    // contacts和messages是否已经获取过
    has_get: {
      contacts: false,
      messages: false
    }
  },
  getters: {
    user: state => state.user,
    user_in_setting: (state, getters) => {
      const user = getters.user;

      return {
        nickname: user.nickname,
        birth: user.birth,
        company: user.company || '',
        profession: user.profession || '',
        signature: user.signature || ''
      }
    },
    me_id: (state, getters) => getters.user._id,
    avatar: (state, getters) => getters.user.avatar,
    groups:(state, getters) =>{
      var g = getters.user.groups;
      var defaultG = g[0];
      return ({ g, defaultG });
    },
    contacts: state => state.contacts,
    messages: (state, getters) => {
      if (state.messages.length === 0) {
        let id = getters.me_id;
        let native_messages = state.native_messages;
        let temp = [];

        native_messages.forEach(function (value, index) {
          let from_and_to = value._id.split('-');

          //格式化msg的from，因为数据库中的from是's'或者'l'，格式化成id
          let msgList = value.messages.map(function (value) {
            value.from = value.from === 's' ? from_and_to[0] : from_and_to[1];
            return value;
          });
          let msgListInfo = value.small_id_info._id === id ? value.large_id_info : value.small_id_info;

          temp.push({
            index,
            to_Id: msgListInfo._id,
            msgList,
            msgListInfo,
            latestMsg: msgList[msgList.length - 1]
          })
        });

        state.messages = temp;
      }

      return state.messages;
    },
    has_get: state => state.has_get,
    msg_in_chat: state => state.msg_in_chat,
    contacter_is_online: state => state.contacter_is_online
  },
  mutations: {
    ['SET_USER'](state, user) {
      state.user = user;
    },
    ['UPDATE_USER'](state, user) {
      const _user = state.user;

      for (let i in user) {
        if (user.hasOwnProperty(i)) {
          _user[i] = user[i];
        }
      }
    },
    ['SET_CONTACTS'](state, contacts) {
      state.contacts = contacts;
      // 已经获取过联系人了，之后再访问contacts组件时不会做http
      state.has_get.contacts = true;
    },
    ['SET_MESSAGES'](state, native_messages) {
      state.native_messages = native_messages;
      state.has_get.messages = true;
    },
    ['SET_MSG_IN_CHAT'](state, msg_in_chat) {
      state.msg_in_chat = msg_in_chat;
    },
    ['SET_CONTACTER_IS_ONLINE'](state, is_online) {
      state.contacter_is_online = is_online
    },
    // 更新未读消息列表的顺序和内容
    ['UPDATE_MESSAGES_INDEX'](state, msg){
      const index = msg.index;
      const messages = state.messages;

      // 表示这个联系人不在未读消息的联系人列表中
      if (index === messages.length) {
        state.messages.splice(0, 0, msg);
        return;
      }

      state.messages.splice(index, 1);
      state.messages.splice(0, 0, msg);
    },
    ['UPDATE_CONTACTS'](state, contact) {
      const group_name = contact.group_name;
      const contact_info = contact.contact_info;
      const is_online = contact_info.is_online;
      const contacts = state.contacts;

      for (let i = 0; i < contacts.length; i++) {
        if (group_name === contacts[i].group_name) {
          if (is_online === 1) {
            state.contacts[i].onlineCount++;
          }

          state.contacts[i].contacts.push(contact_info);
        }
      }
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
    },
    ['GET_CONTACTS']({commit}) {
      axios.get('/api/contacts').then(({data}) => {
        var {code, data} = data;
        if (code === '0') {
          calculateOnlineCount(data);
          commit('SET_CONTACTS', data);
        }
      });
    },
    ['GET_MESSAGES']({commit}) {
      axios.get('/api/messages').then(({data}) => {
        var {code, data} = data;
        if (code === '0') {
          commit('SET_MESSAGES', data);
        }
      })
    },
    ['GET_MESSAGES_AND_CONTACTS_IN_CHAT']({commit, getters}, id){
      axios.get('/api/messages').then(({data}) => {
        var {code, data} = data;
        if (code === '0') {
          commit('SET_MESSAGES', data);
          var messages = getters.messages;
          var msg_in_chat = {
            msgList: [],
            msgListInfo: {}
          };
          for (let i = 0, len = messages.length; i < len; i++) {
            if (messages[i].to_Id === id) {
              msg_in_chat.msgList = messages[i].msgList;
              msg_in_chat.index = i;
            }
          }
          axios.get(`/api/user/${id}/?nickname=1&avatar=1&is_online=1`,).then(({data}) => {
            var {code, data} = data;
            if (code === '0') {
              msg_in_chat.msgListInfo = data;
            }
            commit('SET_MSG_IN_CHAT', msg_in_chat);
          })
        }
      })
    }
  }
});

export default store;
