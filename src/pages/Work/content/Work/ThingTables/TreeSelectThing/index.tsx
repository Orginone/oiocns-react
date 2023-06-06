import React, { useState } from 'react';
import { ParamsType, ProTableProps } from '@ant-design/pro-components';
import cls from './index.module.less';
import { loadThingMenu } from './MenuTree';
import orgCtrl from '@/ts/controller';
import { schema } from '@/ts/base';
import Thing from '@/pages/Store/content/Thing/Thing';
import CustomMenu from '@/components/CustomMenu';
import { handlePropToAttrObj } from '../Function';
interface PageProp {
  form: schema.XForm;
  selectable?: boolean;
  labels: string[];
  current: any;
  belongId: string;
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
  const { onRowSelectChange, current, belongId, propertyIdToAttrIdMap, ...rest } = props;
  const [menu, setMenu] = useState(loadThingMenu(current.workItem.current)); //展示左侧菜单
  const [propertys, setPropertys] = useState<schema.XAttribute[]>([]); //表格头部展示数据
  const [menuSelected, setMenuSelected] = useState(menu); //实体树 选择的
  if (!current || !menu) return <></>;

  return (
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
            setMenuSelected(item);
          }}
          collapsed={false}
        />
      </div>
      <div className={cls.ThingTable}>
        <Thing
          keyExpr={'Id'}
          height={'100%'}
          selectable
          belongId={belongId}
          propertys={propertys.map((a) => a.property!)}
          onSelected={(data: any[]) =>
            onRowSelectChange(handlePropToAttrObj(data, propertyIdToAttrIdMap))
          }
          {...rest}
          labels={[`S${menuSelected.item.id}`]}
        />
      </div>
    </div>
  );
};

export default SelectThing;
