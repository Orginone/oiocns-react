import { ProColumns } from '@ant-design/pro-components';
import React from 'react';
import { Tag, Typography } from 'antd';
import { model, schema } from '@/ts/base';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { IWork, IWorkTask } from '@/ts/core';

/** 人员信息列 */
export const PersonColumns: ProColumns<schema.XTarget>[] = [
  { title: '序号', valueType: 'index', width: 50 },
  {
    title: '名称',
    dataIndex: 'name',
    render: (_: any, record: schema.XTarget) => {
      return <EntityIcon entityId={record.id} showName />;
    },
  },
  { title: '账号', dataIndex: 'code' },
  { title: '手机号', dataIndex: ['team', 'code'] },
  {
    title: '座右铭',
    dataIndex: 'remark',
    render: (_: any, record: schema.XTarget) => {
      return (
        <Typography.Paragraph ellipsis={{ rows: 1, expandable: true, symbol: '更多' }}>
          {record.remark}
        </Typography.Paragraph>
      );
    },
  },
];

/** 身份信息列 */
export const IdentityColumn: ProColumns<schema.XIdentity>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '角色编号',
    dataIndex: 'code',
  },
  {
    title: '角色名称',
    dataIndex: 'name',
  },
  {
    title: '权限',
    dataIndex: 'name',
  },
  {
    title: '组织',
    dataIndex: 'shareId',
    render: (_: any, record: schema.XIdentity) => {
      return <EntityIcon entityId={record.shareId} showName />;
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

/** 分类子项信息列 */
export const SpeciesItemColumn: ProColumns<schema.XSpeciesItem>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '编号',
    dataIndex: 'code',
    key: 'code',
    width: 200,
  },
  {
    title: '信息',
    dataIndex: 'info',
    key: 'info',
    width: 200,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 150,
  },
  {
    title: '归属组织',
    dataIndex: 'belongId',
    editable: false,
    key: 'belongId',
    width: 200,
    render: (_: any, record: schema.XSpeciesItem) => {
      return <EntityIcon entityId={record.belongId} showName />;
    },
  },
  {
    title: '创建人',
    dataIndex: 'createUser',
    editable: false,
    key: 'createUser',
    width: 150,
    render: (_: any, record: schema.XSpeciesItem) => {
      return <EntityIcon entityId={record.createUser} showName />;
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 200,
    editable: false,
  },
];

/** 事项信息列 */
export const WorkColumn: ProColumns<IWork>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '办事名称',
    dataIndex: ['metadata', 'name'],
    key: 'name',
    width: 200,
  },
  {
    title: '办事标识',
    dataIndex: ['metadata', 'code'],
    key: 'code',
    width: 200,
  },
  {
    title: '允许新增',
    dataIndex: ['metadata', 'allowAdd'],
    key: 'allowAdd',
    width: 200,
    render: (_: any, record: IWork) => {
      return record.metadata.allowAdd ? '是' : '否';
    },
  },
  {
    title: '允许变更',
    dataIndex: ['metadata', 'allowEdit'],
    key: 'allowEdit',
    width: 200,
    render: (_: any, record: IWork) => {
      return record.metadata.allowEdit ? '是' : '否';
    },
  },
  {
    title: '允许选择',
    dataIndex: ['metadata', 'allowSelect'],
    key: 'allowSelect',
    width: 200,
    render: (_: any, record: IWork) => {
      return record.metadata.allowSelect ? '是' : '否';
    },
  },
  {
    title: '备注',
    dataIndex: ['metadata', 'remark'],
    key: 'remark',
    width: 150,
  },
  {
    key: 'belongId',
    width: 100,
    title: '归属用户',
    dataIndex: ['metadata', 'belongId'],
    render: (_: any, record: IWork) => {
      return <EntityIcon entityId={record.metadata.belongId} showName />;
    },
  },
  {
    key: 'shareId',
    width: 100,
    title: '共享用户',
    dataIndex: ['metadata', 'shareId'],
    render: (_: any, record: IWork) => {
      return <EntityIcon entityId={record.metadata.shareId} showName />;
    },
  },
  {
    title: '创建人',
    dataIndex: ['metadata', 'createUser'],
    editable: false,
    key: 'createUser',
    width: 150,
    render: (_: any, record: IWork) => {
      return <EntityIcon entityId={record.metadata.createUser} showName />;
    },
  },
  {
    title: '创建时间',
    dataIndex: ['metadata', 'createTime'],
    key: 'createTime',
    width: 200,
    editable: false,
  },
];

