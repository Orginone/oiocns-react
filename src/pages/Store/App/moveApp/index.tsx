import React, { useState, useEffect } from 'react';

// import cls from './index.module.less';
import { Modal } from 'antd';

import MenuTree from '@/components/CustomTreeComp';
import appCtrl from '@/ts/controller/store/appCtrl';
interface indexType {
  visible: boolean; //props
  setVisible: Function;
}
const Index: React.FC<indexType> = ({ visible = false, setVisible }) => {
  // console.log('打印移动appid', appid);
  if (!appCtrl.curProduct) {
    return <></>;
  }
  const [selectItem, setSelectItem] = useState<string[]>([]);

  const curProdID = appCtrl.curProduct!.prod.id;
  useEffect(() => {
    let parendIds: string[] = [];
    function findHasId(arr: any[]) {
      arr.forEach((item: any) => {
        if (
          Array.isArray(item?.items) &&
          item.items.some((v: string) => v === curProdID)
        ) {
          console.log('名中', item);

          parendIds.push(item.id);
        }
        if (item.children) {
          findHasId(item.children);
        }
      });
    }
    findHasId(appCtrl.spacies);
    originalIds = parendIds;
    setSelectItem(parendIds);
  }, [visible === true]);
  const handleOk = () => {
    function setAppid(arr: any[]) {
      arr.forEach((item: any) => {
        // 已选中项定位
        if (selectItem.includes(item.id)) {
          // 判断是否具备子集items数组 不包含则增加 id进入items
          if (Array.isArray(item?.items)) {
            !item.items.includes(curProdID) && item.items.push(curProdID);
          } else {
            item['items'] = [curProdID];
          }
        } else {

          Array.isArray(item?.items)
            ? (item.items = item.items.filter((v: string) => v !== curProdID))
            : (item['items'] = []);
        }
        if (item.children) {
          setAppid(item.children);
        }
      });
    }
    setAppid(appCtrl.spacies);

    console.log('ok', appCtrl.spacies);

    // 数据缓存
    appCtrl.cacheCustomMenu(appCtrl.spacies);
  };
  const handleClickItem = ({ checked }: { checked: string[] }) => {

    setSelectItem(checked);
  };
  return (
    <>
      <Modal
        title="移动应用"
        open={visible}
        onOk={handleOk}
        destroyOnClose
        onCancel={() => {
          setSelectItem([]);
          setVisible(false);
        }}>
        <MenuTree
          title={'我的分类'}
          checkable
          isDirectoryTree
          defaultExpandAll={true}
          checkStrictly={true}
          fieldNames={{ title: 'title', key: 'id', children: 'children' }}
          onCheck={handleClickItem}
          checkedKeys={selectItem}
          autoExpandParent={true}
          treeData={appCtrl.spacies}
        />
      </Modal>
    </>
  );
};

export default Index;
