import React, { useState } from 'react';
import { Modal, Select, Input, Collapse, Menu } from 'antd';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import type { MenuProps } from 'antd';
import { data } from './moke';
import cls from './index.module.less';
interface Iprops {
  title: string;
  open: boolean;
  onOk: () => void;
  handleOk: () => void;
}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    label,
    key,
    icon,
    children,
    type,
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem('科室One', 'sub1', null, [
    getItem('室 1', '1'),
    getItem('室 2', '2'),
    getItem('室 3', '3'),
    getItem('室 4', '4'),
  ]),

  getItem('科室Two', 'sub2', null, [
    getItem('室 5', '5'),
    getItem('室 6', '6'),
    getItem('Submenu', 'sub3', null, [getItem('室 7', '7'), getItem('室 8', '8')]),
  ]),

  getItem('科室Three', 'sub4', null, [
    getItem('室 9', '9'),
    getItem('室 10', '10'),
    getItem('室 11', '11'),
    getItem('室 12', '12'),
  ]),
];

const rootSubmenuKeys = ['sub1', 'sub2', 'sub4']; //点击菜单，收起其他展开的所有菜单

const TransferDepartment = (props: Iprops) => {
  const { title, open, onOk, handleOk } = props;
  function onChange() {
    console.log(1);
  }
  const rm = (
    <div>
      <span className={cls['figure']}>财</span>浙江省财政厅
    </div>
  );
  const menuClick: MenuProps['onClick'] = (e) => {
    //菜单单击事件
    console.log('click ', e);
  };
  const [openKeys, setOpenKeys] = useState(['sub1']);
  const onOpenChange = (keys: any) => {
    console.log(keys);

    const latestOpenKey = keys.find((key: any) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  return (
    <Modal title={title} open={open} onOk={onOk} onCancel={handleOk}>
      <p>部门</p>
      <Select
        // defaultValue="请选择"
        placeholder="搜索部门和人员"
        style={{
          width: '100%',
        }}
        // onChange={handleChange}
        options={data}
      />
      <div className={cls['ogo-input']}></div>
      <Input
        placeholder="搜索部门和人员"
        prefix={<ClockCircleOutlined />}
        className={cls['mods']}
      />
      <Collapse onChange={onChange} expandIconPosition="end">
        <Collapse.Panel header={<>{rm}</>} key="1">
          <Menu
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onClick={menuClick}
            style={{ width: '100%' }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
          />
        </Collapse.Panel>
      </Collapse>
    </Modal>
  );
};
export default TransferDepartment;
