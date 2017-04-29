<template>
  <div class="user me">
    <m-header @on-back="$router.push({path: '/home/messages'})"
              :title="user.nickname" icon-class="icon-shezhi" @on-icon-click="$router.push({path: '/setting'})"></m-header>
    <div class="view-wrap" style="padding: 0;background-color: #fff">
      <div class="user-photo_wall" :style="{'background-image': `url(${'http://placehold.it/400x200/545a82'})`}">
        <img :src="user.avatar | avatarLocation" class="user-avatar">
      </div>
      <div class="user-info">
        <div class="user-info-nickname text-center">{{user.nickname}}</div>
        <div class="user-info-sex_loc text-center">
          <span class="iconfont tip"
                :style="{'background-color': (user.sex === 0 ? 'lightskyblue' : 'rgb(246,152,179)')}">
            {{user.sex}}&nbsp;&nbsp;{{age}} 岁&nbsp;&nbsp;{{user.location}}
          </span>
        </div>
        <group style="margin-top: 15px;">
          <cell :title="user._id">
            <span slot="icon" class="iconfont icon-myfill cell-icon"></span>
          </cell>
          <cell link="#" title="谁谁谁水水水水水水水水谁谁ssssssssssssssssssssssssssss">
            <span slot="icon" class="iconfont icon-qianming cell-icon"></span>
          </cell>
        </group>
      </div>
    </div>

    <group style="margin-top: 15px;">
      <cell :title="user.location" link="#">
        <span slot="icon" class="iconfont icon-zuobiao1 cell-icon"></span>
      </cell>
      <cell :title="user.birth" link="#" >
        <span slot="icon" class="iconfont icon-shengri cell-icon"></span>
      </cell>
      <cell title="公司" link="#">
        <span slot="icon" class="iconfont icon-gongsi cell-icon"></span>
      </cell>
      <cell title="职业" link="#" >
        <span slot="icon" class="iconfont icon-zhiye cell-icon"></span>
      </cell>
    </group>

    <div style="height: 15px;"></div>
  </div>
</template>

<script>
  import {avatarLocation} from '../filters'
  import MHeader from '../components/header'
  import {Cell, Group} from 'vux'
  import {mapGetters} from 'vuex'

  export default {
    components: {
      Cell, Group, MHeader
    },
    data(){
      return {
      }
    },
    filters: {
      avatarLocation
    },
    computed:{
      ...mapGetters(['user']),
      age(){
        const cYear = new Date().getFullYear();
        const birth = this.user.birth;
        const birthYear = birth && parseInt(birth.substr(0, 4));
        return cYear - birthYear + 1;
      }
    }

  }
</script>
