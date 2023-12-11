import React, { useState } from 'react';
import { XTarget } from '@/ts/base/schema';
import { IBelong, TargetType } from '@/ts/core';
import SearchTarget from '@/components/Common/SearchTarget';
import { Modal } from 'antd';
import { schema } from '@/ts/base';

type IProps = {
  cmd: string;
  current: IBelong;
  finished: () => void;
};

/*
  弹出框申请计入
*/
const JoinTarget: React.FC<IProps> = ({ cmd, current, finished }) => {
  const [selectMembers, setSelectMembers] = useState<XTarget[]>([]); // 选中的要拉的人
  let modalTitle = '';
  let selectTargetType: TargetType = TargetType.Person;
  switch (cmd) {
    case 'joinFriend':
      modalTitle = '申请加好友';
      break;
    case 'joinCohort':
      modalTitle = '申请加入群组';
      selectTargetType = TargetType.Cohort;
      break;
    case 'joinStorage':
      modalTitle = '申请加入存储资源群';
      selectTargetType = TargetType.Storage;
      break;
    case 'joinCompany':
      modalTitle = '申请加入单位';
      selectTargetType = TargetType.Company;
      break;
    case 'joinGroup':
      modalTitle = '申请加入组织群';
      selectTargetType = TargetType.Group;
      break;
    default:
      return <></>;
  }
  return (
    <Modal
      destroyOnClose
      title={modalTitle}
      open={true}
      onOk={async () => {
        if (await current.applyJoin(selectMembers)) {
          finished();
        }
      }}
      onCancel={finished}
      okButtonProps={{ disabled: selectMembers.length < 1 }}
      width={670}>
      <SearchTarget
        autoSelect
        searchCallback={(persons: schema.XTarget[]) => {
          setSelectMembers(persons);
        }}
        searchType={selectTargetType}
      />
    </Modal>
  );
};

export default JoinTarget;
