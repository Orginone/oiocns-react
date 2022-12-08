import { Button } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import React, { useState, useEffect } from 'react';

import cls from './index.module.less';
import MarketClassifyTree from '@/components/CustomTreeComp';
import userCtrl from '@/ts/controller/setting/userCtrl';
import SettingService from '../../service';
import { IDepartment } from '@/ts/core/target/itarget';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { PlusOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom';

type CreateGroupPropsType = {
  currentKey: string;
  setCurrent: (current: IDepartment) => void;
  handleMenuClick: (key: string, item: IDepartment | undefined, id?: string) => void; // 点击操作触发的事件
};

const Creategroup: React.FC<CreateGroupPropsType> = ({
  handleMenuClick,
  setCurrent,
  currentKey,
}) => {
  const [key] = useCtrlUpdate(userCtrl);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [selectKey, setSelectKey] = useState<React.Key>(currentKey);
  const setting = SettingService.getInstance();
  const treeContainer = document.getElementById('templateMenu');
  useEffect(() => {
    // 如果新增部门，就需要重新初始化树TODO
    initData(true);
  }, [key]);

  const initData = async (reload: boolean) => {
    const data = await userCtrl.Company.getDepartments(reload);
    if (data.length > 0) {
      if (currentKey && data[0].target.id !== currentKey) {
        const currentContentDept = await setting.refItem(currentKey);
        setCurrent(currentContentDept || data[0]);
        setSelectKey(currentContentDept ? currentKey : data[0].target.id);
      } else {
        setSelectKey(data[0].target.id);
        setCurrent(data[0]);
      }
      const tree = data.map((n) => {
        return createTreeDom(n);
      });
      setTreeData(tree);
    }
  };
  const createTreeDom: any = (n: IDepartment, pid?: string) => {
    const { target } = n;
    return {
      key: target.id,
      title: target.name,
      tag: { color: '#8ba5ec', txt: target.typeName },
      icon: target.avatar,
      isLeaf: false,
      intans: n,
      children:
        n.departments.length > 0
          ? n.departments.map((m) => createTreeDom(m, n.target.id))
          : undefined,
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
      <div className={cls.topMes}>
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
          treeData={treeData}
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

export default Creategroup;
