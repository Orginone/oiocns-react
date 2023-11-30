import { RenderChat } from '@/pages/Home/components/Content/WorkBench';
import React from 'react';
import { defineElement } from '../../defineElement';

export default defineElement({
  render(_) {
    return <RenderChat />;
  },
  displayName: 'Chat',
  meta: {
    props: {},
    type: 'Element',
    label: '沟通',
  },
});
