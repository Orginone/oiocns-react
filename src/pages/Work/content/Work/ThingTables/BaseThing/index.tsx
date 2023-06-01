import { XProperty } from '@/ts/base/schema';
import React, { useEffect, useMemo, useState } from 'react';
import { getColItem } from '../funs';
import { defaultCol } from '../config';
import {
  ParamsType,
  ProColumnType,
  ProTable,
  ProTableProps,
} from '@ant-design/pro-components';
import cls from './index.module.less';
import { kernel } from '@/ts/base';
interface IProps {
  propertys: XProperty[];
  belongId?: string;
  onListChange?: Function;
  Operation?: ProColumnType<any>; //操作列渲染
  labels?: string[];
  formInfo?: any; //传进来的 表单基本信息
  defaultColums?: any[]; //传进来的 表头设置
  readonly?: boolean; //只读表单，隐藏操作区，配置区
  colKey?: 'propertyId' | 'attrId'; //cloumns表头取值设置 属性Id、特性id
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
    colKey = 'propertyId',
    propertys,
    // defaultColums,
    belongId,
    labels = [],
    Operation = {},
    readonly,
    toolBarRender,
    ...rest
  } = props;
  const [showData, setShowData] = useState<any[]>([]);
  const getColumns: any = useMemo(() => {
    let columns: any[] = defaultCol.map((item: any) => {
      return getColItem(item, colKey);
    });

    for (const p of propertys) {
      columns.push(getColItem(p as any, colKey));
    }
    !readonly && columns.push(Operation);
    return columns;
  }, [props.dataSource, propertys, readonly]);

  useEffect(() => {
    fetchData();
  }, [props.labels]);
  const fetchData = async (loadOptions: any = {}) => {
    if (!belongId || labels.length == 0) {
      return;
    }
    loadOptions.userData = labels;
    let request: any = { ...loadOptions };
    // if (props.byIds) {
    //   request.options = {
    //     match: {
    //       _id: {
    //         _in_: props.byIds,
    //       },
    //     },
    //   };
    // }
    const result = await kernel.anystore.loadThing<any>(belongId, request);
    const { success, data } = result;
    if (success) {
      // return ;
      setShowData(
        data.data.map((properItem: any) => {
          const { Propertys: ProperData, ...rest } = properItem;
          let obj = { ...rest };
          for (const key in ProperData) {
            obj[key.slice(1)] = ProperData[key];
          }
          return obj;
        }),
      );
    } else {
      setShowData([]);
    }
  };
  return (
    <>
      <ProTable
        rowKey={rowKey}
        cardProps={{
          className: cls.thingTable,
        }}
        key={labels.join('%')}
        dataSource={labels.length > 0 ? showData : props.dataSource}
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
