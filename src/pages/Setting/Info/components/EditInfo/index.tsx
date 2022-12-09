import React, { useRef, useState } from 'react';
import { message, Upload, UploadProps, Image, UploadFile } from 'antd';
import {
  nanoid,
  ProFormColumnsType,
  ProFormInstance,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { TargetType } from '@/ts/core/enum';
import SchemaForm from '@/components/SchemaForm';
import { XTarget } from '@/ts/base/schema';
import docsCtrl from '@/ts/controller/store/docsCtrl';
import { FileItemShare, TargetModel } from '@/ts/base/model';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { PlusOutlined } from '@ant-design/icons';

interface Iprops {
  title: string;
  open: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  editData?: XTarget;
}
/*
  编辑
*/
const EditCustomModal = (props: Iprops) => {
  const { open, title, handleOk, editData, handleCancel } = props;
  const formRef = useRef<ProFormInstance>();
  const [image, setImage] = useState<UploadFile[]>([
    {
      uid: nanoid(),
      name: 'www',
      status: 'done',
      thumbUrl:
        'data:image/jpeg;base64,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',
      url: 'data:image/jpeg;base64,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',
    },
  ]);
  const [isPreview, setIsPreview] = useState<boolean>();
  const uploadProps: UploadProps = {
    multiple: false,
    showUploadList: false,
    maxCount: 1,
    listType: 'picture-card',
    fileList: image,
    onPreview: () => {
      setIsPreview(true);
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image');
      if (!isImage) {
        message.error(`${file.name} 不是一个图片文件`);
      }
      return isImage;
    },
    async customRequest(options) {
      const file = options.file as File;
      const docDir = await docsCtrl.home?.create('图片');
      console.log(file.name);
      if (docDir && file) {
        const result = await docsCtrl.upload(docDir.key, nanoid() + file.name, file);
        console.log('img', result);
        if (result) {
          const img: FileItemShare = result.shareInfo();
          setImage([
            {
              uid: nanoid(),
              name: img.name,
              status: 'done',
              thumbUrl:
                img.thumbnail ||
                'data:image/jpeg;base64,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',
              url: img.shareLink,
            },
          ]);
          formRef.current?.setFieldValue('avatar', img);
        }
      }
    },
  };
  const columns: ProFormColumnsType<TargetModel>[] = [
    {
      title: '单位图标',
      dataIndex: 'avatar',
      colProps: { span: 24 },
      formItemProps: {
        valuePropName: 'fileList',
      },
      initialValue: image,
      renderFormItem: () => {
        return (
          <Upload {...uploadProps}>
            {image?.length ? (
              <Image
                src={image[0].thumbUrl}
                preview={{ visible: isPreview, src: image[0].url }}
                // style={{ display: 'none' }}
              />
            ) : (
              <PlusOutlined />
            )}
          </Upload>
        );
      },
    },
    {
      title: '单位名称',
      dataIndex: 'teamName',
      formItemProps: {
        rules: [{ required: true, message: '单位名称为必填项' }],
      },
    },
    {
      title: '单位类型',
      dataIndex: 'typeName',
      valueType: 'select',
      fieldProps: {
        options: [
          {
            value: TargetType.Company,
            label: TargetType.Company,
          },
          {
            value: TargetType.University,
            label: TargetType.University,
          },
          {
            value: TargetType.Hospital,
            label: TargetType.Hospital,
          },
        ],
      },
      formItemProps: {
        rules: [{ required: true, message: '单位类型为必填项' }],
      },
    },
    {
      title: '社会信用统一代码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
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
          if (editData) {
            setImage([
              {
                uid: nanoid(),
                name: 'name',
                status: 'done',
                thumbUrl:
                  'data:image/jpeg;base64,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',
                url: 'data:image/jpeg;base64,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',
              },
            ]);
            // editData.avatar ? setImage(JSON.parse(editData.avatar)) : setImage(undefined);
            formRef.current?.setFieldsValue({
              ...editData,
              avatar: [],
              teamName: editData?.team?.name,
              teamCode: editData?.team?.code,
              teamRemark: editData?.team?.remark,
            });
          }
        } else {
          formRef.current?.resetFields();
          setImage([]);
        }
      }}
      modalprops={{
        onCancel: () => handleCancel(),
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onFinish={async (values) => {
        if (editData) {
          const res = await userCtrl.Company.update({
            ...values,
          });
          if (res.success) {
            message.success('更新信息成功');
            handleOk();
          } else {
            message.error('更新信息失败：' + res?.msg);
          }
        } else {
          const res = await userCtrl.User.createCompany(values);
          if (res.success) {
            message.success('创建单位成功');
            userCtrl.setCurSpace(res.data.id);
          } else {
            message.error('创建单位失败：' + res?.msg);
          }
        }
      }}
      columns={columns}>
      <Upload {...uploadProps} />
    </SchemaForm>
  );
};

export default EditCustomModal;
