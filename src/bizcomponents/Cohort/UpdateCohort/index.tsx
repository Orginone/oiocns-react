import React from 'react';
import CohortEnty from '../../../ts/core/target/cohort';
import type { ProFormColumnsType, ProFormLayoutType } from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';
import { message } from 'antd';

import CohortController from '../../../ts/controller/cohort/index';
type DataItem = {
  name: string;
  state: string;
};
interface indexType {
  layoutType: ProFormLayoutType; //props
  open: boolean;
  [key: string]: any;
  setOpen: Function;
  item: CohortEnty;
  getTableList: Function;
  columns: ProFormColumnsType<DataItem>[];
}
const UpdateCohort: React.FC<indexType> = ({
  layoutType,
  item,
  setOpen,
  getTableList,
  columns,
  open,
  ...otherConfig
}) => {
  return (
    <>
      {}
      <BetaSchemaForm<CohortEnty>
        layoutType={layoutType}
        open={open}
        width={500}
        initialValues={item}
        grid={layoutType !== 'LightFilter' && layoutType !== 'QueryFilter'}
        onFinish={async (values: CohortEnty) => {
          console.log('查看内容', item);
          console.log(
            '修改结果',
            CohortController.updateCohort(
              item,
              values.target.name,
              values.target.code,
              values.target.team?.remark!,
              item.target.belongId,
            ),
          );
          console.log(values);
          setOpen(false);
          message.success('修改成功');
        }}
        columns={(layoutType === 'StepsForm' ? [columns] : columns) as any}
        {...otherConfig}
      />
    </>
  );
};

export default UpdateCohort;
