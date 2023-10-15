import { schema } from '@/ts/base';
import { generateUuid } from '@/ts/base/common';
import { SelectBox } from 'devextreme-react';
import { ISelectBoxOptions } from 'devextreme-react/select-box';
import React, { useEffect, useState } from 'react';

interface TreeSelectItemProps extends ISelectBoxOptions {
  speciesItems: schema.XSpeciesItem[];
}

const TreeSelectItem: React.FC<TreeSelectItemProps> = (props) => {
  const [selectValues, setSelectValues] = useState<string[]>([]);
  const [dataSourceArray, setDataSourceArray] = useState<schema.XSpeciesItem[][]>([]);
  const filterChildrenItems = (id?: string) => {
    return props.speciesItems.filter((i) => id === i.parentId);
  };
  useEffect(() => {
    const newItems = [filterChildrenItems()];
    for (const item of selectValues) {
      newItems.push(filterChildrenItems(item));
    }
    setDataSourceArray(newItems.filter((i) => i.length > 0));
  }, [props, selectValues]);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: 10,
      }}>
      {dataSourceArray.map((items, index) => {
        return (
          <SelectBox
            key={generateUuid()}
            {...props}
            searchEnabled
            searchMode="contains"
            searchExpr={'name'}
            dataSource={items}
            displayExpr={'name'}
            valueExpr={'id'}
            onValueChanged={(e) => {
              if (e.value === null && selectValues[index]) {
                setSelectValues([...selectValues.slice(0, index)]);
              }
            }}
            value={selectValues[index]}
            label={`${props.label}-第${index + 1}级`}
            onItemClick={(item) => {
              setSelectValues([...selectValues.slice(0, index), item.itemData.id]);
            }}
          />
        );
      })}
    </div>
  );
};

export default TreeSelectItem;
