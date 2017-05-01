/**
 * Created by lavyun on 2017/4/18.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
import io from 'socket.io-client'

export default {
  state: {
    socket: null,
  },
  getters: {
    socket: state => state.socket
  },
  mutations: {
    ['SET_SOCKET'](state, socket){
      state.socket = socket;
    },
    ['SOCKET_CLOSE'](state, socket) {
      state.socket.close();
      state.socket = null;
    }
  },
  actions: {
    ['SOCKET_CON']({commit}, token){

      // socket连接
      const socket = io(`http://localhost:3000?token=${token}`);

      commit('SET_SOCKET', socket);

      socket.on('hello',function () {
        console.log('hello');
      });
    }
  }
}
