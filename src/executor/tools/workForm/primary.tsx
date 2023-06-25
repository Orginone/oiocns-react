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
  onChanged?: (id: string, data: model.FormEditData) => void;
}

const parseLastSource = (data: model.InstanceDataModel, id: string, userId: string) => {
  if (data.data[id] && data.data[id].length > 0) {
    const item = data.data[id].slice(-1)[0];
    if (item.source && item.source.length > 0) {
      const result = item.source.slice(-1)[0];
      if (!result['Id']) {
        result['Id'] = 'uuid' + generateUuid();
      }
      return result;
    }
  }
  return {
    Status: '正常',
    Creater: userId,
    Id: 'uuid' + generateUuid(),
    CreateTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
    ModifiedTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
  };
};

const PrimaryForms: React.FC<IProps> = (props) => {
  if (props.forms.length < 1) return <></>;
  const [activeTabKey, setActiveTabKey] = useState(props.forms[0].id);
  const loadItems = () => {
    return props.forms.map((f) => {
      const source = parseLastSource(props.data, f.id, props.belong.userId);
      const changed: any = {};
      changed[source['Id']] = {};
      return {
        key: f.id,
        label: f.name,
        children: (
          <OioForm
            key={f.id}
            form={f}
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
                changed[source['Id']][k] = a[k];
              });
              props.onChanged?.apply(this, [
                f.id,
                {
                  source: [{ ...source, ...values }],
                  changed: changed,
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
