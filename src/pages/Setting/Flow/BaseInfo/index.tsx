import React, { useState } from 'react';
import {
  ProFormText,
  ProForm,
  ProCard,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormDependency,
} from '@ant-design/pro-components';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import cls from './index.module.less';
type BaseInfoProps = {
  nextStep: () => void;
};

const BaseInfo: React.FC<BaseInfoProps> = ({ nextStep }) => {
  const [form] = Form.useForm();

  return (
    <div className={cls['contentMes']}>
      <ProForm
        layout="horizontal"
        form={form}
        onFinish={async (e) => {
          nextStep();
        }}>
        <ProFormList
          name="users"
          // label="业务信息"
          initialValue={[{}]}
          // copyIconProps={{ Icon: SmileOutlined, tooltipText: '复制此行到末尾' }}
          deleteIconProps={{
            Icon: CloseCircleOutlined,
            tooltipText: '删除这个流程',
          }}
          creatorButtonProps={{
            position: 'bottom',
            creatorButtonText: '新建流程',
          }}
          itemRender={({ listDom, action }, { record, index }) => {
            console.log(record);
            return (
              <ProCard
                bordered
                extra={action}
                title={`流程${index + 1}`}
                style={{
                  marginBlockEnd: 8,
                }}>
                {listDom}
              </ProCard>
            );
          }}>
          <ProFormGroup>
            <ProFormText
              name="name"
              label="业务信息"
              placeholder="输入流程名称"
              rules={[{ required: true, message: '请输入流程名称!' }]}
            />
          </ProFormGroup>
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
                name="select2"
                label="字段类型"
                request={async () => [
                  { label: '字符串', value: '字符串' },
                  { label: '数字', value: '数字' },
                  { label: '枚举', value: '枚举' },
                ]}
                placeholder="请选择类型"
                rules={[{ required: true, message: '请选择类型!' }]}
              />
            </ProFormGroup>
            <ProFormDependency key="remark" name={['select2']}>
              {({ select2 }) => {
                if (select2 !== '枚举') {
                  return false;
                }
                return (
                  <ProFormList
                    name="enumArray"
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
        </ProFormList>
      </ProForm>
    </div>
  );
};

export default BaseInfo;
