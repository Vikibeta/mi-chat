// 得到查询字符串
// 例如: [ 'nickname', 'avatar' ] => nickname=1&avatar=1

module.exports = function (data) {
  let query = '';
  for (let i = 0; i < data.length; i++) {
    query += `${data[i]}=1&`;
  }
  return query.substr(0, query.length - 1);
};
