import React, { useState, useCallback, useContext } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Select, InputNumber, Input } from 'antd';
import DefaultProps, { useAppwfConfig } from '@/bizcomponents/Flow/flow';
import { EventContext } from '@/bizcomponents/Flow/ProcessDesign/index';
import cls from './index.module.less';

type ConditionGroupItemConfigProps = {};

/**
 * @description: 条件
 * @return {*}
 */
const ConditionGroupItemConfig: React.FC<ConditionGroupItemConfigProps> = () => {
  const selectedNode = useAppwfConfig((state: any) => state.selectedNode);
  const setSelectedNode = useAppwfConfig((state: any) => state.setSelectedNode);
  const { conditionData } = useContext(EventContext);
  console.log('conditionData', conditionData);
  const [key, setKey] = useState(0);

  const paramChange = (paramKey: any, condition: any) => {
    console.log('选中之后标题没有赋值', condition);
    console.log('选中之后标题key', paramKey);
    for (let field of DefaultProps.getFormFields()) {
      if (field.value == paramKey) {
        condition.paramKey = paramKey;
        condition.paramLabel = field.label;
        condition.type = field.type;

        let keys = DefaultProps.getConditionKeys(condition.type).map(
          (el: any) => el.value,
        );
        if (!keys.includes(condition.key)) {
          condition.key = null;
          condition.label = '';
        }
        condition.val = null;
        condition.valLabel = '';
        setKey(key + 1);
      }
    }
  };

  const keyChange = (operation: any, condition: any) => {
    condition.key = operation;
    for (let key of DefaultProps.getConditionKeys(condition.type)) {
      if (key.value == operation) {
        condition.label = key.label;
      }
    }
  };

  const valueChange = (value: any, condition: any) => {
    condition.val = value;
    var filter = DefaultProps.getFormFields().filter(
      (item: any) => item.value == condition.paramKey,
    );
    var dict = [];
    if (filter && filter.length > 0) {
      dict = filter[0].dict;
    }
    dict = dict || [];
    for (let item of dict) {
      if (item.value == value) {
        condition.valLabel = item.label;
        break;
      }
    }
  };

  // const conditionKeys = useCallback(
  //   (type: any) => DefaultProps.getConditionKeys(type),
  //   [],
  // );

  const dictory = useCallback((paramKey: any) => {
    var filter = DefaultProps.getFormFields().filter(
      (item: any) => item.value == paramKey,
    );

    if (filter && filter.length > 0) {
      return filter[0].dict.filter((item: any) => item.label && item.value);
    }
    return [];
  }, []);

  return (
    <div>
      {selectedNode.conditions.map((condition: any, index: number) => (
        <div key={index + '_g'} className={cls['group']}>
          <div className={cls['group-header']}>
            <div
              onClick={(e) => {
                selectedNode.conditions.splice(index, 1);
                setSelectedNode(selectedNode);
                setKey(key + 1);
              }}>
              <DeleteOutlined />
            </div>
            <span className={cls['group-name']}>参数{index}</span>
            <div className={cls['group-cp']}>
              <Select
                style={{ width: 150 }}
                placeholder="请选择参数"
                allowClear
                // 需要选择的参数
                options={conditionData?.labels || []}
                onChange={(val, option) => {
                  console.log('选中的值为啥没有复现', option);
                  paramChange(val, condition);
                }}
                defaultValue={condition.paramKey || null}
              />
              {/* <Select
                style={{ width: 100 }}
                placeholder="判断条件"
                allowClear
                options={[conditionKeys(condition.type)]}
              /> */}
              {condition.type != 'NUMERIC' && (
                <Select
                  style={{ width: 100 }}
                  placeholder="判断条件"
                  allowClear
                  options={[
                    { value: 'EQ', label: '=' },
                    { value: 'NEQ', label: '≠' },
                  ]}
                  onChange={(val) => {
                    keyChange(val, condition);
                  }}
                  defaultValue={condition.key || null}
                />
              )}
              {condition.type == 'NUMERIC' && (
                <Select
                  style={{ width: 100 }}
                  placeholder="判断条件"
                  allowClear
                  options={[
                    { value: 'EQ', label: '=' },
                    { value: 'GT', label: '>' },
                    { value: 'GTE', label: '≥' },
                    { value: 'LT', label: '<' },
                    { value: 'LTE', label: '≤' },
                    { value: 'NEQ', label: '≠' },
                  ]}
                  onChange={(val) => {
                    keyChange(val, condition);
                  }}
                  defaultValue={condition.key || null}
                />
              )}
              {condition.type == 'NUMERIC' && (
                <InputNumber
                  style={{ width: 200 }}
                  onChange={(val) => {
                    valueChange(val, condition);
                  }}
                  defaultValue={condition.val || null}
                />
              )}
              {condition.type == 'DICT' && (
                <Select
                  style={{ width: 200 }}
                  placeholder="请选择"
                  allowClear
                  options={dictory(condition.paramKey)}
                  onChange={(val) => {
                    valueChange(val, condition);
                  }}
                  defaultValue={condition.val || null}
                />
              )}
              {condition.type != 'DICT' && condition.type != 'NUMERIC' && (
                <Input
                  style={{ width: 200 }}
                  placeholder="请输入值"
                  allowClear
                  onChange={(val) => {
                    valueChange(val.target?.value, condition);
                  }}
                  defaultValue={condition.val || null}
                />
              )}
            </div>
            <div className={cls['group-operation']}></div>
          </div>
          <div className={cls['group-content']}></div>
        </div>
      ))}
    </div>
  );
};
export default ConditionGroupItemConfig;
