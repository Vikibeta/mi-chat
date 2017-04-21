/**
 * Created by lavyun on 2017/4/21.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */

var Schema = require('../mongo_models');
var error = require('../utils/errorHandler');

module.exports = function (socket) {

    let UserModel = Schema.User;

    // 断开连接
    socket.on('disconnect', function () {
        require('./leave-private-chat').leavePrivateRoom(socket);

        // 数据库改变在线状态为离线
        UserModel.update({_id: socket.from_id}, {
            $set: {
                is_online: 0
            }
        }, function (err, doc) {
            if(err) error(err);
            console.log(socket.from_id + '已离线');
        });
    })
};