import React, { useEffect, useState } from 'react';
import { Field } from 'devextreme/ui/filter_builder';
import { FilterBuilder } from 'devextreme-react/filter-builder';
import { Modal } from 'antd';
import { SelectBox, TextArea, TextBox } from 'devextreme-react';
import { model, schema } from '@/ts/base';
import { getUuid } from '@/utils/tools';

interface IProps {
  fields: Field[];
  primarys: schema.XForm[];
  details: schema.XForm[];
  current?: model.NodeShowRule;
  onOk: (rule: model.NodeShowRule) => void;
  onCancel: () => void;
}

const ShowRuleModal: React.FC<IProps> = (props) => {
  const [name, setName] = useState<string>();
  const [remark, setRemark] = useState<string>();
  const [target, setTarget] = useState<model.MappingData>();
  const [showType, setShowType] = useState<string>();
  const [value, setValue] = useState<boolean>();
  const [condition, setCondition] = useState<any[]>([]);
  const [targetSource, setTargetSource] = useState<model.MappingData[]>();
  useEffect(() => {
    if (props.current) {
      setName(props.current.name);
      setRemark(props.current.remark);
      setTarget(props.current.target);
      setValue(props.current.value);
      setShowType(props.current.showType);
      setCondition(JSON.parse(props.current?.condition || '[]'));
    }
  }, [props.current]);
  useEffect(() => {
    const tgs: model.MappingData[] = [];
    tgs.push(
      ...props.details.map((a) => {
        return {
          id: a.id,
          formId: a.id,
          key: a.id,
          formName: a.name,
          typeName: '表单',
          trigger: a.id,
          code: '',
          name: `[表单]${a.name}`,
        };
      }),
    );
    props.primarys.forEach((a, index) => {
      tgs.push(
        ...a.attributes.map((s) => {
          return {
            id: s.id,
            key: index.toString() + s.id,
            formId: a.id,
            formName: a.name,
            typeName: '属性',
            trigger: s.id,
            code: '',
            name: `[${a.name}]${s.name}`,
          };
        }),
      );
    });
    setTargetSource(tgs);
  }, [props.details, props.primarys]);

  const vaildDisable = () => {
    return (
      name == undefined ||
      target == undefined ||
      value == undefined ||
      showType == undefined ||
      condition == undefined ||
      condition.length < 1
    );
  };
  return (
    <Modal
      destroyOnClose
      title={'渲染规则'}
      open={true}
      onOk={() => {
        const getString = (datas: any[]) => {
          const ret: string[] = [];
          for (const data of datas) {
            if (typeof data == 'string') {
              ret.push(data);
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
            target: target!,
            showType: showType!,
            value: value!,
            condition: JSON.stringify(condition),
            type: 'show',
            trigger: getString(condition),
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
      <SelectBox
        label="目标对象*"
        labelMode="floating"
        value={target?.key}
        showClearButton
        displayExpr="name"
        valueExpr="key"
        dataSource={targetSource}
        onSelectionChanged={(e) => {
          setTarget(e.selectedItem);
        }}
      />
      <div>
        <SelectBox
          width={'60%'}
          value={showType}
          label="类型*"
          showClearButton
          labelMode="floating"
          displayExpr="label"
          valueExpr="value"
          style={{ display: 'inline-block' }}
          dataSource={[
            { label: '是否展示', value: 'visible' },
            {
              label: '是否必填',
              value: 'isRequired',
              visible: target?.typeName == '主表',
            },
          ]}
          onSelectionChanged={(e) => {
            setShowType(e.selectedItem['value']);
          }}
        />
        <SelectBox
          width={'40%'}
          value={value}
          label="值*"
          showClearButton
          labelMode="floating"
          style={{ display: 'inline-block' }}
          dataSource={[
            { label: '是', value: true },
            { label: '否', value: false },
          ]}
          displayExpr="label"
          valueExpr="value"
          onSelectionChanged={(e) => {
            setValue(e.selectedItem['value']);
          }}
        />
      </div>
      <div style={{ padding: 5 }}>
        <span>条件*：</span>
        <FilterBuilder
          fields={props.fields}
          value={condition}
          groupOperations={['and', 'or']}
          onValueChanged={(e) => {
            setCondition(e.value);
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
export default ShowRuleModal;
