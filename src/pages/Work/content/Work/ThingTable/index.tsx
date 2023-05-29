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
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { deepClone } from '@/ts/base/common';
import { columns } from '@/bizcomponents/Indentity/config';
import { kernel } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { GetRowKey } from 'antd/es/table/interface';
import cls from './index.module.less';
import { debounce } from '@/utils/tools';

interface IProps {
  rowKey?: string | GetRowKey<any>;
  headerTitle?: string | ReactNode;
  labels: string[];
  propertys: XProperty[];
  belongId: string;
  selectable?: boolean;
  height?: any;
  width?: any;
  dataSource?: any; //传进来的 展示数据
  readonly?: boolean; //只读表单，隐藏操作区，配置区
  setRows?: (data: any) => void;
  current: any;
  onListChange?: Function;
  formInfo: any; //传进来的 表单基本信息
  defaultColums?: any[]; //传进来的 表头设置
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
    rowKey = 'Id',
    headerTitle = '实体类',
    belongId,
    propertys,
    dataSource,
    defaultColums,
    current,
    formInfo,
    labels,
    setRows,
    onListChange,
    readonly,
  } = props;

  const [thingList, setThingList] = useState<any[]>(deepClone(dataSource));
  // const [thingList, setThingList] = useState<any[]>(deepClone(defaultData));
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
      render(text: any, _record: any) {
        if (_record?.EDIT_INFO?.[attrId]) {
          return (
            <span style={{ color: '#154ad8' }} title={`修改前：${text}`}>
              {_record?.EDIT_INFO?.[attrId]}
            </span>
          );
        }
        return <>{text}</>;
      },
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
  const getColumns: any = useCallback(() => {
    let columns: ProColumns<any>[] = [];

    columns = defaultCol.map((item) => {
      return getColItem(item as any);
    });
    for (const p of propertys) {
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
    !readonly &&
      columns.push({
        title: '操作',
        valueType: 'option',
        width: 200,
        render: (_text, record, _, _action) => [
          <a
            key="editable"
            onClick={() => {
              const { EDIT_INFO = {}, ...rest } = record;
              setEditData({ ...rest, ...EDIT_INFO });
              setForm(formInfo);
              setOperateModel('edit');
            }}>
            变更
          </a>,
          <a
            key="delete"
            onClick={() => {
              setThingList(thingList.filter((item) => item.Id !== record.Id));
            }}>
            移除
          </a>,
        ],
      });
    return columns;
  }, [thingList, readonly]);
  const submitCurrentTableData = debounce(() => {
    // const colStr = getColumns().map((v: any) => {
    //   const { id, attrId, name, valueType, valueEnum } = v;
    //   return {
    //     id,
    //     attrId,
    //     name,
    //     valueType,
    //     valueEnum,
    //   };
    // });
    // 删除 操作一栏
    const JsonData = {
      data: thingList,
      columns: getColumns().filter((v: ProColumns<any>) => v.valueType !== 'option'),
    };

    onListChange && onListChange(formInfo.id, thingList, JSON.stringify(JsonData));
  }, 100);
  useEffect(() => {
    // 当修改操作执行后 弹出数据
    submitCurrentTableData();
  }, [thingList]);

  // useEffect(() => {
  //   // 当修改操作执行后 弹出数据
  //   if (operateModel == '') {
  //     setTimeout(() => {
  //       submitCurrentTableData();
  //     }, 100);
  //   }
  // }, [operateModel, thingList]);

  const handleModalDataChange = async (type: 'edit' | 'editMore' | 'add') => {
    switch (type) {
      case 'add':
        {
          if (Object.keys(newData).length == 0) {
            break;
          }
          let res = await kernel.anystore.createThing(orgCtrl.user.id, 1);
          let newD = {
            isNew: true,
            EDIT_INFO: {},
          };
          const { success, data = [] }: any = res;
          if (success && data.length > 0) {
            newD = { ...data[0], EDIT_INFO: newData };
          }
          setThingList([newD, ...thingList]);
        }
        break;
      case 'edit':
        {
          const newDataSource = thingList.map((item) => {
            item.Id === editData.Id &&
              (item = {
                ...item,
                EDIT_INFO: { ...(item?.EDIT_INFO ?? {}), ...newData },
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
              EDIT_INFO: { ...(item?.EDIT_INFO ?? {}), ...newData },
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
        rowKey={rowKey}
        tooltip="蓝色字体为修改值，鼠标悬浮时展示修改前的值"
        size="small"
        scroll={{
          x: columns.length * 100,
        }}
        cardProps={{
          className: cls.thingTable,
        }}
        // 紧凑模式-刷新-表头显示操作
        options={readonly ? false : undefined}
        search={false}
        dataSource={thingList}
        headerTitle={headerTitle}
        //根据formInfo.id 设置默认表头设置--保存在localStorage下
        columnsState={
          readonly
            ? undefined
            : {
                defaultValue: { ...defaultColumnStateMap },
                persistenceKey: 'thingTable' + formInfo.id,
                persistenceType: 'localStorage',
              }
        }
        toolBarRender={
          readonly
            ? undefined
            : () => [
                <Button
                  key="1"
                  type="default"
                  onClick={() => {
                    setForm(formInfo);
                    setNewData({});
                    setOperateModel('editMore');
                  }}>
                  批量修改
                </Button>,
                <Button
                  key="1"
                  type="default"
                  onClick={() => {
                    setForm(formInfo);
                    setNewData({});
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
              ]
        }
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
