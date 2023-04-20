import React, { useRef, useState } from 'react';
import { message, Upload, UploadProps, Image, Button, Space, Avatar } from 'antd';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import orgCtrl from '@/ts/controller';
import { FileItemShare, MarketModel } from '@/ts/base/model';
import { BankOutlined } from '@ant-design/icons';
import { IMarket } from '@/ts/core';
import { parseAvatar } from '@/ts/base';

interface Iprops {
  open: boolean;
  title: string;
  current?: IMarket;
  handleCancel?: () => void;
  handleOk: (data: MarketModel) => void;
}
/*
  编辑
*/
const CreateMarketModal = (props: Iprops) => {
  const { open, title, handleOk, handleCancel } = props;
  const formRef = useRef<ProFormInstance>();
  const [avatar, setAvatar] = useState<FileItemShare>();
  const uploadProps: UploadProps = {
    multiple: false,
    showUploadList: false,
    maxCount: 1,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image');
      if (!isImage) {
        message.error(`${file.name} 不是一个图片文件`);
      }
      return isImage;
    },
    async customRequest(options) {
      const file = options.file as File;
      const docDir = await orgCtrl.user.home?.create('图片');
      if (docDir && file) {
        const result = await docDir.upload(file.name, file);
        if (result) {
          setAvatar(result.shareInfo());
        }
      }
    },
  };
  const columns: ProFormColumnsType<MarketModel>[] = [
    {
      title: '图片',
      dataIndex: 'avatar',
      colProps: { span: 24 },
      renderFormItem: () => {
        return (
          <Space>
            <Avatar
              size={64}
              style={{ background: '#f9f9f9', color: '#606060', fontSize: 10 }}
              src={
                avatar ? (
                  <Image src={avatar.thumbnail} preview={{ src: avatar.shareLink }} />
                ) : (
                  <BankOutlined style={{ fontSize: 16 }} />
                )
              }
            />
            <Upload {...uploadProps}>
              <Button type="link">上传图片</Button>
            </Upload>
            {avatar ? (
              <Button type="link" onClick={() => setAvatar(undefined)}>
                清除图片
              </Button>
            ) : (
              ''
            )}
          </Space>
        );
      },
    },
    {
      title: '商店名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '商店名称为必填项' }],
      },
    },
    {
      title: '商店代码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '商店代码为必填项' }],
      },
    },
    {
      title: '是否开放加入',
      dataIndex: 'joinPublic',
      valueType: 'select',
      fieldProps: {
        options: [
          {
            value: true,
            label: '公开',
          },
          {
            value: false,
            label: '不公开',
          },
        ],
      },
      formItemProps: {
        rules: [{ required: true, message: '是否开放加入为必填项' }],
      },
    },
    {
      title: '售卖权限',
      dataIndex: 'sellPublic',
      valueType: 'select',
      fieldProps: {
        options: [
          {
            value: true,
            label: '所有人',
          },
          {
            value: false,
            label: '成员',
          },
        ],
      },
      formItemProps: {
        rules: [{ required: true, message: '售卖权限为必填项' }],
      },
    },
    {
      title: '购买权限',
      dataIndex: 'buyPublic',
      valueType: 'select',
      fieldProps: {
        options: [
          {
            value: true,
            label: '所有人',
          },
          {
            value: false,
            label: '成员',
          },
        ],
      },
      formItemProps: {
        rules: [{ required: true, message: '购买权限为必填项' }],
      },
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
    },
    {
      title: '商店简介',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
    },
  ];
  return (
    <SchemaForm<MarketModel>
      formRef={formRef}
      title={title}
      open={open}
      width={640}
      onOpenChange={(open: boolean) => {
        if (!open) {
          formRef.current?.resetFields();
          setAvatar(undefined);
          if (handleCancel) {
            handleCancel();
          }
        } else {
          if (props.current && props.title === '编辑商店') {
            setAvatar(parseAvatar(props.current.target.photo));
            formRef.current?.setFieldsValue({
              ...props.current.target,
            });
          }
        }
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onFinish={async (values) => {
        values.photo = JSON.stringify(avatar);
        handleOk(values);
      }}
      columns={columns}></SchemaForm>
  );
};

export default CreateMarketModal;
