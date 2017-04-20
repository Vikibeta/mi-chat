<template>
  <div>
    <group v-for="(item, index) in contacts" class="contact-item">
      <cell-box @click.native="toggleFold(index)">
        <div class="contact-item-fold">
          <p class="contact-item-fold-title">{{item.group_name}}</p>
          <span class="iconfont icon-right contact-item-fold-arrow"
                :class="{active: foldStatus[index] === true}"></span>
          <span class="contact-item-fold-count">{{item.online_count}} / {{item.contacts.length}}</span>
        </div>
      </cell-box>
      <cell-box v-for="(contact, index2) in item.contacts" v-show="foldStatus[index]">
        <div class="contact-item-user">
          <div class="contact-item-user-avatar">
            <img :src="contact.avatar | avatarLocation">
          </div>
          <div class="contact-item-user-content text-ellipsis">
            {{contact.nickname}}
            <!--<p class="contact-item-user-nickname"></p>-->
          </div>
          <div class="contact-item-user-status">
            <span class="contact-item-user-statusTip"
                  :class="{online: contact.is_online}">{{contact.is_online ? '在线' : '离线'}}
            </span>
          </div>
        </div>
      </cell-box>
    </group>
  </div>
</template>

<script>
  import {Group, CellBox} from 'vux'
  import {mapGetters} from 'vuex'
  import {avatarLocation} from '../filters'

  export default {
    components: {
      Group,
      CellBox
    },
    data(){
      return {
        tabs: [{
          title: '我的好友',
          online_count: 1,
          contacts: [{
            MI: 123456,
            online: true,
            nickname: '往事随风',
            avatar: 'https://img.alicdn.com/imgextra/i3/1386405035427072941/TB2pEm.kypnpuFjSZFkXXc4ZpXa_!!0-saturn_solar.jpg_240x240xz.jpg_.webp'
          }, {
            MI: 145687,
            online: false,
            nickname: '往事随风2',
            avatar: 'https://img.alicdn.com/imgextra/i3/1386405035427072941/TB2pEm.kypnpuFjSZFkXXc4ZpXa_!!0-saturn_solar.jpg_240x240xz.jpg_.webp'
          }]
        }, {
          title: '同学',
          online_count: 2,
          contacts: [{
            MI: 123456,
            online: true,
            nickname: '往事随风',
            avatar: 'https://img.alicdn.com/imgextra/i3/1386405035427072941/TB2pEm.kypnpuFjSZFkXXc4ZpXa_!!0-saturn_solar.jpg_240x240xz.jpg_.webp'
          }, {
            MI: 145687,
            online: false,
            nickname: '往事随风2',
            avatar: 'https://img.alicdn.com/imgextra/i3/1386405035427072941/TB2pEm.kypnpuFjSZFkXXc4ZpXa_!!0-saturn_solar.jpg_240x240xz.jpg_.webp'
          }]
        }],
        foldStatus: []
      }
    },
    filters:{
      avatarLocation
    },
    computed: {
      ...mapGetters(['contacts'])
    },
    mounted(){
      const length = this.tabs.length;

      for (let i = 0; i < length; i++) {
        this.foldStatus.push(false);
      }
    },
    methods: {
      toggleFold(index){   //切换联系人列表显示
        const foldStatus = this.foldStatus[index];
        this.$set(this.foldStatus, index, !foldStatus);
      }
    }
  }
</script>
