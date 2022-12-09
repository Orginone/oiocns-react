import { Button } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import React, { useEffect, useState } from 'react';
import * as im from 'react-icons/im';

import cls from './index.module.less';
import StoreClassifyTree from '@/components/CustomTreeComp';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ITarget } from '@/ts/core/target/itarget';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { PlusOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom';
import { ImOffice } from 'react-icons/im';

type CreateGroupPropsType = {
  current: ITarget | undefined;
  setCurrent: (current: ITarget) => void;
  handleMenuClick: (key: string, item: ITarget | undefined, id?: string) => void; // 点击操作触发的事件
};

const GroupTree: React.FC<CreateGroupPropsType> = ({
  handleMenuClick,
  setCurrent,
  current,
}) => {
  const [key] = useCtrlUpdate(userCtrl);
  const [data, setData] = useState<any[]>([]);
  const treeContainer = document.getElementById('templateMenu');

  useEffect(() => {
    loadTeamTree();
  }, []);

  /** 加载右侧菜单 */
  const loadMenus = (item: ITarget) => {
    const result = [];
    item.subTeamTypes.forEach((i) => {
      result.push({
        key: 'new' + i,
        icon: <ImOffice />,
        label: '新建' + i,
      });
    });
    result.push(
      {
        key: '刷新',
        icon: <im.ImSpinner9 />,
        label: '刷新子组织',
      },
      {
        key: '删除',
        icon: <im.ImBin />,
        label: '删除' + item.name,
      },
    );
    return result;
  };

  const loadTeamTree = async () => {
    const targets = await userCtrl.company.getJoinedGroups();
    setData(buildTargetTree(targets));
  };

  /** 加载组织树 */
  const buildTargetTree = (targets: ITarget[]) => {
    const result: any[] = [];
    if (targets) {
      for (const item of targets) {
        result.push({
          key: item.id,
          title: item.name,
          item: item,
          isLeaf: false,
          menus: loadMenus(item),
          icon: <ImOffice />,
          children: buildTargetTree(item.subTeam),
        });
      }
    }
    return result;
  };

  const onSelect: TreeProps['onSelect'] = async (_, info: any) => {
    const item: ITarget = info.node.item;
    if (item) {
      await item.loadSubTeam();
      loadTeamTree();
      setCurrent(item);
    }
  };

  // const menu = ['新增部门', '删除部门'];
  return treeContainer ? (
    ReactDOM.createPortal(
      <div id={key} className={cls.topMes}>
        <Button
          className={cls.creatgroup}
          icon={<PlusOutlined className={cls.addIcon} />}
          type="text"
          onClick={() => handleMenuClick('new', undefined)}
        />
        <StoreClassifyTree
          className={cls.docTree}
          title={'内设机构'}
          isDirectoryTree
          menu={'menus'}
          searchable
          showIcon
          treeData={data}
          selectedKeys={[current?.id]}
          onSelect={onSelect}
          handleMenuClick={(key, node) => handleMenuClick(key, node.item)}
        />
      </div>,
      treeContainer,
    )
  ) : (
    <></>
  );
};

export default GroupTree;
