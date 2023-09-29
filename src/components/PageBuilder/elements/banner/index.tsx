import HeadBanner from '@/pages/Home/components/HeadBanner';
import { defineElement } from '../defineElement';
import React from 'react';

export default defineElement({
  render(props) {
    return (
      <HeadBanner title={props.title} backgroundImageUrl={props.backgroundImageUrl} />
    );
  },
  displayName: 'HeadBanner',
  meta: {
    props: {
      title: {
        type: 'string',
      },
      backgroundImageUrl: {
        type: 'string',
      },
    },
    label: '横幅',
  },
});
