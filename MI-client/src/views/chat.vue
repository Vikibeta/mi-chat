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
             :class="{left: item.from === to_Id, right: item.from !== to_Id}">
          <div class="chat-box-top">
            <div class="chat-box-avatar">
              <img :src="item.from === to_Id ? messages.msgListInfo.avatar : $store.state.user.avatar | avatarLocation">
            </div>
            <div class="chat-box-content" v-html="item.msg"></div>
            <div class="clearfix"></div>
          </div>
          <span class="chat-box-time">{{item.time | messageTime}}</span>
        </div>

        <!--<div v-for="i in 100" class="chat-box left">-->
        <!--<div class="chat-box-top">-->
        <!--<div class="chat-box-avatar">-->
        <!--<img src="http://placehold.it/50x50">-->
        <!--</div>-->
        <!--<div class="chat-box-content">{{i}}</div>-->
        <!--<div class="clearfix"></div>-->
        <!--</div>-->
        <!--<span class="chat-box-time">sss</span>-->
        <!--</div>-->

        <div style="height: 20px;"></div>
      </div>

    </div>

    <div class="input_area">
      <div class="input_area-input-wrap">
        <div class="input_area-input-wrap2">
          <div class="scrollbar input_area-input" contenteditable="true" ref="input"></div>
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
  import {mapGetters} from 'vuex'
  import textPastePolyfill from '../utils/textPaste';
  import {BODY_FIXED} from '../mixins'

  export default {
    mixins: [BODY_FIXED],
    data(){
      return {
        socket: null,
        message: '',
        to_Id: '',
        is_online: ''
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
    created(){
      this.to_Id = this.$route.params.to;

      const contacts = this.$store.getters.contacts;

      // 重新刷新本页后的操作
      if (contacts === null) {
        this.$store.dispatch('GET_MESSAGES_AND_CONTACTS_IN_CHAT', this.to_Id);
      }
    },
    mounted(){
      const _this = this;

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

      socket.emit('joinPrivateChat', _this.to_Id);

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
          this.$http.get(`/api/user/${this.to_Id}/?is_online=1`).then(({data}) => {
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
          const targetScrollTop = scrollHeight - (clientHeight - 84);
          const scrollTopDuration = (targetScrollTop - currentScrollTop) / 10;


          function toBottom() {
            scrollPanel.scrollTop += scrollTopDuration;
            if (scrollPanel.scrollTop < targetScrollTop) {
              requestAnimationFrame(toBottom)
            }
          }

          requestAnimationFrame(toBottom);

        })
      },
      sendMessage(){
        const message = this.$refs.input.innerHTML;
        this.message = message;
        this.$refs.input.innerHTML = '';
        this.socket.emit('message', message);
      },
      setNotReadToZero(){
        this.$http.post(`/api/messages/not_read_to_zero/${this.to_Id}`);
      }
    },
    beforeRouteLeave(to, from, next){
      const msgListLen = this.messages.msgList.length;

      // 离开聊天页后端就将to_id的未读消息数量置零
      // 针对正在聊天时对方发来消息后离开页面
      this.setNotReadToZero();

      // 前端将to_id的未读消息数量置零
      this.messages.msgListInfo.not_read = 0;

      // 与该联系人的消息记录排在第一位
      this.$store.commit('UPDATE_MESSAGES_INDEX', {
        to_Id: this.to_Id,
        latestMsg: this.messages.msgList[msgListLen - 1],
        ...this.messages,
      });

      this.socket.emit('leavePrivateChat');
      next();
    }
  }
</script>
