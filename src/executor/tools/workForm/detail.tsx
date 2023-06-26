import { model, schema } from '../../../ts/base';
import { IBelong } from '@/ts/core';
import { useEffect, useState } from 'react';
import React from 'react';
import { Tabs } from 'antd';
import { EditModal } from '../editModal';
import GenerateTable from '../generate/table';
import { formatDate } from '@/utils';

interface IProps {
  allowEdit: boolean;
  belong: IBelong;
  forms: schema.XForm[];
  data: model.InstanceDataModel;
  node: model.WorkNodeModel;
  onChanged?: (id: string, data: model.FormEditData) => void;
}

const parseLastSource = (data?: model.FormEditData[]) => {
  if (data && data.length > 0) {
    const item = data.slice(-1)[0];
    if (item.source && item.source.length > 0) {
      return item.source;
    }
  }
  return [];
};

const DetailTable: React.FC<IProps> = (props) => {
  if (props.forms.length < 1) return <></>;
  const form = props.forms[0];
  if (!props.data.fields[form.id]) return <></>;
  const fields = props.data.fields[form.id];
  const [selectKeys, setSelectKeys] = useState<string[]>([]);
  const [dataSource, setDataSource] = useState(parseLastSource(props.data.data[form.id]));
  useEffect(() => {
    props.onChanged?.apply(this, [
      form.id,
      {
        source: dataSource,
        changed: {},
        nodeId: props.node.id,
        creator: props.belong.userId,
        createTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
      },
    ]);
  }, [dataSource]);
  return (
    <GenerateTable
      form={form}
      fields={fields}
      autoColumn
      height={600}
      dataIndex={'attribute'}
      columnChooser={{ enabled: true }}
      selection={{
        mode: 'multiple',
        allowSelectAll: true,
        selectAllMode: 'allPages',
        showCheckBoxesMode: 'always',
      }}
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
                    setDataSource([...dataSource, values]);
                  },
                });
              },
            },
            visible: props.allowEdit && props.data.allowAdd,
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
                    setDataSource(
                      dataSource.map((d) => {
                        if (selectKeys.includes(d.Id)) {
                          Object.keys(values).forEach((k) => {
                            d[k] = values[k];
                          });
                        }
                        return d;
                      }),
                    );
                  },
                });
              },
            },
            visible: props.allowEdit && props.data.allowEdit && selectKeys.length > 0,
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
                    const keys = dataSource.map((i) => i.Id);
                    setDataSource([
                      ...dataSource,
                      ...values.filter((i) => !keys.includes(i.Id)),
                    ]);
                  },
                });
              },
            },
            visible: props.allowEdit && props.data.allowSelect,
          },
          {
            name: 'remove',
            location: 'after',
            widget: 'dxButton',
            options: {
              text: '移除',
              icon: 'remove',
              onClick: () => {
                setDataSource(dataSource.filter((i) => !selectKeys.includes(i.Id)));
                setSelectKeys([]);
              },
            },
            visible: selectKeys.length > 0,
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
      dataSource={dataSource}
      hideColumns={['Creater', 'CreateTime', 'ModifiedTime']}
    />
  );
};

const DetailForms: React.FC<IProps> = (props) => {
  if (props.forms.length < 1) return <></>;
  const [activeTabKey, setActiveTabKey] = useState(props.forms[0].id);
  const loadItems = () => {
    return props.forms.map((f) => {
      return {
        key: f.id,
        label: f.name,
        children: <DetailTable {...props} forms={[f]} />,
      };
    });
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
