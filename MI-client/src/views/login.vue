<template>
  <div class="login-wrap">
    <div class="login-panel">
      <div class="login-avatar">
        <img
          src="https://img.alicdn.com/imgextra/i3/1386405035427072941/TB2pEm.kypnpuFjSZFkXXc4ZpXa_!!0-saturn_solar.jpg_240x240xz.jpg_.webp">
      </div>
      <div class="login-form">
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
    </div>
  </div>
</template>

<script>
  import {XInput, Group, XButton} from 'vux'

  export default {
    data(){
      return {
        id: '',
        password: ''
      }
    },
    components: {XInput, Group, XButton},
    created(){
      if (window.localStorage.getItem('mi_token')) {
        this.$http.get('/api/user').then(({data}) => {
          var { code, data } = data;
          if(code === '0') {
            this.$store.commit('SET_USER', data);
            this.$router.push({path: '/home/messages'});
          }
        })
      }
    },
    methods: {
      doValidate(){
        const {id, password, $toast} = this;

        if (id === '' || password === '') {
          $toast('请检查是否输入完整');
          return;
        }

        if (!/^\d{6}$/.test(id)) {
          $toast('账号输入有误');
          return;
        }

        if (password.length > 16) {
          $toast('密码输入有误');
          return;
        }
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
            if (window.localStorage) {
              window.localStorage.setItem('mi_token', token);
            }
            this.$router.push({path: '/home/messages'});  // 转到home页面
          }
        })
      },
      doLogin(){
        this.doValidate();
        this.doAuthenticate();
      }
    }
  }
</script>
