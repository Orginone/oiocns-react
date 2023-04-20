import KernelApi from './api/kernelapi';
import { Constants } from './common';
import { PageRequest } from './model';

export const kernel = KernelApi.getInstance();
export * as common from './common';
export * as model from './model';
export * as schema from './schema';
/** 解析头像 */
export const parseAvatar = (avatar?: string) => {
  if (avatar) {
    try {
      return JSON.parse(avatar);
    } catch {
      return undefined;
    }
  }
  return undefined;
};

export const orginoneAvatar = () => {
  return {
    size: 195260,
    name: 'logo3.jpg',
    extension: '.jpg',
    shareLink:
      'http://localhost:8080/orginone/anydata/bucket/load/p2_llrgzcgn-2hu-2lgzzhaz2nl-_hc2lsontwk8tenvwxe-lhoe2gi6lpmj-gqyk9orts9zfyxptzxlxfxwks9zvst9uybgrpnrxwo2ztfzvhazd',
    thumbnail:
      'data:image/jpeg;base64,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',
  };
};
export const pageAll = (filter: string = ''): PageRequest => {
  return {
    offset: 0,
    filter: filter,
    limit: Constants.MAX_UINT_16,
  };
};
