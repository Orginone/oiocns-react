import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import * as im from 'react-icons/im';

import cls from './index.module.less';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ITarget } from '@/ts/core/target/itarget';
import { PlusOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom';
import TargetTree from '@/bizcomponents/GlobalComps/targetTree';

type CreateGroupPropsType = {
  rKey: string;
  setCurrent: (current: ITarget) => void;
  handleMenuClick: (key: string, item: ITarget | undefined) => void;
};

const GroupTree: React.FC<CreateGroupPropsType> = ({
  handleMenuClick,
  setCurrent,
  rKey,
}) => {
  const [data, setData] = useState<ITarget[]>([]);
  const treeContainer = document.getElementById('templateMenu');

  useEffect(() => {
    userCtrl.company.getJoinedGroups(false).then((res) => {
      setData([...res]);
    });
  }, [rKey]);

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

  // const menu = ['新增部门', '删除部门'];
  return treeContainer ? (
    ReactDOM.createPortal(
      <div className={cls.topMes}>
        <Button
          className={cls.creatgroup}
          icon={<PlusOutlined className={cls.addIcon} />}
          type="text"
          onClick={() => {
            const id = '新建|集团';
            handleMenuClick(id, undefined);
          }}
        />
        <TargetTree
          className={cls.docTree}
          targets={data}
          onSelect={setCurrent}
          loadMenus={loadMenus}
          handleMenuClick={handleMenuClick}
        />
      </div>,
      treeContainer,
    )
  ) : (
    <></>
  );
};

export default GroupTree;
