<template>
  <div class="user-add">
    <m-header title="添加好友" @on-back="$router.go(-1)"></m-header>
    <div class="view-wrap" style="padding-top: 20px">
      <div class="contacter-info">
        <div class="contacter-info-wrap">
          <img :src="user.avatar | avatarLocation" class="avatar">
          <div class="user-info">
            <p class="nickname"><strong>{{user.nickname}}</strong></p>
            <p>{{user.sex}}&nbsp;&nbsp;{{age}} 岁&nbsp;&nbsp;{{user.location}}</p>
          </div>
        </div>
      </div>

      <div class="group" style="margin-top: 20px;">
        <p class="text" style="padding-left: 15px;margin-bottom: 5px;">选择分组</p>
        <group>
          <radio :options="groups" v-model="defaultGroup"></radio>
        </group>
      </div>

      <div style="margin-top: 20px;padding: 0 10px;">
        <x-button type="warn" @click.native="doAdd">确 定</x-button>
      </div>
    </div>
  </div>
</template>

<script>
  import MHeader from '../components/header'
  import {Group, Radio, XButton} from 'vux'
  import {mapGetters} from 'vuex'
  import dataToQuery from '../utils/dataToQuery'
  import {avatarLocation} from '../filters'

  export default {
    components: {
      MHeader,
      Group,
      Radio,
      XButton
    },
    data(){
      return {
        contacter_id: '',
        user: {},
        groups: [],
        defaultGroup: ''
      }
    },
    filters: {
      avatarLocation
    },
    computed: {
      ...mapGetters(['me_id']),
      age(){
        const cYear = new Date().getFullYear();
        const birth = this.user.birth;
        const birthYear = birth && parseInt(birth.substr(0, 4));
        return cYear - birthYear + 1;
      }
    },
    created(){
      if (this.$store.state.contacts === null) {
        this.$store.dispatch('GET_CONTACTS');
      }
    },
    mounted(){
      this.getGroups();
      this.getUserInfo();
    },
    methods: {
      getGroups(){  // 获取分组信息
        const groups = this.$store.state.groups;
        // 如果vuex中已经有groups信息了，就从vuex中拿
        if (groups.length === 0) {
          this.$http.get('/api/user/groups').then(({data}) => {
            var {code, data} = data;
            if (code === '0') {
              this.groups = data;
              this.defaultGroup = data[0];
              this.$store.commit('SET_GROUPS', data);
            }
          })
        } else {
          this.groups = groups;
          this.defaultGroup = groups[0];
        }
      },
      getUserInfo(){  // 获取联系人信息
        this.contacter_id = this.$route.params.id;
        const data = ['avatar', 'location', 'sex', 'birth', 'nickname', 'is_online'];
        this.$http.get(`/api/user/${this.contacter_id}/?${dataToQuery(data)}`).then(({data}) => {
          var {code, data} = data;
          if (code === '0') {
            this.user = data;
          }
        })
      },
      doAdd(){
        // 验证
        if (this.doAddValidate() === false) {
          return;
        }

        this.$http.post('/api/contacts', {
          contacter: this.contacter_id,
          group_name: this.defaultGroup
        }).then(({data}) => {
          var {code, message} = data;
          if (code === '0') {
            this.$toast(message);
            this.addToStore();
            setTimeout(() => {
              this.$router.push({path: '/home/contacts'})
            }, 1500)
          }
        })
      },
      doAddValidate(){
        const _this = this;

        if (this.me_id === this.contacter_id) {
          this.$toast('不可以自己加自己哦');
          return false;
        }

        const contacts = this.$store.state.contacts;
        for (let i = 0; i < contacts.length; i++) {
          if (contacts[i].group_name === this.defaultGroup) {
            const group = contacts[i].contacts;
            for (let j = 0, len = group.length; j < len; j++) {
              if (group[j]._id === this.contacter_id) {
                this.$toast(`${_this.user.sex === 0 ? '他' : '她'}已经是你的好友了哦`);
                return false;
              }
            }
          }
        }
      },
      addToStore(){
        const {_id, avatar, nickname, is_online} = this.user;
        const user = {_id, avatar, nickname, is_online};
        this.$store.commit('UPDATE_CONTACTS', {
          group_name: this.defaultGroup,
          contact_info: user
        })
      }
    }
  }
</script>
