import React from 'react';
import { defineElement } from '../../defineElement';
import { RenderAffairs } from '@/pages/Home/components/Content/WorkBench';

export default defineElement({
  render(_) {
    return <RenderAffairs />;
  },
  displayName: 'Affairs',
  meta: {
    props: {},
    type: 'Element',
    label: '常用',
  },
});
