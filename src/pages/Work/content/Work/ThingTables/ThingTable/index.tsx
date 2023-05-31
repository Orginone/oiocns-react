import OioForm from '@/bizcomponents/FormDesign/OioForm';
import { XForm, XProperty } from '@/ts/base/schema';
import { ProColumnType, ProTableProps } from '@ant-design/pro-components';
import type { ParamsType } from '@ant-design/pro-provider';
import { Button, Modal } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import { kernel } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { submitCurrentTableData } from '../funs';
import { ModalNames, toolBtnsType } from '../config';
import BaseThing from '../BaseThing';
import SelectThing from '../TreeSelectThing';

interface IProps {
  labels: string[];
  propertys: XProperty[];
  belongId: string;
  selectable?: boolean;
  height?: any;
  width?: any;
  readonly?: boolean; //只读表单，隐藏操作区，配置区
  setSelectedRows?: (data: any) => void;
  current?: any;
  onListChange?: Function;
  formInfo?: any; //传进来的 表单基本信息
  defaultColums?: any[]; //传进来的 表头设置
  toolBtnItems?: toolBtnsType;
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
    dataSource = [],
    // defaultColums,
    current,
    formInfo,
    labels,
    onListChange,
    readonly,
    toolBtnItems = [],
    ...rest
  } = props;

  const [thingList, setThingList] = useState<any[]>(dataSource as []);
  const [form, setForm] = useState<XForm>();
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [operateModel, setOperateModel] = useState<
    'Edit' | 'EditMore' | 'Add' | 'Select' | ''
  >();
  const [EditData, setEditData] = useState<any>({});
  const [changeData, setChangeData] = useState<any>({});
  const defaultColumnStateMap: any = {
    ModifiedTime: {
      width: 100,
      show: false,
    },
    CreateTime: {
      show: false,
    },
  };

  const Operation: ProColumnType<any> = {
    title: '操作',
    valueType: 'option',
    width: 200,
    render: (_text, record, _, _action) => [
      <a
        key="Editable"
        onClick={() => {
          const { EDIT_INFO = {}, ...rest } = record;
          setEditData({ ...rest, ...EDIT_INFO });
          setForm(formInfo);
          setOperateModel('Edit');
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
  };

  useEffect(() => {
    // 监听实体选择
    if (selectedRows.length > 0) {
      setThingList([...selectedRows, ...thingList]);
    }
  }, [selectedRows]);
  useEffect(() => {
    // 监听展示数据变化。弹出数据给父级
    setTimeout(() => {
      submitCurrentTableData(formInfo.id, thingList, propertys, onListChange);
    }, 100);
  }, [thingList]);
  // 触发弹窗 关闭事件
  const handleModalDataChange = async (type: 'Edit' | 'EditMore' | 'Add') => {
    switch (type) {
      case 'Add':
        {
          if (Object.keys(changeData).length == 0) {
            break;
          }
          let res = await kernel.anystore.createThing(orgCtrl.user.id, 1);
          const { success, data = [] }: any = res;
          if (success && data.length > 0) {
            const _Data = { ...data[0], EDIT_INFO: changeData };
            setThingList([_Data, ...thingList]);
          }
        }
        break;
      case 'Edit':
        {
          const _DataSource = thingList.map((item) => {
            item.Id === EditData.Id &&
              (item = {
                ...item,
                EDIT_INFO: { ...(item?.EDIT_INFO ?? {}), ...changeData },
              });

            return item;
          });
          setThingList(_DataSource);
        }
        break;
      case 'EditMore':
        {
          const _DataSource = thingList.map((item) => {
            return {
              ...item,
              EDIT_INFO: { ...(item?.EDIT_INFO ?? {}), ...changeData },
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
  // 获取自定义按钮组
  const HandleToolBarRender: () => ReactNode[] = () => {
    const dom: ReactNode[] = toolBtnItems.map((item, idx) => {
      if (typeof item == 'string') {
        return (
          <Button
            key={idx}
            type="default"
            style={{ maxWidth: '100px', textOverflow: 'ellipsis', overflow: 'hidden' }}
            onClick={() => {
              setForm(formInfo);
              setChangeData({});
              setOperateModel(item as 'Edit');
            }}>
            {ModalNames.get(item) ?? '--'}
            {formInfo.name}
          </Button>
        );
      }
      return item as ReactNode;
    });
    return dom;
  };
  return (
    <>
      <BaseThing
        Operation={Operation}
        propertys={propertys}
        rowKey={rowKey}
        key={thingList.length}
        tooltip="蓝色字体为修改值，鼠标悬浮时展示修改前的值"
        size="small"
        dataSource={[...thingList]}
        headerTitle={headerTitle}
        columnsState={{ ...defaultColumnStateMap }}
        toolBarRender={readonly ? undefined : (HandleToolBarRender as any)}
        {...rest}
      />
      <>
        {form &&
          current &&
          (operateModel === 'Add' ||
            operateModel === 'EditMore' ||
            operateModel === 'Edit') && (
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
                fieldsValue={operateModel === 'Edit' ? EditData : undefined}
                onValuesChange={(_changeValue, values) => setChangeData(values)}
                noRule={operateModel.includes('Edit')}
              />
            </Modal>
          )}
        {form && operateModel === 'Select' && (
          <Modal
            open={true}
            onOk={() => {}}
            onCancel={() => {
              setOperateModel('');
              setForm(undefined);
            }}
            bodyStyle={{ minHeight: '600px' }}
            destroyOnClose={true}
            cancelText={'关闭'}
            width={'1200px'}>
            <SelectThing
              pageType="tree"
              selectable
              labels={labels}
              current={current}
              propertys={propertys}
              onRowSelectChange={setSelectedRows}
              belongId={belongId}
            />
            {/* <Thing
              keyExpr="Id"
              height={500}
              selectable
              labels={labels}
              propertys={propertys}
              onSelected={setSelectedRows
}
              belongId={belongId}
            /> */}
          </Modal>
        )}
      </>
    </>
  );
};
export default ThingTable;
