/**
 * address-parse
 * MIT License
 * By www.asseek.com
 */

/**
 * 字符串占位长度
 * @param str
 * @returns {number}
 */
function strLen(str) {
  let l = str.length,
    len = 0;
  for (let i = 0; i < l; i++) {
    len += (str.charCodeAt(i) & 0xff00) !== 0 ? 2 : 1;
  }
  return len;
}

const Reg = {
  mobile: /(86-[1][0-9]{10})|(86[1][0-9]{10})|([1][0-9]{10})/g,
  phone: /(([0-9]{3,4}-)[0-9]{7,8})|([0-9]{12})|([0-9]{11})|([0-9]{10})|([0-9]{9})|([0-9]{8})|([0-9]{7})/g,
  zipCode: /([0-9]{6})/g
};

const Utils = {
  strLen,
  Reg
};

export default Utils;
