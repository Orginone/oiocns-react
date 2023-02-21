import React, { useEffect, useState } from 'react';
import { Card, message, Tabs } from 'antd';
import storeCtrl from '@/ts/controller/store';
import { ISpeciesItem } from '@/ts/core/target/species/ispecies';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import userCtrl from '@/ts/controller/setting';
import { XAttribute } from '@/ts/base/schema';
import 'devextreme/dist/css/dx.light.css';
import Button from 'devextreme-react/button';
interface IProps {
  current: ISpeciesItem;
  checkedList?: any[];
}
/**
 * 仓库-物
 */
const Thing: React.FC<IProps> = ({ current, checkedList }: IProps) => {
  const [key] = useCtrlUpdate(storeCtrl);
  // const [operateKey, setOperateKey] = useState<string>();
  // const [operateTarget, setOperateTarget] = useState<ISpeciesItem>();
  const [thingAttrs, setThingAttrs] = useState<XAttribute[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [tabKey_, setTabKey_] = useState<string>();
  // const parentRef = useRef<any>();
  const loadAttrs = async (speciesItem: ISpeciesItem) => {
    let targetAttrs: XAttribute[] =
      (
        await current.loadAttrs(userCtrl.space.id + '', {
          offset: 0,
          limit: 1000,
          filter: '',
        })
      ).result || [];
    setThingAttrs(targetAttrs);
    setColumns(
      targetAttrs.map((item: XAttribute) => {
        return { title: item.name, dataIndex: item.code, key: item.code, width: 150 };
      }),
    );
  };
  useEffect(() => {
    if (current && userCtrl.space.id) {
      if (!tabKey_) {
        loadAttrs(current);
      }
    }
  }, [current]);
  useEffect(() => {
    if (checkedList && checkedList.length > 0) {
      if (!checkedList.map((item) => item.key).includes(tabKey_)) {
        setTabKey_(checkedList[0].key);
        loadAttrs(checkedList[0].item);
      }
    }
  }, [checkedList]);

  const getComponent = (a: ISpeciesItem) => {
    return <div>{a.name}</div>;
  };

  // 操作内容渲染函数
  const renderOperate = (item: XAttribute) => {
    return [
      {
        key: '上架',
        label: '上架',
        onClick: () => {},
      },
    ];
  };

  return (
    <Card id={key} bordered={false}>
      {checkedList && checkedList.length > 0 && (
        <Tabs
          activeKey={tabKey_}
          onChange={(key: any) => {
            setTabKey_(key);
            // onTabChanged(key);
          }}
          items={checkedList?.map((a) => {
            return {
              key: a.key,
              label: a.label,
              children: getComponent(a.item),
            };
          })}
        />
      )}
      {(!checkedList || checkedList.length == 0) && getComponent(current)}
      {/* <CardOrTable
        dataSource={[]}
        columns={columns}
        rowKey={(record: any) => record?.prod?.id}
        operation={renderOperate}
      /> */}
    </Card>
  );
};
export default Thing;
