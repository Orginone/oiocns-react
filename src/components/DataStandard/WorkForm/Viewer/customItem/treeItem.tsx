import { model } from '@/ts/base';
import { generateUuid } from '@/ts/base/common';
import { SelectBox } from 'devextreme-react';
import { ISelectBoxOptions } from 'devextreme-react/select-box';
import React, { useEffect, useState } from 'react';

interface TreeSelectItemProps extends ISelectBoxOptions {
  flexWrap: 'nowrap' | 'wrap';
  speciesItems: model.FiledLookup[];
}

const TreeSelectItem: React.FC<TreeSelectItemProps> = (props) => {
  const [selectValues, setSelectValues] = useState<string[]>([]);
  const [dataSourceArray, setDataSourceArray] = useState<model.FiledLookup[][]>([]);
  const filterChildrenItems = (id?: string) => {
    return props.speciesItems.filter((i) => id === i.parentId);
  };
  const loopFullValues = (initValues: string[], id?: string) => {
    if (id && id.length > 0) {
      const item = props.speciesItems.find((i) => i.id === id);
      if (item) {
        initValues.splice(0, 0, item.value);
        loopFullValues(initValues, item.parentId);
      }
    }
  };
  useEffect(() => {
    const initValues: string[] = [];
    if (props.defaultValue && props.defaultValue.length > 0) {
      const item = props.speciesItems.find((i) => i.value === props.defaultValue);
      if (item) {
        initValues.push(item.value);
        loopFullValues(initValues, item.parentId);
        setSelectValues(initValues);
      }
    }
  }, [props.defaultValue]);
  useEffect(() => {
    const newItems = [filterChildrenItems()];
    for (const item of selectValues) {
      const id = props.speciesItems.find((i) => i.value === item)?.id ?? item;
      newItems.push(filterChildrenItems(id));
    }
    setDataSourceArray(newItems.filter((i) => i.length > 0));

    props.onValueChanged?.apply(this, [{ value: selectValues.at(-1) } as any]);
  }, [props, selectValues]);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: props.flexWrap,
        gap: 10,
        width: '100%',
      }}>
      {dataSourceArray.map((items, index) => {
        return (
          <SelectBox
            key={generateUuid()}
            {...props}
            width={'100%'}
            searchEnabled
            searchMode="contains"
            searchExpr={'text'}
            dataSource={items}
            displayExpr={'text'}
            valueExpr={'value'}
            onValueChanged={(e) => {
              if (e.value === null && selectValues[index]) {
                setSelectValues([...selectValues.slice(0, index)]);
              }
            }}
            value={selectValues[index]}
            label={`${props.label}-第${index + 1}级`}
            onItemClick={(item) => {
              setSelectValues([...selectValues.slice(0, index), item.itemData.value]);
            }}
          />
        );
      })}
    </div>
  );
};

export default TreeSelectItem;
