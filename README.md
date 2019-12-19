# 国内地址地区智能解析，无需完整地址也能正确匹配

> 注: 原作者: https://github.com/akebe/address-parse/ 另在此表示感谢.

此版本是修改版, 修改的原因是在小程序中用到, 然而原版本中依赖于 `area.js` , 而该文件会占用太大的体积, 需要改成网络请求获取。(去除了 `area.js` , 改成需要从外部加载地区的 `JSON` 文件)

用法:

```js
import ParseAddress from 'parse-addr-cn';
// 加载地区文件 地区文件格式在 src/area.json
const areaJSON = '<your area json data>';
// 初始化
const parse = new ParseAddress(areaJSON);
// 得到结果
const [result, ...results] = parse('这里输入需要解析的内容');
```

加载后的地区 JSON 可以这样获取:
```js
  const { AREA } = parse.ParseArea
```

### LICENSE
[MIT](https://en.wikipedia.org/wiki/MIT_License)
