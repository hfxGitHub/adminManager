import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';
import remoteLinkAddress from './ip';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path,
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

export function deepCopy(o) {
  const isArray = o instanceof Array;
  const isObject = o instanceof Object;
  if (!isObject) return o;
  const n = (isArray ? [] : {});
  for (const k in o) n[k] = deepCopy(o[k]);
  return n;
}

export function findValueByKey(key, src, type, defaults) {
  const result = src.filter((current) => {
    return current.key == key;
  })[0];
  return result ? (type ? result[type] : result.value) : type ? defaults : '空';
}

export function filter(obj, func) {
  console.log(obj);
  let result = {};
  for (let _key in obj) {
    if (obj.hasOwnProperty(_key) && func(_key, obj[_key])) {
      result[_key] = obj[_key];
    }
  }
  return result;
}

//创建
export function createTheURL(modelAPI, interfaceType) {
  const temp = modelAPI.split('');
  if(!interfaceType) interfaceType='';
  if (temp[temp.length - 1] !== '/' && interfaceType) {
    temp.push('/');
  }
  const baseURL = remoteLinkAddress();
  const IP = baseURL + temp.join('') + interfaceType;
  return IP;
}


export function getNowFormatDate(time) {
  const date = time ? new Date(time) : new Date();
  const seperator1 = '-';
  const seperator2 = ':';
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = `0${month}`;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = `0${strDate}`;
  }
  const currentdate = `${date.getFullYear() + seperator1 + month + seperator1 + strDate
    } ${date.getHours()}${seperator2}${date.getMinutes()
    }${seperator2}${date.getSeconds()}`;
  return currentdate;
}

export function changeArrayToTree(list, parentId, config = {}) {
  let tree = [];
  const { idName = 'id', parentIdName = 'parentId', childrenName = 'children' } = config;
  for (let i of list) {
    if (i[parentIdName] === parentId) {
      let o = i;
      let t = changeArrayToTree(list, i[idName], { idName, parentIdName, childrenName });
      if (t.length > 0) {
        o[childrenName] = t;
      }
      tree.push({
        ...o,
      });
    }
  }
  return tree;
}

export function getDictByType(dictDataArr, typeName) {
  let resArr = [];
  if (!isArrayFn(dictDataArr)) {
    console.log('dictDataArr不是数组');
    return resArr;
  }
  resArr = dictDataArr.filter(function(current) {
    return current.type == typeName;
  });
  if (resArr.length == 0) {
    console.log(`类型${typeName} 没有找到字典中的数据，请检查`);
  }
  return resArr;
}

export function getAllDictNameById(dictDataArr, typeName, searchId) {
  let resArr = [];
  if (!isArrayFn(dictDataArr)) {
    console.log('dictDataArr不是数组');
    return resArr;
  }
  resArr = dictDataArr.filter(function(current) {
    return current.type == typeName && current.k == searchId;
  });
  if (resArr.length > 0) {
    return resArr[0].val;
  }
  else {
    console.log(`类型${typeName}  查找${searchId}  没有找到字典中的数据，请检查`);
  }
}

export function getDictNameById(dictDataArr, searchId) {
  let resArr = [];
  if (!isArrayFn(dictDataArr)) {
    console.log('dictDataArr不是数组');
    return resArr;
  }
  resArr = dictDataArr.filter(function(current) {
    return current.k == searchId;
  });
  if (resArr.length > 0) {
    return resArr[0].val;
  }
  else {
    console.log('没有找到字典中的数据，请检查');
  }
}

export function getGuideNameById(guideArr, searchId) {
  let resArr = [];
  if (!isArrayFn(guideArr)) {
    console.log('guideArr不是数组');
    return resArr;
  }
  resArr = guideArr.filter(function(current) {
    return current.guideId == searchId;
  });
  if (resArr.length > 0) {
    return resArr[0].guideName;
  }
  else {
    console.log('没有找到指南名称，请检查');
  }

}



