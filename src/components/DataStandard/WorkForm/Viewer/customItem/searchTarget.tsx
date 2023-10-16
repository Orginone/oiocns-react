import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import SearchTarget from '@/components/Common/SearchTarget';
import { schema } from '@/ts/base';
import { TargetType } from '@/ts/core';
import { DropDownBox, TextBox } from 'devextreme-react';
import { IDropDownBoxOptions } from 'devextreme-react/drop-down-box';
import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';

interface SearchTargetItemProps extends IDropDownBoxOptions {
  defaultValue?: string;
  typeName: TargetType;
}

const SearchTargetItem: React.FC<SearchTargetItemProps> = (props) => {
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [selectTarget, setSelectTarget] = useState<schema.XTarget>();
  useEffect(() => {
    if (props.defaultValue && props.defaultValue.length > 5) {
      orgCtrl.user.findEntityAsync(props.defaultValue).then((value) => {
        setSelectTarget(value as schema.XTarget);
      });
    }
  }, [props.defaultValue]);
  useEffect(() => {
    props.onValueChanged?.apply(this, [{ value: selectTarget?.id } as any]);
  }, [selectTarget]);
  const fieldRender = React.useCallback(() => {
    if (selectTarget) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 10,
            paddingTop: 2,
          }}>
          <EntityIcon entity={selectTarget} />
          <TextBox value={`${selectTarget?.name}(${selectTarget?.code})`} />
        </div>
      );
    } else {
      return <TextBox />;
    }
  }, [selectTarget]);
  return (
    <DropDownBox
      {...props}
      opened={searchEnabled}
      value={selectTarget?.id}
      fieldRender={fieldRender}
      onOptionChanged={(e) => {
        if (e.name === 'opened') {
          setSearchEnabled(e.value);
        }
      }}
      onValueChanged={(e) => {
        if (e.value === null || e.value === undefined) {
          setSelectTarget(undefined);
        }
      }}
      contentRender={() => {
        return (
          <SearchTarget
            searchCallback={(persons: schema.XTarget[]) => {
              if (persons.length > 0) {
                setSelectTarget(persons[0]);
              } else {
                setSelectTarget(undefined);
              }
            }}
            searchType={props.typeName}
          />
        );
      }}
    />
  );
};

export default SearchTargetItem;
