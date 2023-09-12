import { AiOutlineSelect } from '@/icons/ai';
import { ProForm } from '@ant-design/pro-components';
import { Button, Input } from 'antd';
import React, { useState } from 'react';
import { IBelong } from '@/ts/core';
import { Rule } from 'antd/lib/form';
import { FormLabelAlign } from 'antd/lib/form/interface';
import { LabelTooltipType } from 'antd/lib/form/FormItemLabel';
import SelectIdentity from '@/components/Common/SelectIdentity';
import { schema } from '@/ts/base';

const { Search } = Input;

interface IProps {
  rules: Rule[];
  name: string;
  belong?: IBelong;
  label: React.ReactNode;
  labelAlign: FormLabelAlign;
  tooltip: LabelTooltipType;
}

/**
 * 角色组件(Todo 待完善)
 */
const ProFormIdentity = (props: IProps) => {
  const [identity, setIdentity] = useState<schema.XIdentity>();
  const [isOpen, setIsOpen] = useState<boolean>(false); // 打开弹窗
  const onSearch = (value: string) => console.log(value);

  return (
    <>
      <ProForm.Item {...props} label={props.label || '角色'}>
        <Search
          placeholder={'请选择角色'}
          allowClear
          value={identity?.id}
          readOnly={true}
          enterButton={
            <Button
              icon={<AiOutlineSelect />}
              type="primary"
              onClick={() => setIsOpen(true)}></Button>
          }
          onSearch={onSearch}
        />
      </ProForm.Item>
      {props.belong && (
        <SelectIdentity
          multiple={false}
          space={props.belong}
          open={isOpen}
          exclude={[]}
          finished={(selected) => {
            if (selected.length > 0) {
              setIdentity(selected[0]);
            }
            setIsOpen(false);
          }}
        />
      )}
    </>
  );
};

export default ProFormIdentity;
