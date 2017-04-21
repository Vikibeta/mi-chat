<template>
  <group>
    <cell-box v-for="(item, index) in messages" @click="doChat(item._id)" :key="index">
      <div class="message-list-item">
        <div class="message-list-content">
          <div class="message-list-content-top">
            <div class="message-list-text">
              <strong
                class="message-list-nickname message-list-text float-left">
                {{item.messages_info.nickname}}
              </strong>
              <span class="message-list-time-date message-list-text float-right text-color">
                {{item.latest_message.time | messageTime}}
              </span>
              <div class="clearfix"></div>
            </div>
          </div>
          <div class="message-list-content-bottom">
            <div class="message-list-text has-tip">
              <p class="message-list-value text-ellipsis">
                {{item.latest_message.msg}}
              </p>
              <span class="message-list-tip" v-show="item.messages_info.not_read">
                {{item.messages_info.not_read}}
              </span>
            </div>
          </div>
        </div>
        <div class="message-list-avatar">
          <img :src="item.messages_info.avatar | avatarLocation">
        </div>
      </div>
    </cell-box>
  </group>
</template>

<script>
  import {CellBox, Group} from 'vux'
  import {avatarLocation, messageTime} from '../filters'
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapGetters(['messages'])
    },
    beforeRouteEnter(to, from, next){
      document.body.className = 'body-auto';
      next()
    },
    beforeRouteLeave(to, from, next){
      document.body.className = '';
      next();
    },
    filters: {
      avatarLocation,
      messageTime
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
