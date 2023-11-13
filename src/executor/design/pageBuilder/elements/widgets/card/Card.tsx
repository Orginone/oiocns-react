import { schema } from '@/ts/base';
import { Card, Space } from 'antd';
import React from 'react';
import { ExistTypeMeta } from '../../../core/ElementMeta';
import { defineElement } from '../../defineElement';
import { length, data, label, valueType, hasPrefix, hasTip } from './type';

export default defineElement({
  render({ data, image, first, second, third, fourth, fifth }) {
    return (
      <Card
        hoverable
        cover={image?.({ data, label: '图片', valueType: 'Photo', height: 200 })}
        actions={[
          <div key={'fourth'}>
            {fourth?.({ data, label: '字段-4', hasPrefix, hasTip })}
          </div>,
          <div key={'fifth'}>
            {fifth?.({ data, label: '字段-5', hasPrefix, hasTip })}
          </div>,
        ]}>
        <Card.Meta
          title={first?.({ data, label: '字段-1', hasTip })}
          description={
            <Space style={{ width: '100%' }} direction="vertical">
              <div key={'second'}>
                {second?.({ data, label: '字段-2', hasPrefix, hasTip })}
              </div>
              <div key={'third'}>
                {third?.({ data, label: '字段-3', hasPrefix, hasTip })}
              </div>
            </Space>
          }
        />
      </Card>
    );
  },
  displayName: 'MetaCard',
  meta: {
    props: {
      data: {
        type: 'type',
        typeName: 'thing',
        label: '数据',
        hidden: true,
      } as ExistTypeMeta<schema.XThing | undefined>,
    },
    slots: {
      image: {
        label: '图片',
        single: true,
        params: { data, label, valueType, height: length },
        default: 'Field',
      },
      first: {
        label: '位置-1',
        single: true,
        params: { data, label, hasTip },
        default: 'Field',
      },
      second: {
        label: '位置-2',
        single: true,
        params: { data, label, hasPrefix, hasTip },
        default: 'Field',
      },
      third: {
        label: '位置-3',
        single: true,
        params: { data, label, hasPrefix, hasTip },
        default: 'Field',
      },
      fourth: {
        label: '位置-4',
        single: true,
        params: { data, label, hasPrefix, hasTip },
        default: 'Field',
      },
      fifth: {
        label: '位置-5',
        single: true,
        params: { data, label, hasPrefix, hasTip },
        default: 'Field',
      },
    },
    type: 'Element',
    label: '实体详情',
  },
});
