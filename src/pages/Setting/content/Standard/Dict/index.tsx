import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Dropdown, Menu, message } from 'antd';
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import CardOrTable from '@/components/CardOrTableComp';
import { DictItemColumns } from '@/pages/Setting/config/columns';
import { XDict, XDictItem, XDictItemArray } from '@/ts/base/schema';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { IDict, ISpeciesItem, ITarget } from '@/ts/core';
import { Dict } from './../../../../../ts/core/target/species/dict';
import { kernel } from '@/ts/base';
import userCtrl from '@/ts/controller/setting';
import DictModel from './dictModal';
import DictItemModel from './dictItemModal';
import { ImBin, ImPencil, ImPlus } from 'react-icons/im';
interface IProps {
  target?: ITarget;
  current: ISpeciesItem;
}
/**
 * @description: 分类字典管理
 * @return {*}
 */
const DictInfo: React.FC<IProps> = ({ current, target }: IProps) => {
  const parentRef = useRef<any>(null); //父级容器Dom
  const [openDictModal, setOpenDictModal] = useState<boolean>(false);
  const [openDictItemModal, setOpenDictItemModal] = useState<boolean>(false);
  const [editData, setEditData] = useState<XDict>();
  const [currentDict, setCurrentDict] = useState<IDict>();
  const [dicts, setDicts] = useState<any[]>([]);
  // const [itemkey, setItemKey] = useState<number>(0);
  const [key, forceUpdate] = useObjectUpdate(editData);
  useEffect(() => {
    kernel
      .queryDicts({
        id: current.target.id,
        spaceId: userCtrl.space.id,
        page: { offset: 0, limit: 10000, filter: '' },
      })
      .then((res) => {
        if (res.success) {
          let records: XDict[] | undefined = res.data.result;
          let menus = records?.map((item: XDict) => {
            return {
              label: renderLabel(item),
              key: item.code,
              data: item,
              // children: [
              //   {
              //     label: '编辑',
              //     key: `${item.code}编辑`,
              //     icon: <ImPencil></ImPencil>,
              //     onClick: (e: any) => {
              //       setEditData(item);
              //       setOpenDictModal(true);
              //     },
              //   },
              //   {
              //     label: '新增子项',
              //     key: `${item.code}新增子项`,
              //     icon: <ImPlus></ImPlus>,
              //     onClick: (e: any) => {
              //       setCurrentDict(new Dict(item));
              //       setOpenDictItemModal(true);
              //     },
              //   },
              //   {
              //     label: <span style={{ color: 'red' }}>删除</span>,
              //     key: `${item.code}删除`,
              //     icon: <ImBin></ImBin>,
              //     onClick: (e: any) => {
              //       console.log('删除', e);
              //     },
              //   },
              // ],
            };
          });
          setDicts(menus as any[]);
        }
      });
  }, [current]);

  /** 渲染标题,支持更多操作 */
  const renderLabel = (item: XDict) => {
    return (
      <span>
        <span
          onClick={() => {
            // alert(item.name);
            setCurrentDict(new Dict(item));
            // setEditData(item);
            forceUpdate();
            // setItemKey(itemkey + 1);
          }}>
          {item.name}
        </span>
        <span onClick={(e: any) => e.stopPropagation()} style={{ float: 'right' }}>
          <Dropdown
            menu={{
              items: [
                {
                  label: '编辑',
                  key: `编辑`,
                  icon: <ImPencil></ImPencil>,
                },
                {
                  label: '新增子项',
                  key: `新增子项`,
                  icon: <ImPlus></ImPlus>,
                },
                {
                  label: <span style={{ color: 'red' }}>删除</span>,
                  key: `删除`,
                  icon: <ImBin></ImBin>,
                },
              ],
              onClick: ({ key }) => {
                switch (key) {
                  case '编辑':
                    setEditData(item);
                    setOpenDictModal(true);
                    break;
                  case '新增子项':
                    setCurrentDict(new Dict(item));
                    setOpenDictItemModal(true);
                    break;
                  case '删除':
                    console.log('删除', key);
                    break;
                }
              },
            }}
            placement="bottom"
            trigger={['click', 'contextMenu']}>
            <EllipsisOutlined style={{ fontSize: 18 }} rotate={90} />
          </Dropdown>
        </span>
      </span>
    );
  };

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
      <div style={{ width: '10vw', height: '50vh', margin: '5px' }}>
        <Button
          type="link"
          size="small"
          icon={<PlusOutlined />}
          style={{ width: '100%' }}
          onClick={() => {
            setEditData(undefined);
            setOpenDictModal(true);
          }}>
          新增
        </Button>
        {/* <CustomMenu
          item={siderMenuData}
          onSelect={(item) => {}}
          onMenuClick={(item, key) => {}}
        /> */}
        <Menu
          mode="inline"
          items={dicts}
          style={{ width: '100%', height: '50vh', overflow: 'auto' }}
          // onClick={(e: any) => {
          //   setItemKey(itemkey + 1);
          // }}
        />
      </div>
      <div style={{ width: '90vw' }}>
        <Card bordered={false} style={{ padding: '10px' }}>
          <CardOrTable<XDictItem>
            key={key}
            rowKey={'id'}
            request={async (page) => {
              if (currentDict) {
                // let res = await kernel.queryDictItems({
                //   id: editData.id,
                //   spaceId: userCtrl.space.id,
                //   page: page,
                // });
                // console.log('res', res);
                // return res.data;
                let res = await currentDict.loadItems(userCtrl.space.id, page);
                console.log('res', res);
                return res;
              } else {
                return {
                  offset: 0,
                  limit: 10000,
                  total: 0,
                  result: undefined,
                } as XDictItemArray;
              }
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
        data={editData}
        open={openDictModal}
        handleCancel={function (): void {
          setOpenDictModal(false);
        }}
        handleOk={function (res: any): void {
          if (res) {
            message.success(`操作成功`);
          }
          setOpenDictModal(false);
        }}
        current={current}
      />
      <DictItemModel
        open={openDictItemModal}
        handleCancel={function (): void {
          setOpenDictItemModal(false);
        }}
        handleOk={function (res: any): void {
          if (res) {
            message.success(`操作成功`);
          }
          setOpenDictItemModal(false);
        }}
        current={currentDict}
      />
    </div>
  );
};
export default DictInfo;
