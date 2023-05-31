import React, { useEffect, useState } from 'react';
import { ParamsType, ProTableProps } from '@ant-design/pro-components';
import BaseThing from '../BaseThing';
import { defaultData } from '../config';
import { XProperty } from '@/ts/base/schema';
import cls from './index.module.less';
import CustomTree from '@/components/CustomTree';
import { buildThingTree } from './treequest';
interface PageProp {
  pageType?: 'tree' | 'table';
  selectable?: boolean;
  onRowSelectChange?: (
    selectedRowKeys: React.Key[],
    selectedRows: { [key: string]: any }[],
  ) => void;
  propertys: XProperty[];
  labels: any;
  current: any;
  belongId: any;
}

const SelectThing = <
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text',
>(
  props: ProTableProps<DataType, Params, ValueType> & PageProp,
) => {
  const {
    headerTitle = '实体类',
    // pageType = 'tree',
    selectable = false,
    onRowSelectChange,
    current,
    // belongId,
    propertys,
    ...rest
  } = props;
  const [treeData, setTreeData] = useState<any[]>([]);

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
    // getCheckboxProps: (record: DataType) => ({
    //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //   name: record.name,
    // }),
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div className={cls.leftTree}>
        <CustomTree
          title={'实体仓库'}
          showIcon
          treeData={treeData}
          fieldNames={{ title: 'label', key: 'key', children: 'children' }}
        />
      </div>
      <BaseThing
        headerTitle={headerTitle}
        rowSelection={selectable ? rowSelection : undefined}
        propertys={propertys}
        dataSource={defaultData}
        readonly
        {...rest}
      />
    </div>
  );
};

export default SelectThing;
