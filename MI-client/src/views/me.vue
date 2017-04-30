<template>
  <div class="user me">
    <m-header @on-back="$router.push({path: '/home/messages'})"
              :title="user.nickname" icon-class="icon-shezhi"
              @on-icon-click="$router.push({path: '/setting'})"></m-header>
    <div class="view-wrap" style="padding: 0;background-color: #fff">
      <div class="user-photo_wall" :style="{'background-image': `url(${'http://placehold.it/400x200/545a82'})`}">
        <img :src="user.avatar | avatarLocation" class="user-avatar" @click="$router.push({path: '/setting/list'})">
      </div>
      <div class="user-info">
        <div class="user-info-nickname text-center">{{user.nickname}}</div>
        <div class="user-info-sex_loc text-center">
          <span class="iconfont tip"
                :style="{'background-color': (user.sex === '男' ? 'lightskyblue' : 'rgb(246,152,179)')}">
            {{user.sex}}&nbsp;&nbsp;{{age}} 岁&nbsp;&nbsp;{{user.location | locationFilter}}
          </span>
        </div>
        <group style="margin-top: 15px;">
          <cell :title="user._id">
            <span slot="icon" class="iconfont icon-myfill cell-icon"></span>
          </cell>
          <cell link="/setting/person" :title="user.signature">
            <span slot="icon" class="iconfont icon-qianming cell-icon"></span>
          </cell>
        </group>
      </div>
    </div>

    <group style="margin-top: 15px;">
      <cell :title="user.location | locationFilter" link="/setting/person">
        <span slot="icon" class="iconfont icon-zuobiao1 cell-icon"></span>
      </cell>
      <cell :title="user.birth" link="/setting/person">
        <span slot="icon" class="iconfont icon-shengri cell-icon"></span>
      </cell>
      <cell :title="user.company || '未设置'" link="/setting/person">
        <span slot="icon" class="iconfont icon-gongsi cell-icon"></span>
      </cell>
      <cell :title="user.profession || '未设置'" link="/setting/person">
        <span slot="icon" class="iconfont icon-zhiye cell-icon"></span>
      </cell>
    </group>

    <div style="height: 15px;"></div>
  </div>
</template>

<script>
  import {avatarLocation} from '../filters'
  import MHeader from '../components/header'
  import {Cell, Group, ChinaAddressV3Data, Value2nameFilter as value2name} from 'vux'
  import {mapGetters} from 'vuex'

  export default {
    components: {
      Cell, Group, MHeader
    },
    data(){
      return {
        value2name,
        ChinaAddressV3Data
      }
    },
    filters: {
      avatarLocation,
      locationFilter(value){
        if (value && value !== '中国') {
          return value2name(value.split('-'), ChinaAddressV3Data);
        }

        return value;
      }
    },
    computed: {
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
