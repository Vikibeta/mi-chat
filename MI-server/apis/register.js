/**
 * Created by lavyun on 2017/4/8.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
var utils = require('utility');
var Schema = require('../mongo_models');
var error = require('../utils/errorHandler');

module.exports = function (router) {
    const UserModel = Schema.User;
    const ContactsModel = Schema.Contacts;

    router.post('/user', function (req, res) {
        const user = req.body;

        const {id:_id, nickname, password, password1} = user;

        const findUser = async function () {

            const user = await UserModel.findOne({_id}, '_id').catch(err => {
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

            // 添加到用户表中
            await UserModel.create({
                _id,
                nickname,
                password: md5Password
            }).catch(err => {
                error(err, res);
            });

            // 默认的分组
            await ContactsModel.create({
                MI: _id,
                group_name: '我的好友',
                contacts: []
            }).catch(err => {
                error(err, res);
            });


            return res.json({
                code: '0',
                message: '注册成功，正在为您登录'
            });
        };

        findUser();

    });
};