/** 特性信息列 */
export const AttributeColumn: ProColumns<schema.XAttribute>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '特性编号',
    dataIndex: 'code',
    key: 'code',
    width: 200,
  },
  {
    title: '特性名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '值类型',
    dataIndex: ['property', 'valueType'],
    key: 'valueType',
    width: 150,
  },
  {
    title: '选择字典',
    dataIndex: ['species', 'name'],
    key: 'dictId',
    width: 150,
  },
  {
    title: '特性定义',
    dataIndex: 'remark',
    ellipsis: true,
    key: 'remark',
  },
];

/** 办事列 */
export const WorkColumns: ProColumns<IWorkTask>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
  },
  {
    title: '类型',
    dataIndex: ['metadata', 'taskType'],
    width: 80,
  },
  {
    title: '标题',
    width: 150,
    dataIndex: ['metadata', 'title'],
  },
  {
    key: 'shareId',
    width: 150,
    title: '共享组织',
    dataIndex: ['metadata', 'shareId'],
    render: (_: any, record: IWorkTask) => {
      return <EntityIcon entityId={record.metadata.shareId} showName />;
    },
  },
  {
    key: 'createUser',
    width: 100,
    title: '申请人',
    dataIndex: ['metadata', 'createUser'],
    render: (_: any, record: IWorkTask) => {
      return <EntityIcon entityId={record.metadata.createUser} showName />;
    },
  },
  {
    title: '发起组织',
    width: 100,
    dataIndex: ['metadata', 'applyId'],
    render: (_: any, record: IWorkTask) => {
      return <EntityIcon entityId={record.metadata.applyId} showName />;
    },
  },
  {
    title: '状态',
    width: 80,
    dataIndex: ['metadata', 'status'],
    render: (_: any, record: IWorkTask) => {
      const status = statusMap.get(record.metadata.status as number);
      return <Tag color={status!.color}>{status!.text}</Tag>;
    },
  },
  {
    title: '内容',
    width: 400,
    dataIndex: ['metadata', 'content'],
    render: (_: any, record: IWorkTask) => {
      if (record.metadata.taskType === '加用户') {
        if (record.targets.length === 2) {
          return `${record.targets[0].name}[${record.targets[0].typeName}]申请加入${record.targets[1].name}[${record.targets[1].typeName}]`;
        }
      }
      return record.metadata.content;
    },
  },
  {
    title: '申请时间',
    valueType: 'dateTime',
    width: 200,
    dataIndex: ['metadata', 'createTime'],
  },
];

/** 物的默认列信息 */
export const AnyThingColumns: model.FieldModel[] = [
  {
    id: 'Id',
    code: 'Id',
    name: '唯一标识',
    valueType: '描述型',
    rule: '{}',
    lookups: [],
    remark: '由系统生成的唯一标记,无实义.',
  },
  {
    id: 'Creater',
    code: 'Creater',
    name: '创建人',
    valueType: '用户型',
    rule: '{}',
    lookups: [],
    remark: '创建标识的人',
  },
  {
    id: 'Status',
    code: 'Status',
    name: '状态',
    valueType: '选择型',
    rule: '{}',
    remark: '数据状态',
    lookups: [
      {
        id: 'normal',
        text: '正常',
        value: '正常',
      },
      {
        id: 'dead',
        text: '已销毁',
        value: '已销毁',
      },
    ],
  },
  {
    id: 'CreateTime',
    code: 'CreateTime',
    name: '创建时间',
    valueType: '时间型',
    rule: '{}',
    lookups: [],
    remark: '创建标识的时间',
  },
  {
    id: 'ModifiedTime',
    code: 'ModifiedTime',
    name: '修改时间',
    valueType: '时间型',
    rule: '{}',
    lookups: [],
    remark: '最新修改时间',
  },
];
