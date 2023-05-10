import React, { useState } from 'react';
import FormList from './List';
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
const SpeciesForm = (props: IProps) => {
  const [selectedForm, setSelectedForm] = useState<XForm>();

  if (selectedForm) {
    return (
      <Design
        current={props.current}
        form={selectedForm}
        onBack={() => setSelectedForm(undefined)}
      />
    );
  }
  return (
    <FormList
      current={props.current}
      recursionOrg={props.recursionOrg}
      recursionSpecies={props.recursionSpecies}
      setSelectedOperation={setSelectedForm}
    />
  );
};
export default SpeciesForm;
