import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import {
  conditiondType,
  dataType,
  getConditionKeys,
  NodeModel,
} from '../../../processType';
import cls from './index.module.less';
import { AiOutlineDelete } from 'react-icons/ai';
import { model } from '@/ts/base';

interface Iprops {
  current: NodeModel;
  conditions: model.FieldModel[];
  refresh: () => void;
}

/**
 * @description: 条件
 * @return {*}
 */

const ConditionNode: React.FC<Iprops> = (props) => {
  if (props.conditions.length < 1) return <>请先选择主表且有特性</>;
  const [key, setKey] = useState(0);
  const [form] = Form.useForm();
  const [currentNode, setCurrentNode] = useState<NodeModel>();

  useEffect(() => {
    setCurrentNode(props.current);
    form.setFieldsValue({ allContent: props.current.conditions });
  }, [props]);

  /**点击添加的时候默认增加一行 */
  const addConditionGroup = () => {
    props.current?.conditions?.push({
      pos: props.current?.conditions.length + 1,
      paramKey: '',
      paramLabel: '',
      key: '',
      label: '',
      type: dataType.NUMERIC,
      val: undefined,
      display: '',
    });
    setKey(key + 1);
  };

  const loadOperateItem = (condition: conditiondType, index: number) => {
    if (condition.type != 'NUMERIC') {
      return (
        <Form.Item name={['allContent', index, 'key']}>
          <Select
            style={{ width: 80 }}
            placeholder="判断条件"
            allowClear
            options={[
              { value: 'EQ', label: '=' },
              { value: 'NEQ', label: '≠' },
            ]}
          />
        </Form.Item>
      );
    } else {
      return (
        <Form.Item name={['allContent', index, 'key']}>
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
          />
        </Form.Item>
      );
    }
  };

  const loadValueItem = (condition: conditiondType, index: number) => {
    switch (condition.type) {
      case 'DICT':
        return (
          <Form.Item name={['allContent', index, 'val']}>
            <Select
              style={{ width: 200 }}
              placeholder="请选择"
              allowClear
              fieldNames={{
                label: 'text',
                value: 'value',
              }}
              options={condition.dict || []}
            />
          </Form.Item>
        );
      case 'NUMERIC':
        return (
          <Form.Item name={['allContent', index, 'val']}>
            <InputNumber style={{ width: 200 }} />
          </Form.Item>
        );
      default:
        return (
          <Form.Item name={['allContent', index, 'val']}>
            <Input style={{ width: 200 }} placeholder="请输入值" allowClear />
          </Form.Item>
        );
    }
  };

  const convertType = (valueType?: string) => {
    switch (valueType) {
      case '分类型':
      case '选择型':
        return dataType.DICT;
      case '日期型':
        return dataType.DATE;
      case '用户型':
        return dataType.BELONG;
      case '数值型':
        return dataType.NUMERIC;
    }
    return dataType.STRING;
  };

  const onChange = async () => {
    const currentValue = await form.getFieldsValue();
    const newArr: string[] = []; // 重置当前条件 不然会越来越多 给不上值
    currentNode?.conditions.map((item: conditiondType, index: number) => {
      /** 怎么知道paramKey有没有变化 */
      item.val = currentValue.allContent[index].val;
      item.label = currentValue.allContent[index].label;
      item.paramKey = currentValue.allContent[index].paramKey;
      item.paramLabel = currentValue.allContent[index].paramLabel;
      /**当前数组得替换一下 */
      newArr.push(currentValue.allContent[index].paramKey);
      // setParamKeyArr(newArr);
      item.type = currentValue.allContent[index].type;
      /**当前条件查找，填写paramLabel */
      const findCon = props.conditions.find((innItem) => {
        return innItem.id === currentValue.allContent[index].paramKey;
      });
      item.paramLabel = findCon ? findCon?.name : '';
      item.type = convertType(findCon?.valueType);
      item.key = currentValue.allContent[index].key;
      if (findCon) {
        /** 大于小于条件查找 */
        const conkeys = getConditionKeys(item.type).find(
          (innItem: { value: string; label: string }) => {
            return innItem.value === currentValue.allContent[index].key;
          },
        );
        item.label = conkeys ? conkeys?.label : '';
        /** 查询符合条件的枚举值 */
        if (item.type === dataType.DICT) {
          const findConLabel = findCon?.lookups?.find((innItem) => {
            return innItem.value === currentValue.allContent[index].val;
          });
          /** 枚举值赋值 */
          item.valLabel = findConLabel?.text || '';
        }
      }
      item.display = `${item.paramLabel} ${item.label} ${item.valLabel || item.val} `;
    });
    props.refresh();
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <Button type="primary" onClick={addConditionGroup}>
          添加条件
        </Button>
      </div>{' '}
      <div>
        <Form key={key} form={form} onValuesChange={onChange}>
          {(currentNode?.conditions || []).map((condition, index) => (
            <div key={index + '_g'} className={cls['group']}>
              <div className={cls['group-header']}>
                <div
                  onClick={() => {
                    currentNode!.conditions.splice(index, 1);
                    setCurrentNode(currentNode);
                    setKey(key + 1);
                  }}>
                  <AiOutlineDelete />
                </div>
                <span className={cls['group-name']}>参数{index + 1}</span>
                <div className={cls['group-operation']}></div>
              </div>
              <div className={cls['group-content']}>
                <Form.Item name={['allContent', index, 'paramKey']}>
                  <Select
                    style={{ width: 130 }}
                    placeholder="请选择参数"
                    allowClear
                    options={(props.conditions || []).map((i) => {
                      return { label: i.name, value: i.id };
                    })}
                    onChange={(e) => {
                      props.conditions.forEach((element) => {
                        if (element.id == e) {
                          condition.type = convertType(element.valueType);
                          condition.paramKey = e;
                          condition.val = '';
                          condition.paramLabel = element.name;
                          if (element.lookups && element.lookups.length > 0) {
                            condition.dict = element.lookups;
                          }
                          setKey(key + 1);
                        }
                      });
                    }}
                  />
                </Form.Item>
                {loadOperateItem(condition, index)}
                {loadValueItem(condition, index)}
              </div>
            </div>
          ))}
        </Form>
      </div>
    </div>
  );
};
export default ConditionNode;
