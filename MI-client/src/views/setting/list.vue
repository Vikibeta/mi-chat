<template>
  <div>
    <m-header title="设置" @on-back="$router.go(-1)"></m-header>
    <div class="view-wrap">
      <group>
        <cell-box is-link>
          <div class="setting-avatar">
            <p>头像</p>
            <img :src="avatar | avatarLocation">
            <input type="file" name="avatar" accept="image/png, image/jpg, image/jpeg" ref="file"
                   @change="uploadAvatar()">
          </div>
        </cell-box>
        <cell title="资料设置" link="/setting/person"></cell>
        <cell title="系统设置" link="/setting/system"></cell>
      </group>

      <div style="margin-top: 30px;padding: 0 10px">
        <x-button type="warn" @click.native="doSignOut">退 出 登 录</x-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {Group, Cell, CellBox, XButton, cookie} from 'vux'
  import MHeader from '@/components/header'
  import {mapGetters} from 'vuex'
  import {avatarLocation} from '@/filters'

  export default {
    components: {
      Group,
      Cell,
      MHeader,
      CellBox,
      XButton
    },
    computed: {
      ...mapGetters(['avatar'])
    },
    filters: {
      avatarLocation
    },
    methods: {
      uploadAvatar(){
        const avatar = this.$refs.file.files[0];
        const form = new FormData();
        form.append('file', avatar);

        this.$http.put('/api/user/avatar', form, {
          'Content-Type': 'multipart/form-data'
        }).then(({data}) => {
          var {code} = data;
          if (code === '1') {
            this.$toast(data.message);
            return;
          }

          this.$toast('上传成功');
          this.$store.state.user.avatar = data.data.avatar;
        });
      },
      doSignOut(){
        const _this = this;
        this.$vux.confirm.show({
          content: '确定要退出吗？',
          onConfirm(){
            _this.$store.commit('SOCKET_CLOSE');
            cookie.remove('mi_afdaefe95e9d7e12', {
              domain: location.hostname,
              path: '/'
            });
            _this.$router.push({path: '/login'});
          }
        });
      }
    }
  }
</script>
