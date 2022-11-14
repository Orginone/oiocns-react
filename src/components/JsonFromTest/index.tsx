import React, { Component } from 'react';
import { Form, InputNumber, Input, DatePicker, Button, Select, Radio } from 'antd';
import moment from 'moment';
// import ExportTableCpn from './ExportTableCpn';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

// 后台返回的数据格式
const data = [
  {
    field: 'jobid',
    text: '工号',
    errorMessage: '请输入工号',
    required: false,
    type: 'int',
    value: 1,
  },
  {
    field: 'date',
    text: '日期',
    errorMessage: '请输入日期',
    required: false,
    type: 'date',
    value: '2022-07-17',
  },
  {
    field: 'username',
    text: '用户名',
    errorMessage: '请输入用户名',
    required: false,
    type: 'char',
    value: 'hello chen',
  },
  {
    field: 'nameId',
    text: '姓名',
    errorMessage: '请输入姓名',
    required: true,
    type: 'select',
    value: '小陈',
    options: [
      { value: 1, label: '小陈' },
      { value: 2, label: '小唐' },
      { value: 3, label: '小刘' },
    ],
  },
  {
    field: 'sex',
    text: '性别',
    errorMessage: '请选择性别',
    required: true,
    type: 'radio',
    value: 0,
    options: [
      { value: 0, label: '男' },
      { value: 1, label: '女' },
    ],
  },
  {
    field: 'textarea',
    text: '文本内容',
    errorMessage: '请输入文本内容',
    required: false,
    type: 'textarea',
    value: '你好啊',
  },
];
// 按钮的数据格式
type ButtonType =
  | 'link'
  | 'text'
  | 'primary'
  | 'default'
  | 'ghost'
  | 'dashed'
  | undefined;

type formBtnType = 'button' | 'submit' | 'reset' | undefined;
const btnData = [
  { type: 'primary', name: '确认', htmlType: 'submit' },
  { type: 'primary', name: '上传', htmlType: 'button', event: 'eventExport' },
  { type: 'default', name: '取消', htmlType: 'button', event: 'eventClick' },
];
// formItem css 样式
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

// 保存按钮 css 样式
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 0,
    },
  },
};

// form css 样式
const formLayout = {
  width: 400,
  marginTop: 100,
  marginLeft: 'auto',
  marginRight: 'auto',
};
// 设置组件的默认值
let defaultValue = {};
for (let i = 0; i < data.length; i++) {
  const { field, value } = data[i];
  // 主要是把时间过滤出去，在这里设置会报错，没有弄明白什么原因
  if (field === 'date') {
    continue;
  }
  defaultValue[field] = value;
}
class FormSearchDemo extends Component {
  // constructor() {
  //   super();
  //   this.state = {};
  // }
  /**
   * 根据json数据 dataBtn 中 type 类型生成不同的组件
   * 这个功能还没有实现
   * @param item  json
   * @param Component
   */
  switchBtn(item, index) {
    console.log('switchBtn:', item, index);
    const { htmlType } = item;
    let styleMargin = { margin: '0 10px' };
    switch (htmlType) {
      case 'component':
      // return <ExportTableCpn key={index} item={item} />;
      // eslint-disable-next-line no-fallthrough
      case 'submit':
        return (
          <Button style={styleMargin} type={item.type} htmlType={item.htmlType}>
            {item.name}
          </Button>
        );
      case 'button':
        return (
          <Button
            style={styleMargin}
            type={item.type}
            htmlType={item.htmlType}
            onClick={this[item.event]}>
            {item.name}
          </Button>
        );
      default:
        return (
          <Button
            style={styleMargin}
            type={item.type}
            htmlType={item.htmlType}
            onClick={this[item.event]}>
            {item.name}
          </Button>
        );
    }
  }

  /**
   * 根据后台返回的 data 中 type 类型生成不同的组件
   * @param item  json
   * @param Component
   */
  switchItem(item) {
    const type = item.type;
    switch (type) {
      case 'int':
        return <InputNumber style={{ width: '100%' }} />;
      case 'char':
        return <Input allowClear />;
      case 'date':
        return <DatePicker style={{ width: '100%' }} />;
      case 'textarea':
        return (
          <TextArea
            autoSize={{
              maxRows: 5,
            }}
          />
        );
      case 'radio':
        return (
          <Radio.Group>
            {item.options.map((item, index) => {
              return (
                <Radio key={index} value={item.value}>
                  {item.label}
                </Radio>
              );
            })}
          </Radio.Group>
        );

      case 'select':
        return (
          <Select allowClear>
            {item.options.map((item, index) => {
              return (
                <Option key={index} value={item.value}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        );
      default:
        return <Input allowClear />;
    }
  }
  onFinish = (values) => {
    console.log('onFinish:', values);
  };

  onFinishFailed = (errorInfo) => {
    console.log('onFinishFailed:', errorInfo);
  };
  eventClick = (value) => {
    console.log('eventClick:');
  };
  eventExport = (value) => {
    console.log('eventExport:');
  };
  render() {
    console.log('defaultValue:', defaultValue);
    let itemTime = moment('2022-07-17', 'YYYY-MM-DD');
    // console.log(itemTime);
    return (
      <Form
        style={formLayout}
        name="basic"
        onFinish={this.onFinish}
        initialValues={{ ...defaultValue, date: itemTime }}
        onFinishFailed={this.onFinishFailed}>
        {data.map((item, index) => {
          return (
            <FormItem
              key={index}
              {...formItemLayout}
              label={item.text}
              name={item.field}
              hasFeedback
              rules={[
                {
                  required: item.required,
                  message: item.errorMessage,
                },
              ]}>
              {this.switchItem(item)}
            </FormItem>
          );
        })}
        <FormItem {...tailFormItemLayout}>
          {btnData.map((item, index) => {
            return item.htmlType === 'submit' ? (
              <Button
                key={index}
                style={{ margin: '0 10px' }}
                type={item.type as ButtonType}
                htmlType={item.htmlType}>
                {item.name}
              </Button>
            ) : (
              <Button
                key={index}
                style={{ margin: '0 10px' }}
                type={item.type as ButtonType}
                htmlType={item.htmlType as formBtnType}
                onClick={item.event && this[item.event]}>
                {item.name}
              </Button>
            );
          })}
        </FormItem>
      </Form>
    );
  }
}

export default FormSearchDemo;