export const Base64 = {
  // 转码表
  table: [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', '+', '/',
  ],
  /**
   * @return {string}
   */
  UTF16ToUTF8(str) {
    const res = [];
    const len = str.length;
    for (let i = 0; i < len; i++) {
      const code = str.charCodeAt(i);
      if (code > 0x0000 && code <= 0x007F) {
        // 单字节，这里并不考虑0x0000，因为它是空字节
        // U+00000000 – U+0000007F 	0xxxxxxx
        res.push(str.charAt(i));
      } else if (code >= 0x0080 && code <= 0x07FF) {
        // 双字节
        // U+00000080 – U+000007FF 	110xxxxx 10xxxxxx
        // 110xxxxx
        const byte1 = 0xC0 | ((code >> 6) & 0x1F);
        // 10xxxxxx
        const byte2 = 0x80 | (code & 0x3F);
        res.push(
          String.fromCharCode(byte1),
          String.fromCharCode(byte2),
        );
      } else if (code >= 0x0800 && code <= 0xFFFF) {
        // 三字节
        // U+00000800 – U+0000FFFF 	1110xxxx 10xxxxxx 10xxxxxx
        // 1110xxxx
        const byte1 = 0xE0 | ((code >> 12) & 0x0F);
        // 10xxxxxx
        const byte2 = 0x80 | ((code >> 6) & 0x3F);
        // 10xxxxxx
        const byte3 = 0x80 | (code & 0x3F);
        res.push(
          String.fromCharCode(byte1),
          String.fromCharCode(byte2),
          String.fromCharCode(byte3),
        );
      } else if (code >= 0x00010000 && code <= 0x001FFFFF) {
        // 四字节
        // U+00010000 – U+001FFFFF 	11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      } else if (code >= 0x00200000 && code <= 0x03FFFFFF) {
        // 五字节
        // U+00200000 – U+03FFFFFF 	111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
      } else /** if (code >= 0x04000000 && code <= 0x7FFFFFFF) */ {
        // 六字节
        // U+04000000 – U+7FFFFFFF 	1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
      }
    }

    return res.join('');
  },
  UTF8ToUTF16(str) {
    const res = [];
    const len = str.length;
    for (let i = 0; i < len; i++) {
      const code = str.charCodeAt(i);
      // 对第一个字节进行判断
      if (((code >> 7) & 0xFF) === 0x0) {
        // 单字节
        // 0xxxxxxx
        res.push(str.charAt(i));
      } else if (((code >> 5) & 0xFF) === 0x6) {
        // 双字节
        // 110xxxxx 10xxxxxx
        const code2 = str.charCodeAt(++i);
        const byte1 = (code & 0x1F) << 6;
        const byte2 = code2 & 0x3F;
        const utf16 = byte1 | byte2;
        res.push(String.fromCharCode(utf16));
      } else if (((code >> 4) & 0xFF) === 0xE) {
        // 三字节
        // 1110xxxx 10xxxxxx 10xxxxxx
        const code2 = str.charCodeAt(++i);
        const code3 = str.charCodeAt(++i);
        const byte1 = (code << 4) | ((code2 >> 2) & 0x0F);
        const byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3F);
        const utf16 = ((byte1 & 0x00FF) << 8) | byte2;
        res.push(String.fromCharCode(utf16));
      } else if (((code >> 3) & 0xFF) === 0x1E) {
        // 四字节
        // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      } else if (((code >> 2) & 0xFF) === 0x3E) {
        // 五字节
        // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
      } else /** if (((code >> 1) & 0xFF) == 0x7E) */ {
        // 六字节
        // 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
      }
    }

    return res.join('');
  },
  encode(str) {
    if (!str) {
      return '';
    }
    const utf8 = this.UTF16ToUTF8(str); // 转成UTF8
    let i = 0; // 遍历索引
    const len = utf8.length;
    const res = [];
    while (i < len) {
      const c1 = utf8.charCodeAt(i++) & 0xFF;
      res.push(this.table[c1 >> 2]);
      // 需要补2个=
      if (i === len) {
        res.push(this.table[(c1 & 0x3) << 4]);
        res.push('==');
        break;
      }
      const c2 = utf8.charCodeAt(i++);
      // 需要补1个=
      if (i === len) {
        res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
        res.push(this.table[(c2 & 0x0F) << 2]);
        res.push('=');
        break;
      }
      const c3 = utf8.charCodeAt(i++);
      res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
      res.push(this.table[((c2 & 0x0F) << 2) | ((c3 & 0xC0) >> 6)]);
      res.push(this.table[c3 & 0x3F]);
    }

    return res.join('');
  },
  decode(str) {
    if (!str) {
      return '';
    }

    const len = str.length;
    let i = 0;
    const res = [];

    while (i < len) {
      const code1 = this.table.indexOf(str.charAt(i++));
      const code2 = this.table.indexOf(str.charAt(i++));
      const code3 = this.table.indexOf(str.charAt(i++));
      const code4 = this.table.indexOf(str.charAt(i++));

      const c1 = (code1 << 2) | (code2 >> 4);
      res.push(String.fromCharCode(c1));

      if (code3 !== -1) {
        const c2 = ((code2 & 0xF) << 4) | (code3 >> 2);
        res.push(String.fromCharCode(c2));
      }
      if (code4 !== -1) {
        const c3 = ((code3 & 0x3) << 6) | code4;
        res.push(String.fromCharCode(c3));
      }

    }

    return this.UTF8ToUTF16(res.join(''));
  },
};


function isArrayFn(value) {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value);
  } else {
    return Object.prototype.toString.call(value) === '[object Array]';
  }
}

/*
* 查找对象中的字符串属性，并删除其两端空格
*/
export function deleteSpace(data) {
  for (let i = 0; i < Object.keys(data).length; i++) {
    let key = Object.keys(data)[i];
    if (typeof data[key] === 'string') {
      data[key] = data[key].trim();
    }
  }
  return data;
}
