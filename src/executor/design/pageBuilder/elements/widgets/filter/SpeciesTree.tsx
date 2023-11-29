import CustomMenu from '@/components/CustomMenu';
import CustomTree from '@/components/CustomTree';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { List, schema } from '@/ts/base';
import { Controller } from '@/ts/controller';
import { IProperty } from '@/ts/core';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Space, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { ExistTypeMeta } from '../../../core/ElementMeta';
import {
  SpeciesEntity,
  SpeciesNode,
  SpeciesProp,
  loadItems,
} from '../../../core/hooks/useSpecies';
import { File } from '../../../design/config/FileProp';
import { Context } from '../../../render/PageContext';
import { defineElement } from '../../defineElement';

interface IProps {
  ctx: Context;
  species: SpeciesProp[];
}

const Design: React.FC<IProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [species, setSpecies] = useState<SpeciesEntity[]>([]);
  const loadSpecies = async () => {
    setLoading(true);
    setSpecies(await loadItems(props.species, props.ctx));
    setLoading(false);
  };
  useEffect(() => {
    loadSpecies();
  }, []);
  return (
    <Spin spinning={loading}>
      <Space style={{ width: 300, padding: '0 10px' }} direction="vertical">
        <CustomTree
          searchable
          treeData={species}
          titleRender={(node: any) => {
            return (
              <Space align="start">
                <DeleteOutlined
                  onClick={() => {
                    const index = props.species.findIndex((id) => id == node.id);
                    props.species.splice(index, 1);
                    loadSpecies();
                  }}
                />
                {node.name}
              </Space>
            );
          }}
        />
        <File
          accepts={['分类型']}
          multiple={true}
          excludeIds={props.species.map((item) => item.code)}
          onOk={(files) => {
            files.forEach((file) => {
              const property = file as IProperty;
              props.species.push({
                code: property.id,
                name: property.code + ' ' + property.name,
                speciesId: property.metadata.speciesId,
              });
            });
            loadSpecies();
          }}>
          <Button type="dashed" size="small">
            添加分类型
          </Button>
        </File>
      </Space>
    </Spin>
  );
};

const buildSpecies = (species: SpeciesEntity[]): SpeciesNode[] => {
  return species.map((item) => {
    item.species.items.forEach((speciesItems) => {
      if (!speciesItems.parentId) {
        speciesItems.parentId = item.species.id;
      }
    });
    const groups = new List(item.species.items).GroupBy((item) => item.parentId);
    return {
      key: item.code + '-' + item.species.id,
      label: item.name,
      children: buildItems(item.code, item.species.id, groups),
      itemType: '分类',
      item: item,
    };
  });
};

const buildItems = (
  code: string,
  parentId: string,
  groups: { [key: string]: schema.XSpeciesItem[] },
): any => {
  const children = groups[parentId] ?? [];
  return children.map((item) => {
    return {
      key: code + item.id,
      label: item.name,
      children: buildItems(code, item.id, groups),
      itemType: '分类项',
      item: item,
    };
  });
};

const View: React.FC<IProps> = (props) => {
  const [ctrl] = useState(new Controller('ctrl'));
  const [loading, setLoading] = useState(false);
  const species = useRef<SpeciesEntity[]>([]);
  const loadSpecies = async () => {
    setLoading(true);
    species.current = await loadItems(props.species, props.ctx);
    setLoading(false);
    ctrl.changCallback();
  };
  // eslint-disable-next-line no-unused-vars
  const [_, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(() => {
    return {
      key: 'speciesTree',
      label: '分类树',
      itemType: '分类树',
      children: buildSpecies(species.current),
    };
  }, ctrl);
  useEffect(() => {
    loadSpecies();
  }, []);
  if (!selectMenu || !rootMenu) {
    return <></>;
  }
  const parentMenu = selectMenu.parentMenu ?? rootMenu;
  const sendSearch = (node: any) => {
    if (node.item) {
      if (node.item.id) {
        props.ctx.view.emitter('species', 'checked', ['S' + node.item.id]);
      } else if (node.item.code) {
        props.ctx.view.emitter('species', 'checked', ['T' + node.item.code]);
      }
    }
  };
  return (
    <Spin spinning={loading}>
      <Space style={{ width: 300, padding: 10 }} direction="vertical">
        <div
          style={{ textAlign: 'center' }}
          title={parentMenu.label}
          onClick={() => {
            setSelectMenu(parentMenu);
            sendSearch(parentMenu);
          }}>
          <span style={{ fontSize: 20, margin: '0 6px' }}>{parentMenu.icon}</span>
          <strong>{parentMenu.label}</strong>
        </div>
        <CustomMenu
          collapsed={false}
          selectMenu={selectMenu}
          item={selectMenu.parentMenu ?? rootMenu}
          onSelect={(node) => {
            setSelectMenu(node);
            sendSearch(node);
          }}
        />
      </Space>
    </Spin>
  );
};

export default defineElement({
  render(props, ctx) {
    if (ctx.view.mode == 'design') {
      return <Design {...props} ctx={ctx} />;
    }
    return <View {...props} ctx={ctx} />;
  },
  displayName: 'SpeciesTree',
  meta: {
    type: 'Element',
    label: '分类树',
    props: {
      species: {
        type: 'array',
        label: '分类数组',
        elementType: {
          type: 'type',
          label: '分类',
        } as ExistTypeMeta<SpeciesProp>,
        default: [],
      },
    },
  },
});
