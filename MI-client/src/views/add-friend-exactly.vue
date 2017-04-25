<!--精确查找-->

<template>
  <div>
    <div style="margin-top: 30px;" class="add-input">
      <group>
        <x-input placeholder="MI号" :max="6" v-model="id">
          <span class="iconfont icon-search" slot="label"></span>
        </x-input>
      </group>
    </div>

    <group v-if="id.length===6" style="margin-top: 30px;">
      <cell-box>
        <div class="message-list-item" v-if="contacter" @click="$router.push({path: `/user/${id}?from_add=1`})">
          <div class="message-list-content">
            <div class="message-list-content-top">
              <div class="message-list-text">
                <strong class="message-list-nickname message-list-text float-left">
                  {{contacter.nickname}}
                </strong>
                <span class="message-list-time-date message-list-text float-right text-color"></span>
                <div class="clearfix"></div>
              </div>
            </div>
            <div class="message-list-content-bottom">
              <div class="message-list-text">
                <p class="message-list-value text-ellipsis">
                  [{{contacter.is_online === 0 ? '离线' : '在线'}}] {{contacter.signature}}
                </p>
              </div>
            </div>
          </div>
          <div class="message-list-avatar">
            <img :src="contacter.avatar | avatarLocation">
          </div>
        </div>

        <div v-else class="text-center" style="padding: 10px 0;color: #868686">没有符合条件的联系人</div>
      </cell-box>
    </group>
  </div>
</template>

<script>
  import {Group, XInput, CellBox} from 'vux'
  import dataToQuery from '../utils/dataToQuery'
  import {BODY_CLASS} from '../mixins'
  import {avatarLocation} from '../filters'

  export default {
    mixins: [BODY_CLASS],
    components: {
      Group,
      XInput,
      CellBox,
    },
    data(){
      return {
        id: '',
        contacter: null
      }
    },
    filters: {
      avatarLocation
    },
    watch: {
      id(value){
        if (value.length === 6) {
          let data = ['avatar', 'nickname', 'is_online', 'signature'];
          this.$http.get(`/api/user/${this.id}/?${dataToQuery(data)}`).then(({data}) => {
            var {code, data} = data;
            if (code === '0') {
                this.contacter = data;
            }
          });
        }
      }
    }
  }
</script>
