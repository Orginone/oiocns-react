import { Button } from 'antd';
import type { DataNode } from 'antd/es/tree';
import React, { useState, useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import MarketClassifyTree from '@/components/CustomTreeComp';
import cls from './index.module.less';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { IIdentity } from '@/ts/core/target/authority/iidentity';
import AddPosttionModal from '../AddPositionMoadl';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
/*由于对接他人页面不熟悉，要边开发边去除冗余代码，勿删!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
type CreateGroupPropsType = {
  createTitle: string;
  currentKey: string;
  setCurrent: (current: IIdentity) => void;
  handleMenuClick: (key: string, item: any) => void;
  // 点击操作触发的事件
  indentitys: IIdentity[];
};

const items: DataNode[] = [
  {
    title: '管理员',
    key: 'super-manager',
    icon: <UserOutlined />,
    children: [],
  },
  {
    title: '管理员2',
    key: 'super-manager2',
    icon: <UserOutlined />,
    children: [],
  },
];
type target = {
  title: string;
  key: string;
  object: IIdentity;
};
const CreatePosition: React.FC<CreateGroupPropsType> = (props) => {
  useEffect(() => {
    getAuthTree();
  }, []);
  const { indentitys, setCurrent } = props;
  const [selectMenu, setSelectMenu] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [authTree, setAuthTree] = useState<IAuthority[]>();

  const getAuthTree = async () => {
    const data = await userCtrl.Company.selectAuthorityTree();
    if (data) {
      console.log(data.name);
      setAuthTree([data]);
    }
  };
  const changeData = (target: IIdentity[]): target[] => {
    const result: target[] = [];
    if (target != undefined) {
      for (const a of target) {
        result.push({
          title: a.target.name,
          key: a.target.id,
          object: a,
        });
      }
    } else {
      console.log('空值');
    }
    return result;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleMenuClick = (key: string, data: target) => {
    // 触发内容去变化
    console.log('点击', key, data);
  };
  const close = () => {
    setIsOpenModal(false);
  };
  const onSelect = async (
    selectKeys: string[],
    info: { selected: boolean; node: { object: IIdentity } },
  ) => {
    // 触发内容去变化
    if (info.selected) {
      setCurrent(info.node.object);
    }
  };

  const menu = ['更改岗位名称', '删除'];
  const positionList = (
    <MarketClassifyTree
      searchable
      childIcon={<UserOutlined />}
      key={selectMenu}
      handleMenuClick={handleMenuClick}
      treeData={changeData(indentitys!)}
      menu={menu}
      onSelect={onSelect}
      title={'全部岗位'}
    />
  );

  return (
    <div>
      <div className={cls.topMes}>
        <Button
          className={cls.creatgroup}
          type="primary"
          onClick={() => {
            setIsOpenModal(true);
          }}>
          新增身份
        </Button>
        {positionList}
      </div>
      <AddPosttionModal
        title={'新增身份'}
        open={isOpenModal}
        onOk={close}
        handleOk={close}
        authTree={authTree}
      />
    </div>
  );
};

export default CreatePosition;
