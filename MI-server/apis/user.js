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

        UserModel.findOne({_id: user}, "-messages -password -is_online -groups").then(user => {
            return res.json({
                code: '0',
                data: user
            });
        }).catch(err => {
            error(err, res);
        })
    });

    // 获取分组信息
    router.get('/user/groups', function (req, res) {
        const user = req.mi_user;

        UserModel.findOne({_id: user}, "groups -_id").then(user => {
            return res.json({
                code: '0',
                data: user.groups
            })
        }).catch(err => {
            error(err, res);
        })
    });

    // 公共的api
    router.get('/user/:id', function (req, res) {
        let id = req.params.id;
        let queryKeys = Object.keys(req.query);
        queryKeys.pop(); // 移除token

        // 可以被查询的属性
        let canQueryKeys = ['nickname', 'is_online', 'avatar', 'signature', 'sex', 'birth', 'location'];

        // url是否合法
        let inCanQuery = queryKeys.every(function (value) {
            return canQueryKeys.indexOf(value) !== -1 ? true : false;
        });

        if (inCanQuery) {
            UserModel.findOne({_id: id}, queryKeys.join(' ')).then(user => {
                return res.json({
                    code: '0',
                    data: user
                })
            }).catch(err => {
                error(err, res)
            })
        } else {
            return res.json({
                code: '1',
                data: 'no permission'
            })
        }
    })
};