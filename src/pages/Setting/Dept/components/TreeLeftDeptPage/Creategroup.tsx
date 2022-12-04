import { Button } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import React, { useState, useEffect } from 'react';

import cls from './index.module.less';
import MarketClassifyTree from '@/components/CustomTreeComp';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { schema } from '@/ts/base';
import SettingService from '../../service';
import { IDepartment } from '@/ts/core/target/itarget';
import { getUuid } from '@/utils/tools';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { PlusOutlined } from '@ant-design/icons';

type CreateGroupPropsType = {
  createTitle: string;
  currentKey: string;
  setCurrent: (current: schema.XTarget) => void;
  handleMenuClick: (key: string, item: any) => void; // 点击操作触发的事件
};

const Creategroup: React.FC<CreateGroupPropsType> = ({ handleMenuClick, setCurrent }) => {
  const [key] = useCtrlUpdate(userCtrl);

  const [treeData, setTreeData] = useState<any[]>([]);
  const setting = SettingService.getInstance();

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
      const tree = data.map((n) => {
        return createTeeDom(n);
      });
      setTreeData(tree);
    }
  };
  const createTeeDom = (n: IDepartment) => {
    const { target } = n;
    return {
      key: target.id + getUuid(),
      title: target.name,
      icon: target.avatar,
      // children: [],
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
    if (info.selected) {
      setCurrent(info.node.target.target);
      setting.setCurrTreeDeptNode(info.node.target.target.id);
    }
  };

  const menu = ['新增部门'];
  return (
    <div>
      <div className={cls.topMes}>
        <Button
          className={cls.creatgroup}
          icon={<PlusOutlined className={cls.addIcon} />}
          type="text"
          onClick={() => handleMenuClick('new', {})}
        />
        <MarketClassifyTree
          id={key}
          showIcon
          searchable
          handleMenuClick={handleMenuClick}
          treeData={treeData}
          title={'内设机构'}
          menu={menu}
          loadData={loadDept}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
};

export default Creategroup;
