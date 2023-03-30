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
import TransToDict from '@/pages/Setting/content/Standard/Dict/transToDict';
import TransToSpecies from '@/pages/Setting/content/Standard/Dict/transToSpecies';
interface IProps {
  target?: ITarget;
  current: ISpeciesItem;
  modalType: string;
  recursionOrg: boolean;
  recursionSpecies: boolean;
  setShowAddDict: (show: boolean) => void;
  setModalType: (modalType: string) => void;
}
/**
 * @description: 分类字典管理
 * @return {*}
 */
const DictInfo: React.FC<IProps> = ({
  current,
  modalType,
  recursionOrg,
  recursionSpecies,
  setShowAddDict,
  setModalType,
}) => {
  const [dictRecords, setDictRecords] = useState<IDict[]>([]);
  const parentRef = useRef<any>(null); //父级容器Dom
  const [openDictModal, setOpenDictModal] = useState<boolean>(false);
  const [openTransToDictModal, setOpenTransToDictModal] = useState<boolean>(false);
  const [openTransToSpeciesModal, setOpenTransToSpeciesModal] = useState<boolean>(false);
  const [openDictItemModal, setOpenDictItemModal] = useState<boolean>(false);
  const [editData, setEditData] = useState<XDict>();
  const [editItemData, setEditItemData] = useState<XDictItem>();
  const [currentDict, setCurrentDict] = useState<IDict>();
  const [dictKey, setDictKey] = useState<string>();
  const [selectKey, setSelectKey] = useState<string>();
  const [itemKey, setItemKey] = useState<string>();
  const [dicts, setDicts] = useState<any[]>([]);
  const loadDicts = async () => {
    let res: IDict[] = await current.loadDictsByPage(
      userCtrl.space.id,
      recursionOrg,
      recursionSpecies,
      {
        offset: 0,
        limit: 10000,
        filter: '',
      },
    );
    setShowAddDict(res.length > 0 && !!currentDict);
    setDictRecords(res);
    let dicts = buildTree(res);
    setDicts(dicts);
    if (dicts && dicts[0]) {
      setSelectKey(dicts[0]?.key);
      setCurrentDict(dicts[0].item);
      setItemKey(getUuid());
      setShowAddDict(true);
    } else {
      setCurrentDict(undefined);
      setItemKey(getUuid());
    }
  };

  useEffect(() => {
    loadDicts();
  }, [current, recursionOrg, recursionSpecies]);

  const buildTree = (dicts: IDict[]) => {
    const result: any[] = [];
    if (dicts) {
      for (const item of dicts) {
        result.push({
          key: item.id,
          item: item,
          isLeaf: true,
          title: item.name,
          icon: <></>,
        });
      }
    }
    return result;
  };

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
          currentDict?.deleteItem(item.id).then((success: any) => {
            setItemKey(getUuid());
            success ? message.success('删除成功') : message.error('删除失败');
          });
        },
      },
    ];
  };

  return (
    <div style={{ display: 'flex', height: '75vh' }}>
      <div style={{ width: '25vw', height: '75vh' }}>
        <CustomTreeComp
          key={dictKey}
          title={
            <div style={{ display: 'flex' }}>
              {/* {'分类字典'} */}
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
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setOpenTransToDictModal(true);
                }}>
                从分类生成
              </Button>
            </div>
          }
          isDirectoryTree
          menu={['编辑', '删除', '转为分类']}
          searchable
          showIcon
          treeData={dicts}
          selectedKeys={[selectKey]}
          onSelect={async (_: any, info: any) => {
            setSelectKey(info.node.key);
            setCurrentDict(info.node.item);
            setItemKey(getUuid());
            setShowAddDict(true);
          }}
          handleMenuClick={(key, node) => {
            switch (key) {
              case '编辑':
                setEditData(node.item.target);
                setOpenDictModal(true);
                break;
              case '删除':
                current.deleteDict(node.item.id).then(async (success) => {
                  await loadDicts();
                  // setItemKey(getUuid());
                  success ? message.success('删除成功') : message.error('删除失败');
                });
                break;
              case '转为分类':
                setCurrentDict(node.item);
                setOpenTransToSpeciesModal(true);
                break;
              default:
                break;
            }
          }}
        />
      </div>
      <div style={{ width: '75vw' }}>
        <Card bordered={false} style={{ paddingLeft: '10px' }}>
          <CardOrTable<XDictItem>
            key={itemKey}
            rowKey={'id'}
            request={async (page) => {
              if (currentDict) {
                let res = await currentDict.loadItemsByPage(userCtrl.space.id, page);
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
            loadDicts();
            message.success(`操作成功`);
          }
          setOpenDictModal(false);
        }}
        current={current}
      />
      <TransToDict
        open={openTransToDictModal}
        setOpen={setOpenTransToDictModal}
        currentSpeciesItem={current}></TransToDict>
      {currentDict && (
        <TransToSpecies
          open={openTransToSpeciesModal}
          setOpen={setOpenTransToSpeciesModal}
          dict={currentDict}
          currentSpeciesItem={current}></TransToSpecies>
      )}
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
