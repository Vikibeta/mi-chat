/**
 * Created by lavyun on 2017/4/16.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */

// 前面补字符串0
const timeNeedZero = function (value) {
  return value < 10 ? '0' + value : value;
};

// 时间格式化
const messageTime = function (timestamp) {
  // 需要被格式化的时间对象
  const time = new Date(timestamp);

  // 得到今天日期
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();

  // 今天零点
  const date = new Date();
  date.setDate(currentDate);
  date.setFullYear(currentYear);
  date.setMonth(currentMonth);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);

  // 一天的微秒数
  const oneDayTS = 1000 * 60 * 60 * 24;

  // 今天零点时的时间戳
  const todayTS = date.getTime();

  // 昨天零点时的时间戳
  const yesterdayTS = todayTS - oneDayTS;

  // 一星期前零点时的时间戳
  const lastWeekTS = yesterdayTS - oneDayTS * 6;

  const timeHour = timeNeedZero(time.getHours());
  const timeMinute = timeNeedZero(time.getMinutes());

  if (timestamp >= todayTS) {
    return `今天 ${timeHour}:${timeMinute}`;
  }

  if (timestamp >= yesterdayTS) {
    return `昨天 ${timeHour}:${timeMinute}`;
  }

  if (timestamp >= lastWeekTS) {
    const dayOfWeek = time.getDay();
    const dayOfWeekZN = ['日', '一', '二', '三', '四', '五', '六'];
    return `星期${dayOfWeekZN[dayOfWeek]} ${timeHour}:${timeMinute}`;
  }

  const timeYear = time.getFullYear();
  const timeMonth = timeNeedZero(time.getMonth() + 1);
  const timeDate = timeNeedZero(time.getDate());

  return `${timeYear}-${timeMonth}-${timeDate}`;
};

const avatarLocation = function (avatarName) {
  const avatarDomain = 'http://oonegmkmg.bkt.clouddn.com';
  const avatarQiniuSheet = 'imageView2/1/w/128/h/128/interlace/1/q/80|imageslim';
  return `${avatarDomain}/${avatarName}?${avatarQiniuSheet}`;
};

export {messageTime, avatarLocation}

