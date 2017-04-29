<template>
  <div>
    <m-header title="设置" @on-back="$router.go(-1)"></m-header>
    <div class="view-wrap">
      <group>

      </group>
    </div>
  </div>
</template>

<script>
  import {Group, Cell} from 'vux'
  import MHeader from '../../components/header'

  export default {
    components: {
      Group,
      Cell,
      MHeader
    }
  }
</script>
