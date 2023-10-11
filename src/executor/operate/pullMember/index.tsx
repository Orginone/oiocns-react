/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { XTarget } from '@/ts/base/schema';
import { IDirectory, ITarget, TargetType } from '@/ts/core';
import SearchTarget from '@/components/Common/SearchTarget';
import { Modal } from 'antd';
import SelectMember from '@/components/Common/SelectMember';

type IProps = {
  current: ITarget | IDirectory;
  finished: (ok: boolean) => void;
};

/*
  弹出框表格查询
*/
const PullMember: React.FC<IProps> = ({ current, finished }) => {
  const [selectMember, setSelectMember] = useState<XTarget[]>([]); // 选中的要拉的人
  const target = 'target' in current ? current.target : current;
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
          if (await target.pullMembers(selected)) {
            finished(true);
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
      onCancel={() => finished(false)}
      onOk={async () => {
        if (await target.pullMembers(selectMember)) {
          finished(true);
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
