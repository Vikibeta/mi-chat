/**
 * Created by lavyun on 2017/4/5.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
module.exports = {
    name: 'User',
    model: {
        _id: {type: String, required: true, unique: true},
        nickname: {type: String, required: true},
        password: {type: String, required: true}
    }
}