import React, { useState, useEffect } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { Select, InputNumber, Input, Form } from 'antd';
import {
  NodeType,
  conditiondType,
  getConditionKeys,
  dataType,
  FieldCondition,
} from '../../processType';
import cls from './index.module.less';

interface IProps {
  currnet: NodeType;
  conditions: FieldCondition[];
}

/**
 * @description: 条件
 * @return {*}
 */
const ConditionGroupItemConfig: React.FC<IProps> = (props) => {
  const [key, setKey] = useState(0);
  const [form] = Form.useForm();
  const [currentNode, setCurrentNode] = useState<NodeType>();
  const [conditions, setConditions] = useState<FieldCondition[]>([]);

  useEffect(() => {
    setCurrentNode(props.currnet);
    setConditions(props.conditions);
    form.setFieldsValue({ allContent: props.currnet.conditions });
  }, [props]);

  return (
    <div>
      <Form
        form={form}
        onValuesChange={async () => {
          const currentValue = await form.getFieldsValue();
          const newArr: string[] = []; // 重置当前条件 不然会越来越多 给不上值
          currentNode?.conditions.map((item: conditiondType, index: number) => {
            /** 怎么知道paramKey有没有变化 */
            item.val = currentValue.allContent[index].val;
            item.label = currentValue.allContent[index].label;
            item.paramKey = currentValue.allContent[index].paramKey;
            item.paramLabel = currentValue.allContent[index].paramLabel;
            /**这里临时存一个数组,用来判断新旧值是否发生变化，然后清空值 */
            // if (paramKeyArr[index] !== currentValue.allContent[index].paramKey) {
            //   currentValue.allContent[index].val = '';
            //   form.setFieldsValue({
            //     allContent: [...currentValue.allContent],
            //   });
            // }
            /**当前数组得替换一下 */
            newArr.push(currentValue.allContent[index].paramKey);
            // setParamKeyArr(newArr);
            item.type = currentValue.allContent[index].type;
            /**当前条件查找，填写paramLabel */
            const findCon = (conditions || []).find((innItem) => {
              return innItem.value === currentValue.allContent[index].paramKey;
            });
            item.paramLabel = findCon ? findCon?.label : '';
            item.type = findCon ? findCon?.type : dataType.STRING;
            item.key = currentValue.allContent[index].key;
            if (findCon) {
              /** 大于小于条件查找 */
              const conkeys = getConditionKeys(findCon.type).find(
                (innItem: { value: string; label: string }) => {
                  return innItem.value === currentValue.allContent[index].key;
                },
              );
              item.label = conkeys ? conkeys?.label : '';
              /** 查询符合条件的枚举值 */
              if (findCon.type === 'DICT' && findCon.dict) {
                const findConLabel = findCon.dict.find(
                  (innItem: { value: string; label: string }) => {
                    return innItem.value === currentValue.allContent[index].val;
                  },
                );
                /** 枚举值赋值 */
                item.valLabel = findConLabel?.label || '';
              }
            }
            item.display = `${item.paramLabel} ${item.label} ${item.val} `;
          });
          // setCurretEditorValue([...(currentOpNode?.conditions || [])]);
        }}>
        {[...(currentNode?.conditions || [])]?.map((condition, index) => (
          <div key={index + '_g'} className={cls['group']}>
            <div className={cls['group-header']}>
              <div
                onClick={() => {
                  currentNode?.conditions.splice(index, 1);
                  setCurrentNode(currentNode);
                  setKey(key + 1);
                }}>
                <AiOutlineDelete />
              </div>
              <span className={cls['group-name']}>参数{index}</span>

              <div className={cls['group-cp']}>
                <Form.Item name={['allContent', index, 'paramKey']}>
                  <Select
                    style={{ width: 130 }}
                    placeholder="请选择参数"
                    allowClear
                    options={conditions}
                    onChange={(e) => {
                      conditions.forEach((element: FieldCondition) => {
                        if (element.value == e) {
                          condition.type = element.type;
                          condition.paramKey = e;
                          condition.paramLabel = element.label;
                          if (element.dict) {
                            condition.dict = element.dict;
                          } else {
                            setKey(key + 1);
                          }
                        }
                      });
                    }}
                  />
                </Form.Item>

                {/* 如果不是数字 */}
                {condition.type != 'NUMERIC' && (
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
                )}
                {/* 数字类型 */}
                {condition.type == 'NUMERIC' && (
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
                )}
                {/* 既不是枚举也不是数字类型 */}
                {condition.type != 'DICT' && condition.type != 'NUMERIC' && (
                  <Form.Item name={['allContent', index, 'val']}>
                    <Input style={{ width: 200 }} placeholder="请输入值" allowClear />
                  </Form.Item>
                )}
                {/* 数字类型 */}
                {condition.type == 'NUMERIC' && (
                  <Form.Item name={['allContent', index, 'val']}>
                    <InputNumber style={{ width: 200 }} />
                  </Form.Item>
                )}
                {/* 枚举类型 */}
                {condition.type == 'DICT' && (
                  <Form.Item name={['allContent', index, 'val']}>
                    <Select
                      style={{ width: 200 }}
                      placeholder="请选择"
                      allowClear
                      options={condition.dict || []}
                    />
                  </Form.Item>
                )}
              </div>
              <div className={cls['group-operation']}></div>
            </div>
            <div className={cls['group-content']}></div>
          </div>
        ))}
      </Form>
    </div>
  );
};
export default ConditionGroupItemConfig;
