import { ShareIconItem } from '@/components/Common/GlobalComps/entityIcon';
import { model, schema } from '@/ts/base';
import { generateUuid } from '@/ts/base/common';
import { ISpecies, ITransfer } from '@/ts/core';
import { Species } from '@/ts/core/thing/standard/species';
import { Radio, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import cls from './../index.module.less';
import { getMappingField } from './util';

interface IProps {
  transfer: ITransfer;
  node: model.Mapping;
  current: model.SubMapping;
  target: 'source' | 'target';
}

export const getSpecies = async (
  transfer: ITransfer,
  node: model.Mapping,
  current: model.SubMapping,
  target: 'source' | 'target',
) => {
  const field = node[target];
  if (field) {
    const form = transfer.forms[field];
    const attr = form?.attributes.filter((attr) => attr.id == current[target]);
    if (attr?.length == 1) {
      const speciesId = attr[0].property?.speciesId;
      if (speciesId) {
        const meta = await transfer.directory.resource.speciesColl.find([speciesId]);
        if (meta.length > 0) {
          const species = new Species(meta[0], transfer.directory);
          await species?.loadItems();
          return species;
        }
      }
    }
  }
};

const Dict: React.FC<IProps> = ({ transfer, node, current, target }) => {
  const { sourceField, targetField } = getMappingField(node.mappingType);
  const [species, setSpecies] = useState<ISpecies>();
  const [value, setValue] = useState<string>('');
  const [items, setItems] = useState<schema.XSpeciesItem[]>([]);
  useEffect(() => {
    refreshItems();
    const id = transfer.command.subscribe((type, cmd) => {
      if (type != 'items') return;
      switch (cmd) {
        case 'clear':
          setValue('');
          break;
        case 'refresh':
          refreshItems();
          break;
      }
    });
    return () => {
      transfer.command.unsubscribe(id);
    };
  }, []);
  const refreshItems = () => {
    getSpecies(transfer, node, current, target).then((res) => {
      setSpecies(res);
      const used = new Set(current.mappings?.map((item) => item[target]));
      setItems(
        res?.items.filter((item) => {
          switch (target) {
            case 'source':
              return !used.has(item[sourceField]);
            case 'target':
              return !used.has(item[targetField]);
          }
        }) ?? [],
      );
    });
  };
  return (
    <div style={{ flex: 1 }} className={cls['flex-column']}>
      <ShareIconItem
        share={{ name: species?.name ?? '字典', typeName: '映射' }}
        showName
      />
      <div className={cls['dicts']}>
        <Radio.Group value={value} buttonStyle="outline">
          <Space direction="vertical">
            {items.map((item) => {
              return (
                <Radio
                  key={generateUuid()}
                  className={cls['field']}
                  value={item.id}
                  onChange={(e) => {
                    setValue(e.target.value);
                    transfer.command.emitter('items', 'choose', [target, item]);
                  }}>
                  <Space>{item.info + ' ' + item?.name}</Space>
                </Radio>
              );
            })}
          </Space>
        </Radio.Group>
      </div>
    </div>
  );
};

export default Dict;
