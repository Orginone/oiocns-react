const sizeUnits = ['', 'KB', 'MB', 'GB', 'TB', 'PB'];
/**
 * 格式化大小
 * @param size 大小
 */
export function formatSize(size: number, unit: string = ''): string {
  if (size > 1024) {
    const index = sizeUnits.indexOf(unit);
    if (index + 2 < sizeUnits.length) {
      return formatSize(parseInt((size / 1024.0).toFixed(0)), sizeUnits[index + 1]);
    }
  }
  return size + unit;
}
/** 编码路径 */
export function encodeKey(key: string): string {
  return btoa(unescape(encodeURIComponent(`${key}`)));
}

/** 将文件切片 */
export function sliceFile(file: Blob, chunkSize: number): Blob[] {
  const slices: Blob[] = [];
  let index = 0;
  while (index * chunkSize < file.size) {
    var start = index * chunkSize;
    var end = start + chunkSize;
    if (end > file.size) {
      end = file.size;
    }
    slices.push(file.slice(start, end));
    index++;
  }
  return slices;
}
/** 将文件读成url */
export function blobToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(btoa(reader.result as string));
    };
    reader.readAsBinaryString(file);
  });
}

/** 将文件读成字节数组 */
export function blobToNumberArray(file: Blob): Promise<number[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const arr = new Uint8Array(reader.result as ArrayBuffer);
      resolve(Array.from<number>(arr.values()));
    };
    reader.readAsArrayBuffer(file);
  });
}

/** 格式化日期 */
export function formatDate(date?: any, fmt?: string) {
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
}

import pako from 'pako';

/** 字符串压缩解压缩 */
export class StringPako {
  static readonly gzheader = new TextEncoder().encode('^!gz');
  /**
   * gzip压缩
   * @param input 字符串
   */
  public static gzip(input: string): Uint8Array {
    if (input.length > 1024) {
      const gzArr = pako.gzip(input);
      const gzhlen = StringPako.gzheader.length;
      const result = new Uint8Array(gzhlen + gzArr.length);
      result.set(StringPako.gzheader);
      result.set(gzArr, gzhlen);
      return result;
    }
    return new TextEncoder().encode(input);
  }
  /**
   * ungzip压缩
   * @param buffer 压缩的字节数组
   */
  public static ungzip(buffer: Uint8Array): string {
    const gzhlen = StringPako.gzheader.length;
    if (this.arrayStartwith(buffer, StringPako.gzheader)) {
      return pako.ungzip(buffer.subarray(gzhlen), { to: 'string' });
    }
    return new TextDecoder().decode(buffer);
  }
  /**
   * 解压缩
   * @param input 输入字符串（明文）
   */
  public static inflate(input: string) {
    if (input.startsWith('^!:')) {
      try {
        input = atob(input.substring(8, input.length - 5).replace(/\*/gm, '='));
        let output = this.arrToString(pako.inflate(this.stringToArr(input)));
        return decodeURIComponent(output);
      } catch (err) {
        return input;
      }
    }
    return input;
  }
  /**
   * 压缩
   * @param input 输入字符串（密文）
   */
  public static deflate(input: string) {
    input = encodeURIComponent(input);
    let output = btoa(this.arrToString(pako.deflate(input)));
    return '^!:' + this.randomStr(5) + output.replace(/=/gm, '*') + this.randomStr(5);
  }
  /**
   * 数组转字符串
   * @param arr 数组
   * @returns 字符串
   */
  private static arrToString(arr: Uint8Array) {
    var dataString = '';
    for (var i = 0; i < arr.length; i++) {
      dataString += String.fromCharCode(arr[i]);
    }
    return dataString;
  }
  /**
   * 字符串转数组
   * @param str 字符串
   * @returns 数组
   */
  private static stringToArr(str: string) {
    var arr = [];
    for (var i = 0, j = str.length; i < j; ++i) {
      arr.push(str.charCodeAt(i));
    }
    var tmpUint8Array = new Uint8Array(arr);
    return tmpUint8Array;
  }
  /**
   * 判断两个数组是否相同
   * @param array1 数组1
   * @param array2 数组2
   */
  private static arrayStartwith(array1: Uint8Array, array2: Uint8Array) {
    if (array1.length < array2.length) {
      return false;
    }
    for (let i = 0; i < array2.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
  }
  /**
   * 生成随机字符串
   * @param num 长度
   * @returns 随机字符串
   */
  private static randomStr(len: number) {
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var str = '';
    for (var i = 0, j = len; i < j; ++i) {
      str += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return str;
  }
}
