import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Menu } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { PlusOutlined } from '@ant-design/icons';
import { ImPencil } from 'react-icons/im';
import CardOrTable from '@/components/CardOrTableComp';
import { DictItemColumns } from '@/pages/Setting/config/columns';
import { XAttribute, XDict, XDictItem } from '@/ts/base/schema';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { IDict, ISpeciesItem, ITarget, Dict } from '@/ts/core';
import { kernel } from '@/ts/base';
import { SpeciesItem } from '@/ts/core/thing/species';
import userCtrl from '@/ts/controller/setting';
import DictModel from './dictModal';
interface IProps {
  target?: ITarget;
  current: ISpeciesItem;
}
/**
 * @description: 分类字典管理
 * @return {*}
 */
const DictInfo: React.FC<IProps> = ({ current, target }: IProps) => {
  // const [tkey, tforceUpdate] = useObjectUpdate(current);

  const parentRef = useRef<any>(null); //父级容器Dom
  const [openDictModal, setOpenDictModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('新增');
  const [currentDict, setCurrentDict] = useState<IDict>();
  const [speciesItem, setSpeciesItem] = useState<ISpeciesItem>();
  const [dicts, setDicts] = useState<any>([]);
  useEffect(() => {
    kernel
      .queryDicts({ id: current.target.id, spaceId: userCtrl.space.id })
      .then((res) => {
        if (res.success) {
          let records: XDict[] | undefined = res.data.result;
          let menus = records?.map((item: XDict) => {
            return { label: item.name, key: item.code, data: item };
          });
          setDicts(menus);
        } else {
        }
      });
  }, [current]);

  const renderItemOperate = (item: XDictItem) => {
    return [
      {
        key: '编辑字典项',
        label: '编辑字典项',
        onClick: () => {},
      },
      {
        key: '删除字典项',
        label: '删除字典项',
        onClick: async () => {},
      },
    ];
  };

  return (
    <div style={{ display: 'flex', height: '50vh' }}>
      <div style={{ width: '10vw', height: '50vh' }}>
        <Button
          type="link"
          size="small"
          icon={<PlusOutlined />}
          style={{ width: '100%' }}
          onClick={() => {
            setModalType('新增');
            setOpenDictModal(true);
          }}>
          新增
        </Button>
        <Menu
          mode="vertical"
          items={dicts}
          style={{ width: '100%', height: '50vh', overflow: 'auto' }}
          onClick={() => {}}
        />
      </div>
      <div style={{ width: '90vw' }}>
        <Card bordered={false} style={{ padding: '10px' }}>
          <CardOrTable<XDictItem>
            rowKey={'id'}
            // key={tkey}
            // request={async (page) => {
            //   return await loadAttrs(page);
            // }}
            operation={renderItemOperate}
            columns={DictItemColumns}
            parentRef={parentRef}
            showChangeBtn={false}
            dataSource={[]}
          />
        </Card>
      </div>
      <DictModel
        title={modalType}
        open={openDictModal}
        handleCancel={function (): void {
          setOpenDictModal(false);
        }}
        handleOk={function (res: any): void {
          setOpenDictModal(false);
        }}
        current={currentDict}
        speciesItem={current}
      />
    </div>
  );
};
export default DictInfo;
