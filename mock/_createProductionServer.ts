//@ts-nocheck
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';
// 获取目录下所有文件 自动注册
const modules = import.meta.glob('./**/*.ts');
const mockModules: any[] = [];
Object.keys(modules).forEach((key) => {
  if (key.includes('/_')) {
    return;
  }
  console.log('mock', key, modules[key].default);

  mockModules.push(...modules[key].default);
});
/**
 * Used in a production environment. Need to manually import all modules
 */
// import data from './data';
export function setupProdMockServer() {
  createProdMockServer([...mockModules]);
}

// 页面使用demo
/* const test = async () => {
  let rs = await API.mock.test();
  console.log('从测试测试测试', rs);
}; */
