<template>
  <div>
    <div class="header chat-header " style="padding: 4px 0">
      <span class="header-back text-left" @click="$router.push({path:'/home'})">
        <i class="iconfont icon-back"></i>
      </span>
      <div class="chat-header-content text-center">
        <p class="chat-header-nickname">{{messages.msgInfo.nickname}}</p>
        <p class="chat-header-online">{{is_online}}</p>
      </div>
      <span class="header-icon iconfont text-right icon-people"></span>
    </div>

    <div class="view-wrap chat-view">
      <div class="chat-view-wrap scrollbar" id="scroll">
        <div v-for="(item, index) in messages.msgList" class="chat-box"
             :class="{left: item.from === toID, right: item.from !== toID}">
          <div class="chat-box-top">
            <div class="chat-box-avatar">
              <img :src="(item.from === toID ? messages.msgInfo.avatar : $store.state.user.avatar) | avatarLocation">
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

  export default {
    data(){
      return {
        socket: null,
        message: '',
        toID: '',
        is_online: ''
      }
    },
    filters: {
      messageTime,
      avatarLocation
    },
    computed: {
      ...mapGetters({
        me_id: 'me_id',
        messages: 'msg_in_chat'
      })
    },
    mounted(){

      textPastePolyfill(this.$refs.input);

      const _this = this;

      const toID = this.$route.params.to;
      this.toID = toID;

      // 得到在线状态
      this.getOnlineStatus();

      const socket = this.$store.state.socketModule.socket;
      this.socket = socket;

      socket.emit('joinPrivateChat', toID);

      // token验证没通过时的前端处理
      socket.on('err', function () {
        console.log('error');
      });

      // 接收消息
      socket.on('message', function (data) {
        _this.messages.push(data);
      });

      // 自己发送消息时 接收服务端时间
      socket.on('syncTime', function (time) {
        _this.messages.push({
          msg: _this.message,
          from: _this.me_id,
          time: time
        });

        _this.scrollBottom();
      })
    },
    methods: {
      getOnlineStatus(){
        this.$http.get(`/api/user/${this.toID}/is_online`).then(({data}) => {
          var {code, data} = data;
          if (code === '0') {
            this.is_online = data === 0 ? '离线' : '在线'
          }
        })
      },
      scrollBottom(){
        const scrollPanel = document.getElementById('scroll');
        this.$nextTick(function () {

          // 有scrollPanel.scrollTop === scrollPanel.scrollHeight - (document.body.clientHeight - header - input_area)的关系;
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
      }
    },
    beforeRouteLeave(to, from, next){
      this.socket.emit('leavePrivateChat');
      next();
    }
  }
</script>
