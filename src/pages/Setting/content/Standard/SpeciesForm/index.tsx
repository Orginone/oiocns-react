import React, { useEffect, useState } from 'react';
import { ISpeciesItem } from '@/ts/core';
import { XOperation } from '@/ts/base/schema';
import Operation from './Operation';
import Design from './Design';

interface IProps {
  current: ISpeciesItem;
  modalType: string;
  recursionOrg: boolean;
  recursionSpecies: boolean;
  toFlowDesign: (operation: XOperation) => void;
  setModalType: (modalType: string) => void;
}

/**
 * @description: 分类--业务表单
 * @return {*}
 */
const SpeciesForm = ({
  current,
  modalType,
  recursionOrg,
  recursionSpecies,
  toFlowDesign,
  setModalType,
}: IProps) => {
  const [tabKey, setTabKey] = useState(0);
  const [selectedOperation, setSelectedOperation] = useState<XOperation>();

  useEffect(() => {
    setTabKey(0);
  }, [current]);

  return tabKey == 0 ? (
    <Operation
      current={current}
      modalType={modalType}
      setModalType={setModalType}
      setTabKey={setTabKey}
      recursionOrg={recursionOrg}
      recursionSpecies={recursionSpecies}
      setSelectedOperation={setSelectedOperation}
    />
  ) : (
    <Design
      current={current}
      operation={selectedOperation as XOperation}
      setTabKey={setTabKey}
      toFlowDesign={toFlowDesign}
    />
  );
};
export default SpeciesForm;
