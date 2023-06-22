import { XProperty } from '@/ts/base/schema';
import React, { useMemo } from 'react';
import { getColItem } from '../Function';
import { defaultCol, defaultColumnStateMap } from '../const';
import { getScrollX } from '@/utils';
import {
  ParamsType,
  ProColumnType,
  ProTable,
  ProTableProps,
} from '@ant-design/pro-components';
import cls from './index.module.less';
import { IFormView } from '@/ts/core';
interface IProps extends ProTableProps<Record<string, any>, ParamsType, 'text'> {
  propertys: XProperty[]; // 表单头部展示数据源
  belongId?: string;
  Operation?: ProColumnType<any>; // 操作列渲染
  labels?: string[]; //搜索信息 表单标签
  formView: IFormView; // 表单基本信息
  readonly?: boolean; //只读表单，隐藏操作区，配置区
}
const BaseThing: React.FC<IProps> = (props) => {
  const {
    propertys = [],
    labels = [],
    Operation = {},
    readonly,
    toolBarRender,
    scroll = {},
    ...rest
  } = props;
  const getColumns: any = useMemo(() => {
    let columns: any[] = [...defaultCol, ...propertys].map((item: any) => {
      return getColItem(item, {});
    });
    if (!readonly) {
      columns.push(Operation);
    }

    return columns;
  }, [props.dataSource, propertys, readonly]);
  const { columnsRes, scrollx } = getScrollX(getColumns);
  return (
    <div>
      <ProTable
        cardProps={{
          className: cls.thingTable,
        }}
        key={labels.join('%')}
        dataSource={props.dataSource}
        search={false}
        columns={columnsRes}
        tableAlertRender={false}
        options={readonly ? false : undefined}
        columnsState={{ ...defaultColumnStateMap }}
        toolBarRender={readonly ? undefined : toolBarRender}
        scroll={{ ...scroll, x: scrollx }}
        {...rest}
      />
    </div>
  );
};
export default BaseThing;
