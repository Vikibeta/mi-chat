/**
 * Created by lavyun on 2017/4/19.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
var Schema = require('../mongo_models');
var error = require('../utils/errorHandler');
const UserModel = Schema.User;

module.exports = function (router) {
    router.get('/user', function (req, res) {
        const user = req.mi_user;

        UserModel.findOne({_id: user}, "-messages -password -is_online").then(user => {
            return res.json({
                code: '0',
                data: user
            });
        }).catch(err => {
            error(err);
        })
    });

    // 查看一些状态的接口
    // 某些可以查，某些不可以
    router.get('/user/:id/:type', function (req, res) {
        const {id, type} = req.params;

        const findOne = function (type) {
            UserModel.findOne({_id: id}, `${type} -_id`).then(user => {
                return res.json({
                    code: '0',
                    data: user[type]
                })
            })
        };

        if (type === 'is_online') {
            findOne(type);
        }
    })
};