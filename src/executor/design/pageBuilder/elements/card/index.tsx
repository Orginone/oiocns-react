import { schema } from '@/ts/base';
import { Card, Image, Space } from 'antd';
import React from 'react';
import { ExistTypeMeta } from '../../core/ElementMeta';
import { defineElement } from '../defineElement';
import Asset from '/img/banner/1.png';
import { shareOpenLink } from '@/utils/tools';
import { XProperty } from '@/ts/base/schema';

interface PosProps {
  property?: XProperty;
}

interface DataProps extends PosProps {
  data: schema.XThing | undefined;
}

const Content: React.FC<DataProps> = ({ data, property }) => {
  let value = '';
  if (data && property) {
    value = property.name + ':' + data['T' + property.id];
  }
  return <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>;
};

const ImageContent: React.FC<DataProps> = ({ data, property }) => {
  let shareLink = '';
  if (data && property) {
    let file = data['T' + property.id];
    if (file) {
      const parsedFile = JSON.parse(file);
      if (parsedFile.length > 0) {
        shareLink = parsedFile[0].shareLink;
      }
    }
  }
  return <Image height={200} src={shareLink ? shareOpenLink(shareLink) : Asset} />;
};

const Position: React.FC<PosProps> = ({ property }) => {
  return <>{property?.name}</>;
};

const ImagePosition: React.FC<PosProps> = () => {
  return <Image src={Asset} height={200} />;
};

export default defineElement({
  render({ card, image, first, second, third, fourth, fifth }, ctx) {
    if (ctx.view.mode == 'view') {
      return (
        <Card
          hoverable
          cover={<ImageContent data={card} property={image} />}
          actions={[
            <Content key={'fourth'} data={card} property={fourth} />,
            <Content key={'fifth'} data={card} property={fifth} />,
          ]}>
          <Card.Meta
            title={<Content data={card} property={first} />}
            description={
              <Space direction="vertical">
                <Content key={'second'} data={card} property={second} />
                <Content key={'third'} data={card} property={third} />
              </Space>
            }
          />
        </Card>
      );
    }
    return (
      <Card
        hoverable
        cover={<ImagePosition property={image} />}
        actions={[
          <Position key={'fourth'} property={fourth} />,
          <Position key={'fifth'} property={fifth} />,
        ]}>
        <Card.Meta
          title={<Position property={first} />}
          description={
            <Space direction="vertical">
              <Position key={'second'} property={second} />
              <Position key={'third'} property={third} />
            </Space>
          }
        />
      </Card>
    );
  },
  displayName: 'MetaCard',
  meta: {
    props: {
      card: {
        type: 'type',
        typeName: 'empty',
        label: '数据',
        hidden: true,
      } as ExistTypeMeta<schema.XThing>,
      image: {
        type: 'type',
        typeName: 'propFile',
        label: '图片',
        default: { name: '主图片' },
      } as ExistTypeMeta<XProperty | undefined>,
      first: {
        type: 'type',
        typeName: 'propFile',
        label: '位置-1',
        default: { name: '位置-1' },
      } as ExistTypeMeta<XProperty | undefined>,
      second: {
        type: 'type',
        typeName: 'propFile',
        label: '位置-2',
        default: { name: '位置-2' },
      } as ExistTypeMeta<XProperty | undefined>,
      third: {
        type: 'type',
        typeName: 'propFile',
        label: '位置-3',
        default: { name: '位置-3' },
      } as ExistTypeMeta<XProperty | undefined>,
      fourth: {
        type: 'type',
        typeName: 'propFile',
        label: '位置-4',
        default: { name: '位置-4' },
      } as ExistTypeMeta<XProperty | undefined>,
      fifth: {
        type: 'type',
        typeName: 'propFile',
        label: '位置-5',
        default: { name: '位置-5' },
      } as ExistTypeMeta<XProperty | undefined>,
    },
    type: 'Element',
    label: '实体详情',
  },
});
