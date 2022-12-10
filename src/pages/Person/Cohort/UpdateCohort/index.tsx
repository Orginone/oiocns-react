import React from 'react';
import type { ProFormColumnsType, ProFormLayoutType } from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';
import { message } from 'antd';
import { ICohort } from '@/ts/core/target/itarget';
import { TargetType } from '@/ts/core/enum';

type DataItem = {
  name: string;
  state: string;
};
interface indexType {
  layoutType: ProFormLayoutType; //props
  open: boolean;
  [key: string]: any;
  setOpen: Function;
  item: ICohort;
  callBack: Function;
  columns: ProFormColumnsType<DataItem>[];
}
const UpdateCohort: React.FC<indexType> = ({
  layoutType,
  item,
  setOpen,
  getTableList,
  columns,
  open,
  callBack,
  modalprops,
  ...otherConfig
}) => {
  return (
    <>
      {}
      <BetaSchemaForm<ICohort>
        layoutType={layoutType}
        open={open}
        width={500}
        initialValues={item}
        modalProps={{
          onCancel: () => setOpen(false),
        }}
        grid={layoutType !== 'LightFilter' && layoutType !== 'QueryFilter'}
        onFinish={async (values: ICohort) => {
          const res = await item.update({
            name: values.target.name,
            teamName: values.target.name,
            teamCode: values.target.code,
            code: values.target.code,
            typeName: TargetType.Cohort,
            teamRemark: values.target.team?.remark!,
            avatar: 'cohort', //头像
          });
          if (res) {
            message.success('修改成功');
          } else {
            message.error('修改失败');
          }
          setOpen(false);
          callBack();
        }}
        columns={(layoutType === 'StepsForm' ? [columns] : columns) as any}
        {...otherConfig}
      />
    </>
  );
};

export default UpdateCohort;
