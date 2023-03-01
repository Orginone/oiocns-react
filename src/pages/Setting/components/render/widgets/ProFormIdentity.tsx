import IndentitySelect from '@/bizcomponents/IndentityManage';
import userCtrl from '@/ts/controller/setting';
import { SelectOutlined } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-components';
import { Button, Input, Modal } from 'antd';
import React, { useState } from 'react';

const { Search } = Input;

/**
 * 身份组件(Todo 待完善)
 */
const ProFormIdentity = (props: any) => {
  const nodeOperateOrgId = props.orgId || userCtrl.space.id;
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [identity, setIdentity] = useState<any>({});

  const [isOpen, setIsOpen] = useState<boolean>(false); // 打开弹窗

  const onSearch = (value: string) => console.log(value);

  return (
    <>
      <ProForm.Item {...props} label={props.label || '身份'}>
        <Search
          placeholder={props.placeholder || '请选择角色'}
          allowClear
          defaultValue={props.defaultValue}
          value={name || id}
          readOnly={true}
          enterButton={
            <Button
              icon={<SelectOutlined />}
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
          multiple={false}
          orgId={nodeOperateOrgId}
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
