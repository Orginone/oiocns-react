import React, { useRef, useState } from 'react';
import { message, Upload, UploadProps, Image, Button, Space, Avatar } from 'antd';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import storeCtrl from '@/ts/controller/store';
import { FileItemShare } from '@/ts/base/model';
import { BankOutlined } from '@ant-design/icons';
import { IMarket, ProductType } from '@/ts/core';
import { parseAvatar } from '@/ts/base';
import userCtrl from '@/ts/controller/setting';

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
      colProps: { span: 12 },
      formItemProps: {
        rules: [{ required: true, message: '应用名称为必填项' }],
      },
    },
    {
      title: '应用编码',
      dataIndex: 'code',
      colProps: { span: 12 },
      formItemProps: {
        rules: [{ required: true, message: '此项为必填项' }],
      },
    },
    {
      title: '应用类型',
      dataIndex: 'typeName',
      valueType: 'select',
      valueEnum: ProductType,
      colProps: { span: 12 },
      initialValue: ProductType.WebApp,
    },
    {
      title: '制定组织',
      dataIndex: 'belongId',
      valueType: 'treeSelect',
      request: async () => {
        return await userCtrl.getTeamTree();
      },
      fieldProps: {
        disabled: title === '修改',
        fieldNames: {
          label: 'teamName',
          value: 'id',
          children: 'subTeam',
        },
        showSearch: true,
        filterTreeNode: true,
        treeNodeFilterProp: 'teamName',
      },
      colProps: { span: 12 },
      initialValue: userCtrl.space.id,
    },
    {
      title: '向下级组织公开',
      dataIndex: 'public',
      valueType: 'select',
      fieldProps: {
        options: [
          {
            value: '1',
            label: '公开',
          },
          {
            value: '0',
            label: '不公开',
          },
        ],
      },
      colProps: { span: 12 },
      formItemProps: {
        rules: [{ required: true, message: '向下级组织公开为必填项' }],
      },
      initialValue: '1',
    },
    {
      title: '选择管理权限',
      dataIndex: 'authId',
      valueType: 'treeSelect',
      formItemProps: { rules: [{ required: true, message: '管理权限为必填项' }] },
      request: async () => {
        const data = await userCtrl.space.loadAuthorityTree(false);
        return data ? [data] : [];
      },
      fieldProps: {
        disabled: title === '修改',
        fieldNames: { label: 'name', value: 'id' },
        showSearch: true,
        filterTreeNode: true,
        treeNodeFilterProp: 'name',
        treeDefaultExpandAll: true,
      },
      initialValue: '361356410774228992',
    },
    {
      title: '应用详情',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
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

export default AppInfoModal;
