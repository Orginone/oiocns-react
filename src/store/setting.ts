/*
 * @Author: zhangqiang 1196217890@qq.com
 * @Date: 2022-11-19 16:13:19
 * @LastEditors: zhangqiang 1196217890@qq.com
 * @LastEditTime: 2022-11-19 17:33:15
 * @FilePath: /oiocns-react/src/store/setting.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import create from 'zustand';
// 数据持久化，会缓存到 storage
import { persist } from 'zustand/middleware';

type settingStoreType = {
  isOpenModal: boolean; //是否打开Modal层
  selectId: string; //增在操作设置的id
  setEditItem: (params: boolean) => void;
  setSelectId: (params: string) => void;
};

const settingStore = create(
  persist<settingStoreType>((set, get) => ({
    isOpenModal: false,
    selectId: '',
    setEditItem: (params: boolean) => set({ isOpenModal: params }),
    setSelectId: (params: string) => set({ selectId: params }),
  })),
);

export default settingStore;
