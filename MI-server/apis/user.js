/**
 * Created by lavyun on 2017/4/8.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
var utils = require('utility');
var Schema = require('../mongo_models');
var error = require('../utils/errorHandler');

module.exports = function (router) {
    router.post('/user', function (req, res) {
        const user = req.body;

        const {id:_id, nickname, password, password1} = user;

        const userModel = Schema.User;

        const findUser = async function () {

            const user = await userModel.findOne({_id}, '_id').catch(err => {
                error(err, res);
            });

            if (user) {
                return res.json({
                    code: '1',
                    message: '账号已存在'
                })
            }

            if (!/^\d{6}$/.test(_id)) {
                return res.json({
                    code: '1',
                    message: 'MI账号为6位纯数字'
                })
            }

            if (nickname.length > 8) {
                return res.json({
                    code: '1',
                    message: '昵称需小于8位'
                });
            }

            if (password.length > 16) {
                return res.json({
                    code: '1',
                    message: '密码需小于16位'
                });
            }

            if (password !== password1) {
                return res.json({
                    code: '1',
                    message: '密码不一致'
                });
            }

            const md5Password = utils.md5(password);

            const newUser = await userModel.create({
                _id,
                nickname,
                password: md5Password
            }).catch(err => {
                error(err, res);
            });

            return res.json({
                code: '0',
                message: '注册成功'
            });
        };

        findUser();

    });


    router.put('/user', function (req, res) {

    });
};


