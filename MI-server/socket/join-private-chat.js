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
        socket.incProperty = from < to ? 'large_id_info.not_read' : 'small_id_info.not_read';

        // 是否输入过
        socket.hasInput = false;

        // 加入房间
        socket.join(socket.roomName);


        // 判断 from-to 的文档存不存在， 如果不存在则创建
        const createMessageDoc = async function () {
            const message = await MessagesModel.findOne({_id: socket.roomName}).catch(err => {
                error(err);
            });

            if (message === null) {
                let small_id = socket.roomName.substr(0, 6);
                let large_id = socket.roomName.substr(7, 6);

                const small_id_info = await UserModel.findOne({_id: small_id}, 'nickname avatar').catch(err => {
                    error(err);
                });

                const large_id_info = await UserModel.findOne({_id: large_id}, 'nickname avatar').catch(err => {
                    error(err);
                });

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

            }
        };

        createMessageDoc();
    });
};