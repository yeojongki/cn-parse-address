/**
 * address-parse
 * MIT License
 * By www.asseek.com
 */
const ProvinceKeys = [
  '特别行政区',
  '古自治区',
  '维吾尔自治区',
  '壮族自治区',
  '回族自治区',
  '自治区',
  '省省直辖',
  '省',
  '市'
];

const CityKeys = [
  '布依族苗族自治州',
  '苗族侗族自治州',
  '藏族羌族自治州',
  '哈尼族彝族自治州',
  '壮族苗族自治州',
  '傣族景颇族自治州',
  '蒙古族藏族自治州',
  '傣族自治州',
  '白族自治州',
  '藏族自治州',
  '彝族自治州',
  '回族自治州',
  '蒙古自治州',
  '朝鲜族自治州',
  '地区',
  '哈萨克自治州',
  '盟',
  '市'
];

const AreaKeys = [
  '满族自治县',
  '满族蒙古族自治县',
  '蒙古族自治县',
  '朝鲜族自治县',
  '回族彝族自治县',
  '彝族回族苗族自治县',
  '彝族苗族自治县',
  '土家族苗族自治县',
  '布依族苗族自治县',
  '苗族布依族自治县',
  '彝族傣族自治县',
  '傣族彝族自治县',
  '仡佬族苗族自治县',
  '黎族苗族自治县',
  '苗族侗族自治县',
  '哈尼族彝族傣族自治县',
  '哈尼族彝族自治县',
  '彝族哈尼族拉祜族自治县',
  '傣族拉祜族佤族自治县',
  '傣族佤族自治县',
  '拉祜族佤族布朗族傣族自治县',
  '苗族瑶族傣族自治县',
  '彝族回族自治县',
  '独龙族怒族自治县',
  '保安族东乡族撒拉族自治县',
  '回族土族自治县',
  '撒拉族自治县',
  '哈萨克自治县',
  '塔吉克自治县',
  '回族自治县',
  '畲族自治县',
  '土家族自治县',
  '布依族自治县',
  '苗族自治县',
  '瑶族自治县',
  '侗族自治县',
  '水族自治县',
  '傈僳族自治县',
  '仫佬族自治县',
  '毛南族自治县',
  '黎族自治县',
  '羌族自治县',
  '彝族自治县',
  '藏族自治县',
  '纳西族自治县',
  '裕固族自治县',
  '哈萨克族自治县',
  '哈尼族自治县',
  '拉祜族自治县',
  '佤族自治县',
  '左旗',
  '右旗',
  '中旗',
  '后旗',
  '联合旗',
  '自治旗',
  '旗',
  '自治县',
  '区',
  '县',
  '市'
];

class ParseArea {
  static isInit = false;

  static ProvinceShort = {};

  static CityShort = {};

  static AreaShort = {};

  static AREA = null;

  /**
   * 通过地区编码返回省市区对象
   * @param code
   * @returns {{code: *, province: (*|string), city: (*|string), area: (*|string)}}
   */
  static getAreaByCode(code) {
    const pCode = `${code.slice(0, 2)}0000`,
      cCode = `${code.slice(0, 4)}00`;
    return {
      code: code,
      province: ParseArea.AREA.province_list[pCode] || '',
      city: ParseArea.AREA.city_list[cCode] || '',
      area: ParseArea.AREA.area_list[code] || ''
    };
  }

  /**
   * 通过code取父省市对象
   * @param target province/city/area
   * @param code
   * @returns {Array} [province, city, area]
   */
  static getTargetParentAreaListByCode(target, code) {
    const result = [];
    result.unshift({
      code,
      name: ParseArea.AREA.area_list[code] || ''
    });
    if (['city', 'province'].includes(target)) {
      code = code.slice(0, 4) + '00';
      result.unshift({
        code,
        name: ParseArea.AREA.city_list[code] || ''
      });
    }
    if (target === 'province') {
      code = code.slice(0, 2) + '0000';
      result.unshift({
        code,
        name: ParseArea.AREA.province_list[code] || ''
      });
    }
    return result;
  }

