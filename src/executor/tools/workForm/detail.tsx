import { model, schema } from '../../../ts/base';
import { IBelong } from '@/ts/core';
import { useEffect, useState } from 'react';
import React from 'react';
import { Tabs } from 'antd';
import { EditModal } from '../editModal';
import GenerateTable from '../generate/table';
import { ImCancelCircle, ImPencil2 } from 'react-icons/im';
import { formatDate } from '@/utils';

interface IProps {
  allowEdit: boolean;
  belong: IBelong;
  forms: schema.XForm[];
  data: model.InstanceDataModel;
  onChanged?: (id: string, data: model.FormEditData) => void;
}

const parseLastSource = (data: model.InstanceDataModel, id: string) => {
  if (data.data[id] && data.data[id].length > 0) {
    const item = data.data[id].slice(-1)[0];
    if (item.source && item.source.length > 0) {
      return item.source;
    }
  }
  return [];
};

const DetailTable: React.FC<IProps> = (props) => {
  const form = props.forms[0];
  const [selectKeys, setSelectKeys] = useState<string[]>([]);
  const [dataSource, setDataSource] = useState(parseLastSource(props.data, form.id));
  useEffect(() => {
    props.onChanged?.apply(this, [
      form.id,
      {
        source: dataSource,
        changed: {},
        creator: props.belong.userId,
        createTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
      },
    ]);
  }, [dataSource]);
  return (
    <GenerateTable
      form={form}
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
                  belong: props.belong,
                  selected: dataSource.map((i) => i.Id),
                  onSave: (values) => {
                    setDataSource([...dataSource, ...values]);
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
      dataMenus={{
        items: [
          {
            key: 'remove',
            icon: <ImCancelCircle fontSize={22} color={'#9498df'} />,
            label: '移除',
          },
          {
            key: 'edit',
            icon: <ImPencil2 fontSize={22} color={'#9498df'} />,
            label: '变更',
          },
        ],
        onMenuClick(key, data) {
          switch (key) {
            case 'edit':
              EditModal.showFormEdit({
                form: form,
                belong: props.belong,
                create: false,
                initialValues: data,
                onSave(values) {
                  setDataSource(
                    dataSource.map((d) => {
                      if (d.Id === data.Id) {
                        Object.keys(values).forEach((k) => {
                          d[k] = values[k];
                        });
                      }
                      return d;
                    }),
                  );
                },
              });
              break;
            case 'remove':
              setDataSource(dataSource.filter((i) => i.Id != data.Id));
              break;
          }
        },
      }}
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
