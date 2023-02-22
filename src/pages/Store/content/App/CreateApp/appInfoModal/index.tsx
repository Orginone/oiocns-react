import React, { useRef, useState } from 'react';
import { message, Upload, UploadProps, Image, Button, Space, Avatar } from 'antd';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import storeCtrl from '@/ts/controller/store';
import { FileItemShare } from '@/ts/base/model';
import { BankOutlined } from '@ant-design/icons';
import { IMarket } from '@/ts/core';
import { parseAvatar } from '@/ts/base';

type AppModel = {
  // 唯一ID
  id?: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 创建组织/个人
  belongId: string;
  // 图片
  photo: string;
};

interface Iprops {
  open: boolean;
  title: string;
  current?: IMarket;
  handleCancel?: () => void;
  handleOk: (data: AppModel) => void;
}
/*
  编辑应用信息
*/
const AppInfoModal = (props: Iprops) => {
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
      const docDir = await storeCtrl.home?.create('业务图标');
      if (docDir && file) {
        const result = await docDir.upload(file.name, file);
        if (result) {
          setAvatar(result.shareInfo());
        }
      }
    },
  };
  const columns: ProFormColumnsType<AppModel>[] = [
    {
      title: '图标',
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
      title: '应用名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '应用名称为必填项' }],
      },
    },
  ];
  return (
    <SchemaForm<AppModel>
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
            setAvatar(parseAvatar(props.current.market.photo));
            formRef.current?.setFieldsValue({
              ...props.current.market,
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

export default AppInfoModal;
