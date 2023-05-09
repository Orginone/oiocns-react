import React, { useRef, useState } from 'react';
import { message, Upload, UploadProps, Image, Button, Space, Avatar } from 'antd';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import orgCtrl from '@/ts/controller';
import { FileItemShare } from '@/ts/base/model';
import { ITarget, ISpeciesItem } from '@/ts/core';
import { AiOutlineBank } from 'react-icons/ai';
import { SpeciesModel } from '@/ts/base/model';
import { parseAvatar } from '@/ts/base';

interface Iprops {
  title: string;
  open: boolean;
  handleCancel: () => void;
  handleOk: (newItem: ISpeciesItem | undefined) => void;
  current: ITarget;
  species?: ISpeciesItem;
}
/*
  编辑
*/
const CreateSpeciesModal = (props: Iprops) => {
  if (!props.open) return <></>;
  const formRef = useRef<ProFormInstance>();
  const [avatar, setAvatar] = useState<FileItemShare>();
  const speciesTypes: string[] = [];
  let target = props.current;
  if (props.species) {
    target = props.species.current;
    speciesTypes.push(...props.species.speciesTypes);
  } else {
    speciesTypes.push(...target.speciesTypes);
  }
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
  const columns: ProFormColumnsType<SpeciesModel>[] = [
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
        rules: [{ required: true, message: '分类名称为必填项' }],
      },
    },
    {
      title: '代码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '分类代码为必填项' }],
      },
    },
    {
      title: '类型',
      dataIndex: 'typeName',
      valueType: 'select',
      formItemProps: {
        rules: [{ required: true, message: '分类代码为必填项' }],
      },
      fieldProps: {
        options: speciesTypes.map((item) => {
          return { value: item, label: item };
        }),
      },
    },
    {
      title: '制定组织',
      dataIndex: 'shareId',
      valueType: 'select',
      initialValue: target.metadata.id,
      formItemProps: { rules: [{ required: true, message: '组织为必填项' }] },
      fieldProps: {
        options: [
          {
            value: target.metadata.id,
            label: target.metadata.name,
          },
        ],
      },
    },
    {
      title: '管理权限',
      dataIndex: 'authId',
      valueType: 'treeSelect',
      formItemProps: { rules: [{ required: true, message: '管理权限为必填项' }] },
      request: async () => {
        const data = await target.space.loadSuperAuth();
        return data ? [data.metadata] : [];
      },
      fieldProps: {
        fieldNames: { label: 'name', value: 'id', children: 'nodes' },
        showSearch: true,
        filterTreeNode: true,
        treeNodeFilterProp: 'name',
        treeDefaultExpandAll: true,
      },
    },
    {
      title: '向下级组织公开',
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
      title: '定义',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '分类定义为必填项' }],
      },
    },
  ];
  return (
    <SchemaForm<SpeciesModel>
      formRef={formRef}
      title={props.title + '类别'}
      open={props.open}
      width={640}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (props.title.includes('修改')) {
            setAvatar(parseAvatar(props.species?.metadata.icon));
            formRef.current?.setFieldsValue(props.species?.metadata);
          }
          formRef.current?.setFieldValue('shareId', target.metadata.id);
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
        values.icon = JSON.stringify(avatar);
        if (props.species) {
          if (props.title.includes('修改')) {
            await props.species.update(values);
            props.handleOk(props.species);
          } else {
            props.handleOk(await props.species.create(values));
          }
        } else {
          props.handleOk(await props.current.createSpecies(values));
        }
      }}
      columns={columns}></SchemaForm>
  );
};

export default CreateSpeciesModal;
