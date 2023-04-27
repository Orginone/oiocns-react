import React, { useEffect, useState } from 'react';
import { ISpeciesItem } from '@/ts/core';
import { XOperation } from '@/ts/base/schema';
import List from './List';
import Design from './Design';

interface IProps {
  current: ISpeciesItem;
  recursionOrg: boolean;
  recursionSpecies: boolean;
}

/**
 * @description: 分类--业务表单
 * @return {*}
 */
const SpeciesForm = ({ current, recursionOrg, recursionSpecies }: IProps) => {
  const [tabKey, setTabKey] = useState(0);
  const [selectedOperation, setSelectedOperation] = useState<XOperation>();

  useEffect(() => {
    setTabKey(0);
  }, [current]);

  return tabKey == 0 ? (
    <List
      current={current}
      setTabKey={setTabKey}
      recursionOrg={recursionOrg}
      recursionSpecies={recursionSpecies}
      setSelectedOperation={setSelectedOperation}
    />
  ) : selectedOperation ? (
    <Design current={current} operation={selectedOperation} onBack={() => setTabKey(0)} />
  ) : (
    <></>
  );
};
export default SpeciesForm;
