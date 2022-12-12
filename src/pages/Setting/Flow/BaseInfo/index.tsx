import React, { useEffect } from 'react';
import {
  ProFormText,
  ProForm,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormDependency,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import DefaultProps from '@/bizcomponents/Flow/flow';
import ProcessCtrl from '@/ts/controller/setting/processCtrl';
import { optionType } from '@/ts/controller/setting/processType';
import cls from './index.module.less';
type BaseInfoProps = {
  nextStep: (params: any) => void;
  currentFormValue: {};
  onChange: (params: any) => void;
};
/** 傻瓜组件，只负责读取状态 */
const BaseInfo: React.FC<BaseInfoProps> = ({ nextStep, currentFormValue, onChange }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(currentFormValue);
  }, [currentFormValue]);

  return (
    <div className={cls['contentMes']}>
      <ProForm
        layout="horizontal"
        onValuesChange={async () => {
          const currentValue = await form.getFieldsValue();

          onChange(currentValue);
          DefaultProps.setFormFields(currentValue?.labels);
          ProcessCtrl.setCondtionData(currentValue);
        }}
        form={form}
        onFinish={async (e) => {
          nextStep(e);
        }}>
        <ProFormText
          name="name"
          label="流程名称"
          placeholder="输入流程名称"
          rules={[{ required: true, message: '请输入流程名称!' }]}
        />
        <ProFormTextArea
          name="fields"
          label="备注信息"
          placeholder="输入备注信息"
          // rules={[{ required: true, message: '请输入备注信息!' }]}
        />
        <ProFormList
          name="labels"
          label="流程字段"
          initialValue={[{ label: '' }]}
          deleteIconProps={{
            Icon: CloseCircleOutlined,
            tooltipText: '删除这个流程字段',
          }}
          creatorButtonProps={{
            position: 'bottom',
            creatorButtonText: '新增字段',
          }}>
          <ProFormGroup key="group">
            <ProFormText
              name="label"
              label="字段名称"
              rules={[{ required: true, message: '请填写字段名称!' }]}
            />
            <ProFormText
              name="value"
              label="字段编号"
              rules={[{ required: true, message: '请填写字段编号!' }]}
            />
            <ProFormSelect
              name="type"
              label="字段类型"
              options={optionType}
              placeholder="请选择类型"
              rules={[{ required: true, message: '请选择类型!' }]}
            />
          </ProFormGroup>
          <ProFormDependency key="type" name={['type']}>
            {({ type }) => {
              if (type !== 'DICT') {
                return false;
              }
              return (
                <ProFormList
                  name="dict"
                  label="枚举信息"
                  deleteIconProps={{
                    Icon: CloseCircleOutlined,
                    tooltipText: '删除这个枚举值',
                  }}
                  initialValue={[{}]}
                  creatorButtonProps={{
                    position: 'bottom',
                    creatorButtonText: '新增枚举值',
                  }}>
                  <ProFormGroup key="group">
                    <ProFormText
                      name="label"
                      label="枚举名称"
                      rules={[{ required: true, message: '请输入枚举名称!' }]}
                    />
                    <ProFormText
                      name="value"
                      label="枚举值"
                      rules={[{ required: true, message: '请输入枚举值!' }]}
                    />
                  </ProFormGroup>
                </ProFormList>
              );
            }}
          </ProFormDependency>
        </ProFormList>
      </ProForm>
    </div>
  );
};

export default BaseInfo;
