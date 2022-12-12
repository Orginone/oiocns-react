import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import MarketClassifyTree from '@/components/CustomTreeComp';
import cls from './index.module.less';
import { IStation } from '@/ts/core/target/itarget';
import CreateTeamModal from '@/bizcomponents/GlobalComps/createTeam';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { TargetType } from '@/ts/core';

type CreateGroupPropsType = {
  currentKey: string;
  setCurrent: (current: IStation) => void;
  handleMenuClick: (key: string, item: any) => void;
  positions: any[];
  reload: () => void;
};
const StationTree: React.FC<CreateGroupPropsType> = (props) => {
  const menu = ['编辑', '删除'];
  const { positions, setCurrent, handleMenuClick, currentKey, reload } = props;
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData([...positions]);
  }, [positions]);

  /**选中树的回调 */
  const onSelect = async (
    _: string[],
    info: { selected: boolean; node: { object: IStation } },
  ) => {
    // 触发内容去变化
    if (info.selected) {
      setCurrent(info.node.object);
    }
  };

  return (
    <div>
      <div className={cls.topMes}>
        <Button
          className={cls.creatgroup}
          icon={<PlusOutlined className={cls.addIcon} />}
          type="text"
          onClick={() => {
            setIsOpenModal(true);
          }}
        />
        <MarketClassifyTree
          searchable
          childIcon={<UserOutlined />}
          handleMenuClick={handleMenuClick}
          treeData={data}
          menu={menu}
          selectedKeys={[currentKey]}
          onSelect={onSelect}
          title={'岗位列表'}
        />
      </div>
      <CreateTeamModal
        handleCancel={() => setIsOpenModal(false)}
        open={isOpenModal}
        title={'新增|岗位'}
        current={userCtrl.company}
        typeNames={[TargetType.Station]}
        handleOk={async () => {
          setIsOpenModal(false);
          reload();
        }}
      />
    </div>
  );
};

export default StationTree;
