import React, { useEffect, useState } from 'react';
import { Field } from 'devextreme/ui/filter_builder';
import { Modal } from 'antd';
import { DropDownBox, TextArea, TextBox, TreeView } from 'devextreme-react';
import { model, schema } from '@/ts/base';
import { getUuid } from '@/utils/tools';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

interface IProps {
  fields: Field[];
  details: schema.XForm[];
  current?: model.NodeExecutorRule;
  onOk: (rule: model.NodeExecutorRule) => void;
  onCancel: () => void;
}

const ExecutorRuleModal: React.FC<IProps> = (props) => {
  const [name, setName] = useState<string>();
  const [remark, setRemark] = useState<string>();
  const [code, setCode] = useState<string>();
  const [trigger, setTrigger] = useState<string[]>();
  const [keyMap, setKeyMap] = useState<Map<string, model.MappingData>>();
  const [triggerSource, setTriggerSource] = useState<Field[]>();
  useEffect(() => {
    if (props.current) {
      setName(props.current.name);
      setRemark(props.current.remark);
      setTrigger(props.current.trigger);
      setCode(props.current.function);
      setKeyMap(props.current.keyMap);
    }
    setTriggerSource([
      ...(props.details.map((a) => {
        return {
          name: a.id,
          dataField: a.code,
          caption: '[表单]' + a.name,
          dataType: 'string',
        };
      }) as Field[]),
      ...props.fields.map((a) => {
        return { ...a, caption: '[属性]' + a.caption };
      }),
    ]);
  }, [props.fields, props.current]);
  const vaildDisable = () => {
    return (
      name == undefined || trigger == undefined || code == undefined || code == undefined
    );
  };

  return (
    <Modal
      destroyOnClose
      title={'函数规则'}
      open={true}
      onOk={() => {
        props.onOk.apply(this, [
          {
            id: props.current?.id ?? getUuid(),
            name: name!,
            remark: remark ?? '',
            type: 'calc',
            trigger: trigger!,
            function: code!,
            keyMap: keyMap!,
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
        dataSource={triggerSource}
        onValueChanged={(e) => {
          setTrigger(e.value);
        }}
        contentRender={() => {
          return (
            <TreeView
              dataSource={triggerSource}
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
      <CodeMirror
        value={code}
        height={'100px'}
        extensions={[javascript()]}
        onChange={setCode}
      />
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
export default ExecutorRuleModal;
