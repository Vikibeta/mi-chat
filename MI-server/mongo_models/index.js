/**
 * Created by lavyun on 2017/4/5.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */
var mongoose = require('mongoose');
var glob = require('glob');

var filePattern = 'mongo_models/!(index).js';
var globInstance = new glob.Glob(filePattern, {nonull: true, sync: true}); //同步获取

var files = globInstance.found;
//[ 'mongo_models/user-messages.js', 'mongo_models/user.js' ]


var fileModels = files.map(function (file) {
    return require('./' + file.split('/')[1]);
});


fileModels.forEach(function (item) {
    var schema = new mongoose.Schema(item.model, {
        //将UserMessage替换为user_messages的方法
        collection: item.name.replace(/([A-Z])/g, function (word, placeholder, index) {
            var lowerWord = word.toLowerCase();
            return index === 0 ? lowerWord : '_' + lowerWord;
        })
    });

    exports[item.name] = mongoose.model(item.name, schema);
});

