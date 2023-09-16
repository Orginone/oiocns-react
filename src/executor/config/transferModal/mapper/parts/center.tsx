import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { model } from '@/ts/base';
import { XAttribute, XSpeciesItem } from '@/ts/base/schema';
import { IDirectory, IForm, ISpecies } from '@/ts/core';
import { ITransfer } from '@/ts/core';
import { Button, Col, Modal, Row, Space, Tag, TreeSelect, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { defaultGenLabel, expand } from '../..';
import cls from './../index.module.less';
interface IProps {
  link: ITransfer;
  current: model.MappingNode;
}

const Center: React.FC<IProps> = ({ link, current }) => {
  const [mappings, setMappings] = useState<model.Mapping[]>(current.data.mappings);
  const dataMap = useRef<Map<string, any>>(new Map());
  const setDataMap = (target: 'source' | 'target') => {
    // if (ShareSet.has(current.metadata[target])) {
    //   switch (current.metadata.type) {
    //     case 'fields': {
    //       const form = ShareSet.get(current.metadata[target]) as IForm;
    //       form.fields.forEach((item) => dataMap.current.set(item.id, item));
    //       break;
    //     }
    //     case 'specieItems': {
    //       const species = ShareSet.get(current.metadata[target]) as ISpecies;
    //       species.items.forEach((item) => dataMap.current.set(item.id, item));
    //       break;
    //     }
    //   }
    // }
  };
  setDataMap('source');
  setDataMap('target');
  useEffect(() => {
    // const id = current.subscribe(() => {
    //   if (current.source && current.target) {
    //     const finished = (mapping: Mapping) => {
    //       current.metadata.mappings.unshift(mapping);
    //       current.clear();
    //       current.refresh(current.metadata);
    //     };
    //     if (current.metadata.type == 'fields') {
    //       const source = current.source.item as XAttribute;
    //       const target = current.target.item as XAttribute;
    //       if (source.property?.valueType != target.property?.valueType) {
    //         message.warning('字段类型必须相同！');
    //         current.clear();
    //         return;
    //       }
    //       if (['选择型', '分类型'].indexOf(source.property?.valueType ?? '') != -1) {
    //         openSelector({
    //           current: current.directory.target.directory,
    //           finished: (mappingId) => {
    //             finished({
    //               source: source.id,
    //               target: target.id,
    //               mappingId: mappingId,
    //             });
    //           },
    //         });
    //         return;
    //       }
    //       finished({
    //         source: source.id,
    //         target: target.id,
    //       });
    //     } else {
    //       const source = current.source.item as XSpeciesItem;
    //       const target = current.target.item as XSpeciesItem;
    //       finished({
    //         source: source.id,
    //         target: target.id,
    //       });
    //     }
    //   }
    //   setMappings([...current.metadata.mappings]);
    // });
    // const cmdId = cmd.subscribe((type, cmd) => {
    //   if (type == 'fields') {
    //     switch (cmd) {
    //       case 'refresh':
    //         setMappings([...current.metadata.mappings]);
    //         break;
    //     }
    //   }
    // });
    return () => {
      // link.command.unsubscribe(cmdId);
      // current.clear();
      // current.unsubscribe(id);
    };
  }, [current]);
  return (
    <div className={cls['flex-column']}>
      <div>
        <EntityIcon entityId={'映射关系'} showName />
      </div>
      <div className={cls['center']}>
        {mappings.map((item, index) => {
          return (
            <Row
              key={item.source + item.target}
              style={{ width: '100%', height: 50 }}
              align={'middle'}>
              <Col flex={8} style={{ textAlign: 'right' }}>
                <Space>
                  {dataMap.current.get(item.source)?.info}
                  {dataMap.current.get(item.source)?.name}
                </Space>
              </Col>
              {/* <Col span={8} style={{ textAlign: 'center' }}>
                <Space align={'center'}>
                  {current.metadata.type == 'fields' && (
                    <Tag color="processing">{`--${
                      dataMap.current.get(item.source)?.valueType ?? ''
                    }->`}</Tag>
                  )}
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      current.metadata.mappings.splice(index, 1);
                      current.changCallback();
                    }}>
                    删除
                  </Button>
                </Space>
              </Col> */}
              <Col span={8} style={{ textAlign: 'left' }}>
                <Space>
                  {dataMap.current.get(item.target)?.info}
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

interface SelectProps {
  current: IDirectory;
  finished: (mappingId: string | undefined) => void;
}

// const openSelector = ({ current, finished }: SelectProps) => {
//   let mappingId: string | undefined = undefined;
//   const treeData = [
//     loadMappingsMenu(current, (entity) => {
//       return defaultGenLabel(entity, ['映射']);
//     }),
//   ];
//   const modal = Modal.confirm({
//     icon: <></>,
//     okText: '确认',
//     cancelText: '取消',
//     title: '选择字典/分类映射',
//     content: (
//       <div style={{ width: '100%' }}>
//         <TreeSelect
//           style={{ width: '100%' }}
//           fieldNames={{
//             label: 'node',
//             value: 'key',
//             children: 'children',
//           }}
//           dropdownStyle={{ maxHeight: 400, overflow: 'auto', minWidth: 300 }}
//           treeData={treeData}
//           treeDefaultExpandedKeys={expand(treeData, ['映射'])}
//           placement="bottomRight"
//           onSelect={(value) => (mappingId = value)}
//         />
//       </div>
//     ),
//     onOk: () => {
//       finished(mappingId);
//       modal.destroy();
//     },
//     onCancel: () => {
//       modal.destroy();
//     },
//   });
// };

export default Center;
