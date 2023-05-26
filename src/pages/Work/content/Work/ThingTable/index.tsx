import OioForm from '@/bizcomponents/FormDesign/OioForm';
import { XForm, XProperty } from '@/ts/base/schema';
import Thing from '@/pages/Store/content/Thing/Thing';

import { ProColumns, ProTable } from '@ant-design/pro-components';
import type { EditableProTableProps } from '@ant-design/pro-components/es/index';
import type { ParamsType } from '@ant-design/pro-provider';
import { Button, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { getUuid } from '@/utils/tools';
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
  editingTool?: any;
  toolBarItems?: any[];
  dataSource?: any;
  byIds?: string[];
  deferred?: boolean;
  setGridInstance?: Function;
  onBack?: () => void;
  setThingId?: (thingId: string) => void;
  scrolling?: boolean;
  keyExpr?: string;
  onSelected?: (data: any[]) => void;
}

const defaultData: any[] = [
  {
    Id: '624748504',
    name: '活动名称一',
    decs: '这个活动真好玩',
    Creater: 'open',
    Status: '正常',
    CreateTime: '1590486176000',
    ModifiedTime: '1590486176000',
    '449928777586315264': 123,
  },
  {
    Id: '624691229',
    name: '活动名称二',
    decs: '这个活动真好玩',
    Creater: 'closed',
    Status: '已销毁',
    CreateTime: '1590481162000',
    ModifiedTime: '1590481162000',
    '449928777586315264': '哈哈哈哈',
  },
];
const ColTypes: Map<string, string> = new Map([
  ['描述型', 'text'],
  ['用户型', 'select'],
  ['选择型', 'select'],
  ['数值型', 'digit'],
  ['时间型', 'dateTime'],
  ['日期型', 'date'],
  ['金额', 'money'],
  ['文本域', 'textarea'],
  ['周', 'dateWeek'],
  ['月', 'dateMonth'],
  ['季度', 'dateQuarter'],
  ['年份', 'dateYear'],
  ['日期区间', 'dateRange'],
  ['日期时间区间', 'dateTimeRange'],
  ['时间', 'time'],
  ['时间区间', 'timeRange'],
  ['树形下拉框', 'treeSelect'],
  ['多选框', 'checkbox'],
  ['星级组件', 'rate'],
  ['单选框', 'radio	'],
  ['进度条', 'progress'],
  ['秒格式化', 'second'],
  ['代码框', 'code'],
  ['图片', 'image'],
  ['颜色', 'color'],
]);

const ThingTable = <
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text',
>(
  props: EditableProTableProps<DataType, Params, ValueType> & IProps,
) => {
  // const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const [dataSource, setDataSource] = useState<any[]>(deepClone(defaultData));
  const [form, setForm] = useState<XForm>();
  const [operateModel, setOperateModel] = useState<string>();
  const [editData, setEditData] = useState<any>({});
  const [newData, setNewData] = useState<any>({});
  const { belongId, propertys, current, formInfo, labels, setRows, onChange } = props;

  const getColumns: () => ProColumns<any>[] = () => {
    let columns: ProColumns<any>[] = [];
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

    columns = defaultCol.map((item) => {
      const { id, name, valueType, valueEnum = {} } = item;
      const width = name.length * 30 > 80 ? name.length * 30 : 80;
      return {
        title: name,
        key: id,
        dataIndex: id,
        valueType: ColTypes.get(valueType),
        valueEnum: valueEnum,
        width: width,
      } as ProColumns<any>;
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

      const { id, attrId, name, valueType, valueEnum = undefined } = p;
      const width = name.length * 30 > 80 ? name.length * 30 : 80;
      columns.push({
        title: name,
        key: id,
        dataIndex: attrId,
        width: width,
        valueType: ColTypes.get(valueType) ?? 'text',
        valueEnum: valueEnum,
      } as ProColumns<any>);
    }
    columns.push({
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
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
            setDataSource(dataSource.filter((item) => item.Id !== record.Id));
          }}>
          删除
        </a>,
      ],
    });

    return columns;
  };

  const submitCurrentTableData = () => {
    let colStr = columns;
    colStr.pop();
    onChange && onChange(formInfo.id, dataSource, JSON.stringify(colStr));
  };

  useEffect(() => {
    // 当修改操作执行后
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
          setDataSource([newD, ...dataSource]);
        }
        break;
      case 'edit':
        {
          const newDataSource = dataSource.map((item) => {
            ((item.Id && item.Id === editData.Id) || item.hid_id === editData.hid_id) &&
              (item = {
                ...item,
                ...newData,
              });

            return item;
          });
          setDataSource(newDataSource);
        }
        break;
      case 'editMore':
        {
          const newDataSource = dataSource.map((item) => {
            return {
              ...item,
              ...newData,
            };
          });
          setDataSource(newDataSource);
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
        dataSource={dataSource}
        headerTitle={'实体类'}
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
