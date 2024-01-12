import { common, model, schema } from '@/ts/base';
import { IBelong } from '@/ts/core';
import React, { useEffect } from 'react';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import FormItem from './formItem';
import { Emitter, logger } from '@/ts/base/common';
import { getItemNums } from '../Utils';
import useStorage from '@/hooks/useStorage';
import useObjectUpdate from '@/hooks/useObjectUpdate';

const WorkFormViewer: React.FC<{
  data: any;
  belong: IBelong;
  form: schema.XForm;
  readonly?: boolean;
  showTitle?: boolean;
  fields: model.FieldModel[];
  changedFields: model.MappingData[];
  rules: model.RenderRule[];
  formData?: model.FormEditData;
  onValuesChange?: (fieldId: string, value: any, data: any) => void;
}> = (props) => {
  props.data.name = props.form.name;
  const [key, forceUpdate] = useObjectUpdate(props.rules);
  const [notifyEmitter] = React.useState(new Emitter());
  const [colNum, setColNum] = useStorage('workFormColNum', '一列');
  const onValueChange = (fieldId: string, value: any, refresh: boolean = true) => {
    const checkHasChanged = (fieldId: string, value: any) => {
      const oldValue = props.data[fieldId];
      if (oldValue) {
        return value != oldValue || value === undefined || value === null;
      } else {
        return value !== undefined && value !== null;
      }
    };
    const runRule = (key: string) => {
      const vaildRule = (rules: any[]): boolean => {
        var pass: boolean = false;
        if (rules.includes('and') || rules.includes('or')) {
          var operate = 'and';
          var result: boolean[] = [];
          for (const rule of rules) {
            if (Array.isArray(rule)) {
              result.push(vaildRule(rule));
            } else if (['and', 'or'].includes(rule)) {
              operate = rule;
            }
          }
          return operate == 'and' ? !result.includes(false) : result.includes(true);
        } else if (rules.length == 3) {
          const dataValue = props.data[rules[0].replace('T', '')];
          if (dataValue) {
            switch (rules[1]) {
              case '=':
                return dataValue == rules[2];
              case '<>':
                return dataValue != rules[2];
              case '>':
                return dataValue > rules[2];
              case '>=':
                return dataValue >= rules[2];
              case '<':
                return dataValue < rules[2];
              case '<=':
                return dataValue <= rules[2];
              case 'contains':
                return `${dataValue}`.includes(rules[2]);
              case 'notcontains':
                return !`${dataValue}`.includes(rules[2]);
              case 'startswith':
                return `${dataValue}`.startsWith(rules[2]);
              case 'endswith':
                return `${dataValue}`.endsWith(rules[2]);
              case 'isblank':
                return `${dataValue}`.trim().length == 0;
              case 'isnotblank':
                return `${dataValue}`.trim().length > 0;
              case 'between':
                if (Array.isArray(rules[2]) && rules[2].length == 2) {
                  return dataValue > rules[2][0] && dataValue <= rules[2][1];
                }
                break;
              default:
                break;
            }
          }
        } else if (rules.length == 2) {
          switch (rules[1]) {
            case 'isblank':
              return props.data[rules[0]] == undefined;
            case 'isnotblank':
              return props.data[rules[0]] != undefined;
            default:
              break;
          }
        } else if (rules.length == 1) {
          return vaildRule(rules[0]);
        }
        return pass;
      };
      const rules =
        props.form.rule?.filter((a) => a.trigger.find((s) => s.includes(key))) ?? [];
      for (const rule of rules) {
        if ('target' in rule) {
          const target = props.fields.find((a) => a.id == rule.target);
          if (target) {
            switch (rule.type) {
              case 'show':
                {
                  var showRule = rule as model.FormShowRule;
                  var pass = vaildRule(JSON.parse(showRule.condition));
                  const oldRule = props.formData?.rules.find(
                    (a) => a.destId == showRule.target && a.typeName == showRule.showType,
                  );
                  if (oldRule) {
                    let newValue = pass ? showRule.value : !showRule.value;
                    if (oldRule.value != newValue) {
                      oldRule.value = pass ? showRule.value : !showRule.value;
                    }
                  } else {
                    props.formData?.rules.push({
                      formId: props.form.id,
                      destId: showRule.target,
                      typeName: showRule.showType,
                      value: pass ? showRule.value : !showRule.value,
                    });
                  }
                }
                break;
              case 'calc':
                var calcRule = rule as model.FormCalcRule;
                var formula = calcRule.formula;
                try {
                  var isLegal = true;
                  var runtime: any = {
                    value: {},
                    decrypt: common.decrypt,
                    encrypt: common.encrypt,
                  };
                  calcRule.mappingData?.forEach((s) => {
                    {
                      const value = props.data[s.id];
                      if (!value) {
                        isLegal = false;
                      }
                      runtime[s.code] = value;
                    }
                  });
                  for (var i = 0; i < calcRule.trigger.length; i++) {
                    const triggerData = props.data[calcRule.trigger[i].replace('T', '')];
                    if (triggerData) {
                      formula = formula.replaceAll(`@${i}@`, JSON.stringify(triggerData));
                    } else {
                      isLegal = false;
                      break;
                    }
                  }
                  if (!isLegal) {
                    const defaultValue = props.fields.find((a) => a.id == calcRule.target)
                      ?.options?.defaultValue;
                    if (defaultValue) {
                      props.data[calcRule.target] = defaultValue;
                    } else {
                      delete props.data[calcRule.target];
                    }
                    return true;
                  } else {
                    common.Sandbox('value=' + formula)(runtime);
                    props.data[calcRule.target] = runtime.value;
                  }
                } catch {
                  logger.error(`计算规则[${formula}]执行失败，请确认是否维护正确!`);
                }
                break;
            }
          }
        }
      }
      return rules.length > 0;
    };
    if (checkHasChanged(fieldId, value)) {
      if (value === undefined || value === null) {
        delete props.data[fieldId];
      } else {
        props.data[fieldId] = value;
      }
      props.onValuesChange?.apply(this, [fieldId, value, props.data]);
      if (runRule(fieldId) && refresh) {
        forceUpdate();
      }
    }
  };
  useEffect(() => {
    if (props.changedFields) {
      props.changedFields
        .filter((a) => a.formId == props.form.id)
        .forEach((s) => {
          onValueChange(s.id, props.data[s.id], false);
        });
      forceUpdate();
    }
  }, [props.changedFields]);

  return (
    <div style={{ padding: 16 }} key={key}>
      <Toolbar height={60}>
        <Item
          location="center"
          locateInMenu="never"
          render={() => (
            <div className="toolbar-label">
              <b style={{ fontSize: 28 }}>{props.form.name}</b>
            </div>
          )}
        />
        <Item
          location="after"
          locateInMenu="never"
          widget="dxSelectBox"
          options={{
            text: '项排列',
            value: colNum,
            items: getItemNums(),
            onItemClick: (e: { itemData: string }) => {
              setColNum(e.itemData);
            },
          }}
        />
      </Toolbar>
      <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', gap: 10 }}>
        <FormItem
          key={'name'}
          data={props.data}
          numStr={colNum}
          rules={[]}
          readOnly={props.readonly}
          field={{
            id: 'name',
            name: '名称',
            code: 'name',
            valueType: '描述型',
            remark: '数据的名称。',
            options: { hideField: true },
          }}
          belong={props.belong}
          notifyEmitter={notifyEmitter}
          onValuesChange={onValueChange}
        />
        {props.fields.map((field) => {
          return (
            <FormItem
              key={field.id}
              data={props.data}
              numStr={colNum}
              rules={[...(props.formData?.rules ?? []), ...(props?.rules ?? [])].filter(
                (a) => a.destId == field.id,
              )}
              readOnly={props.readonly}
              field={field}
              belong={props.belong}
              notifyEmitter={notifyEmitter}
              onValuesChange={onValueChange}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WorkFormViewer;
