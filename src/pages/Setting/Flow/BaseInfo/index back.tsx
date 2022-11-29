import React, { useState } from 'react';
import { ProFormText } from '@ant-design/pro-components';
import { Space, Form, Select, Input, Button, message, Modal } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { deepClone } from '@/ts/base/common';
import cls from './index.module.less';
type BaseInfoProps = {
  nextStep: () => void;
};

const BaseInfo: React.FC<BaseInfoProps> = ({ nextStep }) => {
  const [baseList, setBaseList] = useState([{}]);
  const [enumForm, setEnumForm] = useState<boolean>(false);
  const [formValue, setFormValue] = useState({});

  const [form] = Form.useForm();
  const [enForm] = Form.useForm();

  const onFinish = async () => {
    const currentData = await form.validateFields();
    console.log('currentData', currentData);
    // if (currentData) {
    //   nextStep();
    // }
  };

  const handleChanghe = async (e) => {
    const currentData = await form.getFieldsValue();
    console.log('currentData.allContent', currentData.allContent);
    // setFormValue(currentData.allContent);
  };

  return (
    <div className={cls['contentMes']}>
      <Form
        form={form}
        name="dynamic_form_complex"
        autoComplete="off"
        initialValues={{
          allContent: [
            {
              busMes: 1111,
              sights: [
                {
                  textType: '字符串',
                  textName: '测试名称',
                  textNum: '测试编号',
                  enumMes: [{ enumName: '', enumValue: '' }],
                },
              ],
            },
          ],
        }}
        style={{ width: '800px' }}>
        {baseList.map((item, index) => {
          return (
            <div key={item.id}>
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
                    {fields.map((innitem, innIndex) => (
                      <div key={innitem.key}>
                        <div>
                          <Space key={innitem.key} align="baseline">
                            <Form.Item
                              {...innitem}
                              label="字段名称"
                              name={[innitem.name, 'textName']}
                              rules={[{ required: true, message: '输入字段名称' }]}>
                              <Input placeholder="输入字段名称" />
                            </Form.Item>
                            <Form.Item
                              {...innitem}
                              label="字段编号"
                              name={[innitem.name, 'textNum']}
                              rules={[{ required: true, message: '输入字段编号' }]}>
                              <Input placeholder="输入字段编号" />
                            </Form.Item>
                            <Form.Item
                              {...innitem}
                              label="字段类型"
                              name={[innitem.name, 'textType']}
                              rules={[{ required: true, message: '请选择字段类型' }]}>
                              <Select
                                onChange={(e) => {
                                  // handleChanghe(e);
                                  if (e === '枚举') {
                                    setEnumForm(true);
                                  }
                                }}
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
                            <MinusCircleOutlined onClick={() => remove(innitem.name)} />
                          </Space>
                        </div>
                        <div>
                          <Form.List
                            name={['allContent', index, 'sights', innIndex, 'enumMes']}>
                            {(innFields, { add, remove }) => (
                              <>
                                {innFields.map((inIt) => (
                                  <div key={inIt.key}>
                                    <Space key={inIt.key} align="baseline">
                                      <Form.Item
                                        {...inIt}
                                        label="枚举名称"
                                        // name={[inIt.name, 'enumName']}
                                        name="enumName"
                                        rules={[
                                          { required: true, message: '输入枚举名称' },
                                        ]}>
                                        <Input placeholder="输入枚举名称" />
                                      </Form.Item>
                                      <Form.Item
                                        {...inIt}
                                        label="枚举值"
                                        name={[inIt.name, 'emumValue']}
                                        rules={[
                                          { required: true, message: '输入枚举值' },
                                        ]}>
                                        <Input placeholder="输入枚举值" />
                                      </Form.Item>

                                      <MinusCircleOutlined
                                        onClick={() => remove(inIt.name)}
                                      />
                                      {/* {console.log(index, innIndex2)} */}
                                      {/* {formValue[index].sights[innIndex2].textType ===
                                    '枚举值' ? ( */}

                                      {/* ) : null} */}
                                    </Space>
                                  </div>
                                ))}
                                <Form.Item>
                                  <Button
                                    style={{ width: '160px' }}
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
                      </div>
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
      <Modal
        title="设置枚举值"
        bodyStyle={{ border: 'none' }}
        destroyOnClose
        open={enumForm}
        onOk={async () => {
          const currentdata = await enForm.validateFields();
          console.log(currentdata);
        }}
        onCancel={() => {
          setEnumForm(false);
          enForm.setFieldsValue({ allContent: [] });
        }}>
        <Form autoComplete="off" form={enForm}>
          <Form.List name="allContent">
            {(fields, { add, remove }) => (
              <>
                {console.log(fields)}
                {fields.map((field) => (
                  <div key={field.key}>
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        {...field}
                        label="枚举名称"
                        name={[field.name, 'enumName']}
                        rules={[{ required: true, message: '输入枚举名称' }]}>
                        <Input placeholder="输入枚举名称" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="枚举值"
                        name={[field.name, 'enumValue']}
                        rules={[{ required: true, message: '请输入枚举值' }]}>
                        <Input placeholder="输入枚举值" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}>
                    添加枚举值
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default BaseInfo;
