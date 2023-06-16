/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { XTarget } from '@/ts/base/schema';
import { ITarget, TargetType } from '@/ts/core';
import SearchCompany from '@/bizcomponents/SearchCompany';
import { Modal } from 'antd';

type IProps = {
  current: ITarget;
  finished: () => void;
};

/*
  弹出框表格查询
*/
const SearchTarget: React.FC<IProps> = ({ current, finished }) => {
  const [selectMember, setSelectMember] = useState<XTarget[]>([]); // 选中的要拉的人

  const getFindMember = () => {
    switch (current.typeName) {
      case TargetType.Group:
        return (
          <SearchCompany
            searchCallback={setSelectMember}
            searchType={TargetType.Company}
          />
        );
      default:
        return (
          <SearchCompany
            searchCallback={setSelectMember}
            searchType={TargetType.Person}
          />
        );
    }
  };
  return (
    <Modal
      title="邀请成员"
      width={900}
      destroyOnClose
      open={true}
      onCancel={() => finished()}
      onOk={async () => {
        if (await current.pullMembers(selectMember)) {
          finished();
        }
      }}>
      {getFindMember()}
    </Modal>
  );
};

export default SearchTarget;
