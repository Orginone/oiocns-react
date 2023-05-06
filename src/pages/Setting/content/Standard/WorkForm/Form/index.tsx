import React, { useEffect, useState } from 'react';
import List from './List';
import Design from './Design';
import { XForm } from '@/ts/base/schema';
import { IWorkForm } from '@/ts/core/thing/app/work/workform';

interface IProps {
  current: IWorkForm;
  recursionOrg: boolean;
  recursionSpecies: boolean;
}

/**
 * @description: 分类--业务表单
 * @return {*}
 */
const SpeciesForm = ({ current, recursionOrg, recursionSpecies }: IProps) => {
  const [tabKey, setTabKey] = useState(0);
  const [selectedForm, setSelectedForm] = useState<XForm>();

  useEffect(() => {
    setTabKey(0);
  }, [current]);

  return tabKey == 0 ? (
    <List
      current={current}
      setTabKey={setTabKey}
      recursionOrg={recursionOrg}
      recursionSpecies={recursionSpecies}
      setSelectedOperation={setSelectedForm}
    />
  ) : selectedForm ? (
    <Design current={current} form={selectedForm} onBack={() => setTabKey(0)} />
  ) : (
    <></>
  );
};
export default SpeciesForm;
