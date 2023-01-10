import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Menu, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CardOrTable from '@/components/CardOrTableComp';
import { DictItemColumns } from '@/pages/Setting/config/columns';
import { XDict, XDictItem } from '@/ts/base/schema';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { ISpeciesItem, ITarget } from '@/ts/core';
import { kernel } from '@/ts/base';
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
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const parentRef = useRef<any>(null); //父级容器Dom
  const [openDictModal, setOpenDictModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('新增');
  const [currentDict, setCurrentDict] = useState<XDict>();
  const [dicts, setDicts] = useState<any>([]);
  const [itemkey] = useObjectUpdate(currentDict);
  useEffect(() => {
    kernel
      .querySpeciesDict({
        id: current.target.id,
        spaceId: userCtrl.space.id,
        page: { offset: 0, limit: 10000, filter: '' },
      })
      .then((res) => {
        if (res.success) {
          let records: XDict[] | undefined = res.data.result;
          if (records) {
            setCurrentDict(records[0]);
          }
          let menus = records?.map((item: XDict) => {
            return { label: item.name, key: item.code, data: item };
          });
          setDicts(menus);
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
          key={tkey}
          mode="vertical"
          items={dicts}
          style={{ width: '100%', height: '50vh', overflow: 'auto' }}
          onClick={(e: any) => {
            for (let dict of dicts) {
              if (e.key == dict.key) {
                setCurrentDict(dict.data);
              }
            }
          }}
        />
      </div>
      <div style={{ width: '90vw' }}>
        <Card bordered={false} style={{ padding: '10px' }}>
          <CardOrTable<XDictItem>
            key={itemkey}
            rowKey={'id'}
            request={async (page) => {
              let res = await kernel.queryDictItems({
                id: currentDict ? currentDict.id : '1',
                spaceId: userCtrl.space.id,
                page: page,
              });
              return res.data;
            }}
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
          if (res) {
            message.success(`${modalType}成功`);
          }
          tforceUpdate();
          setOpenDictModal(false);
        }}
        current={current}
      />
    </div>
  );
};
export default DictInfo;
