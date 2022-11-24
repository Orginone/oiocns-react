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
