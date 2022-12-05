import React from 'react';
import {
  ProFormText,
  ProForm,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormDependency,
} from '@ant-design/pro-components';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import cls from './index.module.less';
type BaseInfoProps = {
  nextStep: (params: any) => void;
};

const BaseInfo: React.FC<BaseInfoProps> = ({ nextStep }) => {
  const [form] = Form.useForm();
  return (
    <div className={cls['contentMes']}>
      <ProForm
        layout="horizontal"
        form={form}
        onFinish={async (e) => {
          nextStep(e);
        }}>
        <ProFormText
          name="name"
          label="业务信息"
          placeholder="输入流程名称"
          rules={[{ required: true, message: '请输入流程名称!' }]}
        />

        <ProFormList
          name="labels"
          label="流程字段"
          initialValue={[{}]}
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
              name="value"
              label="字段名称"
              rules={[{ required: true, message: '请填写字段名称!' }]}
            />
            <ProFormText
              name="label"
              label="字段编号"
              rules={[{ required: true, message: '请填写字段编号!' }]}
            />
            <ProFormSelect
              name="type"
              label="字段类型"
              request={async () => [
                { label: '字符串', value: 'STRING' },
                { label: '数字', value: 'NUMERIC' },
                { label: '枚举', value: 'DICT' },
                { label: '日期', value: 'DATE' },
              ]}
              placeholder="请选择类型"
              rules={[{ required: true, message: '请选择类型!' }]}
            />
          </ProFormGroup>
          <ProFormDependency key="remark" name={['type']}>
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
                      name="value"
                      label="字段名称"
                      rules={[{ required: true, message: '请输入字段名称!' }]}
                    />
                    <ProFormText
                      name="label"
                      label="字段编号"
                      rules={[{ required: true, message: '请输入字段编号!' }]}
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