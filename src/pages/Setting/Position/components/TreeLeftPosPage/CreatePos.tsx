import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import MarketClassifyTree from '@/components/CustomTreeComp';
import cls from './index.module.less';
import AddPosttionModal from '../AddPositionMoadl';
import positionCtrl from '@/ts/controller/position/positionCtrl';
import EditCustomModal from '../EditCustomModal';
import { XIdentity } from '@/ts/base/schema';
type CreateGroupPropsType = {
  createTitle: string;
  currentKey: string;
  setCurrent: (current: PositionType) => void;
  handleMenuClick: (key: string, item: any) => void;
  positions: any[];
};
type target = {
  title: string;
  key: string;
  object: any;
};

export type PositionType = {
  name: string;
  code: string;
  indentitys: XIdentity[];
};
const CreatePosition: React.FC<CreateGroupPropsType> = (props) => {
  useEffect(() => {}, []);
  const { positions, setCurrent } = props;
  const [currentPostion, setCurrentPosition] = useState<PositionType>();
  const [selectMenu, setSelectMenu] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
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
    }
  };
  const close = () => {
    setIsOpenModal(false);
  };
  /**选中树的回调 */
  const onSelect = async (
    selectKeys: string[],
    info: { selected: boolean; node: { object: PositionType } },
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
