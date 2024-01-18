import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { TextArea, TextBox } from 'devextreme-react';
import { model } from '@/ts/base';
import { getUuid } from '@/utils/tools';
import CustomBuilder from '../filter/builder';

interface IProps {
  fields: model.FieldInfo[];
  current?: model.AttributeFilterRule;
  onOk: (rule: model.AttributeFilterRule) => void;
  onCancel: () => void;
}

const ShowAttributeModal: React.FC<IProps> = (props) => {
  const [name, setName] = useState<string>();
  const [remark, setRemark] = useState<string>();
  const [condition, setCondition] = useState<string>(props.current?.condition ?? '[]');
  const [conditionText, setConditionText] = useState<string>(
    props.current?.conditionText ?? '{}',
  );
  useEffect(() => {
    if (props.current) {
      setName(props.current.name);
      setRemark(props.current.remark);
    }
  }, [props.current]);
  const vaildDisable = () => {
    return (
      condition == undefined || condition.length < 1
    );
  };
  return (
    <Modal
      destroyOnClose
      title={'属性筛选'}
      open={true}
      onOk={() => {
        const getString = (datas: any[]) => {
          const ret: string[] = [];
          for (const data of datas) {
            if (typeof data == 'string') {
              ret.push(data.replace('T', ''));
            } else if (Array.isArray(data)) {
              ret.push(...getString(data));
            }
          }
          return ret;
        };
        props.onOk.apply(this, [
          {
            id: props.current?.id ?? getUuid(),
            name: name!,
            remark: remark ?? '',
            condition: condition,
            conditionText: conditionText,
            type: 'attribute',
            trigger: getString(JSON.parse(condition)),
          },
        ]);
      }}
      onCancel={props.onCancel}
      okButtonProps={{
        disabled: vaildDisable(),
      }}>
      <TextBox
        label="规则名称*"
        labelMode="floating"
        value={name}
        onValueChange={(e) => {
          setName(e);
        }}
      />
      <div style={{ padding: 5 }}>
        <span>条件*：</span>
        <CustomBuilder
          fields={props.fields}
          displayText={conditionText}
          onValueChanged={(value, text) => {
            setCondition(value);
            setConditionText(text);
          }}
        />
      </div>
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
export default ShowAttributeModal;
