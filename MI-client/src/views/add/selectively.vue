<!-- 条件查找 -->

<template>
  <div>
    <button-tab v-model="sexIndex" style="padding: 0 60px;margin-top: 30px;">
      <button-tab-item>男</button-tab-item>
      <button-tab-item>女</button-tab-item>
    </button-tab>

    <group style="margin-top: 30px;">
      <popup-picker title="年龄" :data="ageList" v-model="ageDefault" :display-format="ageFormat"
                    class="selectively-item"></popup-picker>
      <popup-picker title="星座" :data="constellationList" v-model="constellationDefault"
                    class="selectively-item"></popup-picker>
      <x-address title="所在地" v-model="cityDefault" raw-value :list="cityList" hide-district
                 class="selectively-item"></x-address>
    </group>

    <div style="margin-top: 30px;padding: 0 20px;">
      <x-button type="warn">查 询</x-button>
    </div>
  </div>
</template>

<script>
  import {ButtonTab, ButtonTabItem, Group, PopupPicker, XAddress, ChinaAddressV3Data, XButton} from 'vux'
  export default {
    components: {
      ButtonTab,
      ButtonTabItem,
      Group,
      PopupPicker,
      XAddress,
      XButton
    },
    data(){
      return {
        sexIndex: 0,
        ageList: [],
        ageDefault: [18, 26],
        cityList: ChinaAddressV3Data,
        cityDefault: [],
        constellationList: [['不限', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']],  //星座
        constellationDefault: ['不限'],
        ageFormat: function (value, name) {
          return `${value[0]}-${value[1]}岁`
        },
      }
    },
    mounted(){
      const ageFrom = [], ageTo = [];
      for (let i = 1; i <= 100; i++) {
        ageFrom.push(i);
        ageTo.push(i);
      }
      this.ageList.push(ageFrom);
      this.ageList.push(ageTo);
    }
  }
</script>

