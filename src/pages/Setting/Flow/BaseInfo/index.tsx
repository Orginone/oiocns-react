import React, { useState } from 'react';
import { ProFormText } from '@ant-design/pro-components';
import { Space, Form, Select, Input, Button, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { deepClone } from '@/ts/base/common';
import cls from './index.module.less';
type BaseInfoProps = {
  nextStep: () => void;
};

const BaseInfo: React.FC<BaseInfoProps> = ({ nextStep }) => {
  const [baseList, setBaseList] = useState([{}]);

  const [form] = Form.useForm();

  const onFinish = async () => {
    const currentData = await form.validateFields();
    if (currentData) {
      nextStep();
    }
  };

  return (
    <div className={cls['contentMes']}>
      <Form
        form={form}
        name="dynamic_form_complex"
        autoComplete="off"
        initialValues={{ allContent: [] }}
        style={{ width: '800px' }}>
        {baseList.map((item, index) => {
          return (
            <div>
              <h1 style={{ fontSize: '20px' }}>业务{index + 1}</h1>
              <div className={cls['contentInputMes']}>
                <ProFormText
                  name={['allContent', index, 'busMes']}
                  label="业务信息"
                  style={{ width: '100%' }}
                  placeholder="输入流程名称"
                  addonAfter={
                    <Space>
                      <a
                        onClick={() => {
                          const cloneValue = deepClone(baseList);
                          cloneValue.push({});
                          setBaseList(cloneValue);
                        }}>
                        添加
                      </a>
                      <a
                        onClick={async () => {
                          const cloneValue = deepClone(baseList);
                          if (cloneValue.length > 1) {
                            /**
                             * 这里其实是被表单接管了，看看后面能不能优化一下
                             * */
                            cloneValue.splice(index, 1);
                            setBaseList(cloneValue);
                            const formValue = await form.getFieldsValue();
                            formValue.allContent.splice(index, 1);
                            form.setFieldsValue(formValue);
                            console.log('formValue', formValue);
                          } else {
                            message.warning('必须有一个业务');
                            return false;
                          }
                        }}>
                        删除
                      </a>
                    </Space>
                  }
                  rules={[{ required: true, message: '请输入流程名称！' }]}
                />
              </div>
              <Form.List name={['allContent', index, 'sights']}>
                {(fields, { add, remove }) => (
                  <>
                    {console.log(fields)}
                    {fields.map((field) => (
                      <Space key={field.key} align="baseline">
                        <Form.Item
                          {...field}
                          label="字段名称"
                          name={[field.name, 'textName']}
                          rules={[{ required: true, message: '输入字段名称' }]}>
                          <Input placeholder="输入字段名称" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          label="字段编号"
                          name={[field.name, 'textNum']}
                          rules={[{ required: true, message: '输入字段编号' }]}>
                          <Input placeholder="输入字段编号" />
                        </Form.Item>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, curValues) =>
                            prevValues.textName !== curValues.textName ||
                            prevValues.textNum !== curValues.textNum
                          }>
                          {() => (
                            <Form.Item
                              {...field}
                              label="字段类型"
                              name={[field.name, 'textType']}
                              rules={[{ required: true, message: '请选择字段类型' }]}>
                              <Select
                                placeholder="选择字段类型"
                                // disabled={!form.getFieldValue('area')}
                                options={[
                                  {
                                    value: '字符串',
                                    label: '字符串',
                                  },
                                  {
                                    value: '数字',
                                    label: '数字',
                                  },
                                  {
                                    value: '枚举',
                                    label: '枚举',
                                  },
                                ]}
                                style={{ width: 130 }}></Select>
                            </Form.Item>
                          )}
                        </Form.Item>

                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      </Space>
                    ))}

                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}>
                        添加字段信息
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
          );
        })}
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => {
            onFinish();
          }}>
          下一步
        </Button>
      </Form>
    </div>
  );
};

export default BaseInfo;
