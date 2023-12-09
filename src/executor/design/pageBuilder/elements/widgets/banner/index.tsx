import { Button } from 'antd';
import React, { CSSProperties, useState } from 'react';
import { ExistTypeMeta } from '../../../core/ElementMeta';
import { File, SEntity } from '../../../design/config/FileProp';
import { Context } from '../../../render/PageContext';
import { defineElement } from '../../defineElement';
interface IProps {
  height: number;
  url?: SEntity;
  props: any;
  ctx: Context;
}

const style = (height: number, url?: string) => {
  return {
    position: 'relative',
    backgroundImage: `url(${url})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#fafafa',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: height,
  } as CSSProperties;
};

const View: React.FC<IProps> = (props) => {
  return <div style={style(props.height, props.url?.id)} />;
};

const Design: React.FC<IProps> = (props) => {
  const [url, setUrl] = useState(props.url?.id);
  return (
    <div style={style(props.height, url)}>
      <File
        accepts={['图片']}
        onOk={(files) => {
          props.props.url = files[0].metadata;
          setUrl(props.props.url.id);
        }}>
        <Button
          style={{ position: 'absolute', left: 10, bottom: 10 }}
          type="dashed"
          size="small">
          添加图片
        </Button>
      </File>
    </div>
  );
};

export default defineElement({
  render(props, ctx) {
    if (ctx.view.mode == 'design') {
      return <Design {...props} ctx={ctx} />;
    }
    return <View {...props} ctx={ctx} />;
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
      } as ExistTypeMeta<SEntity | undefined>,
    },
    label: '横幅',
    type: 'Element',
  },
});
