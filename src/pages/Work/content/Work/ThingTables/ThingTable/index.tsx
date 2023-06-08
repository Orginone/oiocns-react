import OioForm from '@/bizcomponents/FormDesign/OioFormNext';
import { ProColumnType, ProTableProps } from '@ant-design/pro-components';
import type { ParamsType } from '@ant-design/pro-provider';
import { Button, Modal } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import { kernel, schema } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { MakePropertysToAttrMap, submitCurrentTableData } from '../Function';
import { toolBtnsType, OperateType } from '../const';
import BaseThing from '../BaseThing';
import SelectThing from '../TreeSelectThing';

interface IProps {
  propertys: schema.XProperty[];
  belongId: string;
  selectable?: boolean;
  height?: any;
  width?: any;
  readonly?: boolean; //只读表单，隐藏操作区，配置区
  setSelectedRows?: (data: any) => void;
  current?: any;
  onListChange?: Function;
  form?: schema.XForm; //传进来的 表单基本信息
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
    belongId,
    propertys,
    dataSource = [],
    // defaultColums,
    current,
    form,
    onListChange,
    toolBtnItems = [],
    ...rest
  } = props;

  const [thingList, setThingList] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [operateModel, setOperateModel] = useState<OperateType>('' as OperateType.Add);
  const [selectedData, setSelectedData] = useState<any>({});
  const [changeData, setChangeData] = useState<any>({});
  const keyMap: Map<string, string> = MakePropertysToAttrMap(propertys);
  useEffect(() => {
    setThingList(dataSource as any[]);
  }, [dataSource]);
  if (!form) {
    return <></>;
  }

  const Operation: ProColumnType<any> = {
    title: '操作',
    valueType: 'option',
    width: 100,
    render: (_text, record, _, _action) => [
      <a
        key="Editable"
        onClick={() => {
          const { EDIT_INFO = {}, ...rest } = record;
          setSelectedData({ ...rest, ...EDIT_INFO });
          setOperateModel(OperateType.Edit);
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

  // 处理实体表选择事件
  useEffect(() => {
    // 监听实体选择 将实体属性转为表格展示特性
    if (selectedRows.length > 0) {
      const thingListIds = thingList.map((v) => v.Id);
      const newThings = selectedRows.filter(
        (v: { id: string }) => !thingListIds.includes(v.id),
      );
      setThingList([...newThings, ...thingList]);
    }
  }, [selectedRows]);

  // 监听展示数据变化。弹出数据给父级
  useEffect(() => {
    submitCurrentTableData(form, thingList, propertys, onListChange);
  }, [thingList]);

  // 触发弹窗 关闭事件
  const handleModalDataChange = async (type: OperateType) => {
    switch (type) {
      case OperateType.Add:
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
      case OperateType.Edit:
        {
          const _DMData: { [key: string]: any } = {};
          const _DataSource = thingList.map((item) => {
            if (item.Id === selectedData.Id) {
              Object.keys(changeData).forEach((keyStr: string) => {
                if (changeData[keyStr] !== item[keyStr]) {
                  _DMData[keyStr] = changeData[keyStr];
                }
              });
              item = {
                ...item,
                EDIT_INFO: { ...(item?.EDIT_INFO ?? {}), ..._DMData },
              };
            }

            return item;
          });
          setThingList(_DataSource);
        }
        break;
      case OperateType.EditMore:
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
    setOperateModel('' as OperateType.Add);
  };
  // 获取自定义按钮组 默认三项 +可以定义Dom
  const HandleToolBarRender: () => ReactNode[] = () => {
    const dom: ReactNode[] = toolBtnItems.map((item, idx) => {
      if (typeof item == 'string') {
        return (
          <Button
            key={idx}
            type="default"
            style={{ maxWidth: '150px', textOverflow: 'ellipsis', overflow: 'hidden' }}
            onClick={() => {
              setChangeData({});
              setSelectedData({});
              setOperateModel(item as OperateType.Add);
            }}>
            {item ?? '--'}
          </Button>
        );
      }
      return item as ReactNode;
    });
    return dom;
  };

  return (
    <>
      {/* 实体表格区域 */}
      <BaseThing
        Operation={Operation}
        propertys={propertys}
        rowKey={rowKey}
        key={thingList.length}
        dataSource={[...thingList]}
        toolBarRender={HandleToolBarRender}
        {...rest}
      />
      {/* 弹窗区域 */}
      <>
        {current && (
          <Modal
            open={[OperateType.Add, OperateType.Edit, OperateType.EditMore].includes(
              operateModel,
            )}
            onOk={async () => {
              await handleModalDataChange(operateModel);
            }}
            onCancel={() => {
              setOperateModel('' as OperateType.Add);
            }}
            destroyOnClose={true}
            cancelText={'关闭'}
            width={1000}>
            <OioForm
              form={form}
              belong={current.workItem.belong}
              fieldsValue={operateModel === OperateType.Edit ? selectedData : undefined}
              onValuesChange={(_changeValue, values) => setChangeData(values)}
              noRule={operateModel.includes('Edit')}
            />
          </Modal>
        )}
        {current && (
          <Modal
            open={operateModel === OperateType.Select}
            onOk={() => {
              setOperateModel('' as OperateType.Add);
            }}
            onCancel={() => {
              setOperateModel('' as OperateType.Add);
            }}
            bodyStyle={{ minHeight: '400px' }}
            destroyOnClose={true}
            cancelText={'关闭'}
            width={1200}>
            <SelectThing
              current={current}
              labels={[`S${form.id}`]}
              propertyIdToAttrIdMap={keyMap}
              onRowSelectChange={(rows) => setSelectedRows(rows)}
              belongId={belongId}
              form={form}
            />
          </Modal>
        )}
      </>
    </>
  );
};
export default React.memo(ThingTable);
