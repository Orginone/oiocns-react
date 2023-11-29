import { defineElement } from '../defineElement';
import React from 'react';
import FriendsActivity from '@/pages/Home/components/Content/Activity/friends';

export default defineElement({
  render() {
    return <FriendsActivity />;
  },
  displayName: 'FriendsActivity',
  meta: {
    props: {},
    label: '好友圈',
    type: 'Element',
  },
});
