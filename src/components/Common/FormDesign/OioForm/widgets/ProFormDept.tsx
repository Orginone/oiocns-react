import React, { useEffect, useState } from 'react';
import { ProFormTreeSelect } from '@ant-design/pro-components';
import { IBelong, ICompany, IDepartment, TargetType } from '@/ts/core';
import { Rule } from 'antd/lib/form';
import { FormLabelAlign } from 'antd/lib/form/interface';
import { LabelTooltipType } from 'antd/lib/form/FormItemLabel';

interface IProps {
  rules: Rule[];
  name: string;
  belong: IBelong;
  label: React.ReactNode;
  labelAlign: FormLabelAlign;
  tooltip: LabelTooltipType;
}

interface treeModel {
  key: string;
  label: string;
  value: string;
  children: treeModel[];
}

/**
 * 部门组件
 */
const ProFormDept = (props: IProps) => {
  const [treeData, setTreeData] = useState<treeModel[]>([]);

  const buildDepartments = (departments: IDepartment[]) => {
    const data: treeModel[] = [];
    for (const item of departments) {
      data.push({
        key: item.id,
        label: item.name,
        value: item.id,
        children: buildDepartments(item.children),
      });
    }
    return data;
  };
  useEffect(() => {
    if (props.belong.typeName != TargetType.Person) {
      const company = props.belong as ICompany;
      setTreeData(buildDepartments(company.departments));
    }
  }, []);

  return (
    <ProFormTreeSelect
      name={props.name}
      label={props.label}
      tooltip={props.tooltip}
      labelAlign={props.labelAlign}
      fieldProps={{
        ...{ treeData },
      }}
      width={150}
      rules={props.rules}
    />
  );
};

export default ProFormDept;
