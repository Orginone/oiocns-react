import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'antd';
import _ from 'lodash';
import { EditModal } from '@/executor/tools/editModal';
import { IBelong, IForm } from '@/ts/core';
import { schema } from '@/utils/excel';
import orgCtrl from '@/ts/controller';
import { Form } from '@/ts/core/thing/standard/form';
import { XAttribute, XForm } from '@/ts/base/schema';
import { SelectBox, TagBox } from 'devextreme-react';
import { ISelectBoxOptions } from 'devextreme-react/select-box';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { jsonParse } from '@/utils/tools';
import { FieldModel, FiledLookup } from '@/ts/base/model';

interface DataBoxProps extends ISelectBoxOptions {
  field: FieldModel;
  attributes: XAttribute[];
  multiple: boolean;
  nameAttribute: string;
  target: schema.XTarget;
  // onValueChange?: any;
}
const DataBox: React.FC<DataBoxProps> = (props) => {
  const {
    width,
    height,
    readOnly,
    field,
    attributes,
    defaultValue,
    // allowViewDetail,
    multiple,
    nameAttribute,
  } = props;
  const attr = attributes.find((item: schema.XAttribute) => item.id === props.name)!;
  const targetFormId = attr.property?.formId;
  const [form, setForm] = useState<XForm>();
  const [formInst, setFormInst] = useState<IForm>();
  const [formBelong, setFormBelong] = useState<IBelong>();
  const [dataSource, setDataSource] = useState<FiledLookup[]>(field?.lookups || []);
  const [selectTarget, setSelectTarget] = useState<any[] | string | undefined>(
    jsonParse(defaultValue, defaultValue),
  );
  // 点击选择数据
  const onClick = () => {
    EditModal.showFormSelect({
      form: form!,
      fields: formInst?.fields!,
      belong: formBelong!,
      multiple,
      onSave: (values) => {
        const dataSource: any = values.map((item: any) => ({
          id: item.id,
          value: item.id,
          text: item[nameAttribute],
        }));
        setDataSource(dataSource);
      },
    });
  };
  // 选中项变动
  const onValueChanged = useCallback((e: any) => {
    const value = e.value;
    setSelectTarget(value);
    if (!value) setDataSource([]);
    props.onValueChanged?.apply(this, [
      { value: JSON.stringify(Array.isArray(value) ? value : [value]) } as any,
    ]);
  }, []);

  // 监听dataSource数据源，设置选中数据
  useEffect(() => {
    field.lookups = dataSource;
    setSelectTarget(
      multiple ? dataSource?.map((item) => item.value) : dataSource?.[0]?.value,
    );
  }, [dataSource]);

  // 初始化
  useAsyncLoad(async () => {
    if (targetFormId) {
      const targetFormMetadata = orgCtrl.user.findMetadata<schema.XEntity>(targetFormId);
      if (targetFormMetadata) {
        const targetFormBelong = orgCtrl.targets.find(
          (i) => i.id === targetFormMetadata.belongId,
        )!;
        // 设置归属
        setFormBelong(targetFormBelong as IBelong);
        const formList = await targetFormBelong?.resource.formColl.find([targetFormId]);
        // 设置表单
        setForm(formList[0]);
        const formInst = new Form(
          { ...formList[0], id: formList[0].id + '_' },
          targetFormBelong.directory,
        );
        await formInst.loadFields();
        // 设置表单实例
        setFormInst(formInst);
        return formInst;
      }
    }
  });

  const BoxComponent: any = multiple ? TagBox : SelectBox;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'end',
        width: width as any,
      }}>
      <BoxComponent
        {..._.omit(props, ['width'])}
        style={readOnly ? { width: '100%' } : { width: 'calc(100% - 87px)' }}
        searchEnabled
        searchMode="contains"
        noDataText="请点击右侧选择数据"
        searchExpr={'text'}
        displayExpr={'text'}
        valueExpr={'value'}
        value={
          multiple
            ? typeof selectTarget === 'string'
              ? [selectTarget]
              : selectTarget
            : Array.isArray(selectTarget) && selectTarget.length
            ? selectTarget[0]
            : selectTarget
        }
        dataSource={dataSource}
        onValueChanged={onValueChanged}
      />
      {!readOnly && (
        <Button
          style={{ marginLeft: 10, height: height as any }}
          type="default"
          onClick={onClick}>
          选择数据
        </Button>
      )}
    </div>
  );
};
export default DataBox;
