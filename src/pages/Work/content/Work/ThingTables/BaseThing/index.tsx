import { XProperty } from '@/ts/base/schema';
import React, { useEffect, useMemo, useState } from 'react';
import { getColItem } from '../funs';
import { defaultCol } from '../const';
import { getScrollX } from '@/utils';

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
    let columns: any[] = [...defaultCol, ...propertys].map((item: any) => {
      return getColItem(item, colKey);
    });
    if (!readonly) {
      columns.push(Operation);
    }

    return columns;
  }, [props.dataSource, propertys, readonly]);
  const { columnsRes, scrollx } = getScrollX(getColumns);

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
        columns={columnsRes}
        tableAlertRender={false}
        options={readonly ? false : undefined}
        toolBarRender={readonly ? undefined : toolBarRender}
        scroll={{ x: scrollx }}
        {...rest}
      />
    </>
  );
};
export default BaseThing;
