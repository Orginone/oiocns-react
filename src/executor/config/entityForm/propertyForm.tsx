import React, { useRef, useState } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { PropertyModel } from '@/ts/base/model';
import { IDirectory, valueTypes } from '@/ts/core';
import { IProperty } from '@/ts/core/thing/property';
import { EntityColumns } from './entityColumns';
import { Modal, Input, Form } from 'antd';
import SelectPropertys from './selectSpecieses';

interface Iprops {
  formType: string;
  current: IDirectory | IProperty;
  finished: () => void;
}
/*
  编辑
*/
const PropertyForm = (props: Iprops) => {
  const [form] = Form.useForm(); // 获取表单的引用
  const formRef = useRef<ProFormInstance>();
  const [selectType, setSelectType] = useState<string>(
    (props.current as IProperty).metadata.valueType,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkList, setCheckList] = useState([]);
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
  const [inputValue, setInputValue] = useState(
    directory.directory.allSpecieses.filter(
      (item) => item.id === initialValue?.speciesId,
    )[0].name,
  );
  const getFromColumns = () => {
    const columns: ProFormColumnsType<PropertyModel>[] = [
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
            setCheckList([]);
            setInputValue('');
            form.setFieldsValue({
              speciesId: '',
            });
            formRef.current?.setFieldValue('speciesId', '');
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
        formItemProps: {
          rules: [{ required: true, message: `${typeName}为必填项` }],
        },
        renderFormItem: () => {
          return (
            <div>
              <Input
                value={inputValue}
                onClick={() => setIsModalOpen(true)}
                type="text"
              />
            </div>
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
      formItemProps: {
        rules: [{ required: true, message: '属性定义为必填项' }],
      },
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
    <div>
      <SchemaForm<PropertyModel>
        form={form}
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
              await directory.createProperty(values);
              break;
          }
          props.finished();
        }}
      />
      {isModalOpen && (
        <Modal
          open
          width={800}
          title={`选择${selectType === '选择型' ? '字典' : '分类'}`}
          destroyOnClose
          okText="确定"
          onOk={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}>
          <SelectPropertys
            target={props.current.directory.target}
            selectType={selectType === '选择型' ? '字典' : '分类'}
            selected={checkList}
            onAdded={async (prop: any) => {
              console.log('prop', prop);
              setInputValue(prop._metadata.name);
              form.setFieldsValue({
                speciesId: prop._metadata.id,
              });
              setCheckList(prop);
            }}
            onDeleted={async () => {
              setCheckList([]);
              setInputValue('');
              form.setFieldsValue({
                speciesId: '',
              });
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default PropertyForm;
