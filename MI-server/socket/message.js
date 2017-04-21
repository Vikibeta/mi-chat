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


        // 消息对象
        const msgInfo = {
            msg,  // 消息内容
            from: socket.from_id,  // 谁发的
            time: new Date().getTime()  //时间戳
        };

        // 发送消息
        socket.to(socket.roomName).emit('message', msgInfo);


        // 给自己发送服务器的时间，以防客户端时间不同步
        socket.emit('syncTime', new Date().getTime());

        // 存库
        msgInfo.from = socket.fromAlias;

        const updateMessages = async function () {
            await MessagesModel.update({_id: socket.roomName}, {
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
    });
};