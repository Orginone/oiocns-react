import OioForm from '@/bizcomponents/FormDesign/OioForm';
import { XForm, XProperty } from '@/ts/base/schema';
import Thing from '@/pages/Store/content/Thing/Thing';

import {
  EditableFormInstance,
  ProColumns,
  ProFormInstance,
  EditableProTable,
  ProForm,
} from '@ant-design/pro-components';
import type { EditableProTableProps } from '@ant-design/pro-components/es/index';
import type { ParamsType } from '@ant-design/pro-provider';
import { Button, Modal } from 'antd';
import React, { useRef, useState } from 'react';
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
    ID: '624748504',
    name: '活动名称一',
    decs: '这个活动真好玩',
    Creater: 'open',
    Status: '正常',
    CreateTime: '1590486176000',
    ModifiedTime: '1590486176000',
  },
  {
    ID: '624691229',
    name: '活动名称二',
    decs: '这个活动真好玩',
    Creater: 'closed',
    Status: '已销毁',
    CreateTime: '1590481162000',
    ModifiedTime: '1590481162000',
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
let i = 0;

const ThingTable = <
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text',
>(
  props: EditableProTableProps<DataType, Params, ValueType> & IProps,
) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const formRef = useRef<ProFormInstance<any>>();
  const editorFormRef = useRef<EditableFormInstance<any>>();
  const [form, setForm] = useState<XForm>();
  const [operateModel, setOperateModel] = useState<string>();

  const { belongId, propertys, current, formInfo, labels, setRows } = props;

  const getColumns: () => ProColumns<any>[] = () => {
    let columns: ProColumns<any>[] = [];
    const defaultCol = [
      { id: 'ID', name: '标识', valueType: '描述型' },
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

      const { id, name, valueType, valueEnum = undefined } = p;
      const width = name.length * 30 > 80 ? name.length * 30 : 80;
      columns.push({
        title: name,
        key: id,
        dataIndex: id,
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
            action?.startEditable?.(record.id);
          }}>
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            const tableDataSource = formRef.current?.getFieldValue('table') as any[];
            formRef.current?.setFieldsValue({
              table: tableDataSource.filter((item) => item.id !== record.id),
            });
          }}>
          删除
        </a>,
      ],
    });
    return columns;
  };

  return (
    <>
      <ProForm<{
        table: any[];
      }>
        formRef={formRef}
        initialValues={{
          table: defaultData,
        }}
        validateTrigger="onBlur">
        <EditableProTable<any>
          rowKey="id"
          size="small"
          scroll={{
            x: 1200,
          }}
          editableFormRef={editorFormRef}
          headerTitle={'可编辑表格'}
          maxLength={5}
          name="table"
          recordCreatorProps={false}
          toolBarRender={() => [
            <Button
              key="1"
              type="default"
              onClick={() => {
                setForm(formInfo);
                setOperateModel('add');
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
          editable={{
            type: 'multiple',
            editableKeys,
            onChange: setEditableRowKeys,
            actionRender: (row, config, defaultDom) => {
              return [
                defaultDom.save,
                defaultDom.delete || defaultDom.cancel,
                <a
                  key="set"
                  onClick={() => {
                    i++;
                    editorFormRef.current?.setRowData?.(config.index!, {
                      title: '动态设置的title' + i,
                    });
                  }}>
                  动态设置此行
                </a>,
              ];
            },
          }}
        />
      </ProForm>
      <>
        {' '}
        {form && operateModel === 'add' && (
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
            <OioForm form={form} define={current} />
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
              height={500}
              selectable
              labels={[labels]}
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
