/**
 * Created by lavyun on 2017/4/19.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
var jwt = require('jsonwebtoken');
var Schema = require('../mongo_models');
var error = require('../utils/errorHandler');

module.exports = function (router) {
    router.get('/user', function (req, res) {
        const user = req.mi_user;

        const UserModel = Schema.User;

        UserModel.findOne({_id: user}, "-messages -password -is_online").then(user => {
            return res.json({
                code: '0',
                data: user
            });
        }).catch(err => {
            error(err);
        })
    })
};