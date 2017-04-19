var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var config = require('../config');

var register = require('./register');
var login = require('./login');
var getUser = require('./getUser');
var contacts = require('./contacts');

module.exports = function () {
    register(router);
    login(router);

    router.use(function (req, res, next) {
        const token = req.body.token || req.query.token;
        if (token) {
            jwt.verify(token, config.jwtSecret, function (err, decoded) {
                if (err) {
                    return res.json({
                        code: '1',
                        message: err
                    })
                } else {
                    req.decoded = decoded;
                    req.mi_user = decoded._doc._id;
                    next();
                }
            })
        } else {
            res.json(403, {
                message: 'No token provided.'
            })
        }
    });

    getUser(router);

    contacts(router);

    return router;
};


