import create from 'zustand';

/**
 * 状态管理-当前单位
 */
const useCloudStore = create((set) => ({
  cloudData: [],
  cloudTree: [],
  setChoudData: (data: any) => {
    set({ cloudData: data });
  },
  setCloudTree: (data: any) => {
    set({ cloudTree: data });
  },
}));

export default useCloudStore;
