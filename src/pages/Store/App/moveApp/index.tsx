import React, { useState } from 'react';

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
  const [selectItem, setSelectItem] = useState('');
  const handleOk = () => {
    console.log('ok', selectItem, '当前操作的应用', appCtrl.curProduct, appCtrl.spacies);
  };
  const handleClickItem = ({ checked }: { checked: string[] }) => {
    setSelectItem(checked[1] || '');
    console.log('ok', selectItem);
  };
  return (
    <>
      <Modal
        title="移动应用"
        open={visible}
        onOk={handleOk}
        destroyOnClose
        onCancel={() => {
          setSelectItem('');
          setVisible(false);
        }}>
        <MenuTree
          title={'目录'}
          checkable
          isDirectoryTree
          checkStrictly={true}
          onCheck={handleClickItem}
          checkedKeys={[selectItem]}
          autoExpandParent={true}
          treeData={appCtrl.spacies}
        />
      </Modal>
    </>
  );
};

export default Index;
