import WorkBench from '@/pages/Home/components/Content/WorkBench';
import { defineElement } from './defineElement';
import React from 'react';

export default defineElement({
  render() {
    return <WorkBench />;
  },
  displayName: 'WorkBench',
  meta: {
    props: {},
    label: '工作台',
    type: 'Element',
  },
});
