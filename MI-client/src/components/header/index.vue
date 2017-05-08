<template>
  <div class="header">
    <p class="header-title text-center" v-text="title"></p>
    <span class="header-back text-left" @click="back"><i class="iconfont icon-back"></i></span>
    <span v-if="iconClass || iconText" class="header-icon text-right" :class="{iconfont: iconClass, [iconClass]: true, iconText}"
          @click="iconClick">{{iconText}}
    </span>
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
      iconClass: String,
      iconText: String
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
