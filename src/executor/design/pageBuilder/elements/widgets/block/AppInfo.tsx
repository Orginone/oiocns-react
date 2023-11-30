import { RenderAppInfo } from '@/pages/Home/components/Content/WorkBench';
import React from 'react';
import { defineElement } from '../../defineElement';

export default defineElement({
  render(_) {
    return <RenderAppInfo />;
  },
  displayName: 'AppInfo',
  meta: {
    props: {},
    type: 'Element',
    label: '应用',
  },
});
