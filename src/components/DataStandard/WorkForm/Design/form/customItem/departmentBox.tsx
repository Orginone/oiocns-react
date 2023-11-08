import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { schema } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { IDepartment } from '@/ts/core';
import { DropDownBox, TextBox, TreeView } from 'devextreme-react';
import { ISelectBoxOptions } from 'devextreme-react/select-box';
import React, { useEffect, useState } from 'react';

interface MemberBoxProps extends ISelectBoxOptions {
  teamId?: string;
  isOperator?: boolean;
  target: schema.XTarget;
}
type DTarget = schema.XTarget & { parentId?: string };

const DepartmentBox: React.FC<MemberBoxProps> = (props) => {
  const [opened, setOpened] = useState<boolean>(false);
  const [targets, setTargets] = useState<DTarget[]>();
  const [selectTarget, setSelectTarget] = useState<DTarget>();
  useEffect(() => {
    const company = orgCtrl.user.companys.find((i) => i.id === props.target.id);
    if (company) {
      setTargets(loadDepartments(company.departments, undefined));
    }
  }, [props]);
  const loadDepartments = (departments: IDepartment[], parentId?: string) => {
    const departs: DTarget[] = [];
    for (const department of departments) {
      if (department.children && department.children.length > 0) {
        departs.push(...loadDepartments(department.children, department.id));
      }
      departs.push({ ...department.metadata, parentId: parentId });
    }
    return departs;
  };
  const itemRender = (target?: DTarget, textBox?: boolean) => {
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
        <span style={{ paddingLeft: 8 }}>{value}</span>
        {textBox && <TextBox readOnly />}
      </div>
    );
  };
  const treeViewRender = () => {
    return (
      <TreeView
        keyExpr="id"
        dataSource={targets}
        expandNodesRecursive
        dataStructure="plain"
        parentIdExpr="parentId"
        selectionMode="single"
        selectByClick={true}
        onItemClick={() => setOpened(false)}
        itemRender={(e) => itemRender(e, false)}
        onItemSelectionChanged={(e) => {
          const targets = e.component.getSelectedNodes();
          if (targets.length > 0) {
            setSelectTarget(targets[0].itemData as DTarget);
          }
        }}
      />
    );
  };
  return (
    <DropDownBox
      {...props}
      opened={opened}
      dataSource={targets}
      readOnly={props.readOnly}
      value={selectTarget?.id}
      contentRender={treeViewRender}
      labelMode={selectTarget ? 'static' : 'floating'}
      fieldRender={() => itemRender(selectTarget, true)}
      onOptionChanged={(e) => {
        if (e.name === 'opened') {
          setOpened(e.value);
        }
      }}
    />
  );
};

export default DepartmentBox;
