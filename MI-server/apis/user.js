/**
 * Created by lavyun on 2017/4/19.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
var formidable = require('formidable');
var qiniu = require('qiniu');
var fs = require('fs');
var config = require('../config');
var Schema = require('../mongo_models');
var error = require('../utils/errorHandler');
const UserModel = Schema.User;

module.exports = function (router) {
    // 获取个人信息
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

    // 修改个人信息
    router.put('/user', function (req, res) {
        const user = req.mi_user;
        const data = req.body;
        console.log(data);

        UserModel.update({_id: user}, {
            $set: data
        }).then(user => {
            return res.json({
                code: '0',
                data: user
            })
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
    });

    // 更新头像
    router.put('/user/avatar', function (req, res) {
        const form = new formidable.IncomingForm();
        form.uploadDir = './public/tmp';
        form.encoding = 'utf-8';
        form.keepExtensions = true;

        form.parse(req, function (err, fields, files) {
            if (err) error(err, res);

            const avatar = files.file;
            const filePath = avatar.path;
            const mine = avatar.type;

            qiniu.conf.ACCESS_KEY = config.qiniu_access;
            qiniu.conf.SECRET_KEY = config.qiniu_secret;

            if (!/^image\/(jpg|png|jpeg)$/.test(mine)) {
                return res.json({
                    code: '1',
                    message: '发生错误，无效的后缀名'
                })
            }

            // 上传到云储存的文件名
            const qiniu_filename = req.mi_user + '_' + Date.now();

            //构建上传策略函数
            const uptoken = function (bucket, key) {
                const putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
                return putPolicy.token();
            };

            //生成上传 Token
            const qiniu_token = uptoken(config.qiniu_bucket, qiniu_filename);

            //构造上传函数
            const uploadFile = function (uptoken, key, localFile) {
                const extra = new qiniu.io.PutExtra();
                qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret) {
                    if (err) error(err, res);

                    // 删除临时文件
                    fs.unlink(filePath, function (err) {
                        if(err) error(err, res);
                    });

                    return res.json({
                        code: '0',
                        data: {
                            avatar: ret.key
                        }
                    });
                });
            };

            //调用uploadFile上传
            uploadFile(qiniu_token, qiniu_filename, filePath);

        })

    });
};