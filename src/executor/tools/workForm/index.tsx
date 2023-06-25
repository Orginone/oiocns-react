import React from 'react';
import { model, schema } from '../../../ts/base';
import { IBelong } from '@/ts/core';
import PrimaryForms from './primary';
import DetailForms from './detail';

interface IFullModalProps {
  allowEdit: boolean;
  belong: IBelong;
  forms: schema.XForm[];
  data: model.InstanceDataModel;
  onChanged?: (id: string, data: model.FormEditData) => void;
}

/** 流程节点表单 */
const WorkForm: React.FC<IFullModalProps> = (props) => {
  console.log(props);
  if (props.forms.length < 1) return <></>;
  const primaryForms = props.forms.filter((f) => f.typeName === '主表');
  const detailForms = props.forms.filter((f) => f.typeName === '子表');
  return (
    <div style={{ padding: 10 }}>
      <PrimaryForms {...props} forms={primaryForms} />
      <DetailForms {...props} forms={detailForms} />
    </div>
  );
};

export default WorkForm;
