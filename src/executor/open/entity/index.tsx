import React from 'react';
import { ProFormColumnsType } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { TargetModel } from '@/ts/base/model';
import UploadItem from '../../tools/uploadItem';
import { schema } from '@/ts/base';
import { formatZhDate } from '@/utils/tools';
import orgCtrl from '@/ts/controller';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

interface Iprops {
  entity: schema.XEntity;
  finished: () => void;
}
/*
  编辑
*/
const EntityPreview: React.FC<Iprops> = ({ entity, finished }) => {
  const columns: ProFormColumnsType<TargetModel>[] = [
    {
      title: '图标',
      dataIndex: 'icon',
      colProps: { span: 24 },
      renderFormItem: (_, __, form) => {
        return (
          <UploadItem
            readonly
            typeName={entity.typeName}
            icon={entity.icon}
            onChanged={(icon) => {
              form.setFieldValue('icon', icon);
            }}
            directory={orgCtrl.user.directory}
          />
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      readonly: true,
    },
    {
      title: '类型',
      dataIndex: 'typeName',
      valueType: 'select',
      initialValue: entity.typeName,
      readonly: true,
    },
    {
      title: '代码',
      dataIndex: 'code',
      readonly: true,
    },
    {
      title: '简称',
      dataIndex: 'teamName',
      readonly: true,
    },
    {
      title: '标识',
      dataIndex: 'teamCode',
      readonly: true,
    },
  ];
  if (entity.belongId !== entity.id) {
    columns.push({
      title: '归属',
      dataIndex: 'belongId',
      readonly: true,
      render: () => <EntityIcon entityId={entity.belongId} showName />,
    });
  }
  if (entity.createUser !== entity.id) {
    columns.push({
      title: '创建人',
      dataIndex: 'createUser',
      readonly: true,
      render: () => <EntityIcon entityId={entity.createUser} showName />,
    });
  }
  columns.push({
    title: '创建时间',
    dataIndex: 'createTime',
    readonly: true,
    render: () => formatZhDate(entity.createTime),
  });
  if (entity.updateUser != entity.createUser) {
    columns.push({
      title: '更新人',
      dataIndex: 'updateUser',
      readonly: true,
      render: () => <EntityIcon entityId={entity.updateUser} showName />,
    });
  }
  if (entity.createTime != entity.updateTime) {
    columns.push({
      title: '更新时间',
      dataIndex: 'updateTime',
      readonly: true,
      render: () => formatZhDate(entity.updateTime),
    });
  }
  columns.push({
    title: '简介',
    dataIndex: 'remark',
    valueType: 'textarea',
    colProps: { span: 24 },
    readonly: true,
  });
  return (
    <SchemaForm<TargetModel>
      open
      title={entity.name}
      width={640}
      columns={columns}
      initialValues={entity}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onOpenChange={(open: boolean) => {
        if (!open) {
          finished();
        }
      }}
      onFinish={() => {
        finished();
      }}></SchemaForm>
  );
};

export default EntityPreview;
