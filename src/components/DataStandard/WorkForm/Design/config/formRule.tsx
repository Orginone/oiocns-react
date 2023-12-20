import { Emitter } from '@/ts/base/common';
import { IForm } from '@/ts/core';
import { CheckBox, FilterBuilder, Form } from 'devextreme-react';
import { GroupItem, SimpleItem } from 'devextreme-react/form';
import React, { useEffect, useState } from 'react';

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
  const [fields, setFields] = useState<any[]>([]);
  useEffect(() => {
    current.loadFields().then((f) => {
      const fields = f.map((a) => {
        switch (a.valueType) {
          case '数值型':
            return {
              dataField: a.code,
              caption: a.name,
              dataType: 'number',
            };
          case '日期型':
            return {
              dataField: a.code,
              caption: a.name,
              dataType: 'date',
            };
          case '时间型':
            return {
              dataField: a.code,
              caption: a.name,
              dataType: 'datetime',
            };
          case '选择型':
          case '分类型':
            return {
              dataField: a.code,
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
            return {
              dataField: a.code,
              caption: a.name,
              dataType: 'string',
            };
        }
      });
      setFields([
        {
          dataField: 'name',
          caption: '表单名称',
          dataType: 'string',
        },
        ...fields,
      ]);
    });
  }, [current]);
  const loadOperateRule = (label: string, operate: string) => {
    return (
      <SimpleItem label={{ text: label }}>
        <CheckBox
          defaultValue={operateRule[operate] ?? true}
          onValueChange={(e) => {
            operateRule[operate] = e;
            setOperateRule(operateRule);
            current.metadata.operateRule = JSON.stringify(operateRule);
            notityAttrChanged();
          }}
        />
      </SimpleItem>
    );
  };
  return (
    <Form
      scrollingEnabled
      height={'calc(100vh - 130px)'}
      formData={current.metadata}
      onFieldDataChanged={notityAttrChanged}>
      <GroupItem caption={'操作规则参数'} />
      {loadOperateRule('允许新增', 'allowAdd')}
      {loadOperateRule('允许选择', 'allowSelect')}
      {loadOperateRule('允许变更', 'allowEdit')}
      <GroupItem caption={'数据过滤规则参数'} />
      {fields.length > 0 && (
        <SimpleItem>
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
        </SimpleItem>
      )}
    </Form>
  );
};

export default FormRuleConfig;
