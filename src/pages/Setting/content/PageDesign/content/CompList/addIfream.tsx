import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import React from 'react';
import pageCtrl from '../../pageCtrl';

const CreatIfreamComp: React.FC<{ title: string }> = ({ title }) => {
  const columns = [
    {
      title: '组件名称',
      dataIndex: 'title',
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],

      valueType: 'text',
      colProps: { span: 12 },
    },
    {
      title: '组件地址',
      dataIndex: 'link',
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
        {
          pattern:
            // /^((ht|f)tps?):\/\/([\w-]+(\.[\w-]+)*\/?)+(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?$/,
            // eslint-disable-next-line no-useless-escape
            /(http|https):\/\/\S*/,
          message: '请输入正确地址',
        },
      ],
      valueType: 'text',
      colProps: {
        xs: 24,
        md: 12,
      },
    },
    {
      title: '宽度',
      dataIndex: 'width',
      colProps: {
        xs: 24,
        md: 12,
      },
      valueType: 'select',
    },
    {
      title: '高度',
      dataIndex: 'height',
      colProps: {
        xs: 24,
        md: 12,
      },
      valueType: 'digit',
    },
  ];
  return (
    <>
      <ModalForm
        title="自定义组件"
        trigger={
          <Button
            type="link"
            onClick={(e) => {
              e.stopPropagation();
            }}>
            {title ?? '新增'}
          </Button>
        }
        colProps={{ span: 12 }}
        grid
        rowProps={{
          gutter: [16, 16],
        }}
        onFinish={async (values) => {
          const { title, link, width, height } = values;

          const h = parseInt(height) / 10 > 10 ? parseInt(height) / 10 : 10;
          const params = { name: title, link, w: width - 0, h };
          pageCtrl.creatIfream(params);
          return true;
        }}
        submitter={{
          searchConfig: {
            submitText: '确认',
            resetText: '取消',
          },
        }}>
        {columns.map((item) => {
          const { title, rules, colProps, valueType, dataIndex } = item;
          switch (valueType) {
            case 'text':
              return (
                <ProFormText
                  name={dataIndex}
                  label={title}
                  key={dataIndex}
                  rules={rules}
                  colProps={colProps}
                  placeholder="请设置"
                />
              );
            case 'digit':
              return (
                <ProFormDigit
                  name={dataIndex}
                  label={title}
                  key={dataIndex}
                  rules={rules}
                  colProps={colProps}
                  placeholder="请设置"
                />
              );
            case 'select':
              return (
                <ProFormSelect
                  name={dataIndex}
                  label={title}
                  key={dataIndex}
                  rules={rules}
                  colProps={colProps}
                  valueEnum={{
                    6: '25%',
                    8: '33%',
                    12: '50%',
                    16: '66%',
                    20: '83%',
                    24: '100%',
                  }}
                  placeholder="请设置"
                />
              );
            default:
              break;
          }
        })}
      </ModalForm>
    </>
  );
};

export default CreatIfreamComp;
