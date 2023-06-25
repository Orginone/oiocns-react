import React, { useState } from 'react';
import { ModalProps, Tabs } from 'antd';
import { model, schema } from '../../ts/base';
import { IBelong } from '@/ts/core';
import OioForm from '@/components/Common/FormDesign/OioFormNext';

interface IFullModalProps extends ModalProps {
  allowEdit: boolean;
  belong: IBelong;
  forms: schema.XForm[];
  data: model.InstanceDataModel;
}

const PrimaryForms: React.FC<IFullModalProps> = (props) => {
  if (props.forms.length < 1) return <></>;
  const [activeTabKey, setActiveTabKey] = useState(props.forms[0].id);
  const loadItems = () => {
    return props.forms.map((f) => {
      return {
        key: f.id,
        label: f.name,
        children: (
          <OioForm
            key={f.id}
            form={f}
            belong={props.belong}
            disabled={!props.allowEdit}
            submitter={{
              resetButtonProps: {
                style: { display: 'none' },
              },
              render: (_: any, _dom: any) => <></>,
            }}
            onValuesChange={(_, values) => {
              console.log(values);
            }}
          />
        ),
      };
    });
  };
  return (
    <Tabs
      items={loadItems()}
      activeKey={activeTabKey}
      onChange={(key) => setActiveTabKey(key)}
    />
  );
};

const DetailForms: React.FC<IFullModalProps> = (props) => {
  if (props.forms.length < 1) return <></>;
  const [activeTabKey, setActiveTabKey] = useState(props.forms[0].id);
  return <Tabs></Tabs>;
};

const WorkForm: React.FC<IFullModalProps> = (props) => {
  if (props.forms.length < 1) return <></>;
  const primaryForms = props.forms.filter((f) => f.typeName === '主表');
  const detailForms = props.forms.filter((f) => f.typeName === '子表');
  return (
    <>
      <PrimaryForms {...props} forms={primaryForms} />
      <DetailForms {...props} forms={detailForms} />
    </>
  );
};

export default WorkForm;
