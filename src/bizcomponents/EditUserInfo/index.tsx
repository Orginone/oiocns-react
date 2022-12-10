import React, { useRef, useState } from 'react';
import { message, Upload, UploadProps, Image, Space, Button, Avatar } from 'antd';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import { ITarget } from '@/ts/core';
import SchemaForm from '@/components/SchemaForm';
import { UserOutlined } from '@ant-design/icons';
import docsCtrl from '@/ts/controller/store/docsCtrl';
import { FileItemShare, TargetModel } from '@/ts/base/model';

interface Iprops {
  title: string;
  open: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  current: ITarget;
}
/*
  编辑
*/
const EditCustomModal = (props: Iprops) => {
  const { open, title, handleOk, current, handleCancel } = props;
  const editData = current.target;
  const formRef = useRef<ProFormInstance>();
  const [avatar, setAvatar] = useState<FileItemShare>();
  const uploadProps: UploadProps = {
    multiple: false,
    showUploadList: false,
    maxCount: 1,
    listType: 'text',
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image');
      if (!isImage) {
        message.error(`${file.name} 不是一个图片文件`);
      }
      return isImage;
    },
    async customRequest(options) {
      const file = options.file as File;
      const docDir = await docsCtrl.home?.create('头像');
      if (docDir && file) {
        const result = await docsCtrl.upload(docDir.key, file.name, file);
        if (result) {
          setAvatar(result.shareInfo());
        }
      }
    },
  };
  const columns: ProFormColumnsType<TargetModel>[] = [
    {
      title: '头像',
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
                  <UserOutlined style={{ fontSize: 16 }} />
                )
              }
            />
            <Upload {...uploadProps}>
              <Button type="link">上传头像</Button>
            </Upload>
          </Space>
        );
      },
      formItemProps: {},
    },
    {
      title: '昵称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
      },
    },
    {
      title: '账号',
      dataIndex: 'code',
      fieldProps: {
        disabled: true,
      },
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
    {
      title: '姓名',
      dataIndex: 'teamName',
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
    {
      title: '手机号',
      dataIndex: 'teamCode',
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
      },
    },
    {
      title: '座右铭',
      dataIndex: 'teamRemark',
      valueType: 'textarea',
      colProps: { span: 24 },
    },
  ];
  return (
    <SchemaForm<TargetModel>
      formRef={formRef}
      title={title}
      open={open}
      width={520}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (editData) {
            if (editData.avatar) {
              setAvatar(JSON.parse(editData.avatar));
            }
            formRef.current?.setFieldsValue({
              ...editData,
              teamName: editData?.team?.name,
              teamCode: editData?.team?.code,
              teamRemark: editData?.team?.remark,
            });
          }
        } else {
          formRef.current?.resetFields();
          setAvatar(undefined);
          handleCancel();
        }
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onFinish={async (values) => {
        if (!editData) return;
        values.avatar = JSON.stringify(avatar);
        console.log(values);
        const res = await current.update({ ...values });
        if (res) {
          message.success('修改成功');
          handleOk();
        } else {
          message.error('修改失败');
          return false;
        }
      }}
      columns={columns}
    />
  );
};

export default EditCustomModal;
