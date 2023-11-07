import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { schema } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { IDepartment } from '@/ts/core';
import { DropDownBox, TextBox, TreeView } from 'devextreme-react';
import { ISelectBoxOptions } from 'devextreme-react/select-box';
import React, { useEffect, useState } from 'react';

interface DepartmentBoxProps extends ISelectBoxOptions {
  teamId?: string;
  isOperator?: boolean;
  target: schema.XTarget;
}
type DTarget = schema.XTarget & { parentId?: string };

const DepartmentBox: React.FC<DepartmentBoxProps> = (props) => {
  const [opened, setOpened] = useState<boolean>(false);
  const [targets, setTargets] = useState<DTarget[]>();
  const [selectTarget, setSelectTarget] = useState<DTarget>();
  useEffect(() => {
    props.onValueChanged?.apply(this, [{ value: selectTarget?.id } as any]);
  }, [selectTarget]);
  useEffect(() => {
    if (props.readOnly) {
      if (props.defaultValue && props.defaultValue.length > 5) {
        orgCtrl.user.findEntityAsync(props.defaultValue).then((value) => {
          setSelectTarget(value as DTarget);
        });
      }
    } else {
      const company = orgCtrl.user.companys.find((i) => i.id === props.target.id);
      if (company) {
        setTargets(loadDepartments(company.departments, undefined));
      }
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
        {textBox ? (
          <TextBox value={value} />
        ) : (
          <span style={{ paddingLeft: 8 }}>{value}</span>
        )}
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
        itemRender={() => itemRender(selectTarget, false)}
        onItemSelectionChanged={(e) => {
          const targets = e.component.getSelectedNodes();
          setSelectTarget(targets.at(-1)?.itemData as DTarget);
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
