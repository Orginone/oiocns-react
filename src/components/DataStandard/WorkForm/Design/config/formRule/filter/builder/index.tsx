import React, { useCallback, useEffect, useState } from 'react';
import { Field } from 'devextreme/ui/filter_builder';
import { CustomOperation, FilterBuilder } from 'devextreme-react/filter-builder';
import { DropDownBox, TreeView } from 'devextreme-react';
import { model } from '@/ts/base';

interface IProps {
  fields: Field[];
  displayText: string;
  onValueChanged: (value: string, displayText: string) => void;
}
const EditorComponent = (props: {
  data: { value: any; setValue: (value: any) => void; field: Field };
}) => {
  const [opened, setOpened] = useState<boolean>(false);
  return (
    <DropDownBox
      width={'90%'}
      opened={opened}
      label="分类*"
      labelMode="floating"
      value={props.data.value}
      displayExpr="text"
      valueExpr="id"
      showClearButton={true}
      dataSource={props.data.field.lookup?.dataSource ?? []}
      onOptionChanged={(e) => {
        if (e.name === 'opened') {
          setOpened(e.value);
        }
      }}
      contentRender={() => {
        return (
          <TreeView
            keyExpr="id"
            displayExpr="text"
            dataStructure="plain"
            selectionMode="single"
            parentIdExpr="parentId"
            showCheckBoxesMode="normal"
            onItemClick={() => setOpened(false)}
            selectByClick={true}
            selectNodesRecursive={false}
            dataSource={props.data.field.lookup?.dataSource ?? []}
            onItemSelectionChanged={(e) => {
              const ss = e.component.getSelectedNodes();
              props.data.setValue(ss.map((a) => a.itemData?.value));
            }}
          />
        );
      }}
    />
  );
};
const CustomBuilder: React.FC<IProps> = (props) => {
  const [value, setValue] = useState<any>(JSON.parse(props.displayText));
  return (
    <FilterBuilder
      fields={props.fields}
      value={value}
      groupOperations={['and', 'or']}
      onValueChanged={(e) => {
        setValue(e.value);
        props.onValueChanged(
          JSON.stringify(e.component.getFilterExpression()),
          JSON.stringify(e.value),
        );
      }}>
      <CustomOperation
        name="sequal"
        caption="相等"
        icon="equal"
        customizeText={(fieldInfo: {
          field: Field;
          value: string | number | any;
          valueText: string;
        }) => {
          const lookups = fieldInfo.field.lookup?.dataSource as model.FiledLookup[];
          return (
            lookups.find((a) => a.value == fieldInfo.value)?.text ?? fieldInfo.valueText
          );
        }}
        editorComponent={EditorComponent}
        calculateFilterExpression={useCallback(
          (filterValue: any, field: any) =>
            filterValue &&
            filterValue.length &&
            Array.prototype.concat
              .apply(
                [],
                filterValue.map((i: any) => [[field.dataField, '=', i], 'or']),
              )
              .slice(0, -1),
          [],
        )}
      />
      <CustomOperation
        name="snotequal"
        caption="不相等"
        icon="notequal"
        customizeText={(fieldInfo: {
          field: Field;
          value: string | number | any;
          valueText: string;
        }) => {
          const lookups = fieldInfo.field.lookup?.dataSource as model.FiledLookup[];
          return (
            lookups.find((a) => a.value == fieldInfo.value)?.text ?? fieldInfo.valueText
          );
        }}
        editorComponent={EditorComponent}
        calculateFilterExpression={useCallback(
          (filterValue: any, field: any) =>
            filterValue &&
            filterValue.length &&
            Array.prototype.concat
              .apply(
                [],
                filterValue.map((i: any) => [[field.dataField, '<>', i], 'or']),
              )
              .slice(0, -1),
          [],
        )}
      />
    </FilterBuilder>
  );
};
export default CustomBuilder;
