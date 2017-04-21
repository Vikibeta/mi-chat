/**
 * Created by lavyun on 2017/4/21.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */

var jwt = require('jsonwebtoken');
var config = require('../config');
var Schema = require('../mongo_models');
var error = require('../utils/errorHandler');

module.exports = function (io) {
    let UserModel = Schema.User;

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
                    UserModel.update({_id: decoded._doc._id}, {
                        $set: {
                            is_online: 1
                        }
                    }).then(doc => {
                        console.log(decoded._doc._id + '已登录');
                        return next();
                    }).catch(err => {
                        error(err);
                    });
                }
            })
        } else {
            next(new Error('no token'));
        }
    });
};