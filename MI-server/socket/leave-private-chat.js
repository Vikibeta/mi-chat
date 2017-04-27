/**
 * Created by lavyun on 2017/4/21.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */

var Schema = require('../mongo_models');
var error = require('../utils/errorHandler');
let UserModel = Schema.User;

// 离开房间的回调函数
const leavePrivateRoom = function (socket) {
    function toFirst(user) {
        let index = user.messages.indexOf(socket.roomName);

        user.messages.splice(index, 1);
        user.messages.splice(0, 0, socket.roomName);

        user.save();
    }

    if (socket.hasInput) {

        // 将这条聊天记录同步到两个用户所有消息列表的第一个
        // 如果消息列表中没有，说明是两个人第一次发消息，直接添加到第一个即可
        UserModel.findOne({_id: socket.from_id}).then(user => {
            toFirst(user);
        }).catch(err => {
            error(err);
        });

        UserModel.findOne({_id: socket.to_id}).then(user => {
            toFirst(user);
        }).catch(err => {
            error(err);
        })
    }
};

exports.leavePrivateRoom = leavePrivateRoom;

exports.init = function (socket) {
    // 离开房间
    socket.on('leavePrivateChat', function () {
        leavePrivateRoom(socket);
    });
};