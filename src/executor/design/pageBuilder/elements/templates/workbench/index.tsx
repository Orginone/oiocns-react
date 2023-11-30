import React from 'react';
import { Layout } from 'react-grid-layout';
import { ExistTypeMeta } from '../../../core/ElementMeta';
import { defineElement } from '../../defineElement';
import { Grid } from '../../layout/Grid';

export default defineElement({
  render(props, ctx) {
    const mode = ctx.view.mode;
    return (
      <div className="workbench-content">
        <div style={{ width: '100%' }}>{props.banner?.({})}</div>
        <Grid
          rowHeight={props.rowHeight}
          layouts={props.layouts}
          isDraggable={mode == 'design'}
          isResizable={mode == 'design'}
          onLayoutChange={(_, allLayouts) => {
            if (mode == 'design') {
              props.props['layouts'] = allLayouts;
            }
          }}>
          <div key="appInfo">{props.app?.({})}</div>
          <div key="calendar">{props.calendar?.({})}</div>
          <div key="chat">{props.chat?.({})}</div>
          <div key="operate">{props.operate?.({})}</div>
          <div key="store">{props.store?.({})}</div>
          <div key="work">{props.work?.({})}</div>
        </Grid>
      </div>
    );
  },
  displayName: 'WorkBench',
  meta: {
    props: {
      rowHeight: {
        type: 'number',
        default: 4,
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
          lg: [
            { w: 12, h: 15, x: 0, y: 44, i: 'appInfo', moved: false, static: false },
            { w: 12, h: 62, x: 0, y: 57, i: 'calendar', moved: false, static: false },
            { w: 6, h: 14, x: 0, y: 14, i: 'chat', moved: false, static: false },
            { w: 12, h: 14, x: 0, y: 0, i: 'operate', moved: false, static: false },
            { w: 12, h: 16, x: 0, y: 28, i: 'store', moved: false, static: false },
            { w: 6, h: 14, x: 6, y: 14, i: 'work', moved: false, static: false },
          ],
          md: [
            { w: 10, h: 24, x: 0, y: 52, i: 'appInfo', moved: false, static: false },
            { w: 10, h: 62, x: 0, y: 76, i: 'calendar', moved: false, static: false },
            { w: 5, h: 22, x: 0, y: 14, i: 'chat', moved: false, static: false },
            { w: 10, h: 14, x: 0, y: 0, i: 'operate', moved: false, static: false },
            { w: 10, h: 16, x: 0, y: 36, i: 'store', moved: false, static: false },
            { w: 5, h: 22, x: 5, y: 14, i: 'work', moved: false, static: false },
          ],
          sm: [
            { w: 6, h: 22, x: 0, y: 52, i: 'appInfo', moved: false, static: false },
            { w: 6, h: 62, x: 0, y: 74, i: 'calendar', moved: false, static: false },
            { w: 3, h: 22, x: 0, y: 14, i: 'chat', moved: false, static: false },
            { w: 6, h: 14, x: 0, y: 0, i: 'operate', moved: false, static: false },
            { w: 6, h: 16, x: 0, y: 36, i: 'store', moved: false, static: false },
            { w: 3, h: 22, x: 3, y: 14, i: 'work', moved: false, static: false },
          ],
          xs: [
            { w: 4, h: 22, x: 0, y: 79, i: 'appInfo', moved: false, static: false },
            { w: 4, h: 62, x: 0, y: 101, i: 'calendar', moved: false, static: false },
            { w: 2, h: 38, x: 0, y: 14, i: 'chat', moved: false, static: false },
            { w: 4, h: 14, x: 0, y: 0, i: 'operate', moved: false, static: false },
            { w: 4, h: 27, x: 0, y: 52, i: 'store', moved: false, static: false },
            { w: 2, h: 37, x: 2, y: 14, i: 'work', moved: false, static: false },
          ],
          xxs: [
            { w: 2, h: 22, x: 0, y: 94, i: 'appInfo', moved: false, static: false },
            { w: 2, h: 62, x: 0, y: 116, i: 'calendar', moved: false, static: false },
            { w: 1, h: 38, x: 0, y: 19, i: 'chat', moved: false, static: false },
            { w: 2, h: 19, x: 0, y: 0, i: 'operate', moved: false, static: false },
            { w: 2, h: 37, x: 0, y: 57, i: 'store', moved: false, static: false },
            { w: 1, h: 38, x: 1, y: 19, i: 'work', moved: false, static: false },
          ],
        },
      },
    },
    slots: {
      banner: {
        label: '横幅插槽',
        single: true,
        params: {},
        default: 'HeadBanner',
      },
      app: {
        label: '应用',
        single: true,
        params: {},
        default: 'AppInfo',
      },
      calendar: {
        label: '日历',
        single: true,
        params: {},
        default: 'Calendar',
      },
      chat: {
        label: '沟通',
        single: true,
        params: {},
        default: 'Chat',
      },
      operate: {
        label: '快捷操作',
        single: true,
        params: {},
        default: 'Operate',
      },
      store: {
        label: '数据',
        single: true,
        params: {},
        default: 'Store',
      },
      work: {
        label: '办事',
        single: true,
        params: {},
        default: 'Work',
      },
    },
    type: 'Template',
    layoutType: 'scroll',
    description: '用于自定义工作台',
    label: '工作台',
  },
});
