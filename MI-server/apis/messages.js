/**
 * Created by lavyun on 2017/4/21.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */

var Schema = require('../mongo_models');
var error = require('../utils/errorHandler');

module.exports = function (router) {
    const UserModel = Schema.User;

    router.get('/messages', function (req, res) {
        const user = req.mi_user;

        UserModel
            .findOne({_id: user}, "messages -_id")
            .populate({
                path: 'messages'
            })
            .exec(function (err, docs) {
                if (err) error(err);

                const response = {
                    code: '0',
                    data: docs.messages.map(function (item) {
                        item.messages = item.messages.reverse().slice(0, 20);
                        return item;
                    })
                };

                return res.json(response)
            })
    })
};