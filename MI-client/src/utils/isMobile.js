/**
 * Created by lavyun on 2017/4/18.
 * https://www.github.com/lavyun
 * lavyun@163.com
 */

export default function() {

  let userAgentInfo = navigator.userAgent.toLowerCase();

  let Agents = ['android', 'iphone', 'symbianos', 'windows phone', 'ipad', 'ipod'];

  let flag = false;

  for (let v = 0; v < Agents.length; v++) {

    if (userAgentInfo.indexOf(Agents[v]) !== -1) {

      flag = true;

      break;

    }

  }

  return flag;
};
