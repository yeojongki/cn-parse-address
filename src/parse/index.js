/**
 * address-parse
 * MIT License
 * By www.asseek.com
 */
import Utils from './utils';
import ParseArea from './parse-area';

class ParseAddress {
  static ExcludeKeys = [
    '发件人',
    '收货地址',
    '收货人',
    '收件人',
    '收货',
    '手机号码',
    '邮编',
    '电话',
    '所在地区',
    '详细地址',
    '地址',
    '：',
    ':',
    '；',
    ';',
    '，',
    ',',
    '。',
    '、'
  ];

  static ParseArea;

  static Reg = Utils.Reg;

  constructor(areaJSON) {
    if (!ParseAddress.ParseArea) {
      ParseAddress.ParseArea = new ParseArea(null, areaJSON);
    }
  }

  /**
   * 开始解析
   * @param address string 地址
   * @param parseAll boolean 是否完全解析
   * @returns {Array}
   */
  parse(address, parseAll) {
    let results = [];
    if (address) {
      this.result = {
        mobile: '',
        zip_code: '',
        phone: ''
      };

      this.address = address;
      this.replace();
      this.parseMobile();
      this.parsePhone();
      this.parseZipCode();
      this.address = this.address.replace(/ {2,}/, ' ');

      results = ParseAddress.ParseArea.parse(this.address, parseAll);

      for (let result of results) {
        Object.assign(result, this.result);
        ParseAddress.parseName(result);
      }
      if (!results.length) {
        let result = Object.assign(this.result, {
          province: '',
          city: '',
          area: '',
          details: this.address,
          name: '',
          code: '',
          __type: ''
        });
        ParseAddress.parseName(result);
        results.push(result);
      }
    }

    return results;
  }

  /**
   * 替换无效字符
   */
  replace() {
    let { address } = this;
    for (let key of ParseAddress.ExcludeKeys) {
      address = address.replace(new RegExp(key, 'g'), ' ');
    }
    this.address = address
      .replace(/\r\n/g, ' ')
      .replace(/\n/g, ' ')
      .replace(/\t/g, ' ')
      .replace(/ {2,}/g, ' ')
      .replace(/(\d{3})-(\d{4})-(\d{4})/g, '$1$2$3')
      .replace(/(\d{3}) (\d{4}) (\d{4})/g, '$1$2$3');
  }

  /**
   * 提取手机号码
   */
  parseMobile() {
    ParseAddress.Reg.mobile.lastIndex = 0;
    const mobile = ParseAddress.Reg.mobile.exec(this.address);
    if (mobile) {
      this.result.mobile = mobile[0];
      this.address = this.address.replace(mobile[0], ' ');
    }
  }

  /**
   * 提取电话号码
   */
  parsePhone() {
    ParseAddress.Reg.phone.lastIndex = 0;
    const phone = ParseAddress.Reg.phone.exec(this.address);
    if (phone) {
      this.result.phone = phone[0];
      this.address = this.address.replace(phone[0], ' ');
    }
  }

  /**
   * 提取邮编
   */
  parseZipCode() {
    ParseAddress.Reg.zipCode.lastIndex = 0;
    const zip = ParseAddress.Reg.zipCode.exec(this.address);
    if (zip) {
      this.result.zip_code = zip[0];
      this.address = this.address.replace(zip[0], '');
    }
  }

  /**
   * 提取姓名
   * @param result
   * @param maxLen 字符串占位 比这个数值短才识别为姓名 汉字2位英文1位
   */
  static parseName(result, maxLen = 11) {
    if (!result.name) {
      const list = result.details.split(' ');
      const name = {
        value: '',
        index: -1
      };
      if (list.length > 1) {
        list.forEach((v, i) => {
          if (v && Utils.strLen(v) < maxLen) {
            if (!name.value || Utils.strLen(name.value) > Utils.strLen(v)) {
              name.value = v;
              name.index = i;
            }
          }
        });
      }
      if (name.value) {
        result.name = name.value;
        list.splice(name.index, 1);
        result.details = list.join(' ');
      }
    }
  }
}

export default ParseAddress;
