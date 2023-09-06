import SchemaForm from '@/components/SchemaForm';
import { generateUuid } from '@/ts/base/common';
import { XRequest } from '@/ts/base/schema';
import { IDirectory } from '@/ts/core';
import { IRequest } from '@/ts/core/thing/config';
import { ConfigColl } from '@/ts/core/thing/directory';
import { ProFormColumnsType } from '@ant-design/pro-components';
import React from 'react';
import { expand, loadScriptsMenu } from '../transferModal';

interface IProps {
  formType: string;
  current: IDirectory | IRequest;
  finished: (request?: IRequest) => void;
}

const getTrees = (current: IDirectory | IRequest) => {
  return [
    loadScriptsMenu(
      current.typeName == '请求'
        ? (current as IRequest).directory.target.directory
        : (current as IDirectory).target.directory,
    ),
  ];
};

const RequestForm: React.FC<IProps> = ({ formType, current, finished }) => {
  const treeData = getTrees(current);
  let initialValue = {};
  switch (formType) {
    case 'updateRequest':
      initialValue = current.metadata;
      break;
  }
  const columns: ProFormColumnsType<XRequest>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
    {
      title: '后置脚本, 解析 CurData(ResponseData)',
      dataIndex: 'suffixExec',
      valueType: 'treeSelect',
      colProps: { span: 24 },
      fieldProps: {
        fieldNames: {
          label: 'label',
          value: 'key',
          children: 'children',
        },
        showSearch: true,
        treeDefaultExpandedKeys: expand(treeData, '脚本'),
        treeNodeFilterProp: 'label',
        treeData: treeData,
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
    <SchemaForm<XRequest>
      open
      title="请求定义"
      width={640}
      columns={columns}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      initialValues={initialValue}
      onOpenChange={(open: boolean) => {
        if (!open) {
          finished();
        }
      }}
      onFinish={async (values) => {
        switch (formType) {
          case 'newRequest': {
            values.typeName = '请求';
            values.curTab = 'Param';
            values.axios = {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json;charset=UTF-8',
              },
            };
            values.headers = Object.entries(values.axios.headers!).map(
              (value: [string, any]) => {
                return {
                  id: generateUuid(),
                  key: value[0],
                  value: value[1],
                };
              },
            );
            let dir = current as IDirectory;
            let request = await dir.createConfig(ConfigColl.Requests, values);
            finished(request as IRequest);
          }
          case 'updateRequest': {
            let request = current as IRequest;
            request.refresh({
              ...initialValue,
              ...values,
            });
            finished(request);
            break;
          }
        }
      }}
    />
  );
};

export default RequestForm;
