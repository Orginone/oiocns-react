import SchemaForm from '@/components/SchemaForm';
import { model, schema } from '@/ts/base';
import { IDirectory, ITransfer } from '@/ts/core';
import { AnyHandler, Excel, generateXlsx } from '@/utils/excel';
import { ProFormColumnsType } from '@ant-design/pro-components';
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import { Button, Space, Spin, TreeSelect, Upload, message } from 'antd';
import React, { useState } from 'react';
import { MenuItem, expand, loadFormsMenu } from '../menus';

interface IProps {
  transfer: ITransfer;
  current: model.Tables;
  finished: () => void;
}

const getExpandKeys = (treeData: MenuItem[]) => {
  return expand(treeData, ['事项配置', '实体配置']);
};

interface UploaderProps {
  transfer: ITransfer;
  file?: model.FileItemModel;
  onChange: (file: model.FileItemModel) => void;
}

const Uploader: React.FC<UploaderProps> = ({ transfer, file, onChange }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string | undefined>(file?.name);
  const Children = () => {
    if (value) {
      return <div style={{ color: 'limegreen', fontSize: 22 }}>{value}</div>;
    }
    return <div style={{ color: 'limegreen', fontSize: 22 }}>点击或拖拽至此处上传</div>;
  };
  return (
    <Spin spinning={loading}>
      <Upload
        type={'drag'}
        showUploadList={false}
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        style={{ width: 550, height: 100, marginTop: 20 }}
        customRequest={async (options) => {
          const file = options.file as File;
          setLoading(true);
          const dir = transfer.directory;
          let subDir = dir.children.find((item) => item.name == '表格')?.metadata;
          if (!subDir) {
            subDir = await dir.create({
              name: '表格',
              code: 'tables',
              remark: '存放上传的文件',
              typeName: '目录',
            } as schema.XDirectory);
          }
          if (subDir) {
            const res = await dir.resource.fileUpdate(
              file,
              `${subDir.id}/${file.name}`,
              (_) => {},
            );
            if (res) {
              onChange(res);
              setValue(res.name);
            } else {
              message.error('上传失败');
            }
            setLoading(false);
          }
        }}>
        <Children />
      </Upload>
    </Spin>
  );
};

const ExcelForm: React.FC<IProps> = ({ transfer, current, finished }) => {
  const [treeData, setTreeData] = useState([loadFormsMenu(transfer.directory)]);
  const columns: ProFormColumnsType<model.Tables>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      colProps: { span: 12 },
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
    {
      title: '编码',
      dataIndex: 'code',
      colProps: { span: 12 },
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
      },
    },
    {
      title: '表单',
      dataIndex: 'formIds',
      valueType: 'treeSelect',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
      },
      renderFormItem: (_, __, form) => {
        return (
          <Space.Compact style={{ width: '100%' }}>
            <TreeSelect
              fieldNames={{
                label: 'label',
                value: 'key',
                children: 'children',
              }}
              showSearch={true}
              multiple={true}
              treeNodeFilterProp={'label'}
              value={form.getFieldValue('formIds')}
              treeDefaultExpandedKeys={getExpandKeys(treeData)}
              onChange={(value) => {
                form.setFieldValue('formIds', value);
              }}
              treeData={treeData}
              loadData={async (node) => {
                if (!node.isLeaf) {
                  let forms = (node.item as IDirectory).standard.forms;
                  if (forms.length > 0) {
                    setTreeData([loadFormsMenu(transfer.directory)]);
                  }
                }
              }}
            />
            <Button
              size="small"
              onClick={async () => {
                let sheets = await transfer.template<schema.XThing>(current);
                let root = transfer.directory.target.directory;
                let map = (sheet: any) => new AnyHandler({ ...sheet, dir: root });
                let handlers = sheets.map(map);
                generateXlsx(new Excel(handlers), '表单模板');
              }}>
              下载模板
            </Button>
          </Space.Compact>
        );
      },
    },
    {
      title: '上传文件',
      dataIndex: 'file',
      formItemProps: {
        rules: [{ required: true, message: '表格文件为必填项' }],
      },
      renderFormItem: (_, __, form) => {
        return (
          <Uploader
            transfer={transfer}
            file={form.getFieldValue('file')}
            onChange={(file) => form.setFieldValue('file', file)}
          />
        );
      },
    },
    {
      title: '前置脚本',
      dataIndex: 'preScripts',
      colProps: { span: 24 },
      renderFormItem: (_, __, form) => {
        return (
          <CodeMirror
            value={form.getFieldValue('preScripts')}
            height={'200px'}
            extensions={[javascript()]}
            onChange={(code: string) => {
              form.setFieldValue('preScripts', code);
            }}
          />
        );
      },
    },
    {
      title: '后置脚本',
      dataIndex: 'postScripts',
      colProps: { span: 24 },
      renderFormItem: (_, __, form) => {
        return (
          <CodeMirror
            value={form.getFieldValue('postScripts')}
            height={'200px'}
            extensions={[javascript()]}
            onChange={(code: string) => {
              form.setFieldValue('postScripts', code);
            }}
          />
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
    },
  ];
  return (
    <SchemaForm<model.Tables>
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
        await transfer.updNode({ ...current, ...values });
        finished();
      }}
    />
  );
};

export { ExcelForm };