  /**
   * 根据省市县类型和对应的`code`获取对应列表
   * 只能逐级获取 province->city->area OK  province->area ERROR
   * @param target String province city area
   * @param code
   * @param parent 默认获取子列表 如果要获取的是父对象 传true
   * @returns {*}
   */
  static getTargetAreaListByCode(target, code, parent) {
    if (parent) return ParseArea.getTargetParentAreaListByCode(target, code);
    let result = [];
    let list =
      ParseArea.AREA[
        {
          city: 'city_list',
          area: 'area_list'
        }[target]
      ];
    if (code && list) {
      code = code.toString();
      let provinceCode = code.slice(0, 2);
      let cityCode = code.slice(2, 4);
      if (target === 'area' && cityCode !== '00') {
        code = `${provinceCode}${cityCode}`;
        for (let j = 0; j < 100; j++) {
          let _code = `${code}${j < 10 ? '0' : ''}${j}`;
          if (list[_code]) {
            result.push({
              code: _code,
              name: list[_code]
            });
          }
        }
      } else {
        for (let i = 0; i < 91; i++) {
          //最大city编码只到91
          //只有city跟area
          code = `${provinceCode}${i < 10 ? '0' : ''}${i}${target === 'city' ? '00' : ''}`;
          if (target === 'city') {
            if (list[code]) {
              result.push({
                code,
                name: list[code]
              });
            }
          } else {
            for (let j = 0; j < 100; j++) {
              let _code = `${code}${j < 10 ? '0' : ''}${j}`;
              if (list[_code]) {
                result.push({
                  code: _code,
                  name: list[_code]
                });
              }
            }
          }
        }
      }
    } else {
      for (let code in list) {
        result.push({
          code,
          name: list[code]
        });
      }
    }
    return result;
  }

  /**
   * 通过省市区非标准字符串准换为标准对象
   * 旧版识别的隐藏省份后缀的对象可通过这个函数转换为新版支持对象
   * @param province
   * @param city
   * @param area
   * @returns {{code: string, province: string, city: string, area: string}}
   */
  static getAreaByAddress({ province, city, area }) {
    const { province_list, city_list, area_list } = ParseArea.AREA;
    const result = {
      code: '',
      province: '',
      city: '',
      area: ''
    };
    for (let _code in province_list) {
      let _province = province_list[_code];
      if (_province.indexOf(province) === 0) {
        result.code = _code;
        result.province = _province;
        _code = _code.substr(0, 2);
        for (let _code_city in city_list) {
          if (_code_city.indexOf(_code) === 0) {
            let _city = city_list[_code_city];
            if (_city.indexOf(city) === 0) {
              result.code = _code_city;
              result.city = _city;
              if (area) {
                _code_city = _code_city.substr(0, 4);
                for (let _code_area in area_list) {
                  if (_code_area.indexOf(_code_city) === 0) {
                    let _area = area_list[_code_area];
                    if (_area.indexOf(area) === 0) {
                      result.code = _code_area;
                      result.area = _area;
                      break;
                    }
                  }
                }
              }
              break;
            }
          }
        }
        break;
      }
    }
    return result;
  }

  static init(areaJSON) {
    if (!areaJSON) {
      throw new Error('init fn `areaJSON` must be required');
    }
    ParseArea.AREA = areaJSON;

    for (let code in ParseArea.AREA.province_list) {
      let province = ParseArea.AREA.province_list[code];
      ParseArea.ProvinceShort[code] = ProvinceKeys.reduce((v, key) => v.replace(key, ''), province);
    }

    for (let code in ParseArea.AREA.city_list) {
      let city = ParseArea.AREA.city_list[code];
      if (city.length > 2) {
        ParseArea.CityShort[code] = CityKeys.reduce((v, key) => v.replace(key, ''), city);
      }
    }
    for (let code in ParseArea.AREA.area_list) {
      let area = ParseArea.AREA.area_list[code];
      if (area === '雨花台区') area = '雨花区';
      if (area.length > 2) {
        ParseArea.AreaShort[code] = AreaKeys.reduce((v, key) => v.replace(key, ''), area);
      }
    }
    ParseArea.isInit = true;
  }

  constructor(address, areaJSON) {
    if (!ParseArea.isInit) {
      ParseArea.init(areaJSON);
    }
    if (address) {
      return this.parse(address);
    }
  }

  /**
   * 开始解析
   * @param address string
   * @param parseAll 是否执行全部解析 默认识别到city终止
   * @returns {Array}
   */
  parse(address, parseAll) {
    this.results = [];

    // 正向解析
    this.results.unshift(...ParseArea.parseByProvince(address));
    if (parseAll || !this.results[0] || !this.results[0].__parse) {
      // 逆向城市解析  通过所有CityShort匹配
      this.results.unshift(...ParseArea.parseByCity(address));
      if (parseAll || !this.results[0] || !this.results[0].__parse) {
        // 逆向地区解析   通过所有AreaShort匹配
        this.results.unshift(...ParseArea.parseByArea(address));
      }
    }
    // 可信度排序
    this.results.sort((a, b) =>
      a.__parse && !b.__parse
        ? -1
        : !a.__parse && b.__parse
        ? 1
        : a.name.length > b.name.length
        ? 1
        : a.name.length < b.name.length
        ? -1
        : 0
    );

    return this.results;
  }

