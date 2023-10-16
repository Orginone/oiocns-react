import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { schema } from '@/ts/base';
import { DropDownBox, TextBox } from 'devextreme-react';
import { IDropDownBoxOptions } from 'devextreme-react/drop-down-box';
import React, { useEffect, useState } from 'react';

interface CurrentTargetItemProps extends IDropDownBoxOptions {
  target: schema.XTarget;
}

const CurrentTargetItem: React.FC<CurrentTargetItemProps> = (props) => {
  const [selectTarget, setSelectTarget] = useState<schema.XTarget>();
  useEffect(() => {
    setSelectTarget(props.target);
  }, [props]);
  return (
    <DropDownBox
      {...props}
      readOnly
      showClearButton={false}
      value={selectTarget?.id}
      fieldRender={() => {
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
      }}
    />
  );
};

export default CurrentTargetItem;
