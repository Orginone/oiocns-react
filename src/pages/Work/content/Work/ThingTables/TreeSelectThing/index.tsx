import React, { useEffect, useState } from 'react';
import { ParamsType, ProTableProps } from '@ant-design/pro-components';
import cls from './index.module.less';
import { loadThingMenu } from './MenuTree';
import orgCtrl from '@/ts/controller';
import { schema } from '@/ts/base';
import Thing from '@/pages/Store/content/Thing/Thing';
import CustomMenu from '@/components/CustomMenu';
import { handlePropToAttrObj } from '../Function';
import { Button, Space } from 'antd';
interface PageProp {
  form: schema.XForm;
  selectable?: boolean;
  labels: string[];
  current: any;
  onOk: () => void;
  onCancel: () => void;
  belongId: string;
  selectedRowKeys?: string[];
  propertyIdToAttrIdMap: Map<string, string>;
  onRowSelectChange: (selectedRows: { [key: string]: any }[]) => void;
}

const SelectThing = <
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text',
>(
  props: ProTableProps<DataType, Params, ValueType> & PageProp,
) => {
  const {
    onRowSelectChange,
    current,
    belongId,
    propertyIdToAttrIdMap,
    selectedRowKeys = [],
    onOk,
    onCancel,
  } = props;
  const [menu, setMenu] = useState(loadThingMenu(current.workItem.current)); //展示左侧菜单
  const [propertys, setPropertys] = useState<schema.XAttribute[]>([]); //表格头部展示数据
  const [menuSelected, setMenuSelected] = useState(menu); //实体树 选择的
  const [selectThings, setSelectThings] = useState<any[]>([]);
  const [isChangeMenu, setIsChangeMenu] = useState<boolean>(false);
  if (!current || !menu) return <></>;
  useEffect(() => {
    setSelectThings(
      selectedRowKeys.map((v) => {
        return { Id: v };
      }),
    );
  }, []);
  /* 监听选择实体变化 */
  const hanSelectChanged = (e: any) => {
    const { currentDeselectedRowKeys, selectedRowsData } = e;
    /* 处理因切换实体类型造成数据重置 */
    if (isChangeMenu) {
      setIsChangeMenu(false);
      return;
    }
    /* 处理取消选择 */
    if (currentDeselectedRowKeys.length > 0) {
      setSelectThings(
        selectThings.filter((v) => !currentDeselectedRowKeys.includes(v.Id)),
      );
    } else {
      /* 处理新增选择 */
      const hasIds = selectThings.map((v) => v.Id);
      const AttrThings = selectedRowsData.filter(
        (v: { Id: string }) => !hasIds.includes(v.Id),
      );
      const newThings = handlePropToAttrObj(AttrThings, propertyIdToAttrIdMap);

      setSelectThings([...selectThings, ...newThings]);
    }
  };
  return (
    <>
      <div className={cls.treeThingWrap}>
        <div className={cls.leftTree}>
          <CustomMenu
            className={cls.leftMenu}
            item={menu}
            selectMenu={menuSelected}
            onSelect={async (item) => {
              if (item.beforeLoad) {
                await item.beforeLoad();
              }
              if (item.itemType === '表单') {
                setPropertys(await orgCtrl.work.loadAttributes(item.item.id, belongId));
              }
              setMenu(loadThingMenu(current.workItem.current));
              setIsChangeMenu(true);
              setMenuSelected(item);
            }}
            collapsed={false}
          />
        </div>
        <div className={cls.ThingTable}>
          <Thing
            keyExpr={'Id'}
            height={'100%'}
            key={menuSelected.item.id}
            selectable
            belongId={belongId}
            propertys={propertys.map((a) => a.property!)}
            defaultSelectedRowKeys={selectThings.map((v) => v.Id)}
            onSelectedChanged={hanSelectChanged}
            labels={[`S${menuSelected.item.id}`]}
          />
        </div>
      </div>
      <Space className={cls.footer}>
        <Button onClick={onCancel}>取消</Button>
        <Button
          onClick={() => {
            /* 确定时弹出修改数据 */
            onRowSelectChange(selectThings);
            onOk();
          }}
          type="primary">
          确认
        </Button>
      </Space>
    </>
  );
};

export default SelectThing;
