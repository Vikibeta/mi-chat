<template>
  <div class="header">
    <p class="header-title text-center" v-text="title"></p>
    <span class="header-back text-left" @click="back"><i class="iconfont icon-back"></i></span>
    <span v-if="iconClass" class="header-icon iconfont text-right" :class="{[iconClass]:true}"
          @click="iconClick"></span>
  </div>
</template>

<script>
  export default {
    props: {
      title: String,
      showLeft: {
        type: Boolean,
        default: true
      },
      iconClass: String
    },
    methods: {
      back(){
        this.$emit('on-back');
      },
      iconClick(){
        this.$emit('on-icon-click');
      }
    }
  }
</script>
