<template>
  <div>
    <m-header @on-back="$router.go(-1)" title="个人资料"></m-header>
    <div class="view-wrap" style="padding: 0">
      <div class="user-photo_wall" :style="{'background-image': `url(${'http://placehold.it/400x200/545a82'})`}">
        <img src="http://placehold.it/100x100" class="user-avatar">
      </div>
      <div class="user-info text-center">
        <div class="user-info-nickname">往事随风</div>
        <div class="user-info-signature text-ellipsis">今天灰常开心^_^今天灰常开心^_^今天灰常开心^_^今天灰常开心^_^</div>
        <div class="user-info-sex_loc">
          <span class="iconfont icon-nan"> 22岁</span>
          &nbsp;&nbsp;
          <span class="iconfont icon-zuobiao"> 安徽-合肥</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import MHeader from '../components/header'
  import {BODY_CLASS} from '../mixins'
  export default {
      mixins: [BODY_CLASS],
      components: {
          MHeader
      }
  }
</script>
