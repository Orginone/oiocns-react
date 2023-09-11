import { generateUuid } from '@/ts/base/common';

export const generateEdge = () => {
  return {
    id: generateUuid(),
    attrs: {
      line: {
        stroke: '#A2B1C3',
        strokeDasharray: '5 5',
      },
    },
    zIndex: -1,
    connector: 'smooth',
  };
};
