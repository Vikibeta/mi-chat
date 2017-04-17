/**
 * Created by lavyun on 2017/4/5.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
module.exports = {
    name: 'Messages',
    model: {
        _id: {type: String, required: true, unique: true},   // 所属MI账号 格式类似 '555555-666666'
        messages: [],
        min_not_read: {type: Number, default: 0},  // 账号数值较小的一方的未读数，这里是 555555,
        max_not_read: {type: Number, default: 0}   // 账号数值较大的一方的未读数，这里是 666666,
    }
};