  /**
   * 1.1 提取省份
   */
  static parseByProvince(addressBase) {
    const province_list = ParseArea.AREA.province_list;
    const results = [];
    const result = {
      province: '',
      city: '',
      area: '',
      details: '',
      name: '',
      code: '',
      __type: 'parseByProvince',
      __parse: false
    };
    let address = addressBase;
    for (let code in province_list) {
      const province = province_list[code];
      let index = address.indexOf(province);
      let shortProvince = index > -1 ? '' : ParseArea.ProvinceShort[code];
      let provinceLength = shortProvince ? shortProvince.length : province.length;
      if (shortProvince) {
        index = address.indexOf(shortProvince);
      }
      if (index > -1) {
        // 如果省份不是第一位 在省份之前的字段识别为名称
        if (index > 0) {
          result.name = address.substr(0, index).trim();
          address = address.substr(index).trim();
        }
        result.province = province;
        result.code = code;
        let _address = address.substr(provinceLength);
        if (_address.charAt(0) !== '市' || _address.indexOf(province) > -1) {
          address = _address;
        }
        //如果是用短名匹配的 要替换省关键字
        if (shortProvince) {
          for (let key of ProvinceKeys) {
            if (address.indexOf(ProvinceKeys[key]) === 0) {
              address = address.substr(ProvinceKeys[key].length);
            }
          }
        }
        let __address = ParseArea.parse_city_by_province(address, result);
        if (!result.city) {
          __address = ParseArea.parse_area_by_province(address, result);
        }
        if (result.city) {
          address = __address;
          result.__parse = true;
          break;
        } else {
          //如果没有识别到地区 缓存本次结果，并重置数据
          results.unshift({ ...result, details: address.trim() });
          result.province = '';
          result.code = '';
          result.name = '';
          address = addressBase;
        }
      }
    }
    if (result.code) {
      results.unshift({ ...result, details: address.trim() });
    }
    return results;
  }

  /**
   * 1.2.提取城市
   * @returns {boolean}
   */
  static parse_city_by_province(address, result) {
    const cityList = ParseArea.getTargetAreaListByCode('city', result.code);
    for (let city of cityList) {
      let index = address.indexOf(city.name);
      let shortCity = index > -1 ? '' : ParseArea.CityShort[city.code];
      let cityLength = shortCity ? shortCity.length : city.name.length;
      if (shortCity) {
        index = address.indexOf(shortCity);
      }
      if (index > -1 && index < 3) {
        result.city = city.name;
        result.code = city.code;
        address = address.substr(index + cityLength);
        //如果是用短名匹配的 要替换市关键字
        if (shortCity) {
          for (let key of CityKeys) {
            if (address.indexOf(key) === 0) {
              //排除几个会导致异常的解析
              if (
                key !== '市' &&
                !['市北区', '市南区', '市中区', '市辖区'].some(v => address.indexOf(v) === 0)
              ) {
                address = address.substr(key.length);
              }
            }
          }
        }
        address = ParseArea.parse_area_by_city(address, result);
        break;
      }
    }
    return address;
  }

  /**
   * 1.3.,2.2 已匹配城市的地址 提取地区
   * @param address string
   * @param result object
   * @returns {string}
   */
  static parse_area_by_city(address, result) {
    const areaList = ParseArea.getTargetAreaListByCode('area', result.code);
    for (let area of areaList) {
      let index = address.indexOf(area.name);
      let shortArea = index > -1 ? '' : ParseArea.AreaShort[area.code];
      let areaLength = shortArea ? shortArea.length : area.name.length;
      if (shortArea) {
        index = address.indexOf(shortArea);
      }
      if (index > -1 && index < 3) {
        result.area = area.name;
        result.code = area.code;
        address = address.substr(index + areaLength);
        //如果是用短名匹配的 要替换市关键字
        if (shortArea) {
          for (let key of AreaKeys) {
            if (address.indexOf(key) === 0) {
              address = address.substr(key.length);
            }
          }
        }
        break;
      }
    }
    return address;
  }

  /**
   * 1.4.提取省份但没有提取到城市的地址尝试通过省份下地区匹配
   */
  static parse_area_by_province(address, result) {
    const areaList = ParseArea.getTargetAreaListByCode('area', result.code);
    for (let area of areaList) {
      let index = address.indexOf(area.name);
      let shortArea = index > -1 ? '' : ParseArea.AreaShort[area.code];
      let areaLength = shortArea ? shortArea.length : area.name.length;
      if (shortArea) {
        index = address.indexOf(shortArea);
      }
      if (index > -1 && index < 6) {
        const [city] = ParseArea.getTargetAreaListByCode('city', area.code, true);
        result.city = city.name;
        result.area = area.name;
        result.code = area.code;
        address = address.substr(index + areaLength);
        //如果是用短名匹配的 要替换地区关键字
        if (shortArea) {
          for (let key of AreaKeys) {
            if (address.indexOf(key) === 0) {
              address = address.substr(key.length);
            }
          }
        }
        break;
      }
    }
    return address;
  }

  /**
   * 2.1 通过城市识别地址
   * @param addressBase string
   * @returns {Array}
   */
  static parseByCity(addressBase) {
    const city_list = ParseArea.AREA.city_list;
    const results = [];
    const result = {
      province: '',
      city: '',
      area: '',
      details: '',
      name: '',
      code: '',
      __type: 'parseByCity',
      __parse: false
    };
    let address = addressBase;
    for (let code in city_list) {
      const city = city_list[code];
      if (city.length < 2) break;
      let index = address.indexOf(city);
      let shortCity = index > -1 ? '' : ParseArea.CityShort[code];
      let cityLength = shortCity ? shortCity.length : city.length;
      if (shortCity) {
        index = address.indexOf(shortCity);
      }
      if (index > -1) {
        const [province] = ParseArea.getTargetAreaListByCode('province', code, true);
        result.province = province.name;
        result.city = city;
        result.code = code;
        // 左侧排除省份名剩下的内容识别为姓名
        let leftAddress = address.substr(0, index);
        let _provinceName = '';
        if (leftAddress) {
          _provinceName = province.name;
          let _index = leftAddress.indexOf(_provinceName);
          if (_index === -1) {
            _provinceName = ParseArea.ProvinceShort[province.code];
            _index = leftAddress.indexOf(_provinceName);
            if (_index === -1) _provinceName = '';
          }
          if (_provinceName) {
            leftAddress = leftAddress.replace(new RegExp(_provinceName, 'g'), '');
          }
          if (leftAddress) {
            result.name = leftAddress;
          }
        }

        address = address.substr(index + cityLength);
        address = ParseArea.parse_area_by_city(address, result);
        if (_provinceName || result.area) {
          result.__parse = true;
          break;
        } else {
          //如果没有识别到省份和地区 缓存本次结果，并重置数据
          results.unshift({ ...result, details: address.trim() });
          result.name = '';
          result.city = '';
          result.province = '';
          result.code = '';
          address = addressBase;
        }
      }
    }
    if (result.code) {
      results.unshift({ ...result, details: address.trim() });
    }
    return results;
  }

  /**
   * 3 通过地区识别地址
   * @returns {Array}
   */
  static parseByArea(addressBase) {
    const area_list = ParseArea.AREA.area_list;
    const results = [];
    const result = {
      province: '',
      city: '',
      area: '',
      details: '',
      name: '',
      code: '',
      __type: 'parseByArea',
      __parse: false
    };
    let address = addressBase;
    for (let code in area_list) {
      const area = area_list[code];
      if (area.length < 2) break;
      let index = address.indexOf(area);
      let shortArea = index > -1 ? '' : ParseArea.AreaShort[code];
      let areaLength = shortArea ? shortArea.length : area.length;
      if (shortArea) {
        index = address.indexOf(shortArea);
      }
      if (index > -1) {
        const [province, city] = ParseArea.getTargetAreaListByCode('province', code, true);
        result.province = province.name;
        result.city = city.name;
        result.area = area;
        result.code = code;
        // 左侧排除省份城市名剩下的内容识别为姓名
        let leftAddress = address.substr(0, index);
        let _provinceName = '',
          _cityName = '';
        if (leftAddress) {
          _provinceName = province.name;
          let _index = leftAddress.indexOf(_provinceName);
          if (_index === -1) {
            _provinceName = ParseArea.ProvinceShort[province.code];
            _index = leftAddress.indexOf(_provinceName);
            if (_index === -1) _provinceName = '';
          }
          if (_provinceName) {
            leftAddress = leftAddress.replace(new RegExp(_provinceName, 'g'), '');
          }

          _cityName = city.name;
          _index = leftAddress.indexOf(_cityName);
          if (_index === -1) {
            _cityName = ParseArea.CityShort[city.code];
            _index = leftAddress.indexOf(_cityName);
            if (_index === -1) _cityName = '';
          }
          if (_cityName) {
            leftAddress = leftAddress.replace(new RegExp(_cityName, 'g'), '');
          }
          if (leftAddress) {
            result.name = leftAddress.trim();
          }
        }
        address = address.substr(index + areaLength);

        if (_provinceName || _cityName) {
          result.__parse = true;
          break;
        } else {
          //如果没有识别到省份和地区 缓存本次结果，并重置数据
          results.unshift({ ...result, details: address.trim() });
          result.name = '';
          result.city = '';
          result.area = '';
          result.province = '';
          result.code = '';
          address = addressBase;
        }
      }
    }
    if (result.code) {
      results.unshift({ ...result, details: address.trim() });
    }
    return results;
  }
}

export default ParseArea;
