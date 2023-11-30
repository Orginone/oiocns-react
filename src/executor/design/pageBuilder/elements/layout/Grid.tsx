import React, { useRef } from 'react';
import { Layout, Responsive, ResponsiveProps, WidthProvider } from 'react-grid-layout';
import { ExistTypeMeta } from '../../core/ElementMeta';
import { Slot } from '../../render/Slot';
import { defineElement } from '../defineElement';
import './index.less';

const ResponsiveLayout = WidthProvider(Responsive);

export const Grid: React.FC<ResponsiveProps> = (props) => {
  const breakPoint = useRef<string>();
  const onLayoutChange = (newLayout: Layout[], layouts: { [p: string]: Layout[] }) => {
    if (breakPoint.current) {
      layouts[breakPoint.current] = newLayout;
    }
    props.onLayoutChange?.(newLayout, layouts);
  };
  return (
    <ResponsiveLayout
      className="grid-layout"
      cols={props.cols}
      rowHeight={props.rowHeight}
      layouts={props.layouts}
      isDraggable={props.isDraggable}
      isResizable={props.isResizable}
      onBreakpointChange={(newBreak) => (breakPoint.current = newBreak)}
      onLayoutChange={onLayoutChange}>
      {props.children}
    </ResponsiveLayout>
  );
};

export default defineElement({
  render(props, ctx) {
    const mode = ctx.view.mode;
    return (
      <Grid
        rowHeight={props.rowHeight}
        layouts={props.layouts}
        isDraggable={mode == 'design'}
        isResizable={mode == 'design'}>
        {props.children.map((c) => (
          <div key={c.id}>
            <Slot key={c.id} child={c} />
          </div>
        ))}
      </Grid>
    );
  },
  displayName: 'Grid',
  meta: {
    props: {
      rowHeight: {
        type: 'number',
        default: 10,
      },
      layouts: {
        type: 'object',
        properties: {
          lg: {
            type: 'array',
            elementType: {
              type: 'type',
              typeName: '布局节点',
            } as ExistTypeMeta<Layout>,
          },
          md: {
            type: 'array',
            elementType: {
              type: 'type',
              typeName: '布局节点',
            } as ExistTypeMeta<Layout>,
          },
          sm: {
            type: 'array',
            elementType: {
              type: 'type',
              typeName: '布局节点',
            } as ExistTypeMeta<Layout>,
          },
          xs: {
            type: 'array',
            elementType: {
              type: 'type',
              typeName: '布局节点',
            } as ExistTypeMeta<Layout>,
          },
          xxs: {
            type: 'array',
            elementType: {
              type: 'type',
              typeName: '布局节点',
            } as ExistTypeMeta<Layout>,
          },
        },
        default: {
          lg: [],
          md: [],
          sm: [],
          xs: [],
          xxs: [],
        },
      },
    },
    label: '栅格布局',
    type: 'Container',
  },
});
