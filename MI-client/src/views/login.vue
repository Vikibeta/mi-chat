<template>
  <div class="login-wrap">
    <div class="login-panel">
      <transition name="fade-to-bottom">
        <div class="login-avatar" v-show="flag">
          <img :src="avatar | avatarLocation">
        </div>
      </transition>
      <transition name="fade-to-top">
        <div class="login-form" v-show="flag">
          <div class="login-form-item">
            <group>
              <x-input type="text" v-model="id" placeholder="请输入MI账号" :max="6"></x-input>
              <x-input type="password" v-model="password" placeholder="请输入密码" :max="16"></x-input>
            </group>
          </div>
          <div class="login-form-item" style="padding: 0 10px">
            <x-button type="warn" @click.native="doLogin">登 录</x-button>
            <p style="margin-top: 15px">
              <router-link :to="{path:'/forget'}" class="float-left" style="color: #1AAD19">忘记密码</router-link>
              <router-link :to="{path:'/register'}" class="float-right" style="color: #1AAD19">注册账号</router-link>
              <span class="clearfix"></span>
            </p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import {XInput, Group, XButton, cookie} from 'vux'
  import {avatarLocation} from '../filters'

  export default {
    data(){
      return {
        id: '',
        password: '',
        avatar: 'default.jpg',
        flag: false
      }
    },
    filters: {
      avatarLocation
    },
    components: {XInput, Group, XButton},
    created(){
        setTimeout(() =>{
          this.flag = true;
        })

      if (cookie.get('mi_afdaefe95e9d7e12')) {
        this.$http.get('/api/user').then(({data}) => {
          var {code, data} = data;
          if (code === '0') {
            this.$store.commit('SET_USER', data);
            this.$router.push({path: '/home/messages'});
          }
        })
      }
    },
    watch: {
      id: function (newValue, oldValue) {
        if (newValue.length === 6) {
          this.getAvatar();
          return;
        }

        if (oldValue.length === 6) {
          this.avatar = 'default.jpg';
        }
      }
    },
    methods: {
      doValidate(){
        const {id, password} = this;

        if (id === '' || password === '') return '请检查是否输入完整';

        if (!/^\d{6}$/.test(id)) return '账号输入有误';

        if (password.length > 16) return '密码输入有误';

        return true;
      },
      doAuthenticate(){
        const {id, password} = this;

        const _this = this;

        this.$http.post('/api/authentication', {
          id, password
        }).then(({data}) => {
          var {code, message, data} = data;
          _this.$toast(message);

          if (code === '0') {
            const token = data.token;
            this.$http.defaults.params.token = token;  // 存token
            this.$store.commit('SET_USER', data.user);  // 个人信息存入全局状态
            this.$store.dispatch('SOCKET_CON', token);

            // 设置cookie
            cookie.set('mi_afdaefe95e9d7e12', token, {
              domain: location.hostname,
              path: '/',
              expires: 15
            });

            this.$router.push({path: '/home/messages'});  // 转到home页面
          }
        })
      },
      getAvatar(){
        this.$http.get(`/api/user/${this.id}/?avatar=1`).then(({data}) => {
          var {code, data} = data;
          if (code === '0') {
            this.avatar = data.avatar;
          }
        })
      },
      doLogin(){
        const validate = this.doValidate();
        if (validate !== true) {
          this.$toast(validate);
          return;
        }

        this.doAuthenticate();
      }
    }
  }
</script>
