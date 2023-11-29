import { model } from '@/ts/base';
import moment from 'moment';
import { message } from 'antd';
import { formatDate } from '@/utils/index';
import { DataType, MenuItemType, OperateMenuType, PageData } from 'typings/globelType';

const dateFormat: string = 'YYYY-MM-DD';

const showMessage = (response: any) => {
  if (response.success) {
    message.success('操作成功！');
  } else {
    message.error('操作失败！发生错误：  ' + response.msg);
  }
};

const debounce = (fun: any, delay?: number) => {
  let timer: any = '';
  let that = this;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(function () {
      fun.call(that, ...args);
    }, delay ?? 300);
  };
};

/**
 * @desc: 处理 翻页参数问题
 * @param {T} params
 * @return {*}
 */
const resetParams = (params: any) => {
  const { page, pageSize, filter, ...rest } = params;
  const num = (page - 1) * pageSize;

  return {
    offset: num >= 0 ? num : 0,
    limit: pageSize || 20,
    filter: filter,
    ...rest,
  };
};

/**
 * 后台响应 => 前端业务结果(分页)
 * @param res 后台分页响应
 * @returns
 */
export function toPageData<T extends DataType>(res: model.ResultType<T>): PageData<T> {
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
  const date = moment(cdate.format('yyyy-MM-DD'));
  const days = moment().diff(date, 'day');
  switch (days) {
    case 0:
      return cdate.format('H:mm:ss');
    case 1:
      return '昨天 ' + cdate.format('H:mm:ss');
    case 2:
      return '前天 ' + cdate.format('H:mm:ss');
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

/**
 * 格式化时间
 * @param source 时间
 * @param format 格式化字符串
 * @returns 格式化后的时间信息
 */
const formatZhDate = (
  source: string | Date,
  format: string = 'YYYY年MM月DD日 HH:mm:ss.ms',
): string => {
  return moment(source).format(format);
};

let count = 1;
// key: 当前填写字符,key0:记录初始字符, hasKeys:已存在的key数组
const getNewKeyWithString: any = (key: string, key0: string, hasKeys: string[]) => {
  if (hasKeys.includes(key)) {
    count++;
    return getNewKeyWithString(`${key0}(${count})`, key0, hasKeys);
  } else {
    count = 1;
    return key;
  }
};

const getUuid = () => {
  let s = [];
  let hexDigits: any = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  let uuid = s.join('');
  return uuid;
};

const findAimObj = (isParent = false, id: string, topParentData?: any[]) => {
  let aimObjet: any = undefined;
  function findItem(id: string, parent: any) {
    const data = parent.children;
    if (aimObjet) {
      return aimObjet;
    }
    const AimObj = data.find((v: any) => {
      return v.id == id;
    });
    if (AimObj) {
      aimObjet = isParent ? parent : AimObj;
      return;
    } else {
      data.forEach((child: any) => {
        return findItem(id, child);
      });
    }
  }
  findItem(id, { children: topParentData });
  return aimObjet;
};

/**
 * 中英文混合按首字母排序
 */
const pySegSort = (arr: string[]) => {
  if (!String.prototype.localeCompare) {
    return null;
  }
  let pattern = new RegExp('[A-Za-z]+');
  let letters = '*abcdefghjklmnopqrstwxyz'.split('');
  let zh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split('');
  let segs: any[] = [];
  letters.forEach(function (item, i) {
    let curr: any = { letter: item, data: [] };
    arr.forEach(function (item2: string) {
      if (pattern.test(item2.split('')[0])) {
        if (
          (!letters[i] || letters[i].localeCompare(item2) <= 0) &&
          (item2.localeCompare(letters[i + 1]) == -1 || i == letters.length - 1)
        ) {
          curr.data.push(item2);
        }
      } else {
        if (
          (!zh[i - 1] || zh[i - 1].localeCompare(item2) <= 0) &&
          item2.localeCompare(zh[i]) == -1
        ) {
          curr.data.push(item2);
        }
      }
    });
    if (curr.data.length) {
      segs.push(curr);
      curr.data.sort(function (a: any, b: any) {
        return a.localeCompare(b);
      });
    }
  });
  return segs;
};
/**
 * 中英文混合按首字母排序  对象数组
 */
const pySegSortObj = (objArr: any[], field: string) => {
  if (!String.prototype.localeCompare) {
    return null;
  }
  let pattern = new RegExp('[A-Za-z]+');
  let letters = '*abcdefghjklmnopqrstwxyz'.split('');
  let zh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split('');
  let segs: any[] = [];
  letters.forEach(function (item, i) {
    let curr: any = { letter: item, data: [] };
    objArr.forEach(function (item2: any) {
      if (pattern.test(item2[field].split('')[0])) {
        if (
          (!letters[i] || letters[i].localeCompare(item2[field]) <= 0) &&
          (item2[field].localeCompare(letters[i + 1]) == -1 || i == letters.length - 1)
        ) {
          curr.data.push(item2);
        }
      } else {
        if (
          (!zh[i - 1] || zh[i - 1].localeCompare(item2[field]) <= 0) &&
          item2[field].localeCompare(zh[i]) == -1
        ) {
          curr.data.push(item2);
        }
      }
    });
    if (curr.data.length) {
      segs.push(curr);
      curr.data.sort(function (a: any, b: any) {
        return a[field].localeCompare(b[field]);
      });
    }
  });
  return segs;
};

const findMenuItemByKey = (item: MenuItemType, key: string): MenuItemType | undefined => {
  for (const node of item.children || []) {
    if (node.key === key) {
      node.parentMenu = item;
      return node;
    }
    const find = findMenuItemByKey(node, key);
    if (find != undefined) {
      return find;
    }
  }
  return undefined;
};

const cleanMenus = (items?: OperateMenuType[]): OperateMenuType[] | undefined => {
  const newItems = items?.map((i) => {
    return {
      key: i.key,
      label: i.label,
      icon: i.icon,
      model: i.model,
      children: cleanMenus(i.children),
    } as OperateMenuType;
  });
  if (newItems && newItems.length > 0) {
    return newItems;
  }
  return undefined;
};
/** url下载 */
const downloadByUrl = (url: string) => {
  if (!url) {
    return message.error('资源路径不存在，请重试！');
  }
  const DownA = document.createElement('a'); // 创建a标签
  DownA.setAttribute('download', url); // download属性(为下载的文件起个名)
  DownA.setAttribute('href', url); // href链接（文件的url地址）（如果是下载图片需要使用代理，不然图片不会是下载而是打开）
  DownA.click(); // 自执行点击事件
};

const truncateString = (str: string, maxLength: number) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength - 3) + '...';
  }
  return str;
};

