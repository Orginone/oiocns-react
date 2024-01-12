import { model, schema } from '../../../ts/base';
import { IBelong } from '@/ts/core';
import { useEffect, useState } from 'react';
import React from 'react';
import { Tabs } from 'antd';
import { EditModal } from '../editModal';
import GenerateThingTable from '../generate/thingTable';
import { getUuid } from '@/utils/tools';
import { XThing } from '@/ts/base/schema';
import { AiFillEdit, AiFillRest } from 'react-icons/ai';
interface IProps {
  allowEdit: boolean;
  belong: IBelong;
  forms: schema.XForm[];
  changedFields: model.MappingData[];
  data: model.InstanceDataModel;
  getFormData: (form: schema.XForm) => model.FormEditData;
  onChanged?: (id: string, data: model.FormEditData, field: string, value: any) => void;
}

const DetailTable: React.FC<IProps> = (props) => {
  if (props.forms.length < 1) return <></>;
  const form = props.forms[0];
  if (!props.data.fields[form.id]) return <></>;
  const fields = props.data.fields[form.id];
  const operateRule = {
    allowAdd: form.options?.allowAdd ?? true,
    allowEdit: form.options?.allowEdit ?? true,
    allowSelect: form.options?.allowSelect ?? true,
  };
  const [key, setKey] = useState<string>(form.id);
  const [formData, setFormData] = useState(props.getFormData(form));
  const [selectKeys, setSelectKeys] = useState<string[]>([]);
  useEffect(() => {
    var after = formData.after.at(-1);
    if (after) {
      after.name = form.name;
    }
    props.onChanged?.apply(this, [form.id, formData, '', {}]);
  }, [formData]);
  useEffect(() => {
    if (props.changedFields.find((s) => s.formId == form.id)) {
      setKey(getUuid());
    }
  }, [props.changedFields]);
  const loadMenus = () => {
    if (props.allowEdit) {
      var items = [
        {
          key: 'remove',
          label: '移除',
          icon: <AiFillRest fontSize={22} />,
        },
      ];
      if (operateRule.allowEdit) {
        items.unshift({
          key: 'update',
          label: '更新',
          icon: <AiFillEdit fontSize={22} />,
        });
      }
      return {
        items: items,
        onMenuClick(key: string, data: XThing) {
          switch (key) {
            case 'update':
              EditModal.showFormEdit({
                form: form,
                fields: fields,
                belong: props.belong,
                create: false,
                initialValues: data,
                onSave: (values) => {
                  formData.after = formData.after.map((item) => {
                    if (selectKeys.includes(item.id)) {
                      Object.keys(values).forEach((k) => {
                        item[k] = values[k];
                      });
                    }
                    return item;
                  });
                  setFormData({ ...formData });
                },
              });
              break;
            case 'remove':
              formData.before = formData.before.filter((i) => i.id != data.id);
              formData.after = formData.after.filter((i) => i.id != data.id);
              setSelectKeys([]);
              setFormData({ ...formData });
              break;
          }
        },
      };
    }
  };
  return (
    <GenerateThingTable
      key={key}
      fields={fields}
      height={500}
      dataIndex={'attribute'}
      selection={
        props.allowEdit
          ? {
              mode: 'multiple',
              allowSelectAll: true,
              selectAllMode: 'allPages',
              showCheckBoxesMode: 'always',
            }
          : undefined
      }
      onSelectionChanged={(e) => setSelectKeys(e.selectedRowKeys)}
      toolbar={{
        visible: true,
        items: [
          {
            name: 'add',
            location: 'after',
            widget: 'dxButton',
            options: {
              text: '新增',
              icon: 'add',
              onClick: () => {
                EditModal.showFormEdit({
                  form: form,
                  fields: fields,
                  belong: props.belong,
                  create: true,
                  onSave: (values) => {
                    formData.after.push(values);
                    setFormData({ ...formData });
                  },
                });
              },
            },
            visible: props.allowEdit && operateRule['allowAdd'],
          },
          {
            name: 'edit',
            location: 'after',
            widget: 'dxButton',
            options: {
              text: '变更',
              icon: 'edit',
              onClick: () => {
                EditModal.showFormEdit({
                  form: form,
                  fields: fields,
                  belong: props.belong,
                  create: false,
                  onSave: (values) => {
                    formData.after = formData.after.map((item) => {
                      if (selectKeys.includes(item.id)) {
                        Object.keys(values).forEach((k) => {
                          item[k] = values[k];
                        });
                      }
                      return item;
                    });
                    setFormData({ ...formData });
                  },
                });
              },
            },
            visible: props.allowEdit && operateRule['allowEdit'] && selectKeys.length > 0,
          },
          {
            name: 'select',
            location: 'after',
            widget: 'dxButton',
            options: {
              text: '选择',
              icon: 'bulletlist',
              onClick: () => {
                EditModal.showFormSelect({
                  form: form,
                  fields: fields,
                  belong: props.belong,
                  onSave: (values) => {
                    values.forEach((item) => {
                      if (formData.after.every((i) => i.id !== item.id)) {
                        formData.after.unshift(item);
                      }
                      if (formData.before.every((i) => i.id !== item.id)) {
                        formData.before.unshift({ ...item });
                      }
                    });
                    setFormData({ ...formData });
                  },
                });
              },
            },
            visible: props.allowEdit && operateRule['allowSelect'],
          },
          {
            name: 'remove',
            location: 'after',
            widget: 'dxButton',
            options: {
              text: '移除',
              icon: 'remove',
              onClick: () => {
                formData.before = formData.before.filter(
                  (i) => !selectKeys.includes(i.id),
                );
                formData.after = formData.after.filter((i) => !selectKeys.includes(i.id));
                setSelectKeys([]);
                setFormData({ ...formData });
              },
            },
            visible: props.allowEdit && selectKeys.length > 0,
          },
          {
            name: 'columnChooserButton',
            location: 'after',
          },
          {
            name: 'searchPanel',
            location: 'after',
          },
        ],
      }}
      dataMenus={loadMenus()}
      dataSource={formData.after}
      beforeSource={formData.before}
    />
  );
};

const DetailForms: React.FC<IProps> = (props) => {
  if (props.forms.length < 1) return <></>;
  const [activeTabKey, setActiveTabKey] = useState(props.forms[0].id);
  const loadItems = () => {
    const items = [];
    for (const form of props.forms) {
      if (
        props.data.rules?.find(
          (a) => a.destId == form.id && a.typeName == 'visible' && !a.value,
        )
      ) {
        continue;
      }
      items.push({
        key: form.id,
        forceRender: true,
        label: form.name,
        children: <DetailTable {...props} forms={[form]} />,
      });
    }
    return items;
  };
  return (
    <Tabs
      items={loadItems()}
      activeKey={activeTabKey}
      onChange={(key) => setActiveTabKey(key)}
    />
  );
};

export default DetailForms;
