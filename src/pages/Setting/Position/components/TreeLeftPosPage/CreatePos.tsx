import { Button } from 'antd';
import type { DataNode } from 'antd/es/tree';
import React, { useState, useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { schema } from '@/ts/base';
import MarketClassifyTree from '@/components/CustomTreeComp';
import cls from './index.module.less';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { IIdentity } from '@/ts/core/target/authority/iidentity';
import { TargetType } from '@/ts/core/enum';
/*由于对接他人页面不熟悉，要边开发边去除冗余代码，勿删!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
type CreateGroupPropsType = {
  createTitle: string;
  currentKey: string;
  setCurrent: (current: schema.XTarget) => void;
  handleMenuClick: (key: string, item: any) => void;
  // 点击操作触发的事件
  callBack: Function;
  personCallBack: Function;
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
const CreatePosition: React.FC<CreateGroupPropsType> = (prop) => {
  useEffect(() => {
    getDataDetail();
  }, []);

  const [selectMenu, setSelectMenu] = useState<string>('');
  const [indentitys, setIndentitys] = useState<IIdentity[]>();
  const getDataDetail = async () => {
    setIndentitys(await userCtrl.Company.getIdentitys());
    console.log(await userCtrl.Company.getIdentitys());
    changeData(indentitys!);
    // prop.callBack(indentitys![0]);
    // prop.personCallBack(await indentitys![0].getIdentityTargets(TargetType.Person)[0]);
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

  const handleTitleClick = async (item: target) => {
    // 触发内容去变化
    const res = await item.object.getIdentityTargets(TargetType.Person);
    prop.personCallBack(res.data.result);
    prop.callBack(item.object);
  };

  const menu = ['更改岗位名称', '删除'];
  const positionList = (
    <MarketClassifyTree
      searchable
      childIcon={<UserOutlined />}
      key={selectMenu}
      handleMenuClick={handleMenuClick}
      handleTitleClick={handleTitleClick}
      treeData={changeData(indentitys!)}
      menu={menu}
      title={'全部岗位'}
    />
  );

  return (
    <div>
      <div className={cls.topMes}>
        <Button className={cls.creatgroup} type="primary" onClick={() => {}}>
          新增岗位
        </Button>
        {positionList}
      </div>
    </div>
  );
};

export default CreatePosition;
