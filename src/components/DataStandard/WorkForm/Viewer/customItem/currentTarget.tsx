import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { schema } from '@/ts/base';
import { SelectBox, TextBox } from 'devextreme-react';
import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import { ISelectBoxOptions } from 'devextreme-react/select-box';

interface CurrentTargetItemProps extends ISelectBoxOptions {
  target: schema.XTarget;
  defaultValue?: string;
}

const CurrentTargetItem: React.FC<CurrentTargetItemProps> = (props) => {
  const [selectTarget, setSelectTarget] = useState<schema.XTarget>();
  useEffect(() => {
    props.onValueChanged?.apply(this, [{ value: selectTarget?.id } as any]);
  }, [selectTarget]);
  useEffect(() => {
    if (props.readOnly) {
      if (props.defaultValue && props.defaultValue.length > 5) {
        orgCtrl.user.findEntityAsync(props.defaultValue).then((value) => {
          setSelectTarget(value as schema.XTarget);
        });
      }
    } else {
      setSelectTarget(props.target);
    }
  }, [props]);
  return (
    <SelectBox
      {...props}
      readOnly
      items={selectTarget ? [selectTarget] : []}
      value={selectTarget?.id}
      showClearButton={false}
      valueExpr={'id'}
      displayExpr={'name'}
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
