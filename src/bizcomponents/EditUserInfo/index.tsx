import React, { useRef, useState } from 'react';
import { message, Upload, UploadProps, Image } from 'antd';
import { nanoid, ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import {
  IDepartment,
  IPerson,
  IGroup,
  ICompany,
  ICohort,
} from '@/ts/core/target/itarget';
import SchemaForm from '@/components/SchemaForm';
import { XTarget } from '@/ts/base/schema';
import { PlusOutlined } from '@ant-design/icons';
import docsCtrl from '@/ts/controller/store/docsCtrl';
import { FileItemShare, TargetModel } from '@/ts/base/model';

interface Iprops {
  title: string;
  open: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  editData?: XTarget;
  reObject: IDepartment | IPerson | IGroup | ICompany | ICohort;
}
/*
  编辑
*/
const EditCustomModal = (props: Iprops) => {
  const { open, title, handleOk, reObject, editData, handleCancel } = props;
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
      title: '头像',
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
      title: '昵称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
      },
    },
    {
      title: '账号',
      dataIndex: 'code',
      //   fieldProps: {
      //     disabled: true,
      //   },
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
      modalprops={{
        onCancel: () => handleCancel(),
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onFinish={async (values) => {
        if (!editData) return;
        const res = await reObject.update({ ...values });
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
