import OioForm from '@/components/Common/FormDesign/OioFormNext';
import { formatDate } from '@/utils';
import { model, schema } from '../../../ts/base';
import { IBelong } from '@/ts/core';
import { useState } from 'react';
import React from 'react';
import { Tabs } from 'antd';
import { generateUuid } from '@/ts/base/common';

interface IProps {
  allowEdit: boolean;
  belong: IBelong;
  forms: schema.XForm[];
  data: model.InstanceDataModel;
  node: model.WorkNodeModel;
  onChanged?: (id: string, data: model.FormEditData) => void;
}

const parseLastSource = (data: model.FormEditData[], userId: string) => {
  if (data && data.length > 0) {
    const item = data.slice(-1)[0];
    if (item.source && item.source.length > 0) {
      return item.source.slice(-1)[0];
    }
  }
  return {
    Status: '正常',
    Creater: userId,
    Name: '',
    Id: 'uuid' + generateUuid(),
    CreateTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
    ModifiedTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
  };
};

const PrimaryForms: React.FC<IProps> = (props) => {
  if (props.forms.length < 1) return <></>;
  const [activeTabKey, setActiveTabKey] = useState(props.forms[0].id);
  const loadItems = () => {
    return props.forms.map((form) => {
      const source = parseLastSource(props.data.data[form.id], props.belong.userId);
      const changed: any = {};
      changed[source.Id] = {};
      return {
        key: form.id,
        label: form.name,
        children: (
          <OioForm
            key={form.id}
            form={form}
            fields={props.data.fields[form.id]}
            fieldsValue={source}
            belong={props.belong}
            disabled={!props.allowEdit}
            submitter={{
              resetButtonProps: {
                style: { display: 'none' },
              },
              render: (_: any, _dom: any) => <></>,
            }}
            onValuesChange={(a, values) => {
              Object.keys(a).forEach((k) => {
                changed[source.Id][k] = a[k];
                props.data.primary[k] = a[k];
              });
              props.onChanged?.apply(this, [
                form.id,
                {
                  source: [{ ...source, ...values }],
                  changed: changed,
                  nodeId: props.node.id,
                  creator: props.belong.userId,
                  createTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
                },
              ]);
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

export default PrimaryForms;
