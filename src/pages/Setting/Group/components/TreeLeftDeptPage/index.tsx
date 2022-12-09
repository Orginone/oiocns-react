import { Button } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import React, { useEffect, useState } from 'react';
import * as im from 'react-icons/im';

import cls from './index.module.less';
import StoreClassifyTree from '@/components/CustomTreeComp';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ITarget } from '@/ts/core/target/itarget';
import { PlusOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom';
import { TargetType } from '@/ts/core';

type CreateGroupPropsType = {
  key: string;
  current: ITarget | undefined;
  setCurrent: (current: ITarget) => void;
  handleMenuClick: (key: string, item: ITarget | undefined) => void;
};

const GroupTree: React.FC<CreateGroupPropsType> = ({
  key,
  handleMenuClick,
  setCurrent,
  current,
}) => {
  const [data, setData] = useState<any[]>([]);
  const treeContainer = document.getElementById('templateMenu');

  useEffect(() => {
    loadTeamTree();
  }, [current]);

  /** 加载右侧菜单 */
  const loadMenus = (item: ITarget) => {
    return [
      {
        key: '新建|集团',
        icon: <im.ImPlus />,
        label: '新建',
        item: item,
      },
      {
        key: '刷新',
        icon: <im.ImSpinner9 />,
        label: '刷新',
        item: item,
      },
      {
        key: '删除',
        icon: <im.ImBin />,
        label: '删除',
        item: item,
      },
    ];
  };

  const loadTeamTree = async () => {
    const targets = await userCtrl.company.getJoinedGroups(false);
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
          isLeaf: item.subTeam.length === 0,
          menus: loadMenus(item),
          icon: getIcon(item.teamName as TargetType),
          children: buildTargetTree(item.subTeam),
        });
      }
    }
    return result;
  };

  const getIcon = (type: TargetType) => {
    switch (type) {
      case TargetType.Working:
        return <im.ImUsers />;
      default:
        return <im.ImTree />;
    }
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
          onClick={() => {
            const key = '新建|集团';
            handleMenuClick(key, undefined);
          }}
        />
        <StoreClassifyTree
          className={cls.docTree}
          title={'外部机构'}
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
