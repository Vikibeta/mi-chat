/**
 * Created by lavyun on 2017/4/19.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
var timeNeedZero = require('./timeNeedZero');

module.exports = function (){
    const date = new Date();
    const cYear = date.getFullYear();
    const cMonth = timeNeedZero(date.getMonth() + 1);
    const cDate = timeNeedZero(date.getDate());
    return `${cYear}-${cMonth}-${cDate}`
};
