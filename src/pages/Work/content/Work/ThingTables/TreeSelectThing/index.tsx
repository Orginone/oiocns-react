import React, { useEffect, useState } from 'react';
import { ParamsType, ProTableProps } from '@ant-design/pro-components';
import cls from './index.module.less';
import { loadStoreMenu } from './MenuTree';
import orgCtrl from '@/ts/controller';
import { schema } from '@/ts/base';
import Thing from '@/pages/Store/content/Thing/Thing';
import CustomMenu from '@/components/CustomMenu';
interface PageProp {
  selectable?: boolean;
  labels: string[];
  current: any;
  belongId: string;
  form: schema.XForm;
  onRowSelectChange?: (selectedRows: { [key: string]: any }[]) => void;
}

const SelectThing = <
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text',
>(
  props: ProTableProps<DataType, Params, ValueType> & PageProp,
) => {
  const { onRowSelectChange, current, belongId, ...rest } = props;
  const [menu, setMenu] = useState<any>(); //展示左侧菜单
  const [propertys, setPropertys] = useState<schema.XAttribute[]>([]); //表格头部展示数据
  const [menuSelected, setMenuSelected] = useState<any>({}); //实体树 选择的
  useEffect(() => {
    // 初始化菜单
    loadStoreMenu(current.workItem.current).then((res) => {
      setMenu(res);
    });
  }, [current != undefined]);
  if (!current || !menu) return <></>;
  // 选择菜单请求实体及表头数据
  const onSelectClick: any = async (menuItem: any) => {
    let attributes = await orgCtrl.work.loadAttributes(menuItem.item.id, belongId);
    setMenuSelected(menuItem.item);
    setPropertys(attributes);
  };

  return (
    <div className={cls.treeThingWrap}>
      <div className={cls.leftTree}>
        <CustomMenu
          className={cls.leftMenu}
          item={menu}
          selectMenu={menuSelected}
          onSelect={(item) => {
            onSelectClick(item);
          }}
          collapsed={false}
        />
      </div>
      <div className={cls.ThingTable}>
        <Thing
          keyExpr={'Id'}
          height={400}
          selectable
          belongId={belongId}
          propertys={propertys.map((a) => a.property!)}
          onSelected={(data: any) => onRowSelectChange && onRowSelectChange(data)}
          {...rest}
          labels={menuSelected.id ? [`S${menuSelected.id}`] : []}
        />
      </div>
    </div>
  );
};

export default SelectThing;
