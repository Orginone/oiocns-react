import SchemaForm from '@/components/SchemaForm';
import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import { Input } from 'antd';
import React, { createRef, useEffect } from 'react';
import {
  CodeColumn,
  NameColumn,
  PostScriptColumn,
  PreScriptColumn,
  RemarkColumn,
} from './common';

interface IProps {
  transfer: ITransfer;
  current: model.Mapping;
  finished: () => void;
}

const MappingForm: React.FC<IProps> = ({ transfer, current, finished }) => {
  const form = createRef<ProFormInstance>();
  useEffect(() => {
    const id = transfer.command.subscribe((type, cmd, args) => {
      if (type == 'data' && cmd == 'fileCollect') {
        const { prop, files } = args;
        if (files && files.length > 0) {
          const item = files[0].metadata;
          transfer.loadForms([item.id]).then(() => {
            form.current?.setFieldValue(prop, item.id);
          });
        }
      }
    });
    return () => {
      transfer.command.unsubscribe(id);
    };
  });
  const selector = (
    title: string,
    dataIndex: string,
  ): ProFormColumnsType<model.Mapping> => {
    return {
      title: title,
      dataIndex: dataIndex,
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: title + '为必填项' }],
      },
      renderFormItem: (_, __, form) => {
        const item = transfer.forms[form.getFieldValue(dataIndex)];
        return (
          <Input
            value={item?.name}
            onClick={() => {
              transfer.command.emitter('data', 'file', {
                prop: dataIndex,
                accepts: ['实体配置', '事项配置'],
              });
            }}
          />
        );
      },
    };
  };
  const columns: ProFormColumnsType<model.Mapping>[] = [
    NameColumn,
    CodeColumn,
    {
      title: '映射类型',
      dataIndex: 'mappingType',
      valueType: 'select',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
      },
      fieldProps: {
        defaultValue: 'OToI',
        options: [
          { label: '外部系统 => 内部系统', value: 'OToI' },
          { label: '内部系统 => 内部系统', value: 'IToI' },
          { label: '内部系统 => 外部系统', value: 'IToO' },
          { label: '外部系统 => 外部系统', value: 'OToO' },
        ],
      },
    },
    selector('源表单', 'source'),
    selector('目标表单', 'target'),
    {
      title: '原 id 字段名称',
      dataIndex: 'idName',
      formItemProps: {
        rules: [{ required: true, message: '原 Id 字段名称为必填项' }],
      },
    },
    PreScriptColumn,
    PostScriptColumn,
    RemarkColumn,
  ];
  return (
    <SchemaForm<model.Mapping>
      formRef={form}
      open
      title="映射定义"
      width={640}
      columns={columns}
      initialValues={current}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onOpenChange={(open: boolean) => {
        if (!open) {
          finished();
        }
      }}
      onFinish={async (values) => {
        Object.assign(current, values);
        finished();
      }}
    />
  );
};

export { MappingForm };
