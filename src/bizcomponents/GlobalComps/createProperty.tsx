import React, { useEffect, useState } from 'react';
import { ProFormColumnsType } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { PropertyModel } from '@/ts/base/model';
import { XProperty } from '@/ts/base/schema';
import { IDict, IPropClass } from '@/ts/core';

interface Iprops {
  open: boolean;
  species: IPropClass;
  data?: XProperty;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
}
/*
  特性编辑模态框
*/
const PropertyModal = ({ open, handleOk, species, data, handleCancel }: Iprops) => {
  if (!open) return <></>;
  const [dicts, setDicts] = useState<IDict[]>([]);
  const [selectType, setSelectType] = useState<string>();
  useEffect(() => {
    species.current.space.loadDicts().then((value) => {
      console.log(value);
      setDicts([...value]);
    });
  }, [selectType]);
  const getFromColumns = () => {
    const columns: ProFormColumnsType<PropertyModel>[] = [
      {
        title: '属性名称',
        dataIndex: 'name',
        formItemProps: {
          rules: [{ required: true, message: '属性名称为必填项' }],
        },
      },
      {
        title: '属性代码',
        dataIndex: 'code',
        readonly: true,
      },
      {
        title: '属性类型',
        dataIndex: 'valueType',
        valueType: 'select',
        fieldProps: {
          options: [
            {
              value: '数值型',
              label: '数值型',
            },
            {
              value: '描述型',
              label: '描述型',
            },
            {
              value: '选择型',
              label: '选择型',
            },
            {
              value: '分类型',
              label: '分类型',
            },
            {
              value: '附件型',
              label: '附件型',
            },
            {
              value: '日期型',
              label: '日期型',
            },
            {
              value: '时间型',
              label: '时间型',
            },
            {
              value: '用户型',
              label: '用户型',
            },
          ],
          onSelect: (select: string) => {
            setSelectType(select);
          },
        },
        formItemProps: {
          rules: [{ required: true, message: '特性类型为必填项' }],
        },
      },
    ];
    if (selectType === '选择型') {
      columns.push({
        title: '选择枚举字典',
        dataIndex: 'dictId',
        valueType: 'select',
        formItemProps: { rules: [{ required: true, message: '枚举分类为必填项' }] },
        fieldProps: {
          disabled: selectType !== '选择型',
          showSearch: true,
          options: dicts.map((i) => {
            return {
              value: i.id,
              label: i.metadata.name,
            };
          }),
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
      title: '属性定义',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '属性定义为必填项' }],
      },
    });
    return columns;
  };

  return (
    <SchemaForm<PropertyModel>
      key={'propertyModal'}
      open={open}
      width={640}
      layoutType="ModalForm"
      initialValues={data || {}}
      title={data ? `编辑[${data.name}]属性` : '新建属性'}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (data) {
            setSelectType(data?.valueType);
          }
        } else {
          handleCancel();
        }
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      onFinish={async (model) => {
        if (data) {
          model.id = data.id;
          handleOk((await species.updateProperty(model)) != undefined);
        } else {
          handleOk((await species.createProperty(model)) != undefined);
        }
      }}
      columns={getFromColumns()}
    />
  );
};

export default PropertyModal;
