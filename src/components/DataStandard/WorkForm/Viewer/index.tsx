import { common, model, schema } from '@/ts/base';
import { IBelong } from '@/ts/core';
import React from 'react';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import FormItem from './formItem';
import { Emitter, logger } from '@/ts/base/common';
import { getItemNums } from '../Utils';
import useStorage from '@/hooks/useStorage';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { transformExpression } from '@/utils/script';

const WorkFormViewer: React.FC<{
  data: any;
  belong: IBelong;
  form: schema.XForm;
  readonly?: boolean;
  showTitle?: boolean;
  fields: model.FieldModel[];
  rule: { [id: string]: { [type: string]: any } };
  onValuesChange?: (fieldId: string, value: any, data: any) => void;
}> = (props) => {
  const [key, forceUpdate] = useObjectUpdate(props.rule);
  const formData: any = { name: props.form.name, ...props.data };
  const [notifyEmitter] = React.useState(new Emitter());
  const [colNum, setColNum] = useStorage('workFormColNum', '一列');
  const onValueChange = (fieldId: string, value: any) => {
    if (value === undefined || value === null) {
      delete props.data[fieldId];
    } else {
      props.data[fieldId] = value;
    }
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
          const dataValue = props.data[rules[0]];
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
                const values = rules[2];
                if (Array.isArray(values) && values.length == 2) {
                  return dataValue > values[0] && dataValue <= values[1];
                }
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
        }
        return pass;
      };
      const rules = props.form.rule?.filter((a) => a.trigger.includes(key)) ?? [];
      for (const rule of rules) {
        const target = props.fields.find((a) => a.id == rule.target);
        if (target) {
          if (props.rule[rule.target] == undefined) {
            props.rule[rule.target] = {};
          }
          switch (rule.type) {
            case 'show':
              const showRule = rule as schema.FormShowRule;
              const value =
                showRule.showType == 'hideField' ? !showRule.value : showRule.value;
              var pass = vaildRule(JSON.parse(showRule.condition));
              props.rule[showRule.target][showRule.showType] = pass ? value : !value;
              break;
            case 'calc':
              const calcRule = rule as schema.FormCalcRule;
              var formula = calcRule.formula;
              for (var i = 0; i < calcRule.trigger.length; i++) {
                const triggerData = props.data[calcRule.trigger[i]];
                if (!triggerData) {
                  return false;
                } else {
                  formula = formula.replaceAll(`@${i}@`, JSON.stringify(triggerData));
                }
              }
              try {
                props.data[calcRule.target] = running(
                  `nextData = ${formula}`,
                  { data: props.data },
                  { target: calcRule.target },
                );
              } catch (error: any) {
                logger.error(`计算规则[${formula}]执行失败，请确认是否维护正确!\n` + error.message);
              }
              break;
          }
        }
      }
      return rules.length > 0;
    };
    props.onValuesChange?.apply(this, [fieldId, value, props.data]);
    if (runRule(fieldId)) {
      forceUpdate();
    }
  };

  const running = (code: string, args: any, env?: model.KeyValue): any => {
    const runtime = {
      environment: env ?? {},
      preData: args,
      nextData: {},
      decrypt: common.decrypt,
      encrypt: common.encrypt,
    };
    
    const result = transformExpression(code);
    common.Sandbox(result.code)(runtime);
    return runtime.nextData;
  };

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
          data={formData}
          numStr={colNum}
          rule={{}}
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
          const itemRule = props.rule[field.id] ?? {};
          return (
            <FormItem
              key={field.id}
              data={formData}
              numStr={colNum}
              rule={itemRule}
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
