import { ResultType } from './model';
import KernelApi from './api/kernelapi';

export const kernel = KernelApi.getInstance();
export * as common from './common';
export * as model from './model';
export * as schema from './schema';
export const faildResult = (msg: string, code: number = 400): ResultType<any> => {
  return { success: false, msg: msg, code: code, data: {} };
};
