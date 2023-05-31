import OioForm from '@/bizcomponents/FormDesign/OioForm';
import { kernel, schema } from '@/ts/base';
import { Button, Modal } from 'antd';
import orgCtrl from '@/ts/controller';
import cls from './index.module.less';
import { debounce } from '@/utils/tools';
import { deepClone } from '@/ts/base/common';
import { GetRowKey } from 'antd/es/table/interface';
import Thing from '@/pages/Store/content/Thing/Thing';
import { columns } from '@/bizcomponents/Indentity/config';
import React, { ReactNode, useEffect, useState } from 'react';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { ProColumns, ProTable } from '@ant-design/pro-components';

enum OperateType {
  'Add' = '新增',
  'Edit' = '编辑',
  'Select' = '选择',
  'EditMore' = '全部编辑',
}

interface IProps {
  rowKey?: string | GetRowKey<any>;
  labels: string[];
  belongId: string;
  selectable?: boolean;
  height?: any;
  width?: any;
  dataSource?: any; //传进来的 展示数据
  readonly?: boolean; //只读表单，隐藏操作区，配置区
  current: any;
  onListChange?: Function;
  form: schema.XForm; //传进来的 表单基本信息
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

const ThingTable: React.FC<IProps> = ({
  rowKey = 'Id',
  belongId,
  dataSource,
  current,
  form,
  labels,
  onListChange,
  readonly,
}) => {
  const [selectData, SetSelectData] = useState<any[]>([]);
  const [attrs, setAttrs] = useState<schema.XAttribute[]>();
  const [thingList, setThingList] = useState<any[]>([]);
  const [operateModel, setOperateModel] = useState<OperateType>();
  const [editData, setEditData] = useState<any>({});
  const [newData, setNewData] = useState<any>({});

  useEffect(() => {
    setTimeout(async () => {
      setAttrs(await orgCtrl.work.loadAttributes(form.id, current.workItem.belongId));
    }, 10);
  }, []);

  if (attrs == undefined) return <></>;
  const defaultColumnStateMap: any = {
    ModifiedTime: {
      width: 100,
      show: false,
    },
    CreateTime: {
      show: false,
    },
  };

  const getColItem = (id: string, name: string, valueType: string) => {
    let ColItem: ProColumns<any> = {
      title: name,
      key: id,
      dataIndex: id,
      width: name.length * 30 > 80 ? name.length * 30 : 80,
      valueType: ColTypes.get(valueType) as 'text',
      render(text: any, _record: any) {
        if (_record?.EDIT_INFO?.[id]) {
          return (
            <span style={{ color: '#154ad8' }} title={`修改前：${text}`}>
              {_record?.EDIT_INFO?.[id]}
            </span>
          );
        }
        return <>{text}</>;
      },
    };

    switch (valueType) {
      case '用户型':
        ColItem.render = (text: any, _record: any) => {
          let share = orgCtrl.user.findShareById(text.props.text as string);
          return (
            <>
              <TeamIcon share={share} size={15} />
              <span style={{ marginLeft: 10 }}>{share.name}</span>
            </>
          );
        };
        break;
      case '选择型':
        break;
      default:
        break;
    }
    return ColItem;
  };

  const getColumns = () => {
    let columns = [
      ...defaultCol.map((a) => getColItem(a.id, a.name, a.valueType)),
      ...attrs.map((a) => getColItem(a.id, a.name, a.property!.valueType)),
    ];
    if (!readonly) {
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
      });
    }
    return columns;
  };

  const submitCurrentTableData = debounce((thingData: any) => {
    // 删除 操作一栏
    onListChange?.call(
      this,
      form.id,
      thingList,
      JSON.stringify({
        data: thingData,
        columns: getColumns().filter((v: ProColumns<any>) => v.valueType !== 'option'),
      }),
    );
  }, 100);

  const handleModalDataChange = async (operate: OperateType) => {
    if (Object.keys(newData).length == 0) return;
    let thingDatas = thingList;
    switch (operate) {
      case OperateType.Add:
        {
          let res = await kernel.anystore.createThing(orgCtrl.user.id, 1);
          const { success, data = [] }: any = res;
          if (success && data.length > 0) {
            thingDatas.unshift({ isNew: true, ...data[0], EDIT_INFO: newData });
          }
        }
        break;
      case OperateType.Edit:
        {
          thingDatas = thingList.map((item) => {
            item.Id === editData.Id &&
              (item = {
                ...item,
                EDIT_INFO: { ...(item?.EDIT_INFO ?? {}), ...newData },
              });

            return item;
          });
        }
        break;
      case OperateType.EditMore:
        {
          thingDatas = thingList.map((item) => {
            return {
              ...item,
              EDIT_INFO: { ...(item?.EDIT_INFO ?? {}), ...newData },
            };
          });
        }
        break;
      default:
        break;
    }
    submitCurrentTableData(thingDatas);
    setOperateModel(undefined);
    setThingList([...thingDatas]);
  };

  const loadToolBar = () => {
    if (!readonly) {
      return () => [
        <Button
          key="1"
          type="default"
          onClick={() => {
            setNewData({});
            setOperateModel(OperateType.EditMore);
          }}>
          批量修改
        </Button>,
        <Button
          key="1"
          type="default"
          onClick={() => {
            setNewData({});
            setOperateModel(OperateType.Add);
          }}>
          新增
        </Button>,
        <Button
          key="2"
          type="default"
          onClick={() => {
            setOperateModel(OperateType.Select);
          }}>
          选择
        </Button>,
      ];
    }
  };

  return (
    <>
      <ProTable<any>
        columns={getColumns()}
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
        headerTitle={form.name}
        //根据formInfo.id 设置默认表头设置--保存在localStorage下
        columnsState={
          readonly
            ? undefined
            : {
                defaultValue: { ...defaultColumnStateMap },
                persistenceKey: 'thingTable' + form.id,
                persistenceType: 'localStorage',
              }
        }
        toolBarRender={loadToolBar()}
      />
      <Modal
        open={
          operateModel &&
          [OperateType.Edit, OperateType.EditMore, OperateType.Add].includes(operateModel)
        }
        onOk={async () => {
          await handleModalDataChange(operateModel!);
        }}
        onCancel={() => {
          setOperateModel(undefined);
        }}
        destroyOnClose={true}
        cancelText={'关闭'}
        width={1000}>
        <OioForm
          form={form}
          define={current}
          fieldsValue={operateModel === OperateType.Edit ? editData : undefined}
          onValuesChange={(_changeValue, values) => setNewData(values)}
          noRule={true}
        />
      </Modal>
      <Modal
        width={1000}
        cancelText={'关闭'}
        destroyOnClose={true}
        open={operateModel === OperateType.Select}
        onOk={() => {
          let allData = thingList;
          selectData.forEach((a) => {
            if (thingList.findIndex((s) => s.Id == a.Id) < 0) {
              let propValue: any = {};
              Object.keys(a.Propertys).forEach((key) => {
                let attr = attrs.find((q) => q.property?.code == key);
                if (attr) {
                  propValue[attr.id] = a.Propertys[key];
                }
              });
              allData.unshift({ ...a, ...propValue });
            }
          });
          submitCurrentTableData(allData);
          setThingList([...allData]);
          setOperateModel(undefined);
        }}
        onCancel={() => {
          setOperateModel(undefined);
        }}>
        <Thing
          keyExpr="Id"
          height={500}
          selectable
          labels={labels}
          belongId={belongId}
          propertys={attrs.map((a) => a.property!)}
          onSelected={(data) => SetSelectData(data)}
        />
      </Modal>
    </>
  );
};
export default ThingTable;
