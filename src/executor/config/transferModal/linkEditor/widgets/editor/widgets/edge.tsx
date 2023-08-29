import { Edge, Graph } from '@antv/x6';

export const edgeRegistering = () => {
  Edge.config({
    markup: [
      {
        tagName: 'path',
        selector: 'wrap',
        attrs: {
          fill: 'none',
          cursor: 'pointer',
          stroke: 'transparent',
          strokeLinecap: 'round',
        },
      },
      {
        tagName: 'path',
        selector: 'line',
        attrs: {
          fill: 'none',
          pointerEvents: 'none',
        },
      },
    ],
    connector: { name: 'curveConnector' },
    attrs: {
      wrap: {
        connection: true,
        strokeWidth: 10,
        strokeLinejoin: 'round',
      },
      line: {
        connection: true,
        stroke: '#A2B1C3',
        strokeWidth: 1,
        targetMarker: {
          name: 'classic',
          size: 6,
        },
      },
    },
  });
  Graph.registerEdge('data-processing-curve', Edge, true);
};
