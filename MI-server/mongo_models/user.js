/**
 * Created by lavyun on 2017/4/5.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */

var getToday = require('../utils/getToday');

module.exports = {
    name: 'User',
    model: {
        _id: {type: String, required: true, unique: true},  // 账号ID(MI号)，唯一，主键
        nickname: {type: String, required: true},  // 昵称
        password: {type: String, required: true},  // 密码，hash加密
        sex: {type: Number, default: 0},  // 性别，默认为0，男
        birth: {type: String, default: getToday()},  // 生日
        location: {type: String, default: '中国'},  // 所在地
        create_at: {type: Date, default: Date.now},  // 注册日期
        is_online: {type: Number, default: 0},  // 是否在线  0表示不在线
        avatar: {type: String, default: `default${Math.ceil(Math.random() * 9)}.jpg`},  // 头像地址 有九张默认头像
        signature: String,   // 个性签名
        photo_wall: String,   // 照片墙地址
        groups: [],  // 分组信息
        messages: [{type: String, ref: 'Messages'}]   // 首页显示的消息列表
    }
}