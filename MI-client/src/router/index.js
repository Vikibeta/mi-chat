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
import Home from '../views/home'
import HomeMessages from '../views/home-messages'   // 未读信息
import HomeContacts from '../views/home-contacts'   // 联系人列表
import Chat from '../views/chat'   // 私聊
import Add from '../views/add-friend'   // 添加联系人
import AddExactly from '../views/add-friend-exactly'   // 精确查找
import AddSelectively from '../views/add-friend-selectively'   // 条件查找
import User from '../views/user'
import UserAdd from '../views/user-add'


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



// 导出router
export default new VueRouter({
  routes: [
    routerHome,
    routerAdd,
    {
      path: '/login', component: Login
    }, {
      path: '/forget', component: Forget
    }, {
      path: '/register', component: Register
    }, {
      path: '/chat/:to', component: Chat
    }, {
      path: '/add', component: Add
    }, {
      path: '/user/:id', component: User
    }, {
      path: '/userAdd/:id', component: UserAdd
    },{
      path: '*', redirect: '/login'
    }]
})
