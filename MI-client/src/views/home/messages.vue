<template>
  <group>
    <cell-box v-for="(item, index) in messages" @click.native="doChat(item)">
      <div class="message-list-item">
        <div class="message-list-content">
          <div class="message-list-content-top">
            <div class="message-list-text">
              <strong
                class="message-list-nickname message-list-text float-left">
                {{item.msgListInfo.nickname}}
              </strong>
              <span class="message-list-time-date message-list-text float-right text-color">
                {{item.latestMsg.time | messageTime}}
              </span>
              <div class="clearfix"></div>
            </div>
          </div>
          <div class="message-list-content-bottom">
            <div class="message-list-text has-tip">
              <p class="message-list-value text-ellipsis">
                {{item.latestMsg.msg}}
              </p>
              <span class="message-list-tip" v-show="item.msgListInfo.not_read">
                {{item.msgListInfo.not_read}}
              </span>
            </div>
          </div>
        </div>
        <div class="message-list-avatar">
          <img :src="item.msgListInfo.avatar | avatarLocation">
        </div>
      </div>
    </cell-box>
  </group>
</template>

<script>
  import {CellBox, Group} from 'vux'
  import {avatarLocation, messageTime} from '@/filters'
  import {mapGetters} from 'vuex'

  export default {
    components: {
      CellBox, Group
    },
    computed: {
      ...mapGetters(['messages'])
    },
    filters: {
      avatarLocation, messageTime
    },
    methods: {
      doChat({index, msgList, msgListInfo}){
        this.$store.commit('SET_MSG_IN_CHAT', {
          index, msgList, msgListInfo
        });
        this.$router.push({path: `/chat/${msgListInfo._id}`});
      }
    }
  }
</script>
