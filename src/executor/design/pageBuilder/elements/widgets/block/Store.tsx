import { RenderStore } from '@/pages/Home/components/Content/WorkBench';
import React from 'react';
import { defineElement } from '../../defineElement';

export default defineElement({
  render(_) {
    return <RenderStore />;
  },
  displayName: 'Store',
  meta: {
    props: {},
    type: 'Element',
    label: '数据',
  },
});
