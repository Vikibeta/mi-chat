<template>
  <div>
    <group v-for="(item, index) in contacts" class="contact-item">
      <cell-box @click.native="toggleFold(index)">
        <div class="contact-item-fold">
          <p class="contact-item-fold-title">{{item.group_name}}</p>
          <span class="iconfont icon-right contact-item-fold-arrow"
                :class="{active: foldStatus[index] === true}">
          </span>
          <span class="contact-item-fold-count">
            {{item.onlineCount}} / {{item.contacts.length}}
          </span>
        </div>
      </cell-box>
      <cell-box v-for="(contact, index2) in item.contacts" v-show="foldStatus[index]"
                @click.native="doChat(contact)">
        <div class="contact-item-user">
          <div class="contact-item-user-avatar">
            <img :src="contact.avatar | avatarLocation">
          </div>
          <div class="contact-item-user-content text-ellipsis">
            {{contact.nickname}}
            <!--<p class="contact-item-user-nickname"></p>-->
          </div>
          <div class="contact-item-user-status">
            <span class="contact-item-user-statusTip" :class="{online: contact.is_online === 1}">
              {{contact.is_online === 1 ? '在线' : '离线'}}
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
        foldStatus: []
      }
    },
    filters: {
      avatarLocation
    },
    computed: {
      ...mapGetters(['contacts'])
    },
    methods: {
      toggleFold(index){   //切换联系人列表显示
        const foldStatus = this.foldStatus[index];
        this.$set(this.foldStatus, index, !foldStatus);
      },
      doChat(contact){
        const id = contact._id;
        const messages = this.$store.getters.messages;
        let msgList = [];
        for (let i = 0, len = messages.length; i < len; i++) {
          if (messages[i].to_Id === id) {
            msgList = messages[i].msgList;
            break;
          }
        }
        this.$store.commit('SET_MSG_IN_CHAT', {
          msgList: msgList.reverse(),
          msgInfo: contact
        });

        this.$router.push({path: `/chat/${id}`});
      }
    }
  }
</script>
