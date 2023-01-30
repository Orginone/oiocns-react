import Design from './Design';
import React, { useState } from 'react';
import { XFlowDefine } from '@/ts/base/schema';
import FlowList from './info';
import { ISpeciesItem, ITarget } from '@/ts/core';

/**
 * 流程设置
 * @returns
 */

interface IProps {
  target?: ITarget;
  current: ISpeciesItem;
  modalType: string;
  setModalType: (modalType: string) => void;
}
const SettingFlow: React.FC<IProps> = ({
  current,
  target,
  modalType,
  setModalType,
}: IProps) => {
  const [tabKey, SetTabKey] = useState(0);
  const [flowDesign, setFlowDesign] = useState<XFlowDefine>();
  return tabKey === 0 ? (
    <FlowList
      onCurrentChaned={(item) => {
        setFlowDesign(item);
      }}
      species={current}
      onDesign={() => SetTabKey(1)}
      modalType={modalType}
      setModalType={setModalType}
    />
  ) : (
    <Design
      current={flowDesign}
      species={current}
      onBack={() => SetTabKey(0)}
      modalType={modalType}
      setModalType={setModalType}
    />
  );
};

export default SettingFlow;
