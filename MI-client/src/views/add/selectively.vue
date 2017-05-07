<!-- 条件查找 -->

<template>
  <div>
    <button-tab v-model="sexIndex" style="padding: 0 60px;margin-top: 30px;">
      <button-tab-item>男</button-tab-item>
      <button-tab-item>女</button-tab-item>
    </button-tab>

    <group style="margin-top: 30px;">
      <popup-picker title="年龄" :data="ageList" v-model="ageDefault" :display-format="ageFormat"
                    class="selectively-item" @on-hide="validateAgeRange">
      </popup-picker>
      <x-address title="所在地" v-model="cityDefault" raw-value :list="cityList" hide-district
                 class="selectively-item">
      </x-address>
    </group>

    <div style="margin-top: 30px;padding: 0 20px;">
      <x-button type="warn" @click.native="doConfirm">查 询</x-button>
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
        ageDefault: ['18', '26'],
        cityList: ChinaAddressV3Data,
        cityDefault: [],
        ageFormat: function (value, name) {
          return `${value[0]}-${value[1]}岁`
        },
      }
    },
    created(){
      this.genAgeList();
    },
    methods: {
      genAgeList(){  // 生成年龄列表
        const ageFrom = [], ageTo = [];
        for (let i = 1; i <= 100; i++) {
          ageFrom.push(i);
          ageTo.push(i);
        }
        this.ageList.push(ageFrom);
        this.ageList.push(ageTo);
      },
      validateAgeRange(type){  // 验证年龄区间是否符合规范
        if (type === true) {
          let sAge = +this.ageDefault[0];
          let bAge = +this.ageDefault[1];
          if (sAge > bAge) {
            this.$vux.alert.show({
              title: '提示',
              content: '请选择正确的年龄范围'
            });
            this.ageDefault = ['18', '26'];
          }
        }
      },
      doConfirm(){
        let sex = this.sexIndex;
        let sAge = this.ageDefault[0];
        let bAge = this.ageDefault[1];
        let cityCode = this.cityDefault.join('-');
        this.$http.get(`/api/users?sex=${sex}&sAge=${sAge}&bAge=${bAge}&cityCode=${cityCode}`).then(({data})=>{
          console.log(data);
        })
      }
    }
  }
</script>

