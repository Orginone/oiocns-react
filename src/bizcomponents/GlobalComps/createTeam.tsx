import React, { useRef, useState } from 'react';
import { message, Upload, UploadProps, Image, Button, Space, Avatar } from 'antd';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import orgCtrl from '@/ts/controller';
import { FileItemShare, TargetModel } from '@/ts/base/model';
import { ITeam } from '@/ts/core';
import { AiOutlineBank } from 'react-icons/ai';
import { parseAvatar } from '@/ts/base';

interface Iprops {
  title: string;
  open: boolean;
  handleCancel: () => void;
  handleOk: (newItem: ITeam | undefined) => void;
  current: ITeam;
  typeNames: string[];
}
/*
  编辑
*/
const CreateTeamModal = (props: Iprops) => {
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
      const docDir = await orgCtrl.user.filesys?.home?.create('头像');
      if (docDir && file) {
        const result = await docDir.upload(file.name, file);
        if (result) {
          setAvatar(result.shareInfo());
        }
      }
    },
  };
  const columns: ProFormColumnsType<TargetModel>[] = [
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
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
    {
      title: '类型',
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
      title: '代码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '代码为必填项' }],
      },
    },
    {
      title: '简称',
      dataIndex: 'TeamName',
    },
    {
      title: '标识',
      dataIndex: 'teamCode',
    },
    {
      title: '简介',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '简介为必填项' }],
      },
    },
  ];
  return (
    <SchemaForm<TargetModel>
      formRef={formRef}
      title={props.title}
      open={props.open}
      width={640}
      onOpenChange={(open: boolean) => {
        if (open) {
          formRef.current?.setFieldValue('typeName', props.typeNames[0]);
          if (props.title === '编辑') {
            setAvatar(parseAvatar(props.current.metadata.icon));
            formRef.current?.setFieldsValue({
              ...props.current.metadata,
              teamName: props.current.metadata.team?.name,
              teamCode: props.current.metadata.team?.code,
              teamRemark: props.current.metadata.remark,
            });
          }
        } else {
          formRef.current?.resetFields();
          setAvatar(undefined);
          props.handleCancel();
        }
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onFinish={async (values) => {
        values.teamName = values.teamName ?? values.name;
        values.teamCode = values.teamCode ?? values.code;
        values.icon = JSON.stringify(avatar);
        if (props.title === '编辑') {
          await props.current.update(values);
          props.handleOk(props.current);
        } else {
          props.handleOk(await props.current.createTarget(values));
        }
      }}
      columns={columns}></SchemaForm>
  );
};

export default CreateTeamModal;
