import React, { useState } from 'react';
import { ProFormColumnsType } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import orgCtrl from '@/ts/controller';
import { FileItemShare } from '@/ts/base/model';
import { IAuthority } from '@/ts/core';
import { Avatar, Button, Space, Upload, Image, UploadProps, message } from 'antd';
import { AiOutlineBank } from 'react-icons/ai';
import { parseAvatar } from '@/ts/base';

interface Iprops {
  title: string;
  open: boolean;
  handleCancel: () => void;
  handleOk: (result: boolean) => void;
  current: IAuthority;
}
/*
  权限编辑模态框
*/
const AuthorityModal = (props: Iprops) => {
  if (!props.open) return <></>;
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
      const docDir = await orgCtrl.user.filesys?.home?.create('头像');
      if (docDir && file) {
        const result = await docDir.upload(file.name, file);
        if (result) {
          setAvatar(result.shareInfo());
        }
      }
    },
  };
  const columns: ProFormColumnsType<any>[] = [
    {
      title: '图标',
      dataIndex: 'icon',
      colProps: { span: 24 },
      renderFormItem: () => {
        return (
          <Space>
            <Avatar
              size={64}
              style={{ background: '#f9f9f9', color: '#606060', fontSize: 10 }}
              src={
                avatar?.thumbnail ? (
                  <Image src={avatar.thumbnail} preview={{ src: avatar.shareLink }} />
                ) : (
                  <AiOutlineBank style={{ fontSize: 16 }} />
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
      title: '选择共享组织',
      dataIndex: 'shareId',
      valueType: 'select',
      initialValue: props.current.metadata.shareId,
      formItemProps: { rules: [{ required: true, message: '请选择共享组织' }] },
      fieldProps: {
        options: props.current.space.parentTarget.map((i) => {
          return {
            label: i.name,
            value: i.id,
          };
        }),
      },
    },
    {
      title: '是否公开',
      dataIndex: 'public',
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
        rules: [{ required: true, message: '是否公开为必填项' }],
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '备注' }],
      },
    },
  ];
  return (
    <SchemaForm
      title={
        props.title.includes('编辑') ? `编辑[${props.current.name}]权限` : '新增权限'
      }
      open={props.open}
      width={640}
      layoutType="ModalForm"
      rowProps={{
        gutter: [24, 0],
      }}
      initialValues={props.title.includes('编辑') ? props.current.metadata : {}}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (props.title.includes('编辑')) {
            setAvatar(parseAvatar(props.current.metadata.icon));
          }
        } else {
          props.handleCancel();
        }
      }}
      onFinish={async (values) => {
        values.icon = JSON.stringify(avatar);
        if (props.title.includes('新增')) {
          props.handleOk((await props.current.create(values)) != undefined);
        } else {
          props.handleOk(await props.current.update(values));
        }
      }}
      columns={columns}></SchemaForm>
  );
};

export default AuthorityModal;
