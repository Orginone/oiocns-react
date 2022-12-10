import KernelApi from './api/kernelapi';

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
