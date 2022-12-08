import React, { useRef, useState } from 'react';
import { message, Upload, UploadProps, Image } from 'antd';
import { nanoid, ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import { TargetType } from '@/ts/core/enum';
import SchemaForm from '@/components/SchemaForm';
import { XTarget } from '@/ts/base/schema';
import { PlusOutlined } from '@ant-design/icons';
import docsCtrl from '@/ts/controller/store/docsCtrl';
import { FileItemShare, TargetModel } from '@/ts/base/model';
import userCtrl from '@/ts/controller/setting/userCtrl';

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
  const [image, setImage] = useState<FileItemShare>();
  const uploadProps: UploadProps = {
    multiple: false,
    showUploadList: false,
    maxCount: 1,
    listType: 'picture-card',
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
          setImage(img);
          formRef.current?.setFieldValue('avatar', img);
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
          <Upload {...uploadProps}>
            {image ? (
              <Image src={image.thumbnail} preview={{ src: image.shareLink }} />
            ) : (
              <PlusOutlined />
            )}
          </Upload>
        );
      },
      formItemProps: {},
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
      width={520}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (editData) {
            editData.avatar ? setImage(JSON.parse(editData.avatar)) : setImage(undefined);
            formRef.current?.setFieldsValue({
              ...editData,
              teamName: editData?.team?.name,
              teamCode: editData?.team?.code,
              teamRemark: editData?.team?.remark,
            });
          }
        } else {
          formRef.current?.resetFields();
          setImage(undefined);
        }
      }}
      modalProps={{
        onCancel: () => handleCancel(),
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onFinish={async (values) => {
        if (!editData) return;
        const res = await userCtrl.User.createCompany(values);
        if (res.success) {
          message.success('创建单位成功');
          userCtrl.setCurSpace(res.data.id);
        } else {
          message.error('创建单位失败：' + res?.msg);
        }
        if (res.success) {
          message.success('修改成功');
          handleOk();
        } else {
          message.error(res.msg);
          return false;
        }
      }}
      columns={columns}
    />
  );
};

export default EditCustomModal;
