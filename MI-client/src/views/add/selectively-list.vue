<template>
  <div>
    <m-header title="条件查找" @on-back="$router.go(-1)" icon-text="换一批" @click="doRefresh"></m-header>
    <div class="view-wrap" style="padding: 0">
      <group>
        <cell-box v-for="(item, index) in selectively_list.list">
          <div class="message-list-item" @click="$router.push({path: `/user/${item._id}?from_add=1`})">
            <div class="message-list-content">
              <div class="message-list-content-top">
                <div class="message-list-text">
                  <strong class="message-list-nickname message-list-text float-left">
                    {{item.nickname}}
                </strong>
                  <span class="message-list-time-date message-list-text float-right text-color"></span>
                  <div class="clearfix"></div>
                </div>
              </div>
              <div class="message-list-content-bottom">
                <div class="message-list-text">
                  <p class="message-list-value text-ellipsis">
                    [{{item.is_online === 0 ? '离线' : '在线'}}] {{item.signature}}
                </p>
                </div>
              </div>
            </div>
            <div class="message-list-avatar">
              <img :src="item.avatar | avatarLocation">
            </div>
          </div>
        </cell-box>

        <cell-box v-show="selectively_list.list.length === 0">
          <div class="text-center" style="padding: 10px 0;color: #868686">没有符合条件的联系人</div>
        </cell-box>
      </group>
    </div>
  </div>
</template>

<script>
  import {CellBox, Group} from 'vux'
  import {mapGetters} from 'vuex'
  import MHeader from '@/components/header'
  import {avatarLocation} from '@/filters'

  export default {
    components:{
        CellBox, Group, MHeader
    },
    filters:{
      avatarLocation
    },
    computed:{
      ...mapGetters(['selectively_list'])
    },
    methods:{
      doRefresh(){

      }
    }
  }
</script>
