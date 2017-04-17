/**
 * Created by lavyun on 2017/4/11.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
var jwt = require('jsonwebtoken');
var privateChat = require('./private-chat');

module.exports = function (io) {

    privateChat(io)

};