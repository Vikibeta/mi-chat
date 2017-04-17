/**
 * Created by lavyun on 2017/4/11.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */

var Schema = require('../mongo_models');

module.exports = function (router) {
    router.all('/private_chat', function (req, res) {
        res.json({
            code: '0',
            message: 'pass'
        })
    })
};