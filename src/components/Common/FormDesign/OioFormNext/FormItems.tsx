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
import ProFormGroup from './widgets/ProFormGroup';
import ProFormPerson from './widgets/ProFormPerson';
import ProFormIdentity from './widgets/ProFormIdentity';
import { IBelong } from '@/ts/core';
import { loadWidgetsOpts } from '../rule';
import { Modal, UploadProps } from 'antd';
import { FileItemShare } from '@/ts/base/model';
import { downloadByUrl } from '@/utils/tools';
import { model } from '@/ts/base';
import PDF from '@/assets/img/flow.png';
import word from '@/assets/img/flow.png';
import file from '@/assets/img/flow.png';
import EntityIcon from '../../GlobalComps/entityIcon';

interface IProps {
  disabled?: boolean;
  field: model.FieldModel;
  belong: IBelong;
  noRule?: boolean;
  value?: any;
  onFilesValueChange?: (key: string, files: any[]) => void;
}

const defaultFilsUrl = [PDF, word, file];
/**
 * 表单项渲染
 */
const OioFormItem = ({
  field,
  belong,
  disabled,
  noRule,
  onFilesValueChange,
  value,
}: IProps) => {
  const rule = JSON.parse(field.rule || '{}');
  // 规则校验
  let rules: Rule[] = [];
  // 基本规则
  if (rule.rules) {
    if (typeof rule.rules === 'string') {
      rules = [...rules, { message: '所填内容不符合要求', pattern: rule.rules }];
    } else if (rule.rules instanceof Array) {
      for (const r of rule.rules) {
        rules = [...rules, { message: '所填内容不符合要求', pattern: r }];
      }
    }
  }
  // 对不展示规则需求，隐藏必填项
  if (noRule) {
    rule.required = false;
    rules = rules?.map((r) => {
      return { ...r, required: false };
    });
  } else {
    // 对展示规则需求，修改提示词
    if (rule.required === true && !noRule) {
      rules = [...rules, { required: true, message: `${field.name}为必填项` }];
    }
  }
  if (!rule.widget) {
    rule.widget = loadWidgetsOpts(field.valueType)[0].value;
  }
  const [fileList, setFileList] = useState<any[]>([]);
  useEffect(() => {
    if (value && ['file', 'upload'].includes(rule.widget)) {
      if (Array.isArray(value)) {
        setFileList(
          value.map((a: FileItemShare) => {
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
      onFilesValueChange && onFilesValueChange(field.id, data);
    },
    async customRequest(options: { file: any }) {
      const file = options.file as File;
      if (file) {
        const result = await belong.directory.createFile(file);

        if (result) {
          const _data = result.shareInfo();
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
          onFilesValueChange && onFilesValueChange(field.id, [...fileList, _file]);
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
  const buildTreeNode = (id: string, items: model.FiledLookup[]): any[] => {
    return items
      .filter((i) => i.parentId === id)
      .map((i) => {
        return {
          label: i.text,
          value: i.value,
          children: buildTreeNode(i.id, items),
        };
      });
  };
  if (disabled) {
    switch (rule.widget) {
      case 'dept':
      case 'department':
      case 'person':
      case 'myself':
      case 'group':
      case 'auth':
      case 'identity':
        if (value) {
          return <EntityIcon entityId={value} showName size={20} />;
        }
        return <></>;
    }
  }
  switch (rule.widget) {
    case 'input':
    case 'string':
    case 'text':
      return (
        <ProFormText
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          fieldProps={rule}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'digit':
    case 'number':
      return (
        <ProFormDigit
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          fieldProps={rule}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'select':
      return (
        <ProFormSelect
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          fieldProps={rule}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'treeSelect':
      return (
        <ProFormTreeSelect
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'file':
    case 'upload': {
      return (
        <ProFormUploadButton
          name={field.id}
          key={fileList.length}
          listType="picture"
          fileList={fileList}
          fieldProps={{
            ...rule,
            ...uploadProps,
          }}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    }
    case 'date':
      return (
        <ProFormDatePicker
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'datetime':
      return (
        <ProFormDateTimePicker
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'dateRange':
      return (
        <ProFormDateRangePicker
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'dateTimeRange':
      return (
        <ProFormDateTimeRangePicker
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'checkbox':
      return (
        <ProFormCheckbox
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'radio':
      return (
        <ProFormRadio
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'money':
      return (
        <ProFormMoney
          disabled={disabled}
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'dict':
      return (
        <ProFormSelect
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          tooltip={field.remark}
          fieldProps={{
            ...rules,
            options: (field.lookups || []).map((i) => {
              return { label: i.text, value: i.value };
            }),
          }}
          rules={rules}
        />
      );
    case 'species':
      return (
        <ProFormTreeSelect
          name={field.id}
          required={rule.required === true || rule.required === 'true'}
          tooltip={field.remark}
          fieldProps={{
            ...rules,
            treeData: (field.lookups || [])
              .filter((i) => !(i.parentId?.length ?? 0 > 0))
              .map((i) => {
                return {
                  label: i.text,
                  value: i.value,
                  children: buildTreeNode(i.id, field.lookups || []),
                };
              }),
          }}
          rules={rules}
        />
      );
    case 'department':
    case 'dept':
      return (
        <ProFormDept
          label=""
          belong={belong}
          name={field.id}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'person':
    case 'myself':
      return (
        <ProFormPerson
          label=""
          belong={belong}
          name={field.id}
          rules={rules}
          myself={rule.widget === 'myself'}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'group':
      return (
        <ProFormGroup
          label=""
          belong={belong}
          name={field.id}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'auth':
      return (
        <ProFormAuth
          label=""
          belong={belong}
          name={field.id}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    case 'identity':
      return (
        <ProFormIdentity
          label=""
          belong={belong}
          name={field.id}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
    default:
      return (
        <ProFormText
          name={field.id}
          fieldProps={rule}
          required={rule.required === true || rule.required === 'true'}
          rules={rules}
          tooltip={field.remark}
          labelAlign="right"
        />
      );
  }
};

export default OioFormItem;
