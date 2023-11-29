import { ShareIconItem } from '@/components/Common/GlobalComps/entityIcon';
import { model, schema } from '@/ts/base';
import { generateUuid } from '@/ts/base/common';
import { ITransfer } from '@/ts/core';
import { Button, Space, Table, message } from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { FullModal } from '../../../common';
import cls from './../index.module.less';
import { getSpecies } from './dict';
import { DictMapper } from './mapper';
import { getMappingField } from './util';
import { getAttrs } from './fields';

interface IProps {
  transfer: ITransfer;
  current: model.Mapping;
}

type MappingType = { source?: schema.XAttribute; target?: schema.XAttribute };

const Center: React.FC<IProps> = ({ transfer, current }) => {
  const [dictModal, setDictModal] = useState<ReactNode>(<></>);
  const [mappings, setMappings] = useState<model.SubMapping[]>(current.mappings);
  const dataMap = useRef<Map<string, schema.XAttribute>>(new Map());
  const choosing = useRef<MappingType>({ source: undefined, target: undefined });
  const setDataMap = (target: 'source' | 'target') => {
    const field = current[target];
    if (field) {
      const form = transfer.forms[field];
      form?.attributes.forEach((item) => dataMap.current.set(item.id, item));
    }
  };
  setDataMap('source');
  setDataMap('target');
  const mapping = () => {
    if (choosing.current.source && choosing.current.target) {
      const clear = () => {
        transfer.command.emitter('fields', 'clear');
        transfer.command.emitter('fields', 'refresh');
      };
      const source = choosing.current.source;
      const target = choosing.current.target;
      if (source?.property?.valueType != target?.property?.valueType) {
        message.warning('字段类型必须相同！');
        clear();
        return;
      }
      current.mappings.unshift({
        source: choosing.current.source.id,
        target: choosing.current.target.id,
        typeName: target.property?.valueType,
      });
      clear();
    }
  };
  useEffect(() => {
    const cmdId = transfer.command.subscribe(async (type, cmd, args) => {
      if (type != 'fields') return;
      switch (cmd) {
        case 'refresh':
          setMappings([...current.mappings]);
          break;
        case 'choose':
          {
            const pos = args[0] as 'source' | 'target';
            choosing.current[pos] = args[1];
            mapping();
          }
          break;
        case 'clear':
          choosing.current.source = undefined;
          choosing.current.target = undefined;
          break;
      }
    });
    return () => {
      transfer.command.unsubscribe(cmdId);
    };
  }, [current]);
  return (
    <div style={{ flex: 2 }} className={cls['flex-column']}>
      <ShareIconItem share={{ name: '映射关系', typeName: '映射' }} showName />
      <Space style={{ width: '100%' }}>
        <Button
          onClick={() => {
            let tag = true;
            while (tag) {
              const sourceAttr = getAttrs(transfer, current, 'source');
              const targetAttr = getAttrs(transfer, current, 'target');
              for (const source of sourceAttr) {
                for (const target of targetAttr) {
                  if (source.property?.id == target.property?.id) {
                    choosing.current.source = source;
                    choosing.current.target = target;
                    mapping();
                    tag = true;
                    continue;
                  }
                }
              }
              tag = false;
            }
          }}>
          自动映射
        </Button>
      </Space>
      <Table
        style={{ marginTop: 16, width: '100%' }}
        dataSource={mappings}
        rowKey={() => generateUuid()}
        columns={[
          {
            title: '原字段',
            dataIndex: 'source',
            width: '40%',
            render: (value) => {
              const item = dataMap.current.get(value);
              return (
                <Space>
                  {item?.property?.info}
                  {item?.name}
                </Space>
              );
            },
          },
          {
            title: '目标字段',
            dataIndex: 'target',
            width: '40%',
            render: (value) => {
              const item = dataMap.current.get(value);
              return (
                <Space>
                  {item?.property?.info}
                  {item?.name}
                </Space>
              );
            },
          },
          {
            title: '操作',
            dataIndex: 'action',
            render: (_v, item, index) => {
              return (
                <Space align={'center'}>
                  <Button
                    type="primary"
                    size="small"
                    onClick={async () => {
                      current.mappings.splice(index, 1);
                      transfer.command.emitter('fields', 'refresh');
                    }}>
                    删除
                  </Button>
                  {item.typeName && ['选择型', '分类型'].includes(item.typeName) && (
                    <Button
                      type="primary"
                      size="small"
                      onClick={async () => {
                        setDictModal(
                          <FullModal
                            fullScreen={false}
                            title={'字典映射'}
                            finished={() => setDictModal(<></>)}>
                            <DictMapper
                              transfer={transfer}
                              node={current}
                              current={item}
                            />
                          </FullModal>,
                        );
                      }}>
                      映射
                    </Button>
                  )}
                </Space>
              );
            },
          },
        ]}
      />
      {dictModal}
    </div>
  );
};

