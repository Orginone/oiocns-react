import { defineElement } from './defineElement';
import React from 'react';
import CohortActivity from '@/pages/Home/components/Content/Activity/cohort';

export default defineElement({
  render() {
    return <CohortActivity />;
  },
  displayName: 'CohortActivity',
  meta: {
    props: {},
    label: '群动态',
    type: 'Element',
  },
});
