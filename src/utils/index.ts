/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
/* --------------------------------------------公共方法--------------------------------- */
// 获取URL参数
const getQueryString = (name: string) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const r = window.location.search.substr(1).match(reg);
  if (r !== null) return decodeURI(r[2]);
  return null;
};

/**
 * Date 转化为指定格式的String<br>
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)可以用 1-2 个占位符<br>
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *
 * @param {string | number} date string支持形式：20160126 12:00:00，2016-01-26 12:00:00，2016.01.26 12:00:00，20160126，2016-01-26 12:00:00.0
 * @param {string} fmt
 * @returns {string}
 * @example
 *
 * formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss.S');
 * // => 2006-07-02 08:09:04.423
 *
 * formatDate(Date.now(), 'yyyy-MM-dd E HH:mm:ss');
 * // => 2009-03-10 二 20:09:04
 *
 * formatDate(Date.now(), 'yyyy-MM-dd EE hh:mm:ss');
 * // => 2009-03-10 周二 08:09:04
 *
 * formatDate(Date.now(), 'yyyy-MM-dd EEE hh:mm:ss');
 * // => 2009-03-10 星期二 08:09:04
 *
 * formatDate(Date.now(), 'yyyy-M-d h:m:s.S')
 * // => 2006-7-2 8:9:4.18
 */
const formatDate = (date?: any, fmt?: string) => {
  if (date === void 0) date = new Date();
  if (fmt === void 0) fmt = 'yyyy-MM-dd HH:mm:ss';

  if (typeof date === 'string') {
    date = new Date(date);
  } else if (typeof date === 'number') {
    date = new Date(date);
  }
  let o: any = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  let week: any = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d',
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') +
        week[date.getDay() + ''],
    );
  }

  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
      );
    }
  }

  return fmt;
};

/**
 * 将时间转化为几天前,几小时前，几分钟前
 *
 * @param {number} ms
 * @returns {*}
 * @example
 *
 * formatTimeAgo(1505232000000);
 * // => 1天前
 */
function formatTimeAgo(ms: any) {
  ms = parseInt(ms);

  let timeNow = Date.now();
  let diff = (timeNow - ms) / 1000;
  let date = new Date();
  // 向下取整更精确些
  let days = Math.floor(diff / (24 * 60 * 60));
  let hours = Math.floor(diff / (60 * 60));
  let minutes = Math.floor(diff / 60);
  let second = Math.floor(diff);

  if (days > 0 && days < 2) {
    return days + '天前';
  } else if (days <= 0 && hours > 0) {
    return hours + '小时前';
  } else if (hours <= 0 && minutes > 0) {
    return minutes + '分钟前';
  } else if (minutes <= 0 && second >= 0) {
    return '刚刚';
  } else {
    date.setTime(ms);

    return (
      date.getFullYear() +
      '-' +
      f(date.getMonth() + 1) +
      '-' +
      f(date.getDate()) +
      ' ' +
      f(date.getHours()) +
      ':' +
      f(date.getMinutes())
    );
  }

  function f(n: any) {
    return n < 10 ? '0' + n : n;
  }
}

/**
 * 检查是否是emoji表情
 * @param {*} value 正则校验变量
 * @return {boolean} 正则校验结果 true: 是emoji表情 false: 不是emoji表情
 */
function isEmoji(value: any) {
  let arr = ['\ud83c[\udf00-\udfff]', '\ud83d[\udc00-\ude4f]', '\ud83d[\ude80-\udeff]'];

  return new RegExp(arr.join('|'), 'g').test(value);
}

/**
 * 检查是否为特殊字符
 * @param {string} value 正则校验的变量
 * @returns {boolean} 正则校验结果 true: 是特殊字符 false: 不是特殊字符
 */
function isSpecialChar(value: any) {
  let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]\s]/im;
  let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]\s]/im;

  return regEn.test(value) || regCn.test(value);
}

/**
 * 过滤对象中为空的属性
 *
 * @param obj
 * @returns {*}
 * @example
 *
 * filterEmptyPropObj({name: 'foo', sex: ''})
 * // => {name: 'foo'}
 */
function filterEmptyPropObj(obj: any) {
  if (!(typeof obj == 'object')) {
    return;
  }

  for (let key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      (obj[key] == null || obj[key] == undefined || obj[key] === '')
    ) {
      delete obj[key];
    }
  }
  return obj;
}

/**
 * 递归访问整个树
 */
function visitTree(
  tree: any[],
  cb: (item: any, parent: any, deep: number) => void,
  options?: {
    /** 子项名，默认：`'children'` */
    childrenMapName?: string;
  },
) {
  options = {
    childrenMapName: 'children',
    ...options,
  };
  const inFn = (data: any[], parent: any, deep: number) => {
    for (const item of data) {
      cb(item, parent, deep);
      const childrenVal = item[options!.childrenMapName!];
      if (childrenVal && childrenVal.length > 0) {
        inFn(childrenVal, item, deep + 1);
      }
    }
  };
  inFn(tree, null, 1);
}

/**
 *  处理表格组件，添加字段展示宽度，文本溢出省略显示
 * @param propsColumns 传入的表头
 * @returns
 */
function getScrollX(propsColumns: { [key: string]: any }[]) {
  let scrollx = 0 as number;
  const columnsRes = propsColumns.map((item) => {
    const { dataIndex, title, width, key, fixed } = item;
    const type = Object.prototype.toString.call(title);
    let _width = 0 as number;
    if (!width) {
      switch (type) {
        case '[object Object]':
          _width = title.props.title.length * 14 + 20;
          break;
        case '[object String]':
          _width = title.length * 14 + 20;
          break;
        default:
          _width = width;
      }
    } else {
      _width = width;
    }
    scrollx += _width;
    return {
      ...item,
      key: key || dataIndex,
      width: _width,
      ellipsis: !fixed,
    };
  });
  return { columnsRes, scrollx };
}

function getJsonText(fileUrl: string): Promise<string> {
  return new Promise((ok, error) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', fileUrl);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // 获取响应数据的原始文本内容
          const rawText = xhr.responseText;
          ok(rawText);
        } else {
          error('请求失败');
        }
      }
    };
    xhr.send();
  });
}

function ellipsisText(text: string, length: number) {
  return text.substring(0, length) + '...';
}

/**
 * 根据传入keys顺序，对传入obj对象键值对排序
 * @param obj
 * @param sortedKeys
 */
function sortObjByKeys<T extends object>(obj: T, sortedKeys: string[]): T {
  const sortedObj: Partial<T> = {};
  sortedKeys.forEach((key) => {
    if (obj?.hasOwnProperty(key)) {
      sortedObj[key as keyof T] = obj[key as keyof T];
    }
  });
  // 将原对象的其他键值对复制到排序后的对象中
  for (const key in obj) {
    if (!sortedObj.hasOwnProperty(key)) sortedObj[key] = obj[key];
  }
  return sortedObj as T;
}

export {
  ellipsisText,
  filterEmptyPropObj,
  formatDate,
  formatTimeAgo,
  getJsonText,
  getQueryString,
  getScrollX,
  isEmoji,
  isSpecialChar,
  sortObjByKeys,
  visitTree,
};
