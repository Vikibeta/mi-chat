/**
 * Created by lavyun on 2017/4/9.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
module.exports = {
    name: 'Contacts',
    model: {
        MI: String,
        group_name: String,
        contacts: [{type: String, ref: 'User'}]
    }
};