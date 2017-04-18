/**
 * Created by lavyun on 2017/4/11.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
var Schema = require('../mongo_models');
var config = require('../config');
var error = require('../utils/errorHandler');

module.exports = function (io) {
    // 创建一个private-chat namespace
    const p_cNsp = io.of('/private-chat-namespace');

    // 房间名
    var roomName;

    const MessageModel = Schema.Messages;

    p_cNsp.on('connection', function (socket) {
        // 从socket的连接url中拿到query中的id和
        const {to, token} = socket.request._query;

        // todo this need delete
        const {from} = socket.request._query;
        roomName = from < to ? from + '-' + to : to + '-' + from;
        socket.from = from;
        socket.fromAlias = from < to ? 's' : 'b';  // 存入数据库的发送者的别名，如果发送者的id较小，则为's(small)'，否则为'b(big)'，目的是减小数据库存储
        socket.incProperty = from < to ? 'max_not_read' : 'min_not_read';  // 需要自增1的数据库模型字段名
        socket.join(roomName);
        // todo this need delete


        // token验证
        // if(token) {
        //     jwt.verify(token, config.jwtSecret, function (err, decoded) {
        //         if(err) {
        //             socket.emit('err');   // 身份过期
        //             console.log('身份过期')
        //         } else {
        //             const from = decoded._doc._id;  // 得到token中的id
        //             socket.from = from;
        //             socket.fromAlias = from < to ? 's' : 'b';  // 存入数据库的发送者的别名，如果发送者的id较小，则为's'，否则为'b'，目的是减小数据库存储
        //             roomName = from < to ? from + '-' + to : to + '-' + from;  // 创建房间名，
        //             socket.join(roomName);
        //         }
        //     })
        // } else {
        //     socket.emit('err');  // 没有token
        //     console.log('no token')
        // }

        // 判断 from-to 的文档存不存在， 如果不存在则创建
        const createMessageDoc = async function () {
            const message =await MessageModel.findOne({_id: roomName}).catch(err => {
                console.log(err);
            });

            if(message === null) {
                const createMessage = await MessageModel.create({
                    _id: roomName,
                    messages: []
                }).catch(err => {
                    console.log(err);
                })
            }
        };

        createMessageDoc();

        // 接受单个socket传来的消息，然后向房间发送消息
        socket.on('message', function (msg) {

            // 消息对象
            const msgInfo = {
                msg,
                from: socket.from,
                time: new Date().getTime()
            };

            // 发送消息
            socket.to(roomName).emit('message', msgInfo);

            // 给自己发送服务器的时间，以防客户端时间不同步
            socket.emit('syncTime', new Date().getTime());

            // 存库
            msgInfo.from = socket.fromAlias;
            const updateMessages = async function () {
                const message = await MessageModel.update({_id: roomName},{
                    $inc:{
                        [socket.incProperty]: 1
                    },
                    $push:{
                        messages: msgInfo
                    }
                })
            }

            updateMessages();
        })
    });
};