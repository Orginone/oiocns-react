/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { XTarget } from '@/ts/base/schema';
import { ITarget, TargetType } from '@/ts/core';
import SearchTarget from '@/components/Common/SearchTarget';
import { Modal } from 'antd';
import SelectMember from '@/components/Common/SelectMember';

type IProps = {
  current: ITarget;
  finished: () => void;
};

/*
  弹出框表格查询
*/
const PullMember: React.FC<IProps> = ({ current, finished }) => {
  const [selectMember, setSelectMember] = useState<XTarget[]>([]); // 选中的要拉的人

  if (
    current.id !== current.metadata.belongId &&
    ![TargetType.Cohort, TargetType.Group].includes(current.typeName as TargetType)
  ) {
    return (
      <SelectMember
        open
        members={current.space.members}
        exclude={current.members}
        finished={async (selected) => {
          console.log(selected);
          if (await current.pullMembers(selected)) {
            finished();
          }
        }}
      />
    );
  }

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
      <SearchTarget
        searchCallback={setSelectMember}
        searchType={
          current.typeName === TargetType.Group ? TargetType.Company : TargetType.Person
        }
      />
    </Modal>
  );
};

export default PullMember;
