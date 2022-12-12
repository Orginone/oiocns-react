import create from 'zustand';

export const useAppwfConfig = create((set, get) => ({
  nodeMap: new Map(),
  addNodeMap: async (data: any) => {
    return set((prev: any) => {
      console.log('prev', prev);
      return { nodeMap: prev.nodeMap.set(data.nodeId, data.node) };
    });
  },
}));

export default {
  useAppwfConfig,
};
