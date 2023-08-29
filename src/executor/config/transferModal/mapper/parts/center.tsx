import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { XAttribute } from '@/ts/base/schema';
import { IMapping } from '@/ts/core/thing/config';
import { Button, Col, Row, Space, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react';
import cls from './../index.module.less';
import { Controller } from '@/ts/controller';
interface IProps {
  current: IMapping;
  ctrl: Controller;
}

const Center: React.FC<IProps> = ({ current, ctrl }) => {
  const [mappings, setMappings] = useState<
    {
      sourceAttr: XAttribute;
      targetAttr: XAttribute;
      options?: { [key: string]: string };
    }[]
  >(current.metadata.mappings);
  useEffect(() => {
    const id = current.subscribe(() => {
      if (current.source && current.target) {
        if (
          current.source.attr.property?.valueType !=
          current.target.attr.property?.valueType
        ) {
          message.warning('字段类型必须相同！');
          current.clear();
          return;
        }
        current.metadata.sourceAttrs.splice(current.source.index, 1);
        current.metadata.targetAttrs.splice(current.target.index, 1);
        current.metadata.mappings.unshift({
          sourceAttr: current.source.attr,
          targetAttr: current.target.attr,
        });
        current.clear();
        current.changCallback();
        ctrl.changCallback();
      }
      setMappings([...current.metadata.mappings]);
    });
    return () => {
      current.clear();
      current.unsubscribe(id);
    };
  }, [current]);
  return (
    <div className={cls['flex-column']}>
      <div>
        <EntityIcon entityId={'映射关系'} showName />
      </div>
      <div className={cls['center']}>
        {mappings.map((item, index) => (
          <Row style={{ width: '100%', height: 50 }} align={'middle'}>
            <Col flex={8} style={{ textAlign: 'right' }}>
              {item.sourceAttr.name}
            </Col>
            <Col span={8} style={{ textAlign: 'center' }}>
              <Space align={'center'}>
                <Tag color="processing">{`--${item.targetAttr.property?.valueType}->`}</Tag>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    current.metadata.sourceAttrs.unshift(item.sourceAttr);
                    current.metadata.targetAttrs.unshift(item.targetAttr);
                    current.metadata.mappings.splice(index, 1);
                    current.changCallback();
                  }}>
                  删除
                </Button>
              </Space>
            </Col>
            <Col span={8} style={{ textAlign: 'left' }}>
              {item.targetAttr.name}
            </Col>
          </Row>
        ))}
      </div>
    </div>
  );
};

export default Center;
