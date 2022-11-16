import { Button, Form, Input } from 'antd';
import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { useState } from 'react';
import CohortService from '@/module/cohort/Cohort';
import type { ProFormColumnsType } from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';
/* eslint-enable no-template-curly-in-string */
interface CohortServiceType {
  service: CohortService;
  open: boolean;
}

const UpdateCohort: React.FC<CohortServiceType> = ({ service, open }) => {
  console.log(service);
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
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

  type DataItem = {
    name: string;
    state: string;
  };

  const columns: ProFormColumnsType<DataItem>[] = [
    {
      title: '标题',
      dataIndex: 'title',
      initialValue: '必填',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      width: 'm',
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum,
      width: 'm',
      tooltip: '当title为disabled时状态无法选择',
      dependencies: ['title'],
      fieldProps: (form) => {
        if (form.getFieldValue('title') === 'disabled') {
          return {
            disabled: true,
            placeholder: 'disabled',
          };
        } else {
          return {
            placeholder: 'normal',
          };
        }
      },
    },
    {
      title: '标签',
      dataIndex: 'labels',
      width: 'm',
      tooltip: '当title为必填时此项将为必填',
      dependencies: ['title'],
      formItemProps(form) {
        if (form.getFieldValue('title') === '必填') {
          return {
            rules: [
              {
                required: true,
              },
            ],
          };
        } else {
          return {};
        }
      },
    },
    {
      valueType: 'dependency',
      name: ['title'],
      columns: ({ title }) => {
        return title !== 'hidden'
          ? [
              {
                title: 'title为hidden时隐藏',
                dataIndex: 'hidden',
                valueType: 'date',
                renderFormItem: () => {
                  return <Input />;
                },
              },
            ]
          : [];
      },
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'createName',
      valueType: 'date',
    },
    {
      valueType: 'divider',
    },
  ];
  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: '群组名称不能为空',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  // setIsModalOpen(open)
  console.log(open);
  const showModal = () => {
    console.log('qqq');
    setIsModalOpen(open);
  };
  useEffect(() => {
    showModal;
  }, []);
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const [form] = Form.useForm();
  const onSave = async () => {
    const values = await form.validateFields();
    console.log(values); //2.表单验证并获取表单值
    const params = {
      code: values.cohort.code,
      name: values.cohort.name,
      teamRemark: values.cohort.remark,
    };
    service.creatItem(params);
    console.log('创建成功');
    setIsModalOpen(false);
  };
  return (
    <div>
      <Modal title="修改群组" open={isModalOpen} onOk={onSave} onCancel={handleOk}>
        <>
          <BetaSchemaForm<DataItem>
            shouldUpdate={false}
            layoutType="Form"
            onFinish={async (values) => {
              console.log(values);
            }}
            columns={columns}
          />
        </>
      </Modal>
    </div>
  );
};
export default UpdateCohort;
