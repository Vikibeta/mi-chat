/**
 * Created by lavyun on 2017/4/21.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */

var Schema = require('../mongo_models');
var error = require('../utils/errorHandler');

module.exports = function (router) {
    const UserModel = Schema.User;
    const MessagesModel = Schema.Messages;

    // 获取未读消息
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
                        item.messages = item.messages.slice(-20);
                        return item;
                    })
                };

                return res.json(response)
            })
    });

    // 未读数置零
    router.post("/messages/not_read_to_zero/:to", function (req, res) {
        const from = req.mi_user;
        const to = req.params.to;
        const message_id = from < to ? from + '-' + to : to + '-' + from;
        const message_pro = from < to ? 'large_id_info.not_read' : 'small_id_info.not_read';

        MessagesModel.update({_id: message_id}, {
            $set: {
                [message_pro]: 0
            }
        }).then(msg => {
            return res.json({
                code: '0'
            })
        }).catch(err => {
            error(err, res);
        })
    })
};