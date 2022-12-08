import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import MarketClassifyTree from '@/components/CustomTreeComp';
import cls from './index.module.less';
import { IIdentity } from '@/ts/core/target/authority/iidentity';
import AddPosttionModal from '../AddPositionMoadl';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
import positionCtrl from '@/ts/controller/position/positionCtrl';
import EditCustomModal from '../EditCustomModal';
type CreateGroupPropsType = {
  createTitle: string;
  currentKey: string;
  setCurrent: (current: IIdentity) => void;
  handleMenuClick: (key: string, item: any) => void;
  positions: any[];
};
type target = {
  title: string;
  key: string;
  object: any;
};
const CreatePosition: React.FC<CreateGroupPropsType> = (props) => {
  useEffect(() => {}, []);
  const { positions, setCurrent } = props;
  const [currentPostion, setCurrentPosition] = useState<any>();
  const [selectMenu, setSelectMenu] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [authTree, setAuthTree] = useState<IAuthority[]>();
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  /**转化成树控件接收的数据格式 */
  const changeData = (target: any[]): target[] => {
    const result: target[] = [];
    if (target != undefined) {
      for (const a of target) {
        result.push({
          title: a.name,
          key: a.code,
          object: a,
        });
      }
    } else {
      console.log('空值');
    }
    return result;
  };
  /**树的操作按钮 */
  const handleMenuClick = (key: string, data: target) => {
    if (key === '删除') {
      positionCtrl.deletePosttion(data.object);
    }
    if (key === '更改岗位名称') {
      setCurrentPosition(data.object);
      setIsOpenEditModal(true);
      // positionCtrl.updatePosttion(data.object);
    }
    console.log(data);
  };
  const close = () => {
    setIsOpenModal(false);
  };
  /**选中树的回调 */
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
      treeData={changeData(positions)}
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
          新增岗位
        </Button>
        {positionList}
      </div>
      <AddPosttionModal
        title={'新增岗位'}
        open={isOpenModal}
        onOk={close}
        handleOk={close}
        authTree={authTree}
      />
      <EditCustomModal
        handleCancel={() => {
          setIsOpenModal(false);
        }}
        open={isOpenEditModal}
        title={'编辑'}
        onOk={() => {
          setIsOpenEditModal(false);
        }}
        handleOk={() => {
          setIsOpenEditModal(false);
        }}
        defaultData={currentPostion}
      />
    </div>
  );
};

export default CreatePosition;
