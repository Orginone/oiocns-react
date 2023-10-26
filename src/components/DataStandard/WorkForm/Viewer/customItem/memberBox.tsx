import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { schema } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { SelectBox, TextBox } from 'devextreme-react';
import { ISelectBoxOptions } from 'devextreme-react/select-box';
import React, { useEffect, useState } from 'react';

interface MemberBoxProps extends ISelectBoxOptions {
  teamId?: string;
  isOperator?: boolean;
  target: schema.XTarget;
}

const MemberBox: React.FC<MemberBoxProps> = (props) => {
  const [targets, setTargets] = useState<schema.XTarget[]>();
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
      if (props.isOperator) {
        setTargets([props.target]);
        setSelectTarget(props.target);
      } else if (props.teamId) {
        const target = orgCtrl.targets.find((i) => i.id === props.teamId);
        if (target) {
          setSelectTarget(undefined);
          setTargets([...target.members]);
        }
      }
    }
  }, [props]);
  const itemRender = (target?: schema.XTarget, textBox?: boolean) => {
    const value = target ? `${target.name}(${target.code})` : '';
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 10,
          paddingTop: 2,
        }}>
        {target && <EntityIcon entity={target} />}
        {textBox ? (
          <TextBox value={value} />
        ) : (
          <span style={{ paddingLeft: 8 }}>{value}</span>
        )}
      </div>
    );
  };
  return (
    <SelectBox
      {...props}
      readOnly={props.isOperator}
      showClearButton={false}
      value={selectTarget?.id}
      displayExpr={'name'}
      valueExpr={'id'}
      dataSource={targets}
      onItemClick={(e) => setSelectTarget(e.itemData)}
      fieldRender={() => {
        return itemRender(selectTarget, true);
      }}
      itemRender={(data) => itemRender(data)}
    />
  );
};

export default MemberBox;
