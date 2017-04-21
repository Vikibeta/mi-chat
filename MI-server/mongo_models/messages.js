/**
 * Created by lavyun on 2017/4/5.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
module.exports = {
    name: 'Messages',
    model: {
        _id: {type: String, required: true, unique: true},   // 所属MI账号 格式类似 '555555-666666'
        messages: [],  // 所有的聊天记录
        small_id_info: {  // id较小者的信息
            _id: String,
            nickname: String,
            avatar: String,
            not_read: {type: Number, default: 0}
        },
        large_id_info: {  // id较大者的信息
            _id: String,
            nickname: String,
            avatar: String,
            not_read: {type: Number, default: 0}
        }
    }
};