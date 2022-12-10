import React, { useRef, useState } from 'react';
import { message, Upload, UploadProps, Image, Button, Space, Avatar } from 'antd';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import docsCtrl from '@/ts/controller/store/docsCtrl';
import { FileItemShare, TargetModel } from '@/ts/base/model';
import { ITarget } from '@/ts/core';
import { BankOutlined } from '@ant-design/icons';

interface Iprops {
  title: string;
  open: boolean;
  handleCancel: () => void;
  handleOk: (newItem: ITarget | undefined) => void;
  current: ITarget;
  typeNames: string[];
}
/*
  编辑
*/
const EditCustomModal = (props: Iprops) => {
  const { open, title, handleOk, current, handleCancel } = props;
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
              <Button type="link">上传图标</Button>
            </Upload>
            {avatar ? (
              <Button type="link" onClick={() => setAvatar(undefined)}>
                清除图标
              </Button>
            ) : (
              ''
            )}
          </Space>
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'teamName',
      formItemProps: {
        rules: [{ required: true, message: '单位名称为必填项' }],
      },
    },
    {
      title: '团队类型',
      dataIndex: 'typeName',
      valueType: 'select',
      fieldProps: {
        options: props.typeNames.map((i) => {
          return {
            value: i,
            label: i,
          };
        }),
      },
      formItemProps: {
        rules: [{ required: true, message: '类型为必填项' }],
      },
    },
    {
      title: '团队代码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '团队代码为必填项' }],
      },
    },
    {
      title: '团队简称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '团队简称为必填项' }],
      },
    },
    {
      title: '团队标识',
      dataIndex: 'teamCode',
      formItemProps: {
        rules: [{ required: true, message: '团队标识为必填项' }],
      },
    },
    {
      title: '团队信息备注',
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
      width={640}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (title === '编辑') {
            setAvatar(undefined);
            if (current.target.avatar) {
              setAvatar(JSON.parse(current.target.avatar));
            }
            formRef.current?.setFieldsValue({
              ...current.target,
              teamName: current.target.team?.name,
              teamCode: current.target.team?.code,
              teamRemark: current.target.team?.remark,
            });
          }
        } else {
          formRef.current?.resetFields();
          formRef.current?.setFieldValue('typeName', props.typeNames[0]);
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
        if (title === '编辑') {
          handleOk(await current.update(values));
        } else {
          handleOk(await current.create(values));
        }
      }}
      columns={columns}></SchemaForm>
  );
};

export default EditCustomModal;
