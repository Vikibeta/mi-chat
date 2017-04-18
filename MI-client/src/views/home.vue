<template>
  <div>
    <div class="home-header">
      <div class="home-header-avatar">
        <img
          src="https://img.alicdn.com/imgextra/i3/1386405035427072941/TB2pEm.kypnpuFjSZFkXXc4ZpXa_!!0-saturn_solar.jpg_240x240xz.jpg_.webp">
      </div>
      <div class="button-bar">
        <span class="button-bar-item" @click="buttonBarActive=0" :class="{active:buttonBarActive === 0}">消息</span>
        <span class="button-bar-item" @click="buttonBarActive=1" :class="{active:buttonBarActive === 1}">联系人</span>
      </div>
      <div class="home-header-plus iconfont icon-add"></div>
    </div>

    <div class="home-list" style="margin-top: 44px;">
      <div class="home-search">
        <div class="home-search-wrap text-center">
          <span class="iconfont icon-search"> 搜索</span>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data(){
      return {
        buttonBarActive: 0
      }
    },
    mounted(){
      this.getContacts();
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
        this.$http.get('/api/contacts').then(({data}) => {
          var {code, data} = data;
          if (code === '0') {
            this.$store.commit('SET_CONTACTS', data);
          }
        })
      }
    }
  }
</script>
