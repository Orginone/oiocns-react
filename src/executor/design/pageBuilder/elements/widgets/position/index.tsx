import { schema } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { shareOpenLink } from '@/utils/tools';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Image, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { ExistTypeMeta } from '../../../core/ElementMeta';
import { File, SProperty, TipDesignText, TipText } from '../../../design/config/FileProp';
import { Context } from '../../../render/PageContext';
import { defineElement } from '../../defineElement';
import Asset from '/img/innovate.png';

export type DisplayType = 'Photo' | 'Avatar' | 'Text' | 'Tags';

interface IProps {
  id: string;
  ctx: Context;
  width?: number;
  height?: number;
  hasPrefix?: boolean;
  hasTip?: boolean;
  props: any;
  label: string;
  valueType: DisplayType;
  data?: schema.XThing;
  property?: SProperty;
  properties: SProperty[];
}

const Design: React.FC<IProps> = (props) => {
  const mapping = (item: schema.XProperty) => {
    return {
      id: item.id,
      name: item.name,
      valueType: item.valueType,
      unit: item.unit,
    };
  };
  switch (props.valueType) {
    case 'Tags':
      return (
        <File
          accepts={['选择型', '分类型']}
          excludeIds={props.properties.map((item) => item.id)}
          multiple={true}
          onOk={(files) => {
            props.properties.push(
              ...files.map((item) => mapping(item.metadata as schema.XProperty)),
            );
            props.ctx.view.emitter('props', 'change', props.id);
          }}>
          <Space direction="horizontal">
            <Button size="small" type="dashed">
              添加标签
            </Button>
            {props.properties.map((item, index) => {
              return (
                <Space key={index}>
                  <DeleteOutlined
                    onClick={() => {
                      props.properties.splice(index, 1);
                      props.ctx.view.emitter('props', 'change', props.id);
                    }}
                  />
                  <Tag>{item.name}</Tag>
                </Space>
              );
            })}
          </Space>
        </File>
      );
    default:
      return (
        <File
          accepts={['属性']}
          onOk={(files) => {
            props.props.property = mapping(files[0].metadata as schema.XProperty);
            props.ctx.view.emitter('props', 'change', props.id);
          }}>
          <TipDesignText
            width={props.width}
            height={props.height}
            value={props.property?.name ?? props.label}
          />
        </File>
      );
  }
};

const getOriginValue = async (property?: SProperty, data?: schema.XThing) => {
  if (property && data) {
    switch (property.valueType) {
      case '选择型':
      case '分类型':
        return data[data['T' + property.id]] ?? '';
      case '数值型':
        return (data['T' + property.id] ?? '') + (property.unit ?? '');
      case '用户型':
        return await getTargetValue(data['T' + property.id]);
      default:
        return data['T' + property.id] ?? '';
    }
  }
};

const getTargetValue = async (targetId?: string) => {
  if (targetId) {
    let res = await orgCtrl.user.findEntityAsync(targetId);
    return res?.name;
  }
};

const getValue = async (props: IProps) => {
  let value = await getOriginValue(props.property, props.data);
  switch (props.valueType) {
    case 'Photo':
    case 'Avatar':
      if (value) {
        const parsedFile = JSON.parse(value);
        if (parsedFile.length > 0) {
          value = parsedFile[0].shareLink;
        } else {
          value = undefined;
        }
      }
      break;
    case 'Tags':
      {
        let value: string[] = [];
        for (const item of props.properties) {
          let originValue = await getOriginValue(item, props.data);
          if (originValue) {
            value.push(originValue);
          }
        }
      }
      break;
    default:
      if (props.hasTip) {
        value = value || value === 0 ? value : '[暂无数据]';
      }
      if (props.hasPrefix && props.property) {
        value = props.property.name + '：' + value;
      }
      break;
  }
  return value;
};

const View: React.FC<IProps> = (props) => {
  const [value, setValue] = useState<any>();
  useEffect(() => {
    getValue(props).then((res) => setValue(res));
  }, []);
  switch (props.valueType) {
    case 'Photo':
    case 'Avatar':
      return (
        <Image
          style={{ objectFit: 'cover', width: props.width, height: props.height }}
          src={value ? shareOpenLink(value) : Asset}
        />
      );
    case 'Tags':
      return (
        <Space direction={'horizontal'}>
          {value?.map((item: any, index: number) => {
            return <Tag key={index}>{item}</Tag>;
          })}
        </Space>
      );
    default: {
      return <TipText>{value}</TipText>;
    }
  }
};

export default defineElement({
  render(props, ctx) {
    if (ctx.view.mode == 'design') {
      return <Design {...props} ctx={ctx} />;
    }
    return <View {...props} ctx={ctx} />;
  },
  displayName: 'Field',
  meta: {
    type: 'Element',
    label: '文字字段',
    props: {
      label: {
        type: 'string',
        label: '名称',
      },
      width: {
        type: 'number',
        label: '宽度',
      },
      height: {
        type: 'number',
        label: '高度',
      },
      hasPrefix: {
        type: 'type',
        label: '是否有前缀',
      } as ExistTypeMeta<boolean | undefined>,
      hasTip: {
        type: 'type',
        label: '是否有[暂无数据]字样',
      } as ExistTypeMeta<boolean | undefined>,
      valueType: {
        type: 'type',
        label: '组件类型',
        default: 'Text',
      } as ExistTypeMeta<DisplayType>,
      data: {
        type: 'type',
        typeName: 'thing',
        label: '数据',
      } as ExistTypeMeta<schema.XThing | undefined>,
      property: {
        type: 'type',
        label: '属性',
        typeName: 'propFile',
      } as ExistTypeMeta<SProperty | undefined>,
      properties: {
        type: 'type',
        label: '属性组',
        typeName: 'propFile',
        default: [],
      } as ExistTypeMeta<SProperty[]>,
    },
  },
});
