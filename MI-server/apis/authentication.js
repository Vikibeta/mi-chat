/**
 * Created by lavyun on 2017/4/8.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
var jwt = require('jsonwebtoken');
var utils = require('utility');
var Schema = require('../mongo_models');
var error = require('../utils/errorHandler');

var config = require('../config');

module.exports = function (router) {
    router.post('/authentication', function (req, res) {
        const {id: _id, password} = req.body;

        const md5Password = utils.md5(password);  // 密码hash化

        const userModel = Schema.User;

        const doAuth = async function () {
            const user = await userModel.findOne({
                _id, password: md5Password
            }).catch(err => {
                error(err, res);
            });

            if (user === null) {
                return res.json({
                    code: '1',
                    message: '账号或密码有误'
                });
            }

            const token = jwt.sign(user, config.jwtSecret, {
                expiresIn: 60 * 60 * 24 * 15
            });

            return res.json({
                code: '0',
                message: '登录成功',
                data: {
                    _id: user._id,
                    nickname: user.nickname,
                    token: token
                }
            })
        };

        doAuth();
    })
};