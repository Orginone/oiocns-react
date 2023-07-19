/**
 * 对象资源可释放接口
 */
export interface IDisposable {
  dispose(): void;
}

/**
 * 延时方法
 * @param timeout 延时时长，单位ms
 */
export const sleep = async (timeout: number): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, timeout);
  });
};
