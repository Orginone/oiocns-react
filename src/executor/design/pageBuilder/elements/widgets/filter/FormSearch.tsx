import { DeleteOutlined } from '@ant-design/icons';
import { Button, Row, Space, Tag } from 'antd';
import React, { ReactNode, useState } from 'react';
import { ExistTypeMeta } from '../../../core/ElementMeta';
import { File, SEntity } from '../../../design/config/FileProp';
import { Context } from '../../../render/PageContext';
import { defineElement } from '../../defineElement';

interface IProps {
  ctx: Context;
  forms: SEntity[];
}

const Layout: React.FC<{ children: ReactNode }> = (props) => {
  return <div style={{ padding: 10 }}>{props.children}</div>;
};

const Design: React.FC<IProps> = (props) => {
  const [forms, setForms] = useState(props.forms);
  return (
    <Layout>
      <Space direction="vertical">
        <Space align="start">
          <DeleteOutlined
            onClick={() => {
              props.forms.splice(0, props.forms.length);
              setForms([...props.forms]);
            }}
          />
          <Tag color="blue">表单过滤</Tag>
          <Row gutter={[8, 8]}>
            {forms.map((item, index) => {
              return (
                <Space key={index} align="start">
                  <DeleteOutlined
                    onClick={() => {
                      props.forms.splice(index, 1);
                      setForms([...props.forms]);
                    }}
                  />
                  <Tag>{item.name}</Tag>
                </Space>
              );
            })}
          </Row>
        </Space>
        <Space>
          <File
            accepts={['表单']}
            excludeIds={props.forms.map((item) => item.id)}
            multiple={true}
            onOk={(files) => {
              files.forEach((file) => {
                props.forms.push({
                  id: file.id,
                  name: file.name,
                });
              });
              setForms([...props.forms]);
            }}>
            <Button type="dashed" size="small">
              添加表单
            </Button>
          </File>
        </Space>
      </Space>
    </Layout>
  );
};

export default defineElement({
  render(props, ctx) {
    if (ctx.view.mode == 'design') {
      return <Design {...props} ctx={ctx} />;
    }
  },
  displayName: 'FormSearch',
  meta: {
    type: 'Element',
    label: '表单搜索',
    props: {
      forms: {
        type: 'array',
        label: '过滤',
        elementType: {
          type: 'type',
          label: '表单',
        } as ExistTypeMeta<SEntity>,
        default: [],
      },
    },
  },
});
