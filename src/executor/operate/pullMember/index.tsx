/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { XTarget } from '@/ts/base/schema';
import { IDirectory, ITarget, TargetType } from '@/ts/core';
import SearchTarget from '@/components/Common/SearchTarget';
import { Modal } from 'antd';
import SelectMember from '@/components/Common/SelectMember';

type IProps = {
  current: ITarget | IDirectory;
  finished: () => void;
};

/*
  弹出框表格查询
*/
const PullMember: React.FC<IProps> = ({ current, finished }) => {
  const [selectMember, setSelectMember] = useState<XTarget[]>([]); // 选中的要拉的人
  const target = 'standard' in current ? current.target : current;
  if (
    target.id != target.belongId &&
    target.typeName != TargetType.Cohort &&
    target.typeName != TargetType.Group
  ) {
    return (
      <SelectMember
        open
        members={target.space.members}
        exclude={target.members}
        finished={async (selected) => {
          if (selected.length > 0) {
            await target.pullMembers(selected);
          }
          finished();
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
      okButtonProps={{ disabled: selectMember.length < 1 }}
      onOk={async () => {
        await target.pullMembers(selectMember);
        finished();
      }}>
      <SearchTarget
        autoSelect
        searchCallback={setSelectMember}
        searchType={
          target.typeName === TargetType.Group ? TargetType.Company : TargetType.Person
        }
      />
    </Modal>
  );
};

export default PullMember;
