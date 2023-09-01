import React, { useEffect, useRef } from 'react';
import { AttrRuleType, XAttribute, XAuthority } from '@/ts/base/schema';
import { getDefaultCommonSettings } from './config';
import { BetaSchemaForm, ProFormInstance } from '@ant-design/pro-components';
import { IForm } from '@/ts/core';
interface IProps {
  selectedFiled: XAttribute;
  superAuth?: XAuthority;
  current: IForm;
  scameRef: { current: { setValue: Function; getValue: Function } };
}
type DataItem = {
  name: string;
  state: string;
  title: string;
};
const obj = {
  required: 'false',
  readOnly: 'false',
  hidden: 'false',
  allowClear: 'false',
};
const AttributeConfig = ({ current, scameRef, selectedFiled, superAuth }: IProps) => {
  console.log('attr', selectedFiled);
  if (!selectedFiled) {
    return <>请选择特性</>;
  }

  // const [form] = Form.useForm();
  const formRef = useRef<ProFormInstance>();
  useEffect(() => {
    const rule: AttrRuleType = JSON.parse(selectedFiled.rule || '{}');
    // if (!rule.widget) {
    //   rule.widget = loadWidgetsOpts(attr.property!.valueType)[0];
    // }
    // form.resetFields();

    formRef?.current?.setFieldsValue({ ...obj, ...selectedFiled, ...rule });
  }, [selectedFiled]);

  const handleItemConfigChanged = (
    changedVal: any,
    changedValues: { [key: string]: any },
  ) => {
    console.log('handleItemConfigChange', changedVal, changedValues);
    // 项配置改变
    if (selectedFiled) {
      selectedFiled.rule = selectedFiled.rule || '{}';
      const rule = { ...JSON.parse(selectedFiled.rule), ...changedValues };
      // setSelectedItem({
      //   ...selectedItem,
      //   rule: JSON.stringify(rule),
      // });
      /* 更新保存数据 */
      current.updateAttribute({ ...selectedFiled, rule: JSON.stringify(rule) });

      const OrgScame = scameRef.current.getValue();
      /* 更新schma展示数据 */
      console.log('change修改', selectedFiled, OrgScame);
    }
  };
  return (
    <div style={{ width: '100%' }}>
      <BetaSchemaForm<DataItem>
        layoutType="Form"
        key={selectedFiled?.id}
        submitter={{ render: false }}
        colProps={{ span: 12 }}
        // initialValues={{ ...attr, ...JSON?.parse(attr.rule || '{}'), ...obj }}
        onFinish={async (values) => {
          console.log(values);
        }}
        grid
        columns={getDefaultCommonSettings(selectedFiled?.property?.valueType)}
        formRef={formRef}
        onValuesChange={handleItemConfigChanged}
      />
    </div>
  );
};

export default AttributeConfig;
