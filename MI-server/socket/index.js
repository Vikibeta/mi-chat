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

module.exports = function (io) {

    // 验证中间件
    require('./validate-middleware')(io);

    io.on('connection', function (socket) {
        // 加入私聊房间
        require('./join-private-chat')(socket);

        // 接受单个socket传来的消息，然后向房间发送消息
        require('./message')(socket);

        // 离开房间
        require('./leave-private-chat').init(socket);

        // 断开连接
        require('./disconnect')(socket);
    });
};