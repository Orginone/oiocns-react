/**
 * 聊天窗口显示正常的值
 * @param val为正常字符
 * @returns 返回值为过滤掉指定字符后的值
 */
export const filetrFindText = (val: string | any) => {
  const matches = val.split('$FINDME')[0];
  if (matches.length === 0) {
    const text = val.split('$FINDME')[1];
    return text;
  } else {
    const text = val.split('$FINDME')[0];
    return text;
  }
};

/**
 * 用来过滤指定字符后的值
 * @param item 进来的解析后的值
 * @returns 返回参数为过滤后指定字符后的值
 */
export const findTextId = (item: string) => {
  const matches = [...item.matchAll(/\$FINDME\[([^\]]*)\]/g)];
  return matches.map((val: any) => val[1]);
};

/**
 * 展示艾特的人
 * @param val 为艾特的人
 */
export const showCiteName = (val: Array<string>, id: any) => {
  if (val && val.length > 0 && val[0].includes(id)) {
    return '有人@你';
  } else {
    return '';
  }
};
