import { Button } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import React, { useEffect, useState } from 'react';

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
  const [data, setData] = useState<any[]>([]);
  const treeContainer = document.getElementById('templateMenu');

  useEffect(() => {
    setTimeout(async () => {
      setData(userCtrl.buildTargetTree(await userCtrl.space.loadSubTeam(false)));
    }, 0);
  }, []);

  const onSelect: TreeProps['onSelect'] = async (_, info: any) => {
    const item: ITarget = info.node.item;
    if (item) {
      console.log(await item.loadSubTeam());
      setData(userCtrl.buildTargetTree(await userCtrl.space.loadSubTeam(false)));
      setCurrent(item);
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
          treeData={data}
          title={'内设机构'}
          menu={menu}
          selectedKeys={[current?.id]}
          onSelect={onSelect}
          fieldNames={{
            title: 'name',
            key: 'id',
            children: 'children',
          }}
        />
      </div>,
      treeContainer,
    )
  ) : (
    <></>
  );
};

export default DepartTree;
