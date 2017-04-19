/**
 * Created by lavyun on 2017/4/11.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */

/**
 * 关于消息列表的排序问题：
 * 类似QQ的，客户端收到消息后，该消息排在列表顶部。
 * 实现方案如下：
 * user有一个messages数组字段，里面存放着消息列表的id，类似 ['555555-666666','222222-555555']
 *
 * 方案a:
 * 每次发送聊天消息后，即socket响应'message'时，删除数组中对应的当前消息列表项，并push到最后面
 * 即当前聊天的id是 '555555-666666' 则经过上述操作后的变成:
 * user: {
 *    _id: '555555',
 *    messages: ['222222-555555', '555555-666666']
 * }
 * user: {
 *    _id: '666666',
 *    messages: ['222222-555555', '555555-666666']
 * }
 * 但是每次接受消息后对数据库进行操作的话过于频繁，所以不可取。
 *
 * 方案b:
 * 客户端进入聊天页后，服务端初始化一个socket.hasInput = false 表示用户是否输入过
 * 若用户发送了一条消息，则将socket.hasInput 赋值为true
 * 当客户端离开聊天页面时，触发 服务端 leave事件，leave事件中判断socket.hasInput是否为true，若为true，则进行消息列表的排序操作
 */

/**
 * 关于接受其他用户的聊天内容
 * 类似QQ聊天时，有第三个人给你发消息，你的页面顶部会弹出 xxx对你说：xxxxxxxxx
 * 服务端得到sockets.connected列表，根据id拿到对应的socket，触发该socket对应的事件
 */

var jwt = require('jsonwebtoken');
var Schema = require('../mongo_models');
var config = require('../config');
var error = require('../utils/errorHandler');

module.exports = function (io) {

    const MessageModel = Schema.Messages;
    const UserModel = Schema.User;

    // 验证中间件
    io.use(function (socket, next) {
        const {token} = socket.request._query;
        if (token) {
            jwt.verify(token, config.jwtSecret, function (err, decoded) {
                if (err) {
                    next(new Error(err));
                } else {

                    // 缓存发送者连接者id
                    socket.from_id = decoded._doc._id;

                    // 数据库改变在线状态
                    UserModel.update({_id: decoded._doc._id},{
                        $set: {
                            is_online: true
                        }
                    },function (err) {
                        console.log(err);
                    });

                    console.log(decoded._doc._id + '已登录');
                    return next();
                }
            })
        } else {
            next(new Error('no token'));
        }
    });

    io.on('connection', function (socket) {
        // 加入私聊房间
        socket.on('joinPrivateChat', function (to) {
            let from = socket.from_id;
            socket.to_id = to;
            socket.roomName = from < to ? from + '-' + to : to + '-' + from;

            // 存入数据库的发送者的别名，如果发送者的id较小，则为's(small)'，否则为'b(big)'，目的是减小数据库存
            socket.fromAlias = from < to ? 's' : 'b';

            // 需要自增1的数据库模型字段名
            socket.incProperty = from < to ? 'max_not_read' : 'min_not_read';

            // 是否输入过
            socket.hasInput = false;

            // 加入房间
            socket.join(socket.roomName);

            // 判断 from-to 的文档存不存在， 如果不存在则创建
            const createMessageDoc = async function () {
                const message = await MessageModel.findOne({_id: socket.roomName}).catch(err => {
                    console.log(err);
                });

                if (message === null) {
                    await MessageModel.create({
                        _id: socket.roomName,
                        messages: []
                    }).catch(err => {
                        console.log(err);
                    });

                }
            };

            createMessageDoc();
        });

        // 接受单个socket传来的消息，然后向房间发送消息
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
                const message = await MessageModel.update({_id: socket.roomName}, {
                    $inc: {
                        [socket.incProperty]: 1
                    },
                    $push: {
                        messages: msgInfo
                    }
                });

                // 添加到各个user的messages记录中
                await UserModel.findOne({_id: socket.from_id}, function (error, doc) {
                    doc.sex = 1;
                    doc.save();
                    console.log(doc);
                })
            };

            updateMessages();
        });

        // 离开房间的回调函数
        function leavePrivateRoom(socket) {
            function toFirst(user) {
                let messages = user.messages;
                let index = messages.indexOf(socket.roomName);
                user.messages.splice(index, 1);
                user.messages.splice(0, 0, socket.roomName);
                user.save();
            }

            if (socket.hasInput) {

                // 将这条聊天记录同步到两个用户所有消息列表的第一个
                UserModel.findOne({_id: socket.from_id}).then(user => {
                    toFirst(user);
                });

                UserModel.findOne({_id: socket.to_id}).then(user => {
                    toFirst(user);
                })
            }
        }

        // 离开房间
        socket.on('leavePrivateChat', function () {
            leavePrivateRoom(socket);
        });

        // 断开连接
        socket.on('disconnect', function () {
            leavePrivateRoom(socket);

            // 数据库改变在线状态为离线
            UserModel.update({_id: decoded._doc._id},{
                $set: {
                    is_online: false
                }
            },function (err) {
                console.log(err);
            });

            console.log(socket.from_id+ '已离线');
        })
    });
};