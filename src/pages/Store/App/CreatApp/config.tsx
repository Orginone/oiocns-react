import type { ProFormColumnsType } from '@ant-design/pro-components';
import { ProCard } from '@ant-design/pro-components';
import cls from './index.module.less';
import React from 'react';
import { Space } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const valueEnum = {
  all: { text: '全部', status: 'Default' },
  open: {
    text: '未解决',
    status: 'Error',
  },
  closed: {
    text: '已解决',
    status: 'Success',
    disabled: true,
  },
  processing: {
    text: '解决中',
    status: 'Processing',
  },
};
const valueEnumType = {
  1: { text: '枚举' },
  2: {
    text: '字符串',
    status: 'Error',
  },
  3: {
    text: '数字',
  },
};

type DataItem = {
  name: string;
  state: string;
};
const groupTitle = (name: string) => {
  return (
    <Space className={cls[`new-store-title`]} size={8}>
      <div className={cls[`new-store-title-before`]}></div>
      <span className={cls[`new-store-info`]}>{name}</span>
    </Space>
  );
};
// 流程信息
const flows: ProFormColumnsType<DataItem> = {
  title: groupTitle(`流程信息`),
  valueType: 'formList',
  dataIndex: 'approveList',
  width: '100%',
  colProps: { span: 24 },
  fieldProps: {
    // 新增按钮样式配置
    creatorButtonProps: {
      type: 'text',
      position: 'top',
      creatorButtonText: '',
      block: false,
      className: cls.addFormListBtn2,
    },
    deleteIconProps: {
      Icon: CloseCircleOutlined,
      tooltipText: '删除该流程',
    },
    itemRender: ({ listDom, action }: any, { record, index }: any) => {
      // debugger;
      return (
        <ProCard
          bordered
          extra={action}
          title={record?.name || `流程${index + 1}`}
          style={{
            marginBlockEnd: 8,
          }}>
          {listDom}
        </ProCard>
      );
    },
  },
  columns: [
    {
      title: '业务信息',
      dataIndex: 'componentName',
      colProps: { span: 12 },
    },
    {
      valueType: 'formList',
      dataIndex: 'flowTypes',
      colProps: { span: 24 },
      fieldProps: {
        // 新增按钮样式配置
        creatorButtonProps: {
          // type: 'text',
          position: 'top',
          creatorButtonText: '添加字段',
          block: false,
          className: cls.addFormListBtn,
        },
      },
      columns: [
        {
          valueType: 'group',
          colProps: { span: 24 },
          columns: [
            {
              title: '字段名称',
              colProps: { span: 8 },
              // width: 'md',
              dataIndex: 'componentAddress',
            },
            {
              title: '字段编号',
              colProps: { span: 8 },
              dataIndex: 'componentWidth',
            },
            {
              title: '字段类型',
              colProps: { span: 8 },
              dataIndex: 'valueType',
              valueType: 'select',
              valueEnum: valueEnumType,
            },
            {
              valueType: 'dependency',
              name: ['valueType'],
              columns: ({ valueType }) => {
                return valueType === '1' ? [valueTypeColumns] : [];
              },
            },
          ],
        },
      ],
    },
  ],
};
// 字段为枚举类型时的配置
const valueTypeColumns: ProFormColumnsType<DataItem> = {
  title: '枚举配置',
  valueType: 'group',
  colProps: { span: 24 },

  columns: [
    {
      valueInded
      valueType: 'formList',
      colProps: { span: 24 },
      fieldProps: {
        itemRender: ({ listDom, action }: any, { record, index }: any) => {
          // debugger;
          return (
            <ProCard
              bordered
              extra={action}
              title={record?.name || `流程${index + 1}`}
              style={{
                marginBlockEnd: 8,
              }}>
              {listDom}
            </ProCard>
          );
        },
      },
      columns: [
        {
          title: '枚举名称',
          colProps: { span: 8 },
          dataIndex: 'componentAddress',
        },
        {
          title: '枚举值',
          colProps: { span: 8 },
          dataIndex: 'componentWidth',
        },
      ],
    },
  ],
};
const columns: ProFormColumnsType<DataItem>[] = [
  {
    title: groupTitle('基础信息'),
    valueType: 'group',
    width: 'md',
    colProps: { md: 24 },
    columns: [
      {
        title: '应用名称',
        dataIndex: 'name',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
        },
        width: 'md',
      },
      {
        title: '应用编码',
        dataIndex: 'code',
        width: 'md',
      },
      {
        title: '应用详情',
        dataIndex: 'platfrom',
        valueType: 'textarea',
        width: 'xl',
      },
    ],
  },
  {
    title: groupTitle(`资源信息`),
    valueType: 'group',
    width: 'md',
    colProps: { md: 24 },
    columns: [
      {
        valueType: 'formList',
        dataIndex: 'sourceList',
        fieldProps: {
          // 新增按钮样式配置
          creatorButtonProps: {
            type: 'text',
            position: 'top',
            creatorButtonText: '',
            block: false,
            className: cls.addFormListBtn,
          },
          itemRender: ({ listDom, action }: any, { record, index }: any) => {
            // console.log(...arg);
            return (
              <ProCard
                bordered
                extra={action}
                title={record?.name || `资源 ${index + 1}`}
                style={{
                  marginBlockEnd: 8,
                }}>
                {listDom}
              </ProCard>
            );
          },
        },
        colProps: { md: 24 },
        columns: [
          {
            valueType: 'group',
            width: 'md',
            colProps: { md: 24 },
            columns: [
              {
                title: '资源名称',
                dataIndex: 'componentName',
                // valueType: 'select',
                width: 'md',
                // valueEnum,
              },
              {
                title: '资源地址',
                width: 'md',
                dataIndex: 'componentAddress',
              },
              {
                title: '资源编码',
                width: 'md',
                dataIndex: 'componentWidth',
              },
            ],
          },
          { ...flows },
        ],
      },
    ],
  },
  // {
  //   title: groupTitle(`流程信息`),
  //   valueType: 'group',
  //   width: 'md',
  //   colProps: { md: 24 },
  //   columns: ,
  // },
  {
    title: groupTitle(`应用组件`),
    valueType: 'group',
    width: 'md',
    colProps: { md: 24 },
    columns: [
      {
        // title: groupTitle(`应用组件`),
        valueType: 'formList',
        dataIndex: 'componentList',
        width: '100%',
        colProps: { md: 24 },
        fieldProps: {
          // 新增按钮样式配置
          creatorButtonProps: {
            type: 'text',
            position: 'top',
            creatorButtonText: '',
            block: false,
            className: cls.addFormListBtn,
          },
        },
        columns: [
          {
            valueType: 'group',
            width: 'md',
            colProps: { md: 24 },
            columns: [
              {
                title: '组件名称',
                dataIndex: 'componentName',
                // valueType: 'select',
                // colSpan: 3,
                width: 'md',
                fieldProps: {
                  colSpan: 11,
                },
                // valueEnum,
              },
              {
                title: '链接地址',
                width: 'md',
                dataIndex: 'componentAddress',
              },
              {
                title: '组件宽度',
                width: 'md',
                dataIndex: 'componentWidth',
              },
              {
                title: '组件高度',
                width: 'md',
                dataIndex: 'componentHeight',
              },
            ],
          },
        ],
      },
    ],
  },
];

export { columns, valueEnum };
export type { DataItem };
