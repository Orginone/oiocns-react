import React from 'react';
// import cls from './index.module.less';
import CohortEnty from '../../../ts/core/target/cohort'
import type { ProFormColumnsType, ProFormLayoutType } from '@ant-design/pro-components';
import { BetaSchemaForm,  } from '@ant-design/pro-components';
import { message } from 'antd';

import CohortController from '../../../ts/controller/cohort/index'
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
const CreateCohort: React.FC<indexType> = ({
  layoutType,
  item,
  setOpen,
  getTableList,
  columns,
  open,
  ...otherConfig
}) => {
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
      <BetaSchemaForm<CohortEnty>
        // trigger={<a>点击我</a>}
        layoutType={layoutType}
        open={open}
        width = {500}
        // steps={[
        //   {
        //     title: 'ProComponent',
        //   },
        // ]}
        // rowProps={{
        //   gutter: 16,
        // }}
        initialValues={item}
        // colProps={{
        //   span: 12,
        // }}
        grid={layoutType !== 'LightFilter' && layoutType !== 'QueryFilter'}
        onFinish={async (values: CohortEnty) => {
          console.log("查看内容",item)
          console.log('修改结果',CohortController.updateCohort(item,values.target.name,values.target.code,values.target.team?.remark!,item.target.belongId))
          // service.updateItem(param);
          console.log(values);
          setOpen(false);
          // getTableList();
          message.success('修改成功');
        }}
        columns={(layoutType === 'StepsForm' ? [columns] : columns) as any}
        {...otherConfig}
      />
    </>
  );
};

export default CreateCohort;
