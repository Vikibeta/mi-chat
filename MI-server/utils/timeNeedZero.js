/**
 * Created by lavyun on 2017/4/19.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
// 前面补字符串0
const timeNeedZero = function (value) {
    return value < 10 ? '0' + value : value;
};

module.exports = timeNeedZero;