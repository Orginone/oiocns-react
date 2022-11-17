import KernelApi from './api/kernelapi';
import { ResultType } from './model';
export const kernel = KernelApi.getInstance();
export * as common from './common';
export * as model from './model';
export * as schema from './schema';
export const FaildResult = (msg: string, code: number = 400): ResultType<any> => {
  return { success: false, msg: msg, code: code, data: {} };
};
