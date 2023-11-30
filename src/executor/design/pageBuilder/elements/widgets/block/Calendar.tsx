import React from 'react';
import { defineElement } from '../../defineElement';
import { CalendarItem } from '@/pages/Home/components/Content/WorkBench';

export default defineElement({
  render(_) {
    return <CalendarItem />;
  },
  displayName: 'Calendar',
  meta: {
    props: {},
    type: 'Element',
    label: '日历',
  },
});
