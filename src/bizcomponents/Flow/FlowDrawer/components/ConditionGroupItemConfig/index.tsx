import React, { useState, useCallback, useEffect } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Select, InputNumber, Input, Form } from 'antd';
import DefaultProps, { useAppwfConfig } from '@/bizcomponents/Flow/flow';
import cls from './index.module.less';

type ConditionGroupItemConfigProps = {};

type conditionType = {
  val: string;
  paramKey: string;
  type: string;
  paramLabel: string;
  pos: number;
  valLabel: string;
  label: String;
  key: string;
};

/**
 * @description: 条件
 * @return {*}
 */
const ConditionGroupItemConfig: React.FC<ConditionGroupItemConfigProps> = () => {
  const [form] = Form.useForm();
  const [curretEditorValue, setCurretEditorValue] = useState<conditionType[]>([]);
  const [paramKeyArr, setParamKeyArr] = useState<string[]>([]);
  const selectedNode = useAppwfConfig((state: any) => state.selectedNode);
  const setSelectedNode = useAppwfConfig((state: any) => state.setSelectedNode);
  const [key, setKey] = useState(0);
  const dictory = useCallback((paramKey: any) => {
    var filter = DefaultProps.getFormFields()?.filter(
      (item: any) => item.value == paramKey,
    );

    if (filter && filter.length > 0) {
      return filter[0].dict.filter((item: any) => item.label && item.value);
    }
    return [];
  }, []);

  useEffect(() => {
    // const currentCondtions = DefaultProps.getFormFields(); //所有的条件
    /** 干掉条件不存在的 */
    // const filterResult = selectedNode.conditions.filter(
    //   (item: { paramKey: string; paramLabel: string }) => {
    //     const findData = currentCondtions.find((innItem) => {
    //       return innItem.value === item.paramKey && innItem.label === item.paramLabel;
    //     });

    //     return typeof findData !== 'undefined';
    //   },
    // );
    form.setFieldsValue({ allContent: selectedNode.conditions });
    setCurretEditorValue([...selectedNode.conditions]);
    const paramKey = selectedNode.conditions.map((item: conditionType) => {
      return item.paramKey;
    });
    setParamKeyArr(paramKey);
  }, []);

  return (
    <div>
      <Form
        form={form}
        onValuesChange={async () => {
          const currentValue = await form.getFieldsValue();
          const currentCondtions = DefaultProps.getFormFields(); //所有的条件
          const newArr: string[] = []; // 重置当前条件 不然会越来越多 给不上值
          selectedNode.conditions.map((item: conditionType, index: number) => {
            /** 怎么知道paramKey有没有变化 */
            item.val = currentValue.allContent[index].val;
            item.paramKey = currentValue.allContent[index].paramKey;
            /**这里临时存一个数组,用来判断新旧值是否发生变化，然后清空值 */
            if (paramKeyArr[index] !== currentValue.allContent[index].paramKey) {
              currentValue.allContent[index].val = '';
              form.setFieldsValue({
                allContent: [...currentValue.allContent],
              });
            }
            /**当前数组得替换一下 */
            newArr.push(currentValue.allContent[index].paramKey);
            setParamKeyArr(newArr);
            item.type = currentValue.allContent[index].type;
            /**当前条件查找，填写paramLabel */
            const findCon = currentCondtions.find((innItem) => {
              return innItem.value === currentValue.allContent[index].paramKey;
            });

            item.paramLabel = findCon ? findCon?.label : '';
            item.type = findCon ? findCon?.type : '';
            item.key = currentValue.allContent[index].key;
            if (findCon) {
              /** 大于小于条件查找 */
              const conkeys = DefaultProps.getConditionKeys(findCon.type).find(
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
                item.valLabel = findConLabel?.label;
              }
            }
          });
          setCurretEditorValue([...selectedNode.conditions]);
        }}>
        {curretEditorValue?.map((condition: any, index: number) => (
          <div key={index + '_g'} className={cls['group']}>
            <div className={cls['group-header']}>
              <div
                onClick={() => {
                  selectedNode.conditions.splice(index, 1);
                  setSelectedNode(selectedNode);
                  setKey(key + 1);
                }}>
                <DeleteOutlined />
              </div>
              <span className={cls['group-name']}>参数{index}</span>

              <div className={cls['group-cp']}>
                <Form.Item name={['allContent', index, 'paramKey']}>
                  <Select
                    style={{ width: 150 }}
                    placeholder="请选择参数"
                    allowClear
                    options={DefaultProps.getFormFields()}
                  />
                </Form.Item>

                {/* 如果不是数字 */}
                {condition.type != 'NUMERIC' && (
                  <Form.Item name={['allContent', index, 'key']}>
                    <Select
                      style={{ width: 100 }}
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
                {/* 数字类型 */}
                {condition.type == 'NUMERIC' && (
                  <Form.Item name={['allContent', index, 'val']}>
                    <InputNumber style={{ width: 200 }} />
                  </Form.Item>
                )}
                {/* 如果是枚举类型 */}
                {condition.type == 'DICT' && (
                  <Form.Item name={['allContent', index, 'val']}>
                    <Select
                      style={{ width: 200 }}
                      placeholder="请选择"
                      allowClear
                      options={dictory(condition.paramKey)}
                    />
                  </Form.Item>
                )}
                {/* 既不是枚举也不是数字类型 */}
                {condition.type != 'DICT' && condition.type != 'NUMERIC' && (
                  <Form.Item name={['allContent', index, 'val']}>
                    <Input style={{ width: 200 }} placeholder="请输入值" allowClear />
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
