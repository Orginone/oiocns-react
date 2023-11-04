import React, { useState } from 'react';
import { WithCommonProps, defineElement } from '../../defineElement';
import cls from './index.module.less';
import Cloud from '/img/cloud.jpg';
import { Input } from 'antd';

const Design: React.FC<WithCommonProps<{ url: string }>> = (props) => {
  const [url, setUrl] = useState(props.url);
  return (
    <>
      <iframe className={cls.iframe} loading="eager" src={url} />
      <Input
        style={{ width: 200, position: 'absolute', left: 10, bottom: 10 }}
        value={url}
        placeholder="输入外部地址"
        onChange={(e) => {
          props.props.url = e.target.value;
          setUrl(e.target.value);
        }}
      />
    </>
  );
};

export default defineElement({
  render(props, ctx) {
    if (ctx.view.mode == 'design') {
      return <Design {...props} />;
    }
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
    type: 'Template',
    layoutType: 'full',
    photo: Cloud,
    description: '用于链接外部地址',
    label: '链接',
  },
});
