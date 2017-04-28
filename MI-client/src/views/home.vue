<template>
  <div class="home">
    <div class="home-header">
      <div class="home-header-avatar" @click="$router.push({path:'/user/44'})">
        <img :src="user.avatar | avatarLocation">
      </div>
      <div class="button-bar">
        <span class="button-bar-item" @click="buttonBarActive=0" :class="{active:buttonBarActive === 0}">消息</span>
        <span class="button-bar-item" @click="buttonBarActive=1" :class="{active:buttonBarActive === 1}">联系人</span>
      </div>
      <div class="home-header-plus iconfont icon-add" @click="$router.push({path: '/add'})"></div>
    </div>

    <div class="home-list" style="margin-top: 44px;">
      <div class="home-search">
        <div class="home-search-wrap text-center">
          <span class="iconfont icon-search">搜索</span>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {avatarLocation} from '../filters'
  export default {
    data(){
      return {
        buttonBarActive: 0
      }
    },
    computed: {
      ...mapGetters(['user', 'has_get'])
    },
    filters: {
      avatarLocation
    },
    mounted(){
      const path = this.$route.path;
      const subPath = path.substr(6);
      this.buttonBarActive = subPath === 'messages' ? 0 : 1;

      this.getContacts();
      this.getMessages();

    },
    watch: {
      buttonBarActive: function (status) {
        if (status === 0) {
          this.$router.push({path: '/home/messages'});
          return;
        }

        if (status === 1) {
          this.$router.push({path: '/home/contacts'});
          return;
        }
      }
    },
    methods: {
      getContacts(){
        // 如果之前没有获取过联系人，则获取，做一下缓存
        if (!this.has_get.contacts) {
          this.$store.dispatch('GET_CONTACTS');
        }
      },
      getMessages(){
        if (!this.has_get.messages) {
          this.$store.dispatch('GET_MESSAGES')
        }
      }
    }
  }
</script>
