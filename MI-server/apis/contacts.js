/**
 * Created by lavyun on 2017/4/8.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
var Schema = require('../mongo_models');
var error = require('../utils/errorHandler');

module.exports = function (router) {

    /**
     * 获取用户联系人列表
     * @req.params.user : 登录的用户
     */
    router.get('/contacts', function (req, res) {
        const user = req.mi_user;

        const contactsModel = Schema.Contacts;

        contactsModel
            .find({'MI': user}, 'group_name contacts -_id')
            .populate({
                path: 'contacts'
            })
            .exec(function (err, doc) {
                if (err) {
                    error(err, res);
                }

                const response = {
                    code: '0',
                    data: doc
                };

                return res.json(response)
            })
    });


    /**
     * 用户添加好友
     * @req.params.user : 登录的用户
     * @req.body.contact : 好友的账号
     * @req.body.group : 放置的分组
     */
    router.post('/contacts', function (req, res) {
        const user = req.miUser;

        const {contacter, group} = req.body;

        const contactsModel = Schema.Contacts;

        const addUserToGroup = async function () {
            const user = await contactsModel.update({MI: user, group_name: group}, {
                '$addToSet': {'contacts': contacter}
            }).catch(err => {
                error(err, res);
            });

            return res.json({
                code: '0',
                message: '添加成功'
            })
        };

        addUserToGroup();
    })
};