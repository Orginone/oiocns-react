import React, { useEffect, useState } from 'react';
import { Field } from 'devextreme/ui/filter_builder';
import { Modal, message } from 'antd';
import { DropDownBox, SelectBox, TextArea, TextBox, TreeView } from 'devextreme-react';
import { schema } from '@/ts/base';
import { getUuid } from '@/utils/tools';
import { transformExpression } from '@/utils/script';

interface IProps {
  fields: Field[];
  current?: schema.FormCalcRule;
  onOk: (rule: schema.FormCalcRule) => void;
  onCancel: () => void;
}

const CalcRuleModal: React.FC<IProps> = (props) => {
  const [name, setName] = useState<string>();
  const [remark, setRemark] = useState<string>();
  const [formula, setFormula] = useState<string>();
  const [trigger, setTrigger] = useState<string[]>();
  const [target, setTarget] = useState<string>();
  useEffect(() => {
    if (props.current) {
      setName(props.current.name);
      setRemark(props.current.remark);
      setTarget(props.current.target);
      setTrigger(props.current.trigger);
      setFormula(props.current.formula);
    }
  }, [props.current]);
  const vaildDisable = () => {
    return (
      name == undefined ||
      trigger == undefined ||
      target == undefined ||
      formula == undefined
    );
  };

  return (
    <Modal
      destroyOnClose
      title={'计算规则'}
      open={true}
      onOk={() => {
        if (formula) {
          try {
            let code = formula.replaceAll(/@\d+@/g, '__param__');
            transformExpression(code);
          } catch (error: any) {
            message.error(
              <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>
                {error.message}
              </pre>,
              30,
            );
            throw error;
          }            
        }
        props.onOk.apply(this, [
          {
            id: props.current?.id ?? getUuid(),
            name: name!,
            remark: remark ?? '',
            target: target!,
            type: 'calc',
            trigger: trigger!,
            formula: formula!,
          },
        ]);
      }}
      onCancel={props.onCancel}
      okButtonProps={{
        disabled: vaildDisable(),
      }}>
      <TextBox
        label="名称*"
        labelMode="floating"
        value={name}
        onValueChange={(e) => {
          setName(e);
        }}
      />
      <DropDownBox
        label="触发对象*"
        labelMode="floating"
        value={trigger}
        displayExpr="caption"
        valueExpr="name"
        showClearButton={true}
        dataSource={props.fields}
        onValueChanged={(e) => {
          setTrigger(e.value);
        }}
        contentRender={() => {
          return (
            <TreeView
              dataSource={props.fields}
              displayExpr="caption"
              dataStructure="plain"
              keyExpr="id"
              selectionMode="multiple"
              showCheckBoxesMode="normal"
              selectNodesRecursive={false}
              selectByClick={true}
              onItemSelectionChanged={(e) => {
                const ss = e.component.getSelectedNodes();
                setTrigger(ss.map((a) => a.itemData?.name));
              }}
            />
          );
        }}
      />
      <SelectBox
        label="目标对象*"
        labelMode="floating"
        value={target}
        showClearButton
        displayExpr="caption"
        valueExpr="name"
        dataSource={props.fields}
        onSelectionChanged={(e) => {
          setTarget(e.selectedItem['name']);
        }}
      />
      <TextArea
        label="计算表达式*"
        hint="说明：@0@ 表示 所选第一个触发变量，以此类推"
        labelMode="floating"
        value={formula}
        autoResizeEnabled
        minHeight={80}
        onValueChanged={(e) => {
          setFormula(e.value);
        }}></TextArea>
      <TextArea
        label="备注"
        labelMode="floating"
        onValueChanged={(e) => {
          setRemark(e.value);
        }}
        value={remark}
      />
    </Modal>
  );
};
export default CalcRuleModal;
