import React, { useEffect, useState } from 'react';
import { ParamsType, ProTableProps } from '@ant-design/pro-components';
import BaseThing from '../BaseThing';
import { XProperty } from '@/ts/base/schema';
import cls from './index.module.less';
import CustomTree from '@/components/CustomTree';
import { buildThingTree } from './treequest';
import orgCtrl from '@/ts/controller';
interface PageProp {
  selectable?: boolean;
  selectedKeys?: string[];
  onRowSelectChange?: (
    selectedRowKeys: React.Key[],
    selectedRows: { [key: string]: any }[],
  ) => void;
  labels: any;
  current: any;
  belongId: any;
  formInfo: any;
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
    // formInfo,
    ...rest
  } = props;

  const [propertys, setPropertys] = useState<XProperty[]>([]);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [treeSelected, setTreeSelected] = useState<any>({});
  useEffect(() => {
    queryData();
  }, [current]);
  async function queryData() {
    setTreeData(await buildThingTree(current.workItem.current.species));
  }

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      onRowSelectChange && onRowSelectChange(selectedRowKeys, selectedRows);
    },
    selectedRowKeys: selectedKeys,
    // getCheckboxProps: (record: DataType) => ({
    //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //   name: record.name,
    // }),
  };

  const handleSelect: any = async (
    selectedKeys: string[],
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
          title={'实体仓库'}
          showIcon
          treeData={treeData}
          fieldNames={{ title: 'label', key: 'key', children: 'children' }}
          onSelect={handleSelect}
        />
      </div>
      <BaseThing
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
