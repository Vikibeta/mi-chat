/**
 * Created by lavyun on 2017/4/5.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

// 页面组件
import Login from '../views/login'   // 登录
import Forget from '../views/forget'   // 忘记密码
import Register from '../views/register'   // 注册
import Home from '../views/home/index'
import HomeMessages from '../views/home/messages'   // 未读信息
import HomeContacts from '../views/home/contacts'   // 联系人列表
import Chat from '../views/chat'   // 私聊
import Add from '../views/add/index'   // 添加联系人
import AddExactly from '../views/add/exactly'   // 精确查找
import AddSelectively from '../views/add/selectively'   // 条件查找
import SelectivelyList from '../views/add/selectively-list'  // 条件查找的列表
import User from '../views/user/index'  // 联系人添加
import UserAdd from '../views/user/add'  // 联系人添加详情，分组选择
import Me from '../views/me'   // 个人信息
import Setting from '../views/setting/index'  // 设置
import SettingList from '../views/setting/list'   // 设置页选项列表
import SettingPerson from '../views/setting/person'   // 个人资料设置
import SettingSystem from '../views/setting/system'   // 系统资料设置


const routerHome = {
  path: '/home', component: Home,
  children: [{
    path: '', component: HomeMessages
  }, {
    path: 'messages', component: HomeMessages
  }, {
    path: 'contacts', component: HomeContacts
  }]
};

const routerAdd = {
  path: '/add', component: Add,
  children: [{
    path: '', component: AddExactly
  }, {
    path: 'exactly', component: AddExactly
  }, {
    path: 'selectively', component: AddSelectively
  }]
};


const routerSetting = {
  path: '/setting', component: Setting,
  children: [{
    path: '', component: SettingList
  },{
    path: 'list', component: SettingList
  },{
    path: 'person', component: SettingPerson
  }, {
    path: 'system', component: SettingSystem
  }]
};


// 导出router
export default new VueRouter({
  routes: [
    routerHome,
    routerAdd,
    routerSetting,
    {
      path: '/login', component: Login
    }, {
      path: '/forget', component: Forget
    }, {
      path: '/register', component: Register
    }, {
      path: '/chat/:to', component: Chat
    }, {
      path: '/selectivelyList', component: SelectivelyList
    }, {
      path: '/user/:id', component: User
    }, {
      path: '/userAdd/:id', component: UserAdd
    },{
      path: '/me', component: Me
    },{
      path: '*', redirect: '/login'
    }]
})
