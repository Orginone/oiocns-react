import OioForm from '@/bizcomponents/FormDesign/OioForm';
import { XForm, XProperty } from '@/ts/base/schema';
import Thing from '@/pages/Store/content/Thing/Thing';

import { ProColumns, ProTable, ProTableProps } from '@ant-design/pro-components';
import type { ParamsType } from '@ant-design/pro-provider';
import { Button, Modal } from 'antd';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { deepClone } from '@/ts/base/common';
import { columns } from '@/bizcomponents/Indentity/config';
import { kernel } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { GetRowKey } from 'antd/es/table/interface';
import cls from './index.module.less';
import { getColItem, submitCurrentTableData } from './funs';
import { defaultCol } from './config';
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

const ThingTable = <
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text',
>(
  props: ProTableProps<DataType, Params, ValueType> & IProps,
) => {
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

  const getColumns: any = useCallback(() => {
    let columns: ProColumns<any>[] = defaultCol.map((item: any) => {
      return getColItem(item);
    });

    for (const p of propertys) {
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

  useEffect(() => {
    // 当修改操作执行后 弹出数据
    submitCurrentTableData(formInfo.id, thingList, getColumns(), onListChange);
  }, [thingList]);

  const handleModalDataChange = async (type: 'edit' | 'editMore' | 'add') => {
    switch (type) {
      case 'add':
        {
          if (Object.keys(newData).length == 0) {
            break;
          }
          let res = await kernel.anystore.createThing(orgCtrl.user.id, 1);
          const { success, data = [] }: any = res;
          if (success && data.length > 0) {
            const _Data = { ...data[0], EDIT_INFO: newData };
            setThingList([_Data, ...thingList]);
          }
        }
        break;
      case 'edit':
        {
          const _DataSource = thingList.map((item) => {
            item.Id === editData.Id &&
              (item = {
                ...item,
                EDIT_INFO: { ...(item?.EDIT_INFO ?? {}), ...newData },
              });

            return item;
          });
          setThingList(_DataSource);
        }
        break;
      case 'editMore':
        {
          const _DataSource = thingList.map((item) => {
            return {
              ...item,
              EDIT_INFO: { ...(item?.EDIT_INFO ?? {}), ...newData },
            };
          });
          setThingList(_DataSource);
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
                noRule={operateModel.includes('edit')}
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
