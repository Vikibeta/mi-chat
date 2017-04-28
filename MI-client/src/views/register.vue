<template>
  <div>
    <m-header title="账号注册"></m-header>
    <div class="view-wrap">
      <div class="register-form">
        <group>
          <x-input type="text" v-model="id" placeholder="请输入6位纯数字MI号" :max="6"></x-input>
          <x-input type="text" v-model="nickname" placeholder="请输入8位以下昵称" :max="8"></x-input>
          <x-input type="password" v-model="password" placeholder="请输入16位以下密码" :max="16"></x-input>
          <x-input type="password" v-model="password1" placeholder="请确认密码"></x-input>
        </group>
      </div>

      <div class="register-form-btn" style="margin-top: 20px;padding: 0 10px;">
        <x-button type="warn" @click.native="doRegister">注 册</x-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {XInput, Group, XButton} from 'vux'
  import MHeader from '../components/header'

  export default {
    data(){
      return {
        id: '666666',
        nickname: 'lavyun',
        password: 'gxzyx1314',
        password1: 'gxzyx1314'
      }
    },
    components: {
      XInput,
      Group,
      XButton,
      MHeader
    },
    watch:{
      id: function (value) {
        this.nickname = value;
      }
    },
    methods: {
      doRegister(){
        const {id, nickname, password, password1, $toast} = this;

        if (id !== '' && nickname !== '' && password !== '' && password1 !== '') {
          if (!/^\d{6}$/.test(id)) {
            $toast('MI账号为6位纯数字');
            return;
          }

          if (nickname.length > 8) {
            $toast('昵称需小于8位');
            return;
          }

          if (password.length > 16) {
            $toast('密码需小于16位');
            return;
          }

          if (password !== password1) {
            $toast('密码不一致');
            return;
          }

          this.$http.post('/api/user', {
            id, nickname, password, password1
          }).then(({data}) => {

            $toast(data.message);

            if (data.code === '0') {
              return this.$http.post('/api/authentication', {
                id: this.id,
                password: this.password
              })
            }
          }).then(({data}) => {
            var {code, data} = data;
            if(code === '0') {
              const token = data.token;
              this.$http.defaults.params.token = token;  // 存token
              this.$store.commit('SET_USER', data.user);  // 个人信息存入全局状态
              this.$store.dispatch('SOCKET_CON', token);
              if (window.localStorage) {
                window.localStorage.setItem('mi_token', token);
              }

              setTimeout(()=>{
                this.$router.push({path: '/home/messages'})
              },1500);
            }
          })
        } else {
          $toast('请检查是否输入完整');
        }
      }
    }
  }
</script>
