import { Button } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import React, { useState, useEffect } from 'react';

import cls from './index.module.less';
import MarketClassifyTree from '@/components/CustomTreeComp';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { schema } from '@/ts/base';
import SettingService from '../../service';
import { IDepartment } from '@/ts/core/target/itarget';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { PlusOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom';

type CreateGroupPropsType = {
  createTitle: string;
  currentKey: string;
  setCurrent: (current: schema.XTarget) => void;
  handleMenuClick: (key: string, item: any) => void; // 点击操作触发的事件
};

const Creategroup: React.FC<CreateGroupPropsType> = ({ handleMenuClick, setCurrent }) => {
  const [key] = useCtrlUpdate(userCtrl);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [currentKey, setCurrentKey] = useState<React.Key>('');
  const setting = SettingService.getInstance();
  const treeContainer = document.getElementById('templateMenu');
  useEffect(() => {
    // 如果新增部门，就需要重新初始化树TODO
    if (userCtrl?.Company) {
      if (userCtrl?.Company.departments && userCtrl?.Company.departments.length > 0) {
        userCtrl.Company.departments = [];
      }
      initData(true);
    }
  }, [key]);

  const initData = async (reload: boolean) => {
    const data = await userCtrl?.Company?.getDepartments(reload);
    if (data?.length) {
      setCurrentKey(data[0].target.id);
      setCurrent(data[0].target);
      const tree = data.map((n) => {
        return createTeeDom(n);
      });
      setTreeData(tree);
    }
  };
  const createTeeDom = (n: IDepartment) => {
    const { target } = n;
    return {
      key: target.id,
      title: target.name,
      tag: { color: '#8ba5ec', txt: target.typeName },
      icon: target.avatar,
      isLeaf: false,
      target: n,
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
  const loadDept = async ({ key, children, target }: any) => {
    if (children) {
      return;
    }
    const deptChild: any[] = await target.getDepartments();
    setTreeData((origin) =>
      updateTreeData(
        origin,
        key,
        deptChild.map((n) => createTeeDom(n)),
      ),
    );
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeys, info: any) => {
    setCurrentKey(selectedKeys.length > 0 ? selectedKeys[0] : '');
    if (info.selected) {
      setCurrent(info.node.target.target);
      setting.setCurrTreeDeptNode(info.node.target.target.id);
    }
  };

  const menu = ['新增部门'];
  return treeContainer ? (
    ReactDOM.createPortal(
      <div className={cls.topMes}>
        <Button
          className={cls.creatgroup}
          icon={<PlusOutlined className={cls.addIcon} />}
          type="text"
          onClick={() => handleMenuClick('new', {})}
        />
        <MarketClassifyTree
          className={cls.docTree}
          showIcon
          searchable
          handleMenuClick={handleMenuClick}
          treeData={treeData}
          title={'内设机构'}
          menu={menu}
          selectedKeys={[currentKey]}
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