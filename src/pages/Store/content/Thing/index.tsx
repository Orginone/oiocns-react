import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'antd';
import storeCtrl from '@/ts/controller/store';
import { ISpeciesItem } from '@/ts/core';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import userCtrl from '@/ts/controller/setting';
import { XAttribute } from '@/ts/base/schema';
import CardOrTable from '@/components/CardOrTableComp';
interface IProps {
  current: ISpeciesItem;
}
/**
 * 仓库-物
 */
const Thing: React.FC<IProps> = ({ current }: IProps) => {
  const [key] = useCtrlUpdate(storeCtrl);
  // const [operateKey, setOperateKey] = useState<string>();
  // const [operateTarget, setOperateTarget] = useState<ISpeciesItem>();
  const [thingAttrs, setThingAttrs] = useState<XAttribute[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  // const parentRef = useRef<any>();
  const loadAttrs = async () => {
    let targetAttrs: XAttribute[] =
      (
        await current.loadAttrs(userCtrl.space.id || '', {
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
    loadAttrs();
  }, [current]);

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
      <CardOrTable
        dataSource={[]}
        // stripe
        // headerTitle={headerTitle}
        // parentRef={parentRef}
        // renderCardContent={renderCardFun}
        // operation={renderOperation}
        columns={columns}
        rowKey={(record: any) => record?.prod?.id}
        operation={renderOperate}
        // {...rest}
      />
    </Card>
  );
};
export default Thing;
