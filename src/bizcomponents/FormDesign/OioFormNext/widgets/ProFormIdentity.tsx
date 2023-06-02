import IndentitySelect from '@/bizcomponents/IndentityManage';
import { AiOutlineSelect } from 'react-icons/ai';
import { ProForm } from '@ant-design/pro-components';
import { Button, Input, Modal } from 'antd';
import React, { useState } from 'react';
import { IBelong } from '@/ts/core';
import { Rule } from 'antd/lib/form';
import { FormLabelAlign } from 'antd/lib/form/interface';
import { LabelTooltipType } from 'antd/lib/form/FormItemLabel';

const { Search } = Input;

interface IProps {
  rules: Rule[];
  name: string;
  belong: IBelong;
  label: React.ReactNode;
  labelAlign: FormLabelAlign;
  tooltip: LabelTooltipType;
}

/**
 * 角色组件(Todo 待完善)
 */
const ProFormIdentity = (props: IProps) => {
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [identity, setIdentity] = useState<any>({});

  const [isOpen, setIsOpen] = useState<boolean>(false); // 打开弹窗

  const onSearch = (value: string) => console.log(value);

  return (
    <>
      <ProForm.Item {...props} label={props.label || '角色'}>
        <Search
          placeholder={'请选择角色'}
          allowClear
          value={name || id}
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
      <Modal
        width="650px"
        title="选择角色"
        open={isOpen}
        destroyOnClose={true}
        onOk={() => {
          console.log('identity', identity);
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}>
        <IndentitySelect
          space={props.belong}
          multiple={false}
          onChecked={(params: any) => {
            console.log('params', params);
            setIdentity(params.data);
            setId(params.key);
            setName(params.title);
          }}
        />
      </Modal>
    </>
  );
};

export default ProFormIdentity;
