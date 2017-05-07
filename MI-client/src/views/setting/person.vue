<template>
  <div>
    <m-header title="个人资料" @on-back="$router.go(-1)"></m-header>
    <div class="view-wrap" style="padding-top: 20px">
      <group>
        <x-input title="昵称" v-model="user.nickname" placeholder="请输入昵称"></x-input>
        <popup-picker title="性别" :data="sexList" v-model="sex"></popup-picker>
        <datetime title="生日" :min-year=1900 v-model="user.birth" confirm-text="确定" cancel-text="取消"></datetime>
      </group>

      <group style="margin-top: 20px">
        <x-input title="公司" v-model="user.company" placeholder="您的公司"></x-input>
        <x-input title="职业" v-model="user.profession" placeholder="您的职业"></x-input>
        <x-address title="所在地" v-model="location" raw-value :list="cityList" hide-district></x-address>
        <x-textarea title="签名" v-model="user.signature" :rows="2" :max="24" placeholder="介绍一下自己吧"
                    class="textarea">
        </x-textarea>
      </group>

      <div style="margin: 20px 0;padding: 0 10px;">
        <x-button type="warn" @click.native="doUpdate">提 交</x-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Group, Cell, XInput,
    PopupPicker, Datetime, XAddress,
    ChinaAddressV3Data, XTextarea, XButton,
    Value2nameFilter as value2name
  } from 'vux'

  import MHeader from '@/components/header'
  import {mapGetters} from 'vuex'

  export default {
    components: {
      Group,
      XInput,
      MHeader,
      PopupPicker,
      Datetime,
      XAddress,
      XTextarea,
      XButton
    },
    data(){
      return {
        sexList: [['男', '女']],
        cityList: ChinaAddressV3Data,
        sex: [],
        location: []
      }
    },
    computed: {
      ...mapGetters(['user']),
    },
    watch: {
      user(user){
        const sex = user.sex;
        const location = user.location;
        this.sex.push(sex);
        if (location !== '中国') this.location = location.split('-');
      }
    },
    mounted(){
      const storeUser = this.$store.state.user;
      const sex = storeUser.sex;
      if (sex) {
        this.sex.push(sex);
        if (storeUser.location !== '中国') this.location = storeUser.location.split('-');
      }
    },
    methods: {
      doUpdate(){
        const afterUpdate = {
          ...this.user,
          sex: this.sex[0],
        };

        if (this.location.length !== 0) {
          afterUpdate.location = this.location.join('-')
        }

        this.$http.put('/api/user', afterUpdate).then(({data}) => {
          var {code, data} = data;
          if (code === '0') {
            this.$store.commit('UPDATE_USER', afterUpdate);
            this.$toast('修改成功', true);

          }
        })
      }
    }
  }
</script>
