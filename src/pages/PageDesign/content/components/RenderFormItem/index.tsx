import React, { useState } from 'react';
import { UploadProps, message } from 'antd';
import {
  ProForm,
  ProFormCheckbox,
  // ProFormDateRangePicker,
  // ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Colorpicker } from 'antd-colorpicker';
import store from '@/ts/controller/store';
import PageCtrl from '../../../pageCtrl';
const RenderFormItem = ({ comp, col }: any) => {
  const { type, id, label, limit = 0, options = [] } = col;
  const _props = { name: id, key: id, label, limit, tooltip: label };
  const ProFormUpload = (props: any) => {
    let data = comp?.data?.[props.name] ?? [];
    if (comp?.data?.['backgroundImage']) {
      data = [{ url: comp?.data?.['backgroundImage'] }];
    }
    const [fileList, setFileList] = useState<any[]>(data);
    const handleChange: UploadProps['onChange'] = (info) => {
      let newFileList = [...info.fileList];
      newFileList = newFileList.slice(-2);
      newFileList = newFileList.map((file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });

      setFileList(newFileList);
    };
    const uploadProps: UploadProps = {
      name: 'file',
      multiple: false,
      showUploadList: true,
      onChange: handleChange,
      beforeUpload: (file: any) => {
        const isImage = file.type.startsWith('image');
        if (!isImage) {
          message.error(`${file.name} 不是一个图片文件`);
        }
        return isImage;
      },
      async customRequest(options: any) {
        const file = options.file as File;
        const docDir = await store.home?.create('门户设置');
        if (docDir && file) {
          const result = await docDir.upload(file.name, file);
          if (result) {
            const filesss = {
              uid: result.key,
              name: result.name,
              status: 'done',
              url: result.shareInfo().shareLink,
            };
            setFileList([...fileList, filesss]);
            PageCtrl.UpdateCompItem({ [props.name]: [...fileList, filesss] });
          }
        }
      },
      onRemove: (file) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
      },
      fileList: fileList,
    };
    return (
      <ProFormUploadButton
        name={props.name}
        key={fileList.length}
        label={props.label}
        max={props.limit || 10}
        value={fileList}
        fieldProps={uploadProps}
      />
    );
  };
  const ProFormColor = (props: any) => {
    const color1 = comp?.data?.[props.name] ?? undefined;
    const [color, setColor] = useState<any[]>(color1);
    return (
      <ProForm.Item {...props}>
        <Colorpicker
          {...props}
          popup
          value={color}
          onChange={(v) => {
            console.log('颜色', v.hex);
            setColor(v.hex);
          }}
          blockStyles={{
            width: '40px',
            height: '40px',
            marginLeft: '20px',
          }}
        />
      </ProForm.Item>
    );
  };
  switch (type) {
    case 'upload':
      return <ProFormUpload width="md" {..._props} placeholder="请设置" />;
    case 'color':
      return <ProFormColor {..._props} placeholder="请设置" />;
    case 'select':
      return <ProFormSelect {..._props} options={options} />;
    case 'radio':
      return <ProFormRadio.Group {..._props} options={options} />;
    case 'checkbox':
      return <ProFormCheckbox.Group {..._props} options={options} />;
    default:
      return <ProFormText {..._props} placeholder="请设置" />;
  }
};

export default RenderFormItem;
