import React, { useState } from 'react';
// import cls from './index.module.less';

import type { ProFormColumnsType, ProFormLayoutType } from '@ant-design/pro-components';
import { BetaSchemaForm, ProFormSelect } from '@ant-design/pro-components';
import { Button, Alert, DatePicker, Space,message } from 'antd';
import { CohortConfigType } from 'typings/Cohort';
import CohortService from '@/module/cohort/Cohort';
import dayjs from 'dayjs';
type DataItem = {
  name: string;
  state: string;
};
interface indexType {
  layoutType: ProFormLayoutType; //props
  open: boolean;
  [key: string]: any;
  service:CohortService,
  setOpen:Function,
  item?:CohortConfigType.CohortConfigTeam,
  getTableList:Function
  columns:ProFormColumnsType<DataItem>[]
}
const CreateCohort: React.FC<indexType> = ({ service,layoutType,item,setOpen,getTableList, columns,open, ...otherConfig }) => {

  // const [layoutType, setLayoutType] = useState<ProFormLayoutType>('Form');
  return (
    <>
      {/* <Space
        style={{
          width: '100%',
        }}
        direction="vertical">
        <ProFormSelect
          label="布局方式"
          options={[
            'Form',
            'ModalForm',
            'DrawerForm',
            'LightFilter',
            'QueryFilter',
            'StepsForm',
            'StepForm',
            'Embed',
          ]}
          fieldProps={{
            value: layoutType,
            onChange: (e) => setLayoutType(e),
          }}
        />
      </Space> */}
      <BetaSchemaForm<DataItem>
        // trigger={<a>点击我</a>}
        layoutType={layoutType}
        open={open}
        // steps={[
        //   {
        //     title: 'ProComponent',
        //   },
        // ]}
        // rowProps={{
        //   gutter: 16,
        // }}
        initialValues = {item}
        colProps={{
          span: 12,
        }}
        grid={layoutType !== 'LightFilter' && layoutType !== 'QueryFilter'}
        onFinish={async (values) => {
          console.log(values);
          const param = {
            belongId:item.belongId,
            code:values.code,
            id:item.targetId,
            name:values.name,
            teamCode:values.code,
            teamName:values.name,
            teamRemark:values.remark,
            thingId:item.thingId
          }
          console.log(param)
          service.updateItem(param)
          console.log(values);
          setOpen(false)
          getTableList();
          message.success('修改成功');
        }}
        columns={(layoutType === 'StepsForm' ? [columns] : columns) as any}
        {...otherConfig}
      />
    </>
  );
};

export default CreateCohort;
