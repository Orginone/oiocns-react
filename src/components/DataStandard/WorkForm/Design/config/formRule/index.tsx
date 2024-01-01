import { Emitter } from '@/ts/base/common';
import { IForm } from '@/ts/core';
import { CheckBox, FilterBuilder } from 'devextreme-react';
import React, { useEffect, useState } from 'react';
import Rule from './rule';
import { Card } from 'antd';
import { Field } from 'devextreme/ui/filter_builder';

interface IAttributeProps {
  current: IForm;
  notifyEmitter: Emitter;
}

const FormRuleConfig: React.FC<IAttributeProps> = ({ notifyEmitter, current }) => {
  const notityAttrChanged = () => {
    notifyEmitter.changCallback('form');
  };
  const [value, setValue] = useState<any>(
    JSON.parse(current.metadata.searchRule ?? '{}'),
  );
  const [operateRule, setOperateRule] = useState<any>(
    JSON.parse(current.metadata.operateRule ?? '{}'),
  );
  const [fields, setFields] = useState<Field[]>([]);
  useEffect(() => {
    current.loadFields().then((f) => {
      const fields = f.map((a) => {
        switch (a.valueType) {
          case '数值型':
            return {
              name: a.id,
              dataField: a.id,
              caption: a.name,
              dataType: 'number',
            };
          case '日期型':
            return { name: a.id, dataField: a.id, caption: a.name, dataType: 'date' };
          case '时间型':
            return {
              name: a.id,
              dataField: a.id,
              caption: a.name,
              dataType: 'datetime',
            };
          case '选择型':
          case '分类型':
            return {
              name: a.id,
              dataField: a.id,
              caption: a.name,
              dataType: 'string',
              lookup: {
                displayExpr: 'text',
                valueExpr: 'value',
                allowClearing: true,
                dataSource: a.lookups,
              },
            };
          default:
            return { name: a.id, dataField: a.id, caption: a.name, dataType: 'string' };
        }
      });
      setFields([
        { name: 'name', dataField: 'name', caption: '表单名称', dataType: 'string' },
        ...(fields as Field[]),
      ]);
    });
  }, [current]);

  const loadOperateRule = (label: string, operate: string) => {
    return (
      <span style={{ padding: 10 }}>
        {label}:
        <CheckBox
          defaultValue={operateRule[operate] ?? true}
          onValueChange={(e) => {
            operateRule[operate] = e;
            setOperateRule(operateRule);
            current.metadata.operateRule = JSON.stringify(operateRule);
            notityAttrChanged();
          }}
        />
      </span>
    );
  };
  return (
    <>
      <Rule fields={fields} form={current}></Rule>
      <Card type="inner" title="操作规则配置">
        {loadOperateRule('允许新增', 'allowAdd')}
        {loadOperateRule('允许选择', 'allowSelect')}
        {loadOperateRule('允许变更', 'allowEdit')}
      </Card>
      <Card type="inner" title="数据过滤规则配置">
        {fields.length > 0 && (
          <FilterBuilder
            fields={fields}
            value={value}
            groupOperations={['and', 'or']}
            onValueChanged={(e) => {
              setValue(e.value);
              current.metadata.searchRule = JSON.stringify(e.value);
              notityAttrChanged();
            }}
          />
        )}
      </Card>
    </>
  );
};

export default FormRuleConfig;
