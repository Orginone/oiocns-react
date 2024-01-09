import React, { useEffect, useRef, useState } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { IDirectory, valueTypes, IProperty } from '@/ts/core';
import { EntityColumns } from './entityColumns';
import { schema } from '@/ts/base';
import OpenFileDialog from '@/components/OpenFileDialog';
import { Input } from 'antd';

interface Iprops {
  formType: string;
  current: IDirectory | IProperty;
  finished: () => void;
}
/*
  编辑
*/
const PropertyForm = (props: Iprops) => {
  const formRef = useRef<ProFormInstance>();
  const [needType, setNeedType] = useState('');
  const [selectType, setSelectType] = useState<string>(
    (props.current as IProperty).metadata.valueType,
  );
  let title = '';
  let directory: IDirectory;
  let property: IProperty | undefined;
  const readonly = props.formType === 'remarkProperty';
  let initialValue: any = props.current.metadata;
  switch (props.formType) {
    case 'newProperty':
      initialValue = {};
      title = '新建属性';
      directory = props.current as IDirectory;
      break;
    case 'updateProperty':
      title = '更新属性';
      property = props.current as IProperty;
      directory = property.directory;
      break;
    case 'remarkProperty':
      title = '查看属性';
      property = props.current as IProperty;
      directory = property.directory;
      break;
    default:
      return <></>;
  }
  const findSpecies = () => {
    if (property?.metadata.speciesId) {
      return directory.target.user.findMetadata<schema.XEntity>(
        property.metadata.speciesId,
      );
    }
  };
  const [species, setSpecies] = useState(findSpecies());
  const findForm = () => {
    if (property?.metadata.formId) {
      return directory.target.user.findMetadata<schema.XEntity>(property.metadata.formId);
    }
  };
  const [form, setForm] = useState(findForm());
  useEffect(() => {
    formRef.current?.setFieldValue('speciesId', species?.id);
    formRef.current?.setFieldValue('formId', form?.id);
  }, [species, form]);
  const getFromColumns = () => {
    const columns: ProFormColumnsType<schema.XProperty>[] = [
      {
        title: '名称',
        dataIndex: 'name',
        readonly: readonly,
        formItemProps: {
          rules: [{ required: true, message: '分类名称为必填项' }],
        },
      },
      {
        title: '代码',
        dataIndex: 'code',
        readonly: readonly,
        formItemProps: {
          rules: [{ required: true, message: '分类代码为必填项' }],
        },
      },
      {
        title: '类型',
        dataIndex: 'valueType',
        valueType: 'select',
        readonly: readonly,
        fieldProps: {
          options: valueTypes.map((i) => {
            return {
              value: i,
              label: i === '选择型' ? '字典型' : i,
            };
          }),
          onSelect: (select: string) => {
            setSelectType(select);
            formRef.current?.setFieldValue('speciesId', '');
            formRef.current?.setFieldValue('formId', '');
          },
        },
        formItemProps: {
          rules: [{ required: true, message: '特性类型为必填项' }],
        },
      },
    ];
    if (['选择型', '分类型'].includes(selectType || '')) {
      const typeName = selectType === '选择型' ? '字典' : '分类';
      columns.push({
        title: `选择${typeName}`,
        dataIndex: 'speciesId',
        valueType: 'select',
        formItemProps: { rules: [{ required: true, message: `${typeName}为必填项` }] },
        renderFormItem() {
          if (readonly) {
            return <div>{species?.name ?? ''}</div>;
          }
          return (
            <Input
              placeholder={`点击选择${typeName}`}
              readOnly
              value={species?.name ?? ''}
              style={{ cursor: 'pointer' }}
              onClick={() => setNeedType(typeName)}
            />
          );
        },
      });
    }
    if (selectType === '引用型') {
      columns.push({
        title: `选择表单`,
        dataIndex: 'formId',
        valueType: 'select',
        renderFormItem() {
          if (readonly) {
            return <div>{form?.name ?? ''}</div>;
          }
          return (
            <Input
              placeholder={`点击选择表单`}
              readOnly
              value={form?.name ?? ''}
              style={{ cursor: 'pointer' }}
              onClick={() => setNeedType('表单')}
            />
          );
        },
      });
    }

    if (selectType === '数值型') {
      columns.push({
        title: '单位',
        dataIndex: 'unit',
      });
    }
    columns.push({
      title: '附加信息',
      dataIndex: 'info',
      valueType: 'textarea',
      readonly: readonly,
      colProps: { span: 24 },
    });
    if (readonly) {
      columns.push(...EntityColumns(props.current!.metadata));
    }
    columns.push({
      title: '备注信息',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      readonly: readonly,
      formItemProps: {
        rules: [{ required: true, message: '备注信息为必填项' }],
      },
    });
    return columns;
  };
  return (
    <>
      <SchemaForm<schema.XProperty>
        open
        title={title}
        width={640}
        formRef={formRef}
        columns={getFromColumns()}
        initialValues={initialValue}
        rowProps={{
          gutter: [24, 0],
        }}
        layoutType="ModalForm"
        onOpenChange={(open: boolean) => {
          if (!open) {
            props.finished();
          }
        }}
        onFinish={async (values) => {
          switch (props.formType) {
            case 'updateProperty':
              await property!.update(values);
              break;
            case 'newProperty':
              await directory.standard.createProperty(values);
              break;
          }
          props.finished();
        }}
      />
      {needType !== '' && (
        <OpenFileDialog
          title={`选择${needType}`}
          rootKey={directory.spaceKey}
          accepts={[needType]}
          onCancel={() => setNeedType('')}
          onOk={(files) => {
            if (['字典', '分类'].includes(needType)) {
              if (files.length > 0) {
                setSpecies(files[0].metadata);
              } else {
                setSpecies(undefined);
              }
            } else if ('表单' == needType) {
              if (files.length > 0) {
                setForm(files[0].metadata);
              } else {
                setForm(undefined);
              }
            }
            setNeedType('');
          }}
        />
      )}
    </>
  );
};

export default PropertyForm;
