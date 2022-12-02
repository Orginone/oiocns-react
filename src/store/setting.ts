import create from 'zustand';
// 数据持久化，会缓存到 storage
import { persist } from 'zustand/middleware';

type settingStoreType = {
  isOpenModal: boolean; //是否打开Modal层
  selectId: string; //增在操作设置的id
  contionMes: {};
  setEditItem: (params: boolean) => void;
  setSelectId: (params: string) => void;
  setContions: (params: any) => void;
};

const settingStore = create(
  persist<settingStoreType>((set, get) => ({
    isOpenModal: false,
    selectId: '',
    contionMes: {},
    setEditItem: (params: boolean) => set({ isOpenModal: params }),
    setSelectId: (params: string) => set({ selectId: params }),
    setContions: (params: any) => set({ contionMes: params }),
  })),
);

export default settingStore;
