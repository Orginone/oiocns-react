import {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDateTimePicker,
  ProFormDateTimeRangePicker,
  ProFormMoney,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import {
  ProFormCheckbox,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import { Rule } from 'antd/es/form';
import React, { useEffect, useState } from 'react';
import ProFormAuth from './widgets/ProFormAuth';
import ProFormDept from './widgets/ProFormDept';
import ProFormDict from './widgets/ProFormDict';
import ProFormGroup from './widgets/ProFormGroup';
import ProFormPerson from './widgets/ProFormPerson';
import ProFormIdentity from './widgets/ProFormIdentity';
import { XAttribute } from '@/ts/base/schema';
import { IBelong } from '@/ts/core';
import { loadWidgetsOpts } from '../rule';
import { Modal, UploadProps } from 'antd';
import { FileItemShare } from '@/ts/base/model';
import { downloadByUrl } from '@/utils/tools';

interface IProps {
  disabled?: boolean;
  item: XAttribute;
  belong: IBelong;
  noRule?: boolean;
  value?: any;
  onFilesValueChange?: (key: string, files: any[]) => void;
}

const defaultFilsUrl = [
  '/public/img/pdf.png',
  '/public/img/word.png',
  '/public/img/file.png',
];
/**
 * 表单项渲染
 */
const OioFormItem = ({
  item,
  belong,
  disabled,
  noRule,
  onFilesValueChange,
  value,
}: IProps) => {
  const rule = JSON.parse(item.rule || '{}');
  // 规则校验
  let rules: Rule[] = [];
  if (rule.rules && !noRule) {
    if (typeof rule.rules === 'string') {
      rules = [...rules, { message: '所填内容不符合要求', pattern: rule.rules }];
    } else if (rule.rules instanceof Array) {
      for (const r of rule.rules) {
        rules = [...rules, { message: '所填内容不符合要求', pattern: r }];
      }
    }
  }
  if (rule.required === true) {
    rules = [...rules, { required: true, message: `${rule.title}为必填项` }];
  }
  if (noRule) {
    rules = [];
  }
  if (!rule.widget) {
    rule.widget = loadWidgetsOpts(item.property!.valueType)[0].value;
  }

  const [fileList, setFileList] = useState<any[]>([]);
  useEffect(() => {
    if (value && ['file', 'upload'].includes(rule.widget)) {
      setFileList(
        JSON.parse(value).map((a: FileItemShare) => {
          return {
            uid: a.name,
            name: a.name,
            status: 'done',
            url: a.shareLink,
            data: a,
          };
        }),
      );
    }
  }, [value]);
  // 上传文件区域
  const uploadProps: UploadProps = {
    multiple: false,
    showUploadList: true,
    maxCount: 10,
    onPreview(file: any) {
      Modal.confirm({
        title: '下载文件',
        content: '是否下载文件？',
        cancelText: '取消',
        okText: '下载',
        onOk: () => downloadByUrl(file.url),
      });
    },
    onRemove(file: { key: string } & any) {
      const data = fileList.filter((v) => v.uid !== file.uid);
      setFileList(data);
      onFilesValueChange && onFilesValueChange(item.id, data);
    },
    async customRequest(options: { file: any }) {
      const file = options.file as File;
      if (file) {
        const result = await belong.directory.createFile(file);

        if (result) {
          const _data = result.shareInfo();
          console.log('da', _data);
          const showImg =
            _data.extension && ['.png', '.jpg', '.jpeg'].includes(_data.extension)
              ? _data.shareLink
              : getImgSrc(_data.extension ?? '.file');

          const _file = {
            uid: result.key,
            name: _data.name,
            status: 'done',
            url: _data.shareLink,
            data: _data,
            isImage:
              _data.extension && ['.png', '.jpg', '.jpeg'].includes(_data.extension),
            thumbUrl: showImg,
          };
          setFileList([...fileList, _file]);
          onFilesValueChange && onFilesValueChange(item.id, [...fileList, _file]);
        }
      }
    },
  };
  const getImgSrc = (fileType: string) => {
    switch (fileType) {
      case '.pdf':
        return defaultFilsUrl[0];

      case '.doc':
      case '.docx':
        return defaultFilsUrl[1];
      default:
        return defaultFilsUrl[2];
    }
  };
  switch (rule.widget) {
    case 'input':
    case 'string':
    case 'text':
      return (
        <ProFormText
          disabled={disabled}
          name={item.id}
          required={rule.required}
          fieldProps={rule}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'digit':
    case 'number':
      return (
        <ProFormDigit
          disabled={disabled}
          name={item.id}
          fieldProps={rule}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'select':
      return (
        <ProFormSelect
          disabled={disabled}
          name={item.id}
          fieldProps={rule}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'treeSelect':
      return (
        <ProFormTreeSelect
          disabled={disabled}
          name={item.id}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'file':
    case 'upload': {
      return (
        <ProFormUploadButton
          name={item.id}
          key={fileList.length}
          listType="picture"
          fileList={fileList}
          fieldProps={{
            ...rule,
            ...uploadProps,
          }}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    }

    case 'date':
      return (
        <ProFormDatePicker
          disabled={disabled}
          name={item.id}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'datetime':
      return (
        <ProFormDateTimePicker
          disabled={disabled}
          name={item.id}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'dateRange':
      return (
        <ProFormDateRangePicker
          disabled={disabled}
          name={item.id}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'dateTimeRange':
      return (
        <ProFormDateTimeRangePicker
          disabled={disabled}
          name={item.id}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'checkbox':
      return (
        <ProFormCheckbox
          disabled={disabled}
          name={item.id}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'radio':
      return (
        <ProFormRadio
          disabled={disabled}
          name={item.id}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'money':
      return (
        <ProFormMoney
          disabled={disabled}
          name={item.id}
          rules={rules}
          // width={200}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'dict':
      return (
        <ProFormDict
          label=""
          speciesId={item.property!.speciesId}
          name={item.id}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
          props={rule}
        />
      );
    case 'department':
    case 'dept':
      return (
        <ProFormDept
          label=""
          belong={belong}
          name={item.id}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'person':
      return (
        <ProFormPerson
          label=""
          belong={belong}
          name={item.id}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'group':
      return (
        <ProFormGroup
          label=""
          belong={belong}
          name={item.id}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'auth':
      return (
        <ProFormAuth
          label=""
          belong={belong}
          name={item.id}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    case 'identity':
      return (
        <ProFormIdentity
          label=""
          belong={belong}
          name={item.id}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
    default:
      return (
        <ProFormText
          name={item.id}
          fieldProps={rule}
          rules={rules}
          tooltip={rule.description}
          labelAlign="right"
        />
      );
  }
};

export default OioFormItem;
