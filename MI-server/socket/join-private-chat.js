/**
 * Created by lavyun on 2017/4/21.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */

var Schema = require('../mongo_models');
var error = require('../utils/errorHandler');

module.exports = function (socket) {

    let MessagesModel = Schema.Messages;
    let UserModel = Schema.User;

    // 加入私聊房间
    socket.on('joinPrivateChat', function (to) {
        let from = socket.from_id;
        socket.to_id = to;
        socket.roomName = from < to ? from + '-' + to : to + '-' + from;

        // 存入数据库的发送者的别名，如果发送者的id较小，则为's(small)'，否则为'l(large)'，目的是减小数据库存
        socket.fromAlias = from < to ? 's' : 'l';

        // 需要自增1的数据库模型字段名
        socket.incProperty = from > to ? 'large_id_info.not_read' : 'small_id_info.not_read';

        // 是否输入过
        socket.hasInput = false;

        // 加入房间
        socket.join(socket.roomName);

        // 是不是第一次聊天
        socket.firstChat = false;
        MessagesModel.findOne({_id: socket.roomName}, "_id").then(message => {
            if (message === null) {
                socket.firstChat = true;
            }
        }).catch(err => {
            error(err);
        });
    });
};