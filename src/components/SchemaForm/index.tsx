import React from 'react';
// import cls from './index.module.less';
import type { ProFormColumnsType, ProFormLayoutType } from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';
import { DataType } from 'typings/globelType';

interface indexType<T> {
  layoutType: ProFormLayoutType; //props
  open: boolean;
  columns: ProFormColumnsType<T>[];
  onFinish: (values: T) => void;
  [key: string]: any;
}
const Index = <T extends DataType>({
  layoutType,
  open,
  columns,
  onFinish,
  ...otherConfig
}: indexType<T>) => {
  const config = {
    layoutType,
    open,
    colProps: { span: 12 },
    grid: layoutType !== 'LightFilter' && layoutType !== 'QueryFilter',
    onFinish: async (values: T) => {
      console.log('jsonfromonFinish', values);
      onFinish(values);
    },
    columns: (layoutType === 'StepsForm' ? [columns] : columns) as any,
    ...otherConfig,
  };
  return (
    <>
      <BetaSchemaForm<T> {...config} />
    </>
  );
};

export default Index;