/** 获取文件的实际地址 */
const shareOpenLink = (link: string | undefined, download: boolean = false) => {
  if (link?.startsWith('/orginone/kernel/load/')) {
    return download ? `${link}?download=1` : link;
  }
  return `/orginone/kernel/load/${link}${download ? '?download=1' : ''}`;
};

/** 获取html文本中的字符串 */
const parseHtmlToText = (html: string) => {
  var text = html.replace(/\s*/g, ''); //去掉空格
  text = text.replace(/<[^>]+>/g, ''); //去掉所有的html标记
  text = text.replace(/↵/g, ''); //去掉所有的↵符号
  return text.replace(/[\r\n]/g, ''); //去掉回车换行
};

/** 根据节点id获取节点信息 */
const getNodeByNodeId = (
  id: string,
  node: model.WorkNodeModel | undefined,
): model.WorkNodeModel | undefined => {
  if (node) {
    if (id === node.id) return node;
    const find = getNodeByNodeId(id, node.children);
    if (find) return find;
    for (const subNode of node?.branches ?? []) {
      const find = getNodeByNodeId(id, subNode.children);
      if (find) return find;
    }
  }
};

const loadGatewayNodes = (
  node: model.WorkNodeModel,
  memberNodes: model.WorkNodeModel[],
) => {
  if (node.type == '网关') {
    memberNodes.push(node);
  }
  if (node.children) {
    memberNodes = loadGatewayNodes(node.children, memberNodes);
  }
  for (const branch of node.branches ?? []) {
    if (branch.children) {
      memberNodes = loadGatewayNodes(branch.children, memberNodes);
    }
  }
  return memberNodes;
};

export {
  cleanMenus,
  dateFormat,
  debounce,
  downloadByUrl,
  findAimObj,
  findMenuItemByKey,
  formatZhDate,
  getNewKeyWithString,
  getNodeByNodeId,
  getUuid,
  handleFormatDate,
  loadGatewayNodes,
  parseHtmlToText,
  pySegSort,
  pySegSortObj,
  renderNum,
  resetParams,
  shareOpenLink,
  showChatTime,
  showMessage,
  truncateString,
  validIsSocialCreditCode,
};
