var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var config = require('../config');

var user = require('./user');
var authenticate = require('./authentication');
var contacts = require('./contacts');
var privateChat = require('./private-chat');

module.exports = function () {
    user(router);
    authenticate(router);

    router.use(function (req, res, next) {
        const token = req.body.token || req.query.token;
        if (token) {
            jwt.verify(token, config.jwtSecret, function (err, decoded) {
                if (err) {
                    return res.json({
                        code: '1',
                        message: '身份验证已过期'
                    })
                } else {
                    req.decoded = decoded;
                    req.miUser = decoded._doc._id;
                    next();
                }
            })
        } else {
            res.json(403, {
                message: 'No token provided.'
            })
        }
    });

    contacts(router);

    privateChat(router);

    return router;
};


