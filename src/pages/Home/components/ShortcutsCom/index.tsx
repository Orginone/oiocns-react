import './index.less';
import { AiOutlineSend } from 'react-icons/ai';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import CreateTeamModal from '@/bizcomponents/GlobalComps/createTeam';
import { schema } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import CardWidthTitle from '@/components/CardWidthTitle';
import { useHistory } from 'react-router-dom';
import SearchCompany from '@/bizcomponents/SearchCompany';
import { TargetType, companyTypes } from '@/ts/core';

interface ShortcutsComType {
  props: []; //入口列表
}
const btns = [
  { label: '加好友', icon: <AiOutlineSend /> },
  { label: '创单位', icon: <AiOutlineSend /> },
  { label: '邀成员', icon: <AiOutlineSend /> },
  { label: '建应用', icon: <AiOutlineSend /> },
  { label: '逛商场', icon: <AiOutlineSend /> },
  { label: '添数据', icon: <AiOutlineSend /> },
];

const BannerCom: React.FC<ShortcutsComType> = () => {
  const [showFormModal, setShowFormModal] = useState<boolean>(false); // 创建单位开关
  const [isModalOpen, setIsModalOpen] = useState(false); // 添加好友的开关
  const [friends, setFriends] = useState<schema.XTarget[]>([]); // 搜索出的好友列表

  const history = useHistory();

  /**
   * @description: 搜索回调
   * @param {schema} person
   * @return {*}
   */
  const searchCallback = (persons: schema.XTarget[]) => {
    setFriends(persons);
  };
  /**
   * @description: 按钮循环
   * @return {*}
   */
  const Btns = (
    <>
      {btns.map((item) => {
        return (
          <Button
            className="shortcuts-btn"
            key={item.label}
            size="large"
            icon={item.icon}
            onClick={() => {
              onShortClick(item?.label);
            }}>
            {item.label}
          </Button>
        );
      })}
    </>
  );

  /**
   * @description: 按钮点击事件
   * @param {string} item
   * @return {*}
   */
  const onShortClick = (item: string) => {
    switch (item) {
      case '加好友':
        setIsModalOpen(true);
        break;
      case '创单位':
        setShowFormModal(true);
        break;
      case '邀成员':
        break;
      case '逛商场':
        history.push('/market/shop');
        break;
      case '添数据':
        break;
      default:
        break;
    }
  };

  /**
   * @description: 取消
   * @return {*}
   */
  const onCancel = () => {
    setShowFormModal(false);
    setIsModalOpen(false);
  };

  /**
   * @description: 添加好友回调
   * @return {*}
   */
  const handleOk = async () => {
    setIsModalOpen(false);
    for (const friend of friends) {
      await orgCtrl.user.applyJoin([friend]);
    }
  };

  return (
    <CardWidthTitle className="shortcuts-wrap" title={'快捷入口'}>
      {Btns}
      {/* 加好友 */}
      <Modal
        title="添加好友"
        okButtonProps={{ disabled: !friends }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={onCancel}
        width={670}>
        <SearchCompany searchCallback={searchCallback} searchType={TargetType.Person} />
      </Modal>
      {/* 创建单位 */}
      <CreateTeamModal
        title={'创建单位'}
        isEdit={false}
        open={showFormModal}
        handleCancel={onCancel}
        handleOk={(item) => {
          if (item) {
            setShowFormModal(false);
          }
        }}
        current={orgCtrl.user}
        typeNames={companyTypes}
      />
    </CardWidthTitle>
  );
};

export default BannerCom;
