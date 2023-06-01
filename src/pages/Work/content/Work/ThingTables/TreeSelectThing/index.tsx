import React, { useEffect, useState } from 'react';
import { ParamsType, ProTableProps } from '@ant-design/pro-components';
import BaseThing from '../BaseThing';
import cls from './index.module.less';
import CustomTree from '@/components/CustomTree';
import { buildThingTree } from './treequest';
import orgCtrl from '@/ts/controller';
import { schema } from '@/ts/base';
interface PageProp {
  selectable?: boolean;
  selectedKeys?: string[];
  onRowSelectChange?: (
    selectedRowKeys: React.Key[],
    selectedRows: { [key: string]: any }[],
  ) => void;
  labels: string[];
  current: any;
  belongId: string;
  form: schema.XForm;
}

const SelectThing = <
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text',
>(
  props: ProTableProps<DataType, Params, ValueType> & PageProp,
) => {
  const {
    selectable = false,
    onRowSelectChange,
    selectedKeys = [],
    current,
    belongId,
    // form,
    ...rest
  } = props;

  const [propertys, setPropertys] = useState<schema.XProperty[]>([]); //表格头部展示数据
  const [treeData, setTreeData] = useState<any[]>([]); //实体树展示数据
  const [treeSelected, setTreeSelected] = useState<any>({}); //实体树 选择的
  useEffect(() => {
    queryData();
  }, [current]);
  async function queryData() {
    setTreeData(await buildThingTree(current.workItem.current.species));
  }

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      onRowSelectChange && onRowSelectChange(selectedRowKeys, selectedRows);
    },
    selectedRowKeys: selectedKeys,
    // 设置禁止选取，禁止操作
    // getCheckboxProps: (record: DataType) => ({
    //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //   name: record.name,
    // }),
  };

  const handleSelect: any = async (
    _selectedKeys: string[],
    _info: {
      event: 'select';
      selected: boolean;
      node: any;
      selectedNodes: any[];
      nativeEvent: MouseEvent;
    },
  ) => {
    let attributes = await orgCtrl.work.loadAttributes(_info.node.item.id, belongId);
    setTreeSelected(_info.node.item);
    setPropertys(
      attributes
        .filter((i) => i.linkPropertys && i.linkPropertys.length > 0)
        .map((i) => {
          return { attrId: i.id, ...i.linkPropertys![0] };
        }),
    );
  };
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div className={cls.leftTree}>
        <CustomTree
          title={'实体分类'}
          showIcon
          treeData={treeData}
          fieldNames={{ title: 'label', key: 'key', children: 'children' }}
          onSelect={handleSelect}
        />
      </div>
      <BaseThing
        style={{ width: 'calc(100% - 220px)', marginTop: '20px' }}
        rowSelection={selectable ? rowSelection : undefined}
        key={treeSelected?.id}
        colKey={'propertyId'}
        readonly
        {...rest}
        belongId={belongId}
        propertys={propertys}
        labels={treeSelected?.id ? [`S${treeSelected.id}`] : undefined}
      />
    </div>
  );
};

export default SelectThing;
