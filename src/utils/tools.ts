import { model } from '@/ts/base';
import moment from 'moment';
import { message } from 'antd';
import { formatDate } from '@/utils/index';
import { PageData } from 'typings/globelType';

const showMessage = (response: any) => {
  if (response.success) {
    message.success('操作成功！');
  } else {
    message.error('操作失败！发生错误：  ' + response.msg);
  }
}


const debounce = (fun: any, delay?: number) => {
  let timer: any = '';
  let that = this;
  return (args: any) => {
    let _args = args;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fun.call(that, _args);
    }, delay ?? 300);
  };
};

/**
 * @desc: 处理 翻页参数问题
 * @param {T} params
 * @return {*}
 */
const resetParams = (params: any) => {
  const { page, pageSize, ...rest } = params;
  const num = (page - 1) * pageSize;

  return {
    offset: num >= 0 ? num : 0,
    limit: pageSize || 20,
    ...rest,
  };
};

/**
 * 后台响应 => 前端业务结果(分页)
 * @param res 后台分页响应
 * @returns
 */
export function toPageData<T extends { result: any; total: number }>(
  res: model.ResultType<T>,
): PageData<T> {
  if (res.success) {
    return {
      success: true,
      data: res.data?.result || [],
      total: res.data?.total || 0,
      msg: res.msg,
    };
  } else {
    console.error(res?.msg);
    return { success: false, data: [], total: 0, msg: res.msg };
  }
}

// m--n 之间的数字
const renderNum = (m: number, n: number) => {
  return Math.floor(Math.random() * (n + 1 - m) + m);
};

const validIsSocialCreditCode = (code: string) => {
  var numUpChar = '0123456789ABCDEFGHJKLMNPQRTUWXY';
  var reg = new RegExp('^[A-Z0-9]+$');
  if (!reg.test(code) || code.length != 18) {
    return false;
  }
  var wis = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
  var sum = 0;
  for (var i = 0; i < 17; i++) {
    sum += numUpChar.indexOf(code[i]) * wis[i];
  }
  var ret = 0;
  if (sum % 31 != 0) {
    ret = 31 - (sum % 31);
  }
  return numUpChar.indexOf(code[17]) == ret;
};

/**
 * @description: 聊天间隔时间
 * @param {moment} chatDate
 * @return {*}
 */
const showChatTime = (chatDate: moment.MomentInput) => {
  const cdate = moment(chatDate);
  const days = moment().diff(cdate, 'day');
  switch (days) {
    case 0:
      return cdate.format('H:mm');
    case 1:
      return '昨天 ' + cdate.format('H:mm');
    case 2:
      return '前天 ' + cdate.format('H:mm');
  }
  const year = moment().diff(cdate, 'year');
  if (year == 0) {
    return cdate.format('M月D日 H:mm');
  }
  return cdate.format('yy年 M月D日 H:mm');
};

/**
 * @description: 时间处理
 * @param {string} timeStr
 * @return {*}
 */
const handleFormatDate = (timeStr: string) => {
  const nowTime = new Date().getTime();
  const showTime = new Date(timeStr).getTime();
  // 超过一天 展示 月/日
  if (nowTime - showTime > 3600 * 24 * 1000) {
    return formatDate(timeStr, 'M月d日');
  }
  // 不超过一天 展示 时/分
  return formatDate(timeStr, 'H:mm');
};
export {
  debounce,
  handleFormatDate,
  renderNum,
  resetParams,
  showChatTime,
  validIsSocialCreditCode,
  showMessage
};
