<template>
  <group>
    <cell-box v-for="(item, index) in messages" @click="doChat(item._id)" :key="index">
      <div class="message-list-item">
        <div class="message-list-content">
          <div class="message-list-content-top">
            <div class="message-list-text">
              <strong class="message-list-nickname message-list-text float-left">{{item.nickname}}</strong>
              <span class="message-list-time-date message-list-text float-right text-color">{{item.time}}</span>
              <div class="clearfix"></div>
            </div>
          </div>
          <div class="message-list-content-bottom">
            <div class="message-list-text has-tip">
              <p class="message-list-value text-ellipsis">{{item.msgTopic}}</p>
              <span class="message-list-tip">{{item.msgCount}}</span>
            </div>
          </div>
        </div>
        <div class="message-list-avatar">
          <img :src="item.avatar | avatarLocation">
        </div>
      </div>
    </cell-box>
  </group>
</template>

<script>
  import {CellBox, Group} from 'vux'
  import {avatarLocation} from '../filters'

  export default {
    data(){
      return {
        messages: [{
          _id: '123456',
          nickname: '往事随风',
          msgTopic: '呵呵',
          time: '2017-10-12',
          msgCount: 12,
          avatar: 'default1.jpg'
        },{
          _id: '123456',
          nickname: '往事随风',
          msgTopic: '呵呵',
          time: '2017-10-12',
          msgCount: 12,
          avatar: 'default2.jpg'
        }]
      }
    },
    beforeRouteEnter(to, from, next){
      document.body.className = 'body-auto';
      next()
    },
    beforeRouteLeave(to, from, next){
      document.body.className = '';
      next();
    },
    filters:{
      avatarLocation
    },
    components: {
      CellBox,
      Group
    },
    methods: {
      doChat(id) {
        this.$router.push({path: `/chat/${id}`})
      }
    }
  }
</script>
