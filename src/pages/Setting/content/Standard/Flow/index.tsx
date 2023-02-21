import Design from './Design';
import React, { useEffect, useState } from 'react';
import { XFlowDefine } from '@/ts/base/schema';
import FlowList from './info';
import { ISpeciesItem, ITarget } from '@/ts/core';
import { IsThingAdmin } from '@/utils/authority';
import userCtrl from '@/ts/controller/setting';

/**
 * 流程设置
 * @returns
 */

interface IProps {
  target?: ITarget;
  current: ISpeciesItem;
  modalType: string;
  flowDesign: XFlowDefine;
  curTabKey?: number;
  setFlowDesign: Function;
  setModalType: (modalType: string) => void;
}
const SettingFlow: React.FC<IProps> = ({
  current,
  target,
  modalType,
  flowDesign,
  curTabKey,
  setFlowDesign,
  setModalType,
}: IProps) => {
  const [tabKey, SetTabKey] = useState(curTabKey || 0);
  const [operateOrgId, setOperateOrgId] = useState<string>();
  const [instance, setInstance] = useState<any>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const judgeIsAdmin = async (target: ITarget) => {
    let isAdmin = await IsThingAdmin(target);
    setIsAdmin(isAdmin);
  };
  useEffect(() => {
    judgeIsAdmin(userCtrl.space);
  }, []);
  useEffect(() => {
    setModalType('');
    setFlowDesign(undefined);
  }, [current]);

  return tabKey === 0 ? (
    <FlowList
      onCurrentChaned={(item) => {
        if (item) {
          setFlowDesign(item);
        }
      }}
      isAdmin={isAdmin}
      operateOrgId={operateOrgId}
      setOperateOrgId={setOperateOrgId}
      setInstance={setInstance}
      species={current}
      onDesign={() => SetTabKey(1)}
      modalType={modalType}
      setModalType={setModalType}
    />
  ) : (
    <Design
      current={flowDesign}
      species={current}
      instance={instance}
      setInstance={setInstance}
      operateOrgId={operateOrgId}
      setOperateOrgId={setOperateOrgId}
      onBack={() => {
        setInstance(undefined);
        setOperateOrgId(undefined);
        SetTabKey(0);
      }}
      modalType={modalType}
      setModalType={setModalType}
    />
  );
};

export default SettingFlow;
