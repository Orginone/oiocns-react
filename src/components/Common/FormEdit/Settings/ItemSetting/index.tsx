import React, { useEffect, useRef } from 'react';
import { AttrRuleType, XAttribute, XAuthority } from '@/ts/base/schema';
import { getDefaultCommonSettings } from './config';
import { UpdataScameItemById } from '../tools';
import { BetaSchemaForm, ProFormInstance } from '@ant-design/pro-components';
import { IForm } from '@/ts/core';
interface IProps {
  selectedFiled: XAttribute;
  superAuth?: XAuthority;
  current: IForm;
  schemaRef: { current: { setValue: Function; getValue: Function } };
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
const AttributeConfig = ({ current, schemaRef, selectedFiled, superAuth }: IProps) => {
  if (!selectedFiled) {
    return <>请选择组件</>;
  }

  const formRef = useRef<ProFormInstance>();
  useEffect(() => {
    const rule: AttrRuleType = JSON.parse(selectedFiled.rule || '{}');
    formRef?.current?.setFieldsValue({ ...obj, ...selectedFiled, ...rule });
  }, [selectedFiled]);

  const handleItemConfigChanged = (
    _changedVal: any,
    changedValues: { [key: string]: any },
  ) => {
    // 项配置改变
    if (selectedFiled) {
      selectedFiled.rule = selectedFiled.rule || '{}';
      const rule = { ...JSON.parse(selectedFiled.rule), ...changedValues };
      /* 更新保存数据 */
      current.updateAttribute({ ...selectedFiled, rule: JSON.stringify(rule) });
      const resultScame = UpdataScameItemById(
        selectedFiled.id,
        schemaRef.current.getValue(),
        changedValues,
      );
      /* 更新schma展示数据 */
      schemaRef.current.setValue(resultScame);
      const ruleInfo = JSON.parse(current.metadata.rule || '{}');
      current.update({
        ...current.metadata,
        rule: JSON.stringify({
          ...ruleInfo,
          schema: resultScame,
        }),
      });
    }
  };
  return (
    <div style={{ width: '100%' }}>
      <BetaSchemaForm<DataItem>
        layoutType="Form"
        key={selectedFiled?.id}
        // submitter={{ render: false }}
        colProps={{ span: 12 }}
        // initialValues={{ ...attr, ...JSON?.parse(attr.rule || '{}'), ...obj }}
        onFinish={async (values) => {
          handleItemConfigChanged({}, values);
        }}
        grid
        columns={getDefaultCommonSettings(selectedFiled?.property?.valueType)}
        formRef={formRef}
      />
    </div>
  );
};

export default AttributeConfig;
