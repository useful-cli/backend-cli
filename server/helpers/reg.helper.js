/**
 * Module description: reg正则处理模块
 */
const moment = require('moment');
const localTime = require('moment-timezone');

function replaceToSpace() {
    return localTime.tz(moment(), "Asia/Shanghai");
}

export default {
  replaceToSpace
};
