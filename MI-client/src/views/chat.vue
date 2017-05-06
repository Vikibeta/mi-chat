<template>
  <div>
    <div class="header chat-header " style="padding: 4px 0">
      <span class="header-back text-left" @click="$router.push({path:'/home/messages'})">
        <i class="iconfont icon-back"></i>
      </span>
      <div class="chat-header-content text-center">
        <p class="chat-header-nickname">{{messages.msgListInfo.nickname}}</p>
        <p class="chat-header-online">
          {{messages.msgListInfo.is_online !== undefined ? messages.msgListInfo.is_online : is_online | onlineText}}
        </p>
      </div>
      <span class="header-icon iconfont text-right icon-people"></span>
    </div>

    <div class="view-wrap chat-view">
      <div class="chat-view-wrap scrollbar" id="scroll">
        <div v-for="(item, index) in messages.msgList" class="chat-box"
             :class="{left: item.from === to_id, right: item.from !== to_id}">
          <div class="chat-box-top">
            <div class="chat-box-avatar">
              <img :src="item.from === to_id ? messages.msgListInfo.avatar : $store.state.user.avatar | avatarLocation">
            </div>
            <div class="chat-box-content" v-html="item.msg"></div>
            <div class="clearfix"></div>
          </div>
          <span class="chat-box-time">{{item.time | messageTime}}</span>
        </div>
        <div style="height: 20px;"></div>
      </div>

    </div>

    <div class="input_area">
      <div class="input_area-input-wrap">
        <div class="input_area-input-wrap2">
          <div class="scrollbar input_area-input" contenteditable="true" ref="input" @click="handleKeyboardPop"></div>
        </div>
      </div>
      <div class="input_area-btn-wrap">
        <div class="input_area-btn" @click="sendMessage">发送</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {messageTime, avatarLocation} from '../filters'
  import {mapGetters, mapState} from 'vuex'
  import textPastePolyfill from '../utils/textPaste';
  import {BODY_FIXED} from '../mixins'

  export default {
    mixins: [BODY_FIXED],
    data(){
      return {
        socket: null,
        message: '',
        to_id: '',
        is_online: '',
        has_input: false,  // 是否输入过
        is_pass_router_validate: true //是否经过离开的路由钩子的验证
      }
    },
    filters: {
      messageTime,
      avatarLocation,
      onlineText(value){
        if (value === -1) {
          return '';
        }
        return value === 0 ? '离线' : '在线'
      }
    },
    computed: {
      ...mapGetters({
        me_id: 'me_id',
        messages: 'msg_in_chat'
      })
    },
    watch: {
      me_id(value){
        this.validate(value);
      }
    },
    created(){
      this.to_id = this.$route.params.to;

      const contacts = this.$store.getters.contacts;

      // 重新刷新本页后的操作
      if (contacts === null) {
        this.$store.dispatch('GET_MESSAGES_AND_CONTACTS_IN_CHAT', this.to_id);
      }
    },
    mounted(){
      const _this = this;

      // 验证是不是跟自己聊天，是不是自己的好友
      if (this.me_id) this.validate(this.me_id);

      // 一进入聊天页后端就将to_id的未读消息数量置零
      // 针对用户直接关闭浏览器的情况，不会触发离开路由的函数
      this.setNotReadToZero();

      // 输入框的复制事件兼容处理
      textPastePolyfill(this.$refs.input);

      // 得到在线状态
      this.getOnlineStatus();

      const socket = this.$store.state.socketModule.socket;
      this.socket = socket;

      // 进入聊天页时默认滚动条在底部
      const scrollPanel = document.getElementById('scroll');
      scrollPanel.scrollTop = scrollPanel.scrollHeight;
//      console.log(scrollPanel.scrollTop);
//      console.log(scrollPanel.scrollHeight);
//      setTimeout(function () {
//        scrollPanel.scrollTop = scrollPanel.scrollHeight;
//      },500);

      socket.emit('joinPrivateChat', _this.to_id);

      // token验证没通过时的前端处理
      // 使用off解绑，不然会重复触发
      socket.off('err');
      socket.on('err', function () {
        console.log('error');
      });

      // 接收消息
      socket.off('message');
      socket.on('message', function (data) {
        _this.messages.msgList.push(data);
        _this.scrollBottom();
      });


      // 自己发送消息时 接收服务端时间
      socket.off('syncTime');
      socket.on('syncTime', function (time) {
        _this.messages.msgList.push({
          msg: _this.message,
          from: _this.me_id,
          time: time
        });
        _this.scrollBottom();
      })
    },
    methods: {
      getOnlineStatus(){
        var is_online = this.messages.msgListInfo.is_online;
        // 如果不存在就通过api查询，针对从未读消息页进入的情况
        if (is_online === undefined) {
          this.$http.get(`/api/user/${this.to_id}/?is_online=1`).then(({data}) => {
            var {code, data} = data;
            if (code === '0') {
              this.is_online = data.is_online;
            }
          })
        }
      },
      scrollBottom(){
        const scrollPanel = document.getElementById('scroll');
        this.$nextTick(function () {

          // 有scrollPanel.scrollTop
          // === scrollPanel.scrollHeight - (document.body.clientHeight - header - input_area)的关系;
          const clientHeight = document.body.clientHeight;
          const currentScrollTop = scrollPanel.scrollTop;
          const scrollHeight = scrollPanel.scrollHeight;
          const scrollTopDuration = (scrollHeight - (clientHeight - 84) - currentScrollTop) / 10;


          let raf_id = null;
          let targetScrollTop = scrollHeight;

          function toBottom() {
            targetScrollTop = scrollPanel.scrollTop;
            scrollPanel.scrollTop += scrollTopDuration;
            if (scrollPanel.scrollTop !== targetScrollTop) {
              raf_id = requestAnimationFrame(toBottom)
            } else {
                cancelAnimationFrame(raf_id);
            }
          }

          toBottom();
        })
      },
      sendMessage(){
        // 判断时候输入过，如果输入过，离开此页时，该聊天消息排在所有消息的第一位
        if (this.has_input === false) this.has_input = true;

        const message = this.$refs.input.innerHTML;
        this.message = message;
        this.$refs.input.innerHTML = '';
        this.socket.emit('message', message);
      },
      setNotReadToZero(){
        this.$http.post(`/api/messages/not_read_to_zero/${this.to_id}`);
      },
      validate(me_id){
        if (me_id === this.to_id) {
          this.is_pass_router_validate = false;
          this.$router.push({path: '/home/messages'});
        }
      },
      handleKeyboardPop(){
        setTimeout(()=>{   // 输入框弹起后，聊天页滚动到最底部，500ms时间间隔。不然可能会在输入框弹起之前滚到了底部
            this.scrollBottom();
        },500);
      }
    },
    beforeRouteLeave(to, from, next) {
      if (this.is_pass_router_validate === false) next();
      else {
        const msgListLen = this.messages.msgList.length;

        // 离开聊天页后端就将to_id的未读消息数量置零
        // 针对正在聊天时对方发来消息后离开页面
        this.setNotReadToZero();

        // 前端将to_id的未读消息数量置零
        this.messages.msgListInfo.not_read = 0;

        // 如果输入过，与该联系人的消息记录排在第一位
        if(this.has_input === true) {
          this.$store.commit('UPDATE_MESSAGES_INDEX', {
            to_id: this.to_id,
            latestMsg: this.messages.msgList[msgListLen - 1],
            ...this.messages,
          });
        }

        this.socket.emit('leavePrivateChat');
        next();
      }
    }
  }
</script>
