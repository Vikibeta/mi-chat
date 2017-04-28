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

    socket.on('message', function (msg) {
        // const toSocket = io.sockets.connected[socket.to_id];
        // toSocket.emit('hello');

        // 将socket.hasInput置为true，表示输入过。
        if (!socket.hasInput) socket.hasInput = true;

        let defaultHandler = function () {
            // 消息对象
            const msgInfo = {
                msg,  // 消息内容
                from: socket.from_id,  // 谁发的
                time: new Date().getTime()  //时间戳
            };

            // 发送消息
            socket.to(socket.roomName).emit('message', msgInfo);


            // 给自己发送服务器的时间，以防客户端时间不同步
            socket.emit('syncTime', Date.now());

            // 存库
            msgInfo.from = socket.fromAlias;

            let updateMessages = async function () {

                const message = await MessagesModel.update({_id: socket.roomName}, {
                    $inc: {
                        [socket.incProperty]: 1
                    },
                    $push: {
                        messages: msgInfo,
                    }
                }).catch(err => {
                    error(err);
                });
            };

            updateMessages();
        };

        // 如果是第一次聊天，则数据库创建房间
        if (socket.firstChat) {

            UserModel.findOne({_id: socket.from_id}).then(user => {
                user.messages.splice(0, 0, socket.roomName);
                user.save();
            }).catch(err => {
                error(err);
            });

            UserModel.findOne({_id: socket.to_id}).then(user => {
                user.messages.splice(0, 0, socket.roomName);
                user.save();
            }).catch(err => {
                error(err);
            });

            // 创建房间
            let createRoom = async function () {

                let small_id = socket.roomName.substr(0, 6);
                let large_id = socket.roomName.substr(7, 6);

                let [small_id_info, large_id_info] = await Promise.all([
                    UserModel.findOne({_id: small_id}, 'nickname avatar'),
                    UserModel.findOne({_id: large_id}, 'nickname avatar')
                ]);

                await MessagesModel.create({
                    _id: socket.roomName,
                    messages: [],
                    small_id_info: {
                        _id: small_id_info._id,
                        avatar: small_id_info.avatar,
                        nickname: small_id_info.nickname,
                        not_read: 0
                    },
                    large_id_info: {
                        _id: large_id_info._id,
                        avatar: large_id_info.avatar,
                        nickname: large_id_info.nickname,
                        not_read: 0
                    }
                }).catch(err => {
                    error(err);
                });

            };

            socket.firstChat = false;

            createRoom().then(defaultHandler);
        } else {
            defaultHandler();
        }

    });
};