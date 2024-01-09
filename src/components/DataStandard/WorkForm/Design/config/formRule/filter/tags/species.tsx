import React, { useEffect, useState } from 'react';
import { Field } from 'devextreme/ui/filter_builder';
import { DropDownBox, TreeView, Button } from 'devextreme-react';
import { schema } from '@/ts/base';
import { FiledLookup } from '@/ts/base/model';

interface IProps {
  fields: Field[];
  onValueChanged: (v: schema.XTagFilter[]) => void;
}

const SpeciesTag: React.FC<IProps> = ({ fields, onValueChanged }) => {
  const [opened, setOpened] = useState<boolean>(false);
  const [selectSpecies, setSelectSpecies] = useState<FiledLookup[]>();
  const [speciesSource, setSpeciesSource] = useState<FiledLookup[]>();
  useEffect(() => {
    const source: FiledLookup[] = [];
    fields.forEach((a) => {
      const children = a.lookup?.dataSource as FiledLookup[];
      if (children) {
        source.push(
          ...children.map((s) => {
            return { ...s, parentId: s.parentId ?? a.dataField, rootText: a.caption };
          }),
        );
      }
      source.push({ id: a.dataField!, text: a.caption!, value: 'S' + a.dataField });
    });
    setSpeciesSource(
      source.filter((s, i) => source.findIndex((d) => d.id === s.id) === i),
    );
  }, [fields]);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: 10,
      }}>
      <DropDownBox
        width={'90%'}
        opened={opened}
        label="分类*"
        labelMode="floating"
        value={selectSpecies?.map((a) => a.id)}
        displayExpr="text"
        valueExpr="id"
        showClearButton={true}
        dataSource={speciesSource}
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
              selectionMode="multiple"
              parentIdExpr="parentId"
              showCheckBoxesMode="normal"
              onItemClick={() => setOpened(false)}
              selectByClick={true}
              selectNodesRecursive={false}
              dataSource={speciesSource}
              onItemSelectionChanged={(e) => {
                const ss = e.component.getSelectedNodes();
                setSelectSpecies(ss.map((a) => a.itemData) as FiledLookup[]);
              }}
            />
          );
        }}
      />
      <Button
        width={100}
        disabled={!selectSpecies || selectSpecies.length <= 0}
        onClick={() => {
          if (selectSpecies && selectSpecies.length > 0) {
            onValueChanged(
              selectSpecies.map((s) => {
                var name = 'rootText' in s ? `[${s.rootText}]${s.text}` : s.text;
                return {
                  id: s.id,
                  typeName: '分类',
                  name: name,
                  code: s.value,
                  value: s.value,
                };
              }),
            );
          }
        }}>
        新增
      </Button>
    </div>
  );
};

export default SpeciesTag;
