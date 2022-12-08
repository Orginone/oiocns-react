import { Button } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import React, { useState } from 'react';

import cls from './index.module.less';
import MarketClassifyTree from '@/components/CustomTreeComp';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ITarget } from '@/ts/core/target/itarget';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { PlusOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom';

type CreateGroupPropsType = {
  current: ITarget | undefined;
  setCurrent: (current: ITarget) => void;
  handleMenuClick: (key: string, item: ITarget | undefined, id?: string) => void; // 点击操作触发的事件
};

const DepartTree: React.FC<CreateGroupPropsType> = ({
  handleMenuClick,
  setCurrent,
  current,
}) => {
  const [key] = useCtrlUpdate(userCtrl);
  const [selectKey, setSelectKey] = useState<React.Key>(currentKey);
  const setting = SettingService.getInstance();
  const treeContainer = document.getElementById('templateMenu');

  const initData = async (reload: boolean) => {
    const data = await userCtrl.company.loadSubTeam(reload);
    if (data.length > 0) {
      if (currentKey && data[0].target.id !== currentKey) {
        const currentContentDept = await setting.refItem(currentKey);
        setCurrent(currentContentDept || data[0]);
        setSelectKey(currentContentDept ? currentKey : data[0].target.id);
      } else {
        setSelectKey(data[0].target.id);
        setCurrent(data[0]);
      }
      return data.map((n) => {
        return createTreeDom(n);
      });
    }
    return [];
  };

  const createTreeDom: any = (n: ITarget, pid?: string) => {
    const { target } = n;
    const child = n.subTeam.map((m) => createTreeDom(m, target.id));
    return {
      key: target.id,
      title: target.name,
      tag: { color: '#8ba5ec', txt: target.typeName },
      icon: target.avatar,
      isLeaf: false,
      intans: n,
      children: child,
      pid,
    };
  };
  const updateTreeData = (list: any[], key: React.Key, children: any[]): any[] =>
    list.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          children,
          isLeaf: children.length == 0,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });
  const loadDept = async ({ key, children, intans }: any) => {
    if (children) {
      return;
    }
    const deptChild: any[] = await intans.getDepartments();
    setTreeData((origin) =>
      updateTreeData(
        origin,
        key,
        deptChild.map((n) => createTreeDom(n, intans.target.id)),
      ),
    );
  };

  const onSelect: TreeProps['onSelect'] = async (selectedKeys, info: any) => {
    setSelectKey(selectedKeys.length > 0 ? selectedKeys[0] : '');
    await loadDept(info.node);
    if (info.selected) {
      setCurrent(info.node.intans);
      setting.setCurrTreeDeptNode(info.node.intans.target.id);
    }
  };

  const menu = ['新增部门', '删除部门'];
  return treeContainer ? (
    ReactDOM.createPortal(
      <div id={key} className={cls.topMes}>
        <Button
          className={cls.creatgroup}
          icon={<PlusOutlined className={cls.addIcon} />}
          type="text"
          onClick={() => handleMenuClick('new', undefined)}
        />
        <MarketClassifyTree
          className={cls.docTree}
          showIcon
          searchable
          handleMenuClick={(key, node) => handleMenuClick(key, node.intans, node.pid)}
          treeData={initData(false)}
          title={'内设机构'}
          menu={menu}
          selectedKeys={[selectKey]}
          loadData={loadDept}
          onSelect={onSelect}
        />
      </div>,
      treeContainer,
    )
  ) : (
    <></>
  );
};

export default DepartTree;
