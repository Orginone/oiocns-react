import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineUser } from 'react-icons/ai';
import MarketClassifyTree from '@/components/CustomTreeComp';
import cls from './index.module.less';
import { IIdentity } from '@/ts/core/target/authority/iidentity';
import AddPosttionModal from '../AddPositionMoadl';
import { ITarget } from '@/ts/core/target/itarget';
type CreateGroupPropsType = {
  currentKey: string;
  setCurrent: (current: IIdentity) => void; // 点击操作触发的事件
  indentitys: IIdentity[];
  current: ITarget;
  isAdmin: boolean;
};
type target = {
  title: string;
  key: string;
  object: IIdentity;
};
const CreatePosition: React.FC<CreateGroupPropsType> = (props) => {
  const { indentitys, setCurrent, current, currentKey, isAdmin } = props;
  const [selectMenu, setSelectMenu] = useState<string>(currentKey);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  useEffect(() => {
    setSelectMenu(currentKey);
  }, [currentKey]);

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

  const close = () => {
    setIsOpenModal(false);
  };
  const onSelect = async (
    _: string[],
    info: { selected: boolean; node: { object: IIdentity } },
  ) => {
    setSelectMenu(_.length > 0 ? _[0] : '');
    // 触发内容去变化
    if (info.selected) {
      setCurrent(info.node.object);
    }
  };

  const positionList = (
    <MarketClassifyTree
      searchable
      childIcon={<AiOutlineUser />}
      selectedKeys={[selectMenu]}
      treeData={changeData(indentitys!)}
      onSelect={onSelect}
      title={'全部角色'}
    />
  );
  return (
    <div>
      <div className={cls.topMes}>
        {isAdmin && (
          <Button
            className={cls.creatgroup}
            type="text"
            icon={<AiOutlinePlus className={cls.addIcon} />}
            onClick={() => {
              setIsOpenModal(true);
            }}
          />
        )}
        {positionList}
      </div>
      <AddPosttionModal
        title={'新增'}
        open={isOpenModal}
        handleCancel={close}
        handleOk={close}
        current={current}
      />
    </div>
  );
};

export default CreatePosition;
