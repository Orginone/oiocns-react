import React, { useEffect, useState } from 'react';
import { ProFormTreeSelect } from '@ant-design/pro-components';
import { Rule } from 'antd/lib/form';
import { FormLabelAlign } from 'antd/lib/form/interface';
import { LabelTooltipType } from 'antd/es/form/FormItemLabel';
import { IBelong } from '@/ts/core';
import { schema } from '@/ts/base';

interface IProps {
  dictId: string;
  rules: Rule[];
  name: string;
  label: React.ReactNode;
  labelAlign: FormLabelAlign;
  tooltip: LabelTooltipType;
  belong: IBelong;
  props: any;
}
/**
 * 字典组件
 */
const ProFormDict = (props: IProps) => {
  const [treeData, setTreeData] = useState<any[]>([]);

  const filterOption = (input: any, option: any) =>
    ((option?.label ?? '') as string).includes(input);
  const filterSort = (optionA: any, optionB: any) =>
    ((optionA?.label ?? '') as string)
      .toLowerCase()
      .localeCompare(((optionB?.label ?? '') as string).toLowerCase());
  const buildTreeNode = (id: string, items: schema.XSpeciesItem[]): any[] => {
    return items
      .filter((i) => i.parentId === id)
      .map((i) => {
        return {
          label: i.name,
          value: i.id,
          children: buildTreeNode(i.id, items),
        };
      });
  };
  useEffect(() => {
    props.belong.resource.speciesItemColl
      .loadSpace({
        options: { match: { speciesId: props.dictId } },
      })
      .then((value) => {
        setTreeData(
          value
            .filter((i) => !(i.parentId?.length > 0))
            .map((i) => {
              return {
                label: i.name,
                value: i.id,
                children: buildTreeNode(i.id, value),
              };
            }),
        );
      });
  }, []);
  return (
    <ProFormTreeSelect
      width={200}
      name={props.name}
      label={props.label}
      tooltip={props.tooltip}
      labelAlign={props.labelAlign}
      fieldProps={{
        treeData: treeData,
        ...props.rules,
        ...{ filterOption },
        ...{ filterSort },
      }}
      rules={props.rules}
    />
  );
};

export default ProFormDict;
