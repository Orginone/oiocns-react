import OioForm from '@/bizcomponents/FormDesign/OioForm';
import { XForm, XProperty } from '@/ts/base/schema';
import Thing from '@/pages/Store/content/Thing/Thing';

import {
  ProColumns,
  ProSchemaValueEnumObj,
  ProTable,
  ProTableProps,
} from '@ant-design/pro-components';
import type { ParamsType } from '@ant-design/pro-provider';
import { Button, Modal } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { deepClone } from '@/ts/base/common';
import { columns } from '@/bizcomponents/Indentity/config';
import { kernel } from '@/ts/base';
import orgCtrl from '@/ts/controller';
interface IProps {
  labels: string[];
  propertys: XProperty[];
  belongId: string;
  selectable?: boolean;
  height?: any;
  width?: any;
  dataSource?: any;
  setRows?: (data: any) => void;
  current: any;
  onListChange?: Function;
  formInfo: any;
}

const ColTypes: Map<string, string> = new Map([
  ['描述型', 'text'],
  ['用户型', 'select'],
  ['选择型', 'select'],
  ['数值型', 'digit'],
  ['时间型', 'dateTime'],
  ['日期型', 'date'],
  // ['金额', 'money'],
  // ['文本域', 'textarea'],
  // ['周', 'dateWeek'],
  // ['月', 'dateMonth'],
  // ['季度', 'dateQuarter'],
  // ['年份', 'dateYear'],
  // ['日期区间', 'dateRange'],
  // ['日期时间区间', 'dateTimeRange'],
  // ['时间', 'time'],
  // ['时间区间', 'timeRange'],
  // ['树形下拉框', 'treeSelect'],
  // ['多选框', 'checkbox'],
  // ['星级组件', 'rate'],
  // ['单选框', 'radio	'],
  // ['进度条', 'progress'],
  // ['秒格式化', 'second'],
  // ['代码框', 'code'],
  // ['图片', 'image'],
  // ['颜色', 'color'],
]);
const defaultCol = [
  { id: 'Id', name: '标识', valueType: '描述型' },
  { id: 'Creater', name: '创建者', valueType: '用户型' },
  {
    id: 'Status',
    name: '状态',
    valueType: '选择型',
    valueEnum: {
      正常: { text: '正常', status: 'Success' },
      已销毁: {
        text: '已销毁',
        status: 'Default',
      },
    },
  },
  { id: 'CreateTime', name: '创建时间', valueType: '时间型' },
  { id: 'ModifiedTime', name: '修改时间', valueType: '时间型' },
];
const ThingTable = <
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text',
>(
  props: ProTableProps<DataType, Params, ValueType> & IProps,
) => {
  // const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const {
    belongId,
    propertys,
    dataSource,
    current,
    formInfo,
    labels,
    setRows,
    onListChange,
  } = props;

  const [thingList, setThingList] = useState<any[]>(deepClone(dataSource ?? []));
  const [form, setForm] = useState<XForm>();
  const [operateModel, setOperateModel] = useState<string>();
  const [editData, setEditData] = useState<any>({});
  const [newData, setNewData] = useState<any>({});
  const defaultColumnStateMap: any = {
    ModifiedTime: {
      width: 100,
      show: false,
    },
    CreateTime: {
      show: false,
    },
  };
  const getColumns: () => ProColumns<any>[] = () => {
    let columns: ProColumns<any>[] = [];

    columns = defaultCol.map((item) => {
      return getColItem(item as any);
    });
    for (const p of props.propertys) {
      // columns.push(
      // getColumn(
      //   p.id,
      //   p.name,
      //   p.valueType,
      //   `Propertys.${p.code}`,
      //   p.dict?.dictItems || [],
      // ),
      // );

      columns.push(getColItem(p as any));
    }
    columns.push({
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (_text, record, _, _action) => [
        <a
          key="editable"
          onClick={() => {
            setEditData(record);
            setForm(formInfo);
            setOperateModel('edit');
          }}>
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setThingList(thingList.filter((item) => item.Id !== record.Id));
          }}>
          删除
        </a>,
      ],
    });

    return columns;
  };
  const getColItem = (
    col: {
      attrId: string;
      valueEnum: Object | undefined;
    } & XProperty,
  ) => {
    const { id, attrId, name, valueType = '描述型', valueEnum = undefined } = col;
    const width = name.length * 30 > 80 ? name.length * 30 : 80;

    let ColItem: ProColumns<any> = {
      title: name,
      key: id,
      dataIndex: attrId ?? id,
      width: width,
      valueType: ColTypes.get(valueType) as 'text',
      valueEnum: valueEnum as ProSchemaValueEnumObj,
    };

    switch (valueType) {
      case '用户型':
        {
          ColItem.render = (text: ReactNode, _record: any) => {
            if (text) {
              let share = orgCtrl.user.findShareById(text as string);

              return (
                <>
                  <TeamIcon share={share} size={15} />
                  <span style={{ marginLeft: 10 }}>{share.name}</span>
                </>
              );
            }
            return <span>-</span>;
          };
        }
        break;
      case '选择型':
        break;

      default:
        break;
    }
    return ColItem;
  };
  const submitCurrentTableData = () => {
    let colStr = columns;
    // 删除 操作一栏
    colStr.pop();
    onListChange && onListChange(formInfo.id, thingList, JSON.stringify(colStr));
  };

  useEffect(() => {
    // 当修改操作执行后 弹出数据
    if (operateModel == '') {
      setTimeout(() => {
        submitCurrentTableData();
      }, 100);
    }
  }, [operateModel]);

  const handleModalDataChange = async (type: 'edit' | 'editMore' | 'add') => {
    switch (type) {
      case 'add':
        {
          let res = await kernel.anystore.createThing(orgCtrl.user.id, 1);
          let newD = {};
          const { success, data = [] }: any = res;
          if (success && data.length > 0) {
            newD = { ...data[0], ...newData };
          }
          console.log('42142', newD);
          setThingList([newD, ...thingList]);
        }
        break;
      case 'edit':
        {
          const newDataSource = thingList.map((item) => {
            ((item.Id && item.Id === editData.Id) || item.hid_id === editData.hid_id) &&
              (item = {
                ...item,
                ...newData,
              });

            return item;
          });
          setThingList(newDataSource);
        }
        break;
      case 'editMore':
        {
          const newDataSource = thingList.map((item) => {
            return {
              ...item,
              ...newData,
            };
          });
          setThingList(newDataSource);
        }
        break;

      default:
        break;
    }
    setOperateModel('');
    setForm(undefined);
  };
  return (
    <>
      <ProTable<any>
        rowKey="id"
        size="small"
        scroll={{
          x: 1200,
        }}
        search={false}
        dataSource={thingList}
        headerTitle={'实体类'}
        columnsState={{
          defaultValue: { ...defaultColumnStateMap },
          persistenceKey: 'thingTable' + formInfo.id,
          persistenceType: 'localStorage',
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="default"
            onClick={() => {
              setForm(formInfo);
              setOperateModel('editMore');
            }}>
            批量修改
          </Button>,
          <Button
            key="1"
            type="default"
            onClick={() => {
              setForm(formInfo);
              setOperateModel('add');
            }}>
            新增{formInfo.name}
          </Button>,
          <Button
            key="2"
            type="default"
            onClick={() => {
              setForm(formInfo);
              setOperateModel('select');
            }}>
            选择{formInfo.name}
          </Button>,
        ]}
        columns={getColumns()}
      />
      <>
        {form &&
          (operateModel === 'add' ||
            operateModel === 'editMore' ||
            operateModel === 'edit') && (
            <Modal
              open={true}
              onOk={async () => {
                await handleModalDataChange(operateModel);
              }}
              onCancel={() => {
                setOperateModel('');
                setForm(undefined);
              }}
              destroyOnClose={true}
              cancelText={'关闭'}
              width={1000}>
              <OioForm
                form={form}
                define={current}
                fieldsValue={operateModel === 'edit' ? editData : undefined}
                onValuesChange={(_changeValue, values) => setNewData(values)}
                noRule={true}
              />
            </Modal>
          )}
        {form && operateModel === 'select' && (
          <Modal
            open={true}
            onOk={() => {}}
            onCancel={() => {
              setOperateModel('');
              setForm(undefined);
            }}
            destroyOnClose={true}
            cancelText={'关闭'}
            width={1000}>
            <Thing
              keyExpr="Id"
              height={500}
              selectable
              labels={labels}
              propertys={propertys}
              onSelected={setRows}
              belongId={belongId}
            />
          </Modal>
        )}
      </>
    </>
  );
};
export default ThingTable;
