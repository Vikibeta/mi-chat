<template>
  <div>
    <div class="header chat-header " style="padding: 4px 0">
      <span class="header-back text-left" onclick="$router.push({path:'/home'})"><i class="iconfont icon-back"></i></span>
      <div class="chat-header-content text-center">
        <p class="chat-header-nickname">往事随风</p>
        <p class="chat-header-online">在线</p>
      </div>
      <span class="header-icon iconfont text-right icon-people"></span>
    </div>

    <div class="view-wrap chat-view" >
      <div class="chat-view-wrap scrollbar" id="scroll">
        <div v-for="(item, index) in messages" class="chat-box"
        :class="{left: item.from === toID, right: item.from !== toID}">
        <div class="chat-box-top">
        <div class="chat-box-avatar">
        <img src="http://placehold.it/50x50">
        </div>
        <div class="chat-box-content">{{item.msg}}</div>
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
          <div class="input_area-input" contenteditable="true" ref="input"></div>
        </div>
      </div>
      <div class="input_area-btn-wrap">
        <div class="input_area-btn" @click="sendMessage">发送</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {messageTime} from '../filters'
  import {XButton} from 'vux'

  export default {
    data(){
      return {
        socket: null,
        messages: [],
        message: '',
        fromID: '',
        toID: ''
      }
    },
    components: {
      XButton
    },
    filters: {
      messageTime: messageTime
    },
    mounted(){
      const _this = this;

      const toID = this.$route.params.to;
      this.toID = toID;


      // todo 需要删除
      const fromID = this.$route.params.from;

// todo  需要保留     const fromID = this.$store.state.id;
      this.fromID = fromID;

      // 连接socket时带上token做验证
      const token = this.$http.defaults.params.token;
      this.socket = this.$io(`http://localhost:3000/private-chat-namespace?to=${toID}&token=${token}&from=${fromID}`);

      // token验证没通过时的前端处理
      this.socket.on('err', function () {
        console.log('error');
      });

      // 接收消息
      this.socket.on('message', function (data) {
        _this.messages.push(data);
//        _this.$refs.scroll.scrollTop = _this.$refs.scroll.scrollHeight;
      });

      // 自己发送消息时 接收服务端时间
      this.socket.on('syncTime', function (time) {
        _this.messages.push({
          msg: _this.message,
          from: _this.fromID,
          time: time
        });

        _this.scrollBottom();
      })
    },
    methods: {
      scrollBottom(){
        const scrollPanel = document.getElementById('scroll');
        this.$nextTick(function () {

          // scrollPanel.scrollTop = scrollPanel.scrollHeight - (document.body.clientHeight - header - input_area);
          const clientHeight = document.body.clientHeight;
          const currentScrollTop = scrollPanel.scrollTop;
          const scrollHeight = scrollPanel.scrollHeight;
          const targetScrollTop =  scrollHeight - (clientHeight - 84);
          const scrollTopDuration = (targetScrollTop - currentScrollTop) / 10;


          function toBottom() {
            scrollPanel.scrollTop += scrollTopDuration;
            if(scrollPanel.scrollTop < targetScrollTop) {
                requestAnimationFrame(toBottom)
            }
          }

          requestAnimationFrame(toBottom);

        })
      },
      sendMessage(){
        const message = this.$refs.input.innerText;
        this.message = message;
        this.$refs.input.innerText = '';
        this.socket.emit('message', message);
      },
    }
  }
</script>
