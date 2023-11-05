import FullScreenModal from '@/components/Common/fullScreen';
import SchemaForm from '@/components/SchemaForm';
import staticContext from '@/executor/design/pageBuilder';
import ElementFactory from '@/executor/design/pageBuilder/core/ElementFactory';
import ElementTreeManager from '@/executor/design/pageBuilder/core/ElementTreeManager';
import UploadItem from '@/executor/tools/uploadItem';
import { schema } from '@/ts/base';
import { IDirectory } from '@/ts/core';
import { IPageTemplate } from '@/ts/core/thing/standard/page';
import { ProFormColumnsType } from '@ant-design/pro-components';
import { Card, Col, Input, Radio, Row, Image } from 'antd';
import React, { useState } from 'react';

interface IProps {
  formType: string;
  current: IDirectory | IPageTemplate;
  finished: () => void;
}

interface ITemplate {
  value?: string;
  onChange: (value?: string) => void;
}

const Template: React.FC<ITemplate> = ({ value, onChange }) => {
  return (
    <FullScreenModal
      open
      fullScreen
      title={'模板选择'}
      width={1000}
      onCancel={() => onChange(value)}>
      <Radio.Group
        style={{ width: '100%', height: '100%' }}
        value={value}
        onChange={(e) => onChange(e.target.value)}>
        <Row style={{ padding: 10 }} justify={'center'} gutter={[20, 20]}>
          {Object.entries(staticContext.components)
            .map((item) => item[1])
            .filter((item) => item.meta.type == 'Template')
            .map((item, index) => {
              return (
                <Col key={index} onClick={() => onChange(item.displayName)}>
                  <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={
                      <Image
                        height={200}
                        style={{ objectFit: 'cover' }}
                        src={item.meta.photo}
                        onClick={(e) => e.stopPropagation()}
                      />
                    }>
                    <Card.Meta
                      title={<Radio value={item.displayName}>{item.meta.label}</Radio>}
                      description={item.meta.description}
                    />
                  </Card>
                </Col>
              );
            })}
        </Row>
      </Radio.Group>
    </FullScreenModal>
  );
};

const getMeta = (kind: string) => {
  for (const item of Object.entries(staticContext.components)) {
    if (item[0] == kind) {
      return item[1].meta;
    }
  }
  return;
};

const PageTemplateForm: React.FC<IProps> = ({ formType, current, finished }) => {
  const [center, setCenter] = useState(<></>);
  let initialValue: any = { public: false };
  switch (formType) {
    case 'updatePageTemplate':
      initialValue = current.metadata;
      break;
  }
  const columns: ProFormColumnsType<schema.XPageTemplate>[] = [
    {
      title: '图标',
      dataIndex: 'icon',
      colProps: { span: 24 },
      renderFormItem: (_, __, form) => {
        return (
          <UploadItem
            typeName={'模板'}
            icon={initialValue.icon}
            onChanged={(icon) => {
              form.setFieldValue('icon', icon);
            }}
            directory={current.directory}
          />
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
    {
      title: '编码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
      },
    },
    {
      title: '是否发布至首页',
      dataIndex: 'public',
      valueType: 'switch',
      colProps: { span: 12 },
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
      },
    },
    {
      title: '模板',
      dataIndex: 'kind',
      colProps: { span: 12 },
      renderFormItem: (_, __, form) => {
        const kind = form.getFieldValue('kind');
        return (
          <Input
            allowClear
            value={getMeta(kind)?.label}
            onClick={() => {
              setCenter(
                <Template
                  value={kind}
                  onChange={(value) => {
                    form.setFieldValue('kind', value);
                    setCenter(<></>);
                  }}
                />,
              );
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
      formItemProps: {
        rules: [{ required: true, message: '备注为必填项' }],
      },
    },
  ];
  return (
    <div>
      <SchemaForm<schema.XPageTemplate>
        open
        title="页面模板定义"
        width={640}
        columns={columns}
        initialValues={initialValue}
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
          switch (formType) {
            case 'newPageTemplate': {
              values.typeName = '页面模板';
              values.rootElement = ElementTreeManager.createRoot();
              if (values.kind) {
                const meta = getMeta(values.kind);
                if (meta) {
                  values.rootElement.props.layoutType = meta.layoutType;
                  values.rootElement.children.push(
                    new ElementFactory(staticContext.metas).create(
                      values.kind,
                      meta.label,
                    ),
                  );
                }
              }
              await (current as IDirectory).standard.createTemplate(values);
              finished();
              break;
            }
            case 'updatePageTemplate': {
              (current as IPageTemplate).update({ ...initialValue, ...values });
              finished();
              break;
            }
          }
        }}
      />
      {center}
    </div>
  );
};

export default PageTemplateForm;
