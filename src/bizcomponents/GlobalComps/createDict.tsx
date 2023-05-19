import React, { useRef, useState } from 'react';
import SchemaForm from '@/components/SchemaForm';
import { DictModel, FileItemShare } from '@/ts/base/model';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import { IDict, IDictClass } from '@/ts/core';
import { Avatar, Button, Space, Image, Upload, message, UploadProps } from 'antd';
import { AiOutlineBank } from 'react-icons/ai';
import { parseAvatar } from '@/ts/base';
import orgCtrl from '@/ts/controller';

interface Iprops {
  open: boolean;
  current: IDict | IDictClass;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
}
/*
  特性编辑模态框
*/
const DictModal = (props: Iprops) => {
  if (!props.open) return <></>;
  const { open, current, handleCancel, handleOk } = props;
  const formRef = useRef<ProFormInstance>();
  const [avatar, setAvatar] = useState<FileItemShare>();
  const dict = 'items' in current ? current : undefined;
  const dictClass = dict ? dict.species : (current as IDictClass);
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
  const columns: ProFormColumnsType<DictModel>[] = [
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
                avatar ? (
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
      title: '字典名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '字典名称为必填项' }],
      },
    },
    {
      title: '字典代码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '字典代码为必填项' }],
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
    },
  ];
  return (
    <SchemaForm<DictModel>
      formRef={formRef}
      title={dict ? `编辑[${dict.name}]字典` : '新增字典'}
      open={open}
      width={640}
      layoutType="ModalForm"
      initialValues={dict?.metadata || {}}
      rowProps={{
        gutter: [24, 0],
      }}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (dict) {
            setAvatar(parseAvatar(dict.metadata.icon));
          }
        } else {
          handleCancel();
        }
      }}
      onFinish={async (values) => {
        values.icon = JSON.stringify(avatar);
        if (dict) {
          handleOk(await dict.update(values));
        } else {
          handleOk((await dictClass.createDict(values)) !== undefined);
        }
      }}
      columns={columns}
    />
  );
};

export default DictModal;
