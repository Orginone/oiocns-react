import React, { useRef, useState } from 'react';
import { message, Upload, UploadProps, Image, Button, Space } from 'antd';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import docsCtrl from '@/ts/controller/store/docsCtrl';
import { FileItemShare, TargetModel } from '@/ts/base/model';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { parseAvatar } from '@/ts/base';

interface Iprops {
  open: boolean;
  handleCancel: () => void;
  handleOk: Function;
}
/*
  编辑用户信息
*/
const UserInfoEditModal = (props: Iprops) => {
  const { open, handleOk, handleCancel } = props;
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
            {avatar ? (
              <Image src={avatar.thumbnail} preview={{ src: avatar.shareLink }} />
            ) : (
              ''
            )}
            <Upload {...uploadProps}>
              <Button type="link">上传头像</Button>
            </Upload>
            {avatar ? (
              <Button type="link" onClick={() => setAvatar(undefined)}>
                清除头像
              </Button>
            ) : (
              ''
            )}
          </Space>
        );
      },
    },
    {
      title: '姓名',
      dataIndex: 'teamName',
      formItemProps: {
        rules: [{ required: true, message: '姓名为必填项' }],
      },
    },
    {
      title: '账号',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '账号为必填项' }],
      },
    },
    {
      title: '呢称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '呢称为必填项' }],
      },
    },
    {
      title: '手机号',
      dataIndex: 'teamCode',
      formItemProps: {
        rules: [{ required: true, message: '手机号为必填项' }],
      },
    },
    {
      title: '左右铭',
      dataIndex: 'teamRemark',
      valueType: 'textarea',
      colProps: { span: 24 },
    },
  ];
  return (
    <SchemaForm<TargetModel>
      formRef={formRef}
      title="更新个人信息"
      open={open}
      width={640}
      onOpenChange={(open: boolean) => {
        if (open) {
          setAvatar(parseAvatar(userCtrl.user.target.avatar));
          formRef.current?.setFieldsValue({
            ...userCtrl.user.target,
            teamName: userCtrl.user.target.team?.name,
            teamCode: userCtrl.user.target.team?.code,
            teamRemark: userCtrl.user.target.team?.remark,
          });
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
        values.avatar = JSON.stringify(avatar);
        userCtrl.user.update(values);
        handleOk();
      }}
      columns={columns}></SchemaForm>
  );
};

export default UserInfoEditModal;
