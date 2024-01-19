import React, { useEffect, useState } from 'react';
import { Card, Modal } from 'antd';
import { Button, DataGrid, SelectBox, TextArea, TextBox } from 'devextreme-react';
import { model } from '@/ts/base';
import { getUuid } from '@/utils/tools';
import { Column, Editing, Paging } from 'devextreme-react/data-grid';

interface IProps {
  fields: model.FieldInfo[];
  current?: model.FormCalcRule;
  onOk: (rule: model.FormCalcRule) => void;
  onCancel: () => void;
}

const CalcRuleModal: React.FC<IProps> = (props) => {
  const [name, setName] = useState<string>();
  const [remark, setRemark] = useState<string>();
  const [formula, setFormula] = useState<string>();
  const [target, setTarget] = useState<string>();
  const [argsCode, setArgsCode] = useState<string>();
  const [select, setSelect] = useState<model.FieldInfo>();
  const [mappingData, setMappingData] = useState<model.MappingData[]>([]);

  useEffect(() => {
    if (props.current) {
      setName(props.current.name);
      setRemark(props.current.remark);
      setTarget(props.current.target);
      setFormula(props.current.formula);
      setMappingData(props.current.mappingData);
    }
  }, [props.current]);
  const vaildDisable = () => {
    return (
      name == undefined ||
      mappingData == undefined ||
      mappingData.length == 0 ||
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
        props.onOk.apply(this, [
          {
            id: props.current?.id ?? getUuid(),
            name: name!,
            remark: remark ?? '',
            target: target!,
            type: 'calc',
            trigger: mappingData.map((a) => a.trigger),
            formula: formula!,
            mappingData,
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
        value={target}
        showClearButton
        displayExpr="caption"
        valueExpr="id"
        dataSource={props.fields}
        onSelectionChanged={(e) => {
          setTarget(e.selectedItem['id']);
        }}
      />
      <Card bordered title={'变量维护'} style={{ margin: 10 }}>
        <>
          <TextBox
            width={'30%'}
            label="变量名称*"
            labelMode="floating"
            value={argsCode}
            onValueChange={setArgsCode}
            style={{ display: 'inline-block', margin: 2 }}
          />
          <SelectBox
            width={'45%'}
            showClearButton
            label="变量对象*"
            labelMode="floating"
            value={select?.id}
            displayExpr={'caption'}
            valueExpr="id"
            dataSource={props.fields.filter(
              (a) => !mappingData.find((s) => s.id == a.id),
            )}
            style={{ display: 'inline-block', margin: 2 }}
            onSelectionChanged={(e) => {
              setSelect(e.selectedItem);
            }}
          />
          <Button
            width={'20%'}
            style={{ display: 'inline-block', margin: 2 }}
            onClick={() => {
              if (select && argsCode) {
                if (!mappingData.map((a) => a.code).includes(argsCode)) {
                  setSelect(undefined);
                  setArgsCode(undefined);
                  setMappingData([
                    {
                      name: select.caption ?? '未知',
                      code: argsCode,
                      formId: '',
                      formName: '',
                      typeName: '对象',
                      trigger: select.id,
                      key: select.id,
                      id: select.id,
                    },
                    ...mappingData,
                  ]);
                }
              }
            }}>
            新增
          </Button>
        </>
        <DataGrid
          allowColumnResizing
          keyExpr="id"
          dataSource={mappingData}
          onSaved={(e) => {
            for (const change of e.changes) {
              if (change.type == 'remove') {
                setMappingData(mappingData.filter((a) => a.id != change.key));
              }
            }
          }}>
          <Paging enabled={true} pageSize={10} />
          <Editing mode="row" allowDeleting={true} />
          <Column dataField="code" caption="变量代码" />
          <Column dataField="name" caption="对象名称" />
        </DataGrid>
      </Card>
      <TextArea
        label="计算表达式*"
        labelMode="floating"
        value={formula}
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
