/**
 * Created by lavyun on 2017/4/19.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
var fs = require('fs');
var formidable = require('formidable');
var qiniu = require('qiniu');
var config = require('../config');
var Schema = require('../mongo_models');
var error = require('../utils/errorHandler');
const UserModel = Schema.User;

module.exports = function (router) {
    // 获取个人信息
    router.get('/user', function (req, res) {
        const user = req.mi_user;

        UserModel.findOne({_id: user}, "-messages -password -is_online -_v").then(user => {
            return res.json({
                code: '0',
                data: user
            });
        }).catch(err => {
            error(err, res);
        })
    });

    // 根据年龄，性别，所在地条件查询
    router.get('/users', function (req, res) {
        let {sex, sAge, bAge, location} = req.query;

        sex = sex === '0' ? '男' : '女';
        location = location || '中国';
        sAge = +sAge;  // 字符串转成数字
        bAge = +bAge;

        UserModel.find({
            sex,
            location,
            age: {
                $gte: sAge,
                $lte: bAge
            }
        }, "nickname is_online signature avatar birth").then(users => {
            return res.json({
                code: '0',
                data: users
            })
        }).catch(err => {
            error(err, res)
        })
    });

    // 修改个人信息
    router.put('/user', function (req, res) {
        const user = req.mi_user;
        const data = req.body;

        UserModel.update({_id: user}, {$set: data}).then(user => {
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

    // 更新头像
    router.put('/user/avatar', function (req, res) {
        const user = req.mi_user;
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
                        if (err) error(err, res);
                    });

                    // 将新的头像文件名写入数据库
                    UserModel.update({_id: user}, {
                        $set: {
                            avatar: ret.key
                        }
                    }).then().catch(err => {
                        error(err, res);
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