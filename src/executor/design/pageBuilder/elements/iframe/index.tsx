import React from 'react';
import { defineElement } from '../defineElement';
import cls from './index.module.less';

export default defineElement({
  render(props) {
    return <iframe className={cls.iframe} loading="eager" src={props.url} />;
  },
  displayName: 'Iframe',
  meta: {
    props: {
      url: {
        type: 'string',
        label: '链接地址',
      },
    },
    type: 'Element',
    label: '链接',
  },
});
