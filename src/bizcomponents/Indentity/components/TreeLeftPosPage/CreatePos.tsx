import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import MarketClassifyTree from '@/components/CustomTreeComp';
import cls from './index.module.less';
import { IIdentity } from '@/ts/core/target/authority/iidentity';
import AddPosttionModal from '../AddPositionMoadl';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
import {
  IDepartment,
  IPerson,
  IGroup,
  ICompany,
  ICohort,
} from '@/ts/core/target/itarget';
type CreateGroupPropsType = {
  createTitle: string;
  currentKey: string;
  setCurrent: (current: IIdentity) => void;
  handleMenuClick: (key: string, item: any) => void;
  // 点击操作触发的事件
  indentitys: IIdentity[];
  reObject: IDepartment | IPerson | IGroup | ICompany | ICohort;
};
type target = {
  title: string;
  key: string;
  object: IIdentity;
};
const CreatePosition: React.FC<CreateGroupPropsType> = (props) => {
  useEffect(() => {
    getAuthTree();
  }, []);
  const { indentitys, setCurrent, reObject } = props;
  const [selectMenu, setSelectMenu] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [authTree, setAuthTree] = useState<IAuthority[]>();

  const getAuthTree = async () => {
    const data = await reObject.selectAuthorityTree(false);
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
    }
    return result;
  };

  const handleMenuClick = (key: string, data: target) => {
    console.log('点击', key, data);
  };
  const close = () => {
    setIsOpenModal(false);
  };
  const onSelect = async (
    _: string[],
    info: { selected: boolean; node: { object: IIdentity } },
  ) => {
    // 触发内容去变化
    if (info.selected) {
      setCurrent(info.node.object);
    }
  };

  const positionList = (
    <MarketClassifyTree
      searchable
      childIcon={<UserOutlined />}
      key={selectMenu}
      handleMenuClick={handleMenuClick}
      treeData={changeData(indentitys!)}
      onSelect={onSelect}
      title={'全部岗位'}
    />
  );
  return (
    <div>
      <div className={cls.topMes} style={{ marginRight: '25px' }}>
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
        reObject={reObject}
      />
    </div>
  );
};

export default CreatePosition;
