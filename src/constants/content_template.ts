export enum TOOBAR_TYPE {
  'SHARE',
  'COMMEMNT',
  'STORAGE',
  'SHOPCARD',
}

export const toobarTypeAndNameMaps: Record<TOOBAR_TYPE, string> = {
  [TOOBAR_TYPE.SHARE]: '分享',
  [TOOBAR_TYPE.COMMEMNT]: '评论',
  [TOOBAR_TYPE.STORAGE]: '暂存',
  [TOOBAR_TYPE.SHOPCARD]: '购物车',
};
