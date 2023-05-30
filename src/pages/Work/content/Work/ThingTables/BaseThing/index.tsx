import { XProperty } from '@/ts/base/schema';
import React, { useMemo } from 'react';
import { getColItem } from '../funs';
import { defaultCol } from '../config';
import {
  ParamsType,
  ProColumnType,
  ProTable,
  ProTableProps,
} from '@ant-design/pro-components';

interface IProps {
  propertys: XProperty[];

  onListChange?: Function;
  Operation?: ProColumnType<any>; //操作列渲染

  formInfo?: any; //传进来的 表单基本信息
  defaultColums?: any[]; //传进来的 表头设置
  readonly?: boolean; //只读表单，隐藏操作区，配置区
}

const BaseThing = <
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text',
>(
  props: ProTableProps<DataType, Params, ValueType> & IProps,
) => {
  const {
    rowKey = 'Id',
    propertys,
    dataSource,
    // defaultColums,
    Operation = {},
    readonly,
    toolBarRender,
    ...rest
  } = props;

  const getColumns: any = useMemo(() => {
    let columns: any[] = defaultCol.map((item: any) => {
      return getColItem(item);
    });

    for (const p of propertys) {
      columns.push(getColItem(p as any));
    }
    !readonly && columns.push(Operation);
    return columns;
  }, [dataSource, propertys, readonly]);

  return (
    <>
      <ProTable
        rowKey={rowKey}
        size="small"
        dataSource={dataSource}
        search={false}
        columns={getColumns}
        tableAlertRender={false}
        options={readonly ? false : undefined}
        toolBarRender={readonly ? undefined : toolBarRender}
        {...rest}
      />
    </>
  );
};
export default BaseThing;
