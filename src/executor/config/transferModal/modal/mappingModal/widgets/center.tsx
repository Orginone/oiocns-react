import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { model, schema } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { ShareIdSet } from '@/ts/core/public/entity';
import { Button, Col, Row, Space, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import cls from './../index.module.less';

interface IProps {
  transfer: ITransfer;
  current: model.Mapping;
}

type MappingType = { source?: schema.XAttribute; target?: schema.XAttribute };

const Center: React.FC<IProps> = ({ transfer, current }) => {
  const [mappings, setMappings] = useState<model.SubMapping[]>(current.mappings);
  const dataMap = useRef<Map<string, schema.XAttribute>>(new Map());
  const choosing = useRef<MappingType>({ source: undefined, target: undefined });
  const setDataMap = (target: 'source' | 'target') => {
    if (ShareIdSet.has(current[target])) {
      const form = ShareIdSet.get(current[target]) as schema.XForm;
      form.attributes.forEach((item) => dataMap.current.set(item.id, item));
    }
  };
  setDataMap('source');
  setDataMap('target');
  useEffect(() => {
    const id = transfer.subscribe(() => {
      if (choosing.current.source && choosing.current.target) {
        const finished = (mapping: model.SubMapping) => {
          current.mappings.unshift(mapping);
          transfer.updNode(current);
        };
        const clear = () => {
          transfer.command.emitter('fields', 'clear');
          transfer.changCallback();
        };
        const source = choosing.current.source;
        const target = choosing.current.target;
        if (source?.property?.valueType != target?.property?.valueType) {
          message.warning('字段类型必须相同！');
          clear();
          return;
        }
        finished({
          source: choosing.current.source.id,
          target: choosing.current.target.id,
        });
        clear();
      }
      setMappings([...current.mappings]);
    });
    const cmdId = transfer.command.subscribe((type, cmd, args) => {
      if (type == 'fields') {
        switch (cmd) {
          case 'refresh':
            setMappings([...current.mappings]);
            break;
          case 'choose':
            const pos = args[0] as 'source' | 'target';
            choosing.current[pos] = args[1];
            transfer.changCallback();
            break;
          case 'clear':
            choosing.current.source = undefined;
            choosing.current.target = undefined;
            break;
        }
      }
    });
    return () => {
      transfer.command.unsubscribe(cmdId);
      transfer.unsubscribe(id);
    };
  }, [current]);
  return (
    <div className={cls['flex-column']}>
      <EntityIcon entityId={'映射关系'} showName />
      <div className={cls['center']}>
        {mappings.map((item, index) => {
          return (
            <Row
              key={item.source + item.target}
              style={{ width: '100%', height: 50 }}
              align={'middle'}>
              <Col flex={8} style={{ textAlign: 'right' }}>
                <Space>
                  {dataMap.current.get(item.source)?.property?.info}
                  {dataMap.current.get(item.source)?.name}
                </Space>
              </Col>
              {
                <Col span={8} style={{ textAlign: 'center' }}>
                  <Space align={'center'}>
                    <Button
                      type="primary"
                      size="small"
                      onClick={async () => {
                        current.mappings.splice(index, 1);
                        await transfer.updNode(current);
                        transfer.changCallback();
                      }}>
                      删除
                    </Button>
                  </Space>
                </Col>
              }
              <Col span={8} style={{ textAlign: 'left' }}>
                <Space className={cls.overflow}>
                  {dataMap.current.get(item.target)?.property?.info}
                  {dataMap.current.get(item.target)?.name}
                </Space>
              </Col>
            </Row>
          );
        })}
      </div>
    </div>
  );
};

export default Center;
