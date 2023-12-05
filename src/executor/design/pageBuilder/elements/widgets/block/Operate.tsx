import { RenderOperate } from '@/pages/Home/components/Content/WorkBench';
import React from 'react';
import { defineElement } from '../../defineElement';

export default defineElement({
  render(_) {
    return <RenderOperate />;
  },
  displayName: 'Operate',
  meta: {
    props: {},
    type: 'Element',
    label: '快捷操作',
  },
});
