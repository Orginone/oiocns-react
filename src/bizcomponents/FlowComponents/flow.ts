import create from 'zustand';

export const useAppwfConfig = create((setItem, get) => ({
  nodeMap: new Map(),
  addNodeMap: async (data: any) => {
    return setItem((prev: any) => {
      return { nodeMap: prev.nodeMap.set(data.nodeId, data.node) };
    });
  },
}));

export default {
  useAppwfConfig,
};
