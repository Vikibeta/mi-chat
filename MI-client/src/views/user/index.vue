<template>
  <div class="user">
    <m-header @on-back="$router.go(-1)" title="个人资料"></m-header>
    <div class="view-wrap" style="padding: 0;background-color: #fff">
      <div class="user-photo_wall" :style="{'background-image': `url(${'http://placehold.it/400x200/545a82'})`}">
        <img :src="user.avatar | avatarLocation" class="user-avatar">
      </div>
      <div class="user-info">
        <div class="user-info-nickname text-center">{{user.nickname}}</div>
        <div class="user-info-signature text-ellipsis text-center" v-if="user.signature && user.signature.length !== 0">
          {{user.signature}}
        </div>
        <div class="user-info-sex_loc text-center">
          <span class="iconfont tip"
                :style="{'background-color': (user.sex === '男' ? 'lightskyblue' : 'rgb(246,152,179)')}">
            {{user.sex}}&nbsp;&nbsp;{{age}} 岁&nbsp;&nbsp;{{user.location | locationFilter}}
          </span>
        </div>
        <group style="margin-top: 15px;">
          <cell :title="id">
            <span slot="icon" class="iconfont icon-myfill cell-icon"></span>
          </cell>
          <cell title="上次在线 今天22:06">
            <span slot="icon" class="iconfont icon-message_fill_light cell-icon"></span>
          </cell>
        </group>
      </div>
    </div>

    <group style="margin-top: 10px">
      <cell :title="user.company || '无业游民'">
        <span slot="icon" class="iconfont icon-gongsi cell-icon"></span>
      </cell>
      <cell :title="user.profession || '无业游民'">
        <span slot="icon" class="iconfont icon-zhiye cell-icon"></span>
      </cell>
    </group>

    <div style="height: 52px"></div>
    <div class="btn-controls">
      <div class="btn" v-show="this.fromAdd === '1'">
        <x-button type="default" @click.native="$router.push({path: `/userAdd/${id}`})">
          加入通信录

        </x-button>
      </div>
      <div class="btn" :class="{block : this.fromAdd !== '1'}">
        <x-button type="warn" @click.native="$router.push({path: `/chat/${id}`})">发消息</x-button>
      </div>
    </div>
  </div>
</template>

<script>
  import MHeader from '@/components/header'
  import {Group, Cell, XButton, ChinaAddressV3Data, Value2nameFilter as value2name} from 'vux'
  import dataToQuery from '@/utils/dataToQuery'
  import {avatarLocation} from '@/filters'

  export default {
    components: {
      MHeader,
      Group,
      Cell,
      XButton
    },
    data(){
      return {
        id: '',
        fromAdd: '1',
        user: {
          avatar: 'default.jpg'
        }
      }
    },
    computed: {
      age(){
        const cYear = new Date().getFullYear();
        const birth = this.user.birth;
        const birthYear = birth && parseInt(birth.substr(0, 4));
        return cYear - birthYear + 1;
      }
    },
    filters: {
      avatarLocation,
      locationFilter(value){
        if (value && value !== '中国') {
          const loc = value2name(value.split('-'), ChinaAddressV3Data);
          return loc.replace(/[省市辖区]/g, '');
        }

        return value;
      }
    },
    mounted(){
      this.id = this.$route.params.id;
      this.fromAdd = this.$route.query.from_add;
      this.getUserInfo(this.id);
    },
    methods: {
      getUserInfo(id){
        let data = ['nickname', 'avatar', 'signature', 'sex', 'birth', 'location', 'company', 'profession'];
        this.$http.get(`/api/user/${id}/?${dataToQuery(data)}`).then(({data}) => {
          var {code, data} = data;
          if (code === '0') {
            this.user = data;
          }
        })
      }
    }
  }
</script>
