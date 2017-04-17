<!--精确查找-->

<template>
  <div>
    <div style="margin-top: 30px;" class="add-input">
      <group>
        <x-input placeholder="MI号" :max="6" v-model="exactSearchMI">
          <span class="iconfont icon-search" slot="label"></span>
        </x-input>
      </group>
    </div>

    <group v-if="exactSearchMI.length===6" style="margin-top: 30px;">
      <cell-box>
        <div class="message-list-item" v-if="contacter">
          <div class="message-list-content">
            <div class="message-list-content-top">
              <div class="message-list-text">
                <strong class="message-list-nickname message-list-text float-left">{{contacter.nickname}}</strong>
                <!--住址-->
                <span class="message-list-time-date message-list-text float-right text-color"></span>
                <div class="clearfix"></div>
              </div>
            </div>
            <div class="message-list-content-bottom">
              <div class="message-list-text">
                <p class="message-list-value text-ellipsis">{{contacter.signature}}</p>
              </div>
            </div>
          </div>
          <div class="message-list-avatar">
            <img :src="contacter.avatar">
          </div>
        </div>

        <div v-else class="text-center" style="padding: 10px 0;color: #868686">没有符合条件的联系人</div>
      </cell-box>
    </group>
  </div>
</template>

<script>
  import {Group, XInput, CellBox} from 'vux'
  export default {
    components: {
      Group,
      XInput,
      CellBox,
    },
    data(){
      return {
        exactSearchMI: '',
        contacter: null
      }
    },
    watch: {
      exactSearchMI(value){
        if (value.length === 6) {
          if(value === '123456') {
            this.contacter = {
              avatar: 'https://oixyh3u6e.qnssl.com/livingearth/livingearth.png',
              nickname: '往事随风',
              signature: '本人名主已有花'
            }
          } else {
            this.contacter = null;
          }
        }
      }
    }
  }
</script>
