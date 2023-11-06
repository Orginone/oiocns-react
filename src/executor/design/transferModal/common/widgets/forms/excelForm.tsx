import SchemaForm from '@/components/SchemaForm';
import { model, schema } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { AnyHandler, Excel, generateXlsx } from '@/utils/excel';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import { Button, Input, Space } from 'antd';
import React, { useEffect, useRef } from 'react';
import {
  CodeColumn,
  NameColumn,
  PostScriptColumn,
  PreScriptColumn,
  RemarkColumn,
} from './common';

interface IProps {
  transfer: ITransfer;
  current: model.Tables;
  finished: () => void;
}

const ExcelForm: React.FC<IProps> = ({ transfer, current, finished }) => {
  const form = useRef<ProFormInstance>();
  useEffect(() => {
    const id = transfer.command.subscribe((type, cmd, args) => {
      if (type == 'data' && cmd == 'fileCollect') {
        const { prop, files } = args;
        if (files && files.length > 0) {
          const formIds: string[] = files.map((file: any) => file.metadata.id);
          transfer.loadForms(formIds).then(() => {
            form.current?.setFieldValue(prop, formIds);
          });
        }
      }
    });
    return () => {
      transfer.command.unsubscribe(id);
    };
  });
  const columns: ProFormColumnsType<model.Tables>[] = [
    NameColumn,
    CodeColumn,
    {
      title: '表单',
      dataIndex: 'formIds',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
      },
      renderFormItem: (_, __, form) => {
        const formIds: string[] = form.getFieldValue('formIds') ?? [];
        return (
          <Space.Compact style={{ width: '100%' }}>
            <Input
              value={formIds?.map((item: any) => transfer.forms[item].name)}
              onClick={() => {
                transfer.command.emitter('data', 'file', {
                  prop: 'formIds',
                  multiple: true,
                  accepts: ['表单'],
                });
              }}
            />
            <Button
              size="small"
              onClick={async () => {
                let forms = formIds.map((item) => transfer.forms[item]);
                generateXlsx(
                  new Excel(
                    transfer.template<schema.XThing>(forms).map((sheet) => {
                      return new AnyHandler({ ...sheet, dir: transfer.directory });
                    }),
                  ),
                  '表单模板',
                );
              }}>
              下载模板
            </Button>
          </Space.Compact>
        );
      },
    },
    PreScriptColumn,
    PostScriptColumn,
    RemarkColumn,
  ];
  return (
    <SchemaForm<model.Tables>
      formRef={form}
      open
      title="表格定义"
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

export { ExcelForm };
