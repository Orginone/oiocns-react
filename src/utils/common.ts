import { filetrText } from '@/pages/Chats/config/common';
import { common } from '@/ts/base';

/**
 * 聊天窗口显示正常的值
 * @param val为正常字符
 * @returns 返回值为过滤掉指定字符后的值
 */
export const filetrFindText = (val: string | any) => {
  const userText = filetrText(val);
  const matches = userText?.split('$FINDME')[0];
  if (matches?.length === 0) {
    const text = userText?.split('$FINDME')[1];
    return text;
  } else {
    const text = userText?.split('$FINDME')[0];
    return text;
  }
};

/**
 * 用来过滤指定字符后的值
 * @param item 进来的解析后的值
 * @returns 返回参数为过滤后指定字符后的值
 */
export const findTextId = (item: string | any) => {
  const typeofPas = item?.includes('^!:');
  if (typeofPas) {
    const Text = common.StringPako.inflate(item);
    const matches = [...Text.matchAll(/\$FINDME\[([^\]]*)\]/g)];
    return matches.map((val: any) => val[1]);
  }
};

/**
 * 展示艾特的人
 * @param val 为艾特的人
 */
export const showCiteName = (val: any, id: any) => {
  if (val && val.length > 0 && val[0].includes(id)) {
    return '[有人@你]';
  } else {
    return '';
  }
};

/**
 * @description: 一维数组对象模糊搜索 模糊匹配
 * @param {*} dataList 为一维数组数据结构
 * @param {*} value 输入值
 * @param {*} type type 为指定想要搜索的字段名，array格式 ['showTxt']
 * @return {*}
 */
export const filterOne = (dataList: any[], value: string, type: string[]) => {
  let str = dataList.filter(function (item) {
    for (let j = 0; j < type.length; j++) {
      if (item[type[j]] != undefined || item[type[j]] != null) {
        if (item[type[j]].indexOf(value) >= 0) {
          return item;
        }
      }
    }
  });
  return str;
};
