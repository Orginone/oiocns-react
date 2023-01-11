import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CardOrTable from '@/components/CardOrTableComp';
import { DictItemColumns } from '@/pages/Setting/config/columns';
import { XDict, XDictItem, XDictItemArray } from '@/ts/base/schema';
import { IDict, ISpeciesItem, ITarget } from '@/ts/core';
import userCtrl from '@/ts/controller/setting';
import DictModel from './dictModal';
import DictItemModel from './dictItemModal';
import { getUuid } from '@/utils/tools';
import CustomTreeComp from '@/components/CustomTreeComp';
interface IProps {
  target?: ITarget;
  current: ISpeciesItem;
  dictRecords: IDict[];
  modalType: string;
  setModalType: (modalType: string) => void;
  reload: Function;
}
/**
 * @description: 分类字典管理
 * @return {*}
 */
const DictInfo: React.FC<IProps> = ({
  current,
  target,
  dictRecords,
  modalType,
  setModalType,
  reload,
}: IProps) => {
  const parentRef = useRef<any>(null); //父级容器Dom
  const [openDictModal, setOpenDictModal] = useState<boolean>(false);
  const [openDictItemModal, setOpenDictItemModal] = useState<boolean>(false);
  const [editData, setEditData] = useState<XDict>();
  const [editItemData, setEditItemData] = useState<XDictItem>();
  const [currentDict, setCurrentDict] = useState<IDict>();
  const buildTree = (dicts: IDict[]) => {
    const result: any[] = [];
    for (const item of dicts) {
      result.push({
        key: item.id,
        item: item,
        isLeaf: true,
        title: item.name,
        icon: <></>,
      });
    }
    return result;
  };
  const dicts = buildTree(dictRecords);
  const [selectKey, setSelectKey] = useState<string>(dicts[0]?.key);
  const [itemKey, setItemKey] = useState<string>();

  useEffect(() => {
    if (modalType.includes('新增字典项')) {
      if (currentDict) {
        setEditItemData(undefined);
        setOpenDictItemModal(true);
      } else {
        message.warn('请先选择 左侧分类字典');
        setModalType('');
      }
    }
  }, [modalType, currentDict]);

  const renderItemOperate = (item: XDictItem) => {
    return [
      {
        key: '编辑项',
        label: '编辑项',
        onClick: () => {
          setEditItemData(item);
          setOpenDictItemModal(true);
        },
      },
      {
        key: '删除项',
        label: <span style={{ color: 'red' }}>删除项</span>,
        onClick: async () => {
          currentDict?.deleteItem(item.id).then((success) => {
            setItemKey(getUuid());
            success ? message.success('删除成功') : message.error('删除失败');
          });
        },
      },
    ];
  };

  return (
    <div style={{ display: 'flex', height: '75vh' }}>
      <div style={{ width: '15vw', height: '75vh', margin: '5px' }}>
        <CustomTreeComp
          title={
            <div style={{ display: 'flex' }}>
              {'分类字典'}
              <Button
                type="link"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditData(undefined);
                  setOpenDictModal(true);
                }}>
                新增
              </Button>
            </div>
          }
          isDirectoryTree
          menu={['编辑', '删除']}
          searchable
          showIcon
          treeData={dicts}
          selectedKeys={[selectKey]}
          onSelect={async (_: any, info: any) => {
            setSelectKey(info.node.key);
            setCurrentDict(info.node.item);
            setItemKey(getUuid());
          }}
          handleMenuClick={(key, node) => {
            switch (key) {
              case '编辑':
                setEditData(node.item.target);
                setOpenDictModal(true);
                break;
              case '删除':
                current.deleteDict(node.item.id).then((success) => {
                  setSelectKey(dicts[0]?.key);
                  setItemKey(getUuid());
                  reload();
                  success ? message.success('删除成功') : message.error('删除失败');
                  if (dicts[0]) {
                    setCurrentDict(dicts[0].item);
                  }
                });
                break;
              default:
                break;
            }
          }}
        />
      </div>
      <div style={{ width: '85vw' }}>
        <Card bordered={false} style={{ paddingLeft: '10px' }}>
          <CardOrTable<XDictItem>
            key={itemKey}
            rowKey={'id'}
            request={async (page) => {
              if (currentDict) {
                let res = await currentDict.loadItems(userCtrl.space.id, page);
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
            reload();
          }
          setOpenDictModal(false);
        }}
        current={current}
      />
      {currentDict && (
        <DictItemModel
          data={editItemData}
          open={openDictItemModal}
          handleCancel={function (): void {
            setModalType('');
            setOpenDictItemModal(false);
          }}
          handleOk={function (res: any): void {
            if (res) {
              setItemKey(getUuid());
              message.success(`操作成功`);
            }
            setModalType('');
            setOpenDictItemModal(false);
          }}
          current={currentDict}
        />
      )}
    </div>
  );
};
export default DictInfo;