interface DictProps {
  transfer: ITransfer;
  node: model.Mapping;
  current: model.SubMapping;
}

type DicMappingType = { source?: schema.XSpeciesItem; target?: schema.XSpeciesItem };

export const DictCenter: React.FC<DictProps> = ({ transfer, node, current }) => {
  const { sourceField, targetField } = getMappingField(node.mappingType);
  const [mappings, setMappings] = useState<model.SubMapping[]>(current.mappings ?? []);
  const [sources, setSources] = useState<{ [key: string]: schema.XSpeciesItem }>({});
  const [targets, setTargets] = useState<{ [key: string]: schema.XSpeciesItem }>({});
  const choosing = useRef<DicMappingType>({ source: undefined, target: undefined });
  const setDataMap = async (
    target: 'source' | 'target',
    setData: (items: { [key: string]: schema.XSpeciesItem }) => void,
  ) => {
    const species = await getSpecies(transfer, node, current, target);
    const data: { [key: string]: schema.XSpeciesItem } = {};
    species?.items.forEach((item) => {
      switch (target) {
        case 'source':
          data[item[sourceField]] = item;
          break;
        case 'target':
          data[item[targetField]] = item;
          break;
      }
    });
    setData(data);
  };
  useEffect(() => {
    setDataMap('source', setSources);
    setDataMap('target', setTargets);
    const cmdId = transfer.command.subscribe(async (type, cmd, args) => {
      if (type != 'items') return;
      switch (cmd) {
        case 'refresh':
          setMappings([...(current.mappings ?? [])]);
          break;
        case 'choose':
          {
            const pos = args[0] as 'source' | 'target';
            choosing.current[pos] = args[1];
            if (choosing.current.source && choosing.current.target) {
              const clear = () => {
                transfer.command.emitter('items', 'clear');
                transfer.command.emitter('items', 'refresh');
              };
              current.mappings = current.mappings || [];
              current.mappings.unshift({
                source: choosing.current.source[sourceField],
                target: choosing.current.target[targetField],
              });
              clear();
            }
          }
          break;
        case 'clear':
          choosing.current.source = undefined;
          choosing.current.target = undefined;
          break;
      }
    });
    return () => {
      transfer.command.unsubscribe(cmdId);
    };
  }, []);
  return (
    <div style={{ flex: 2 }} className={cls['flex-column']}>
      <ShareIconItem share={{ name: '字典关系', typeName: '映射' }} showName />
      <Table
        style={{ width: '100%' }}
        dataSource={mappings}
        rowKey={() => generateUuid()}
        columns={[
          {
            title: '原选择项',
            dataIndex: 'source',
            width: '40%',
            render: (value) => {
              const item = sources[value];
              return (
                <Space>
                  {item?.info}
                  {item?.name}
                </Space>
              );
            },
          },
          {
            title: '目标选择项',
            dataIndex: 'target',
            width: '40%',
            render: (value) => {
              const item = targets[value];
              return (
                <Space>
                  {item?.info}
                  {item?.name}
                </Space>
              );
            },
          },
          {
            title: '操作',
            dataIndex: 'action',
            render: (_v, _, index) => {
              return (
                <Space align={'center'}>
                  <Button
                    type="primary"
                    size="small"
                    onClick={async () => {
                      current.mappings?.splice(index, 1);
                      transfer.command.emitter('items', 'refresh');
                    }}>
                    删除
                  </Button>
                </Space>
              );
            },
          },
        ]}
      />
    </div>
  );
};

export default Center;
