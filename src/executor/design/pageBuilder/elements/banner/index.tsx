import { schema } from '@/ts/base';
import { ExistTypeMeta } from '../../core/ElementMeta';
import { defineElement } from '../defineElement';
import React from 'react';

export default defineElement({
  render(props) {
    return (
      <div
        style={{
          position: 'relative',
          background: `no-repeat url(${props.url?.id}) #fafafa center `,
          backgroundSize: 'cover',
          height: props.height,
        }}
      />
    );
  },
  displayName: 'HeadBanner',
  meta: {
    props: {
      height: {
        type: 'number',
        default: 200,
      },
      url: {
        type: 'type',
        label: '关联图片',
        typeName: 'picFile',
      } as ExistTypeMeta<schema.XEntity | undefined>,
    },
    label: '横幅',
    type: 'Element',
  },
});
