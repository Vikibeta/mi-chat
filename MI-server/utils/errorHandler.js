/**
 * Created by lavyun on 2017/4/8.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
module.exports = function (err, res) {
    return res.json({
        code: '1',
        message: '服务器发生错误，请重试'
    })
};