import AuthorityModal from '@/bizcomponents/GlobalComps/createAuthority';
import { MenuItemType } from 'typings/globelType';
import React from 'react';

interface IProps {
  operateKey: string;
  selectMenu: MenuItemType;
  confrim: () => void;
}

const OperateIndex = ({ selectMenu, operateKey, confrim }: IProps) => {
  return (
    <>
      {/** 权限模态框 */}
      {operateKey.includes('权限') && (
        <AuthorityModal
          title={operateKey}
          open={operateKey.includes('权限')}
          current={selectMenu.item}
          handleCancel={confrim}
          handleOk={confrim}
        />
      )}
    </>
  );
};

export default OperateIndex;
