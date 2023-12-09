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
  const [value, setValue] = useState<string | undefined>(props.defaultValue);
  useEffect(() => {
    if (value && value && value.length > 5) {
      orgCtrl.user.findEntityAsync(value).then((a) => {
        setSelectTarget(a as schema.XTarget);
      });
    } else {
      setSelectTarget(undefined);
    }
    props.onValueChanged?.apply(this, [{ value } as any]);
  }, [value, props]);

  const fieldRender = () => {
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
  };

  return (
    <DropDownBox
      {...props}
      opened={searchEnabled}
      value={props.defaultValue}
      fieldRender={fieldRender}
      onOptionChanged={(e) => {
        if (e.name === 'opened') {
          setSearchEnabled(e.value);
        }
      }}
      onValueChanged={(e) => {
        if (e.value === null || e.value === undefined) {
          setValue(undefined);
        }
      }}
      contentRender={() => {
        return (
          <SearchTarget
            searchCallback={(persons: schema.XTarget[]) => {
              if (persons.length > 0) {
                setValue(persons[0].id);
              }
              setSearchEnabled(false);
            }}
            searchType={props.typeName}
          />
        );
      }}
    />
  );
};

export default SearchTargetItem;
