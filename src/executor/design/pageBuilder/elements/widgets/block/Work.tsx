import { RenderWork } from '@/pages/Home/components/Content/WorkBench';
import React from 'react';
import { defineElement } from '../../defineElement';

export default defineElement({
  render(_) {
    return <RenderWork />;
  },
  displayName: 'Work',
  meta: {
    props: {},
    type: 'Element',
    label: '办事',
  },
});
