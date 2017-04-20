<template>
  <div>
    <m-header title="添加联系人" @on-back="$router.push({path: '/home'})"></m-header>
    <div class="view-wrap" style="padding-top: 0">
      <tab custom-bar-width="100px">
        <tab-item selected @on-item-click="$router.push({path:'/add/exactly'})">精确查找</tab-item>
        <tab-item @on-item-click="$router.push({path:'/add/selectively'})">条件查找</tab-item>
      </tab>

      <keep-alive>
        <router-view></router-view>
      </keep-alive>

    </div>
  </div>
</template>

<script>
  import MHeader from '../components/header'
  import {Tab, TabItem} from 'vux'
  export default {
    components: {
      Tab,
      TabItem,
      'm-header': MHeader
    }
  }

</script>
