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

const DepartmentBox: React.FC<MemberBoxProps> = (props) => {
  const [targets, setTargets] = useState<schema.XTarget[]>();
  const [selectTarget, setSelectTarget] = useState<schema.XTarget>();
  useEffect(() => {
    const company = orgCtrl.user.companys.find((i) => i.id === props.target.id);
    if (company) {
      setTargets(company.departments.map((a) => a.metadata));
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
      itemRender={(data) => itemRender(data)}
      fieldRender={() => {
        return itemRender(selectTarget, true);
      }}
    />
  );
};

export default DepartmentBox;
