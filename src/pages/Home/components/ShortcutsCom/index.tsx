import './index.less';
import { SendOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import CreateTeamModal from '@/bizcomponents/CreateTeam';
import { companyTypes } from '@/ts/core/enum';
import { schema } from '@/ts/base';
import userCtrl from '@/ts/controller/setting/userCtrl';
import SearchPerson from '@/bizcomponents/SearchPerson';
import CardWidthTitle from '@/components/CardWidthTitle';
import { useHistory } from 'react-router-dom';

interface ShortcutsComType {
  props: []; //入口列表
}
const btns = [
  { label: '加好友', icon: <SendOutlined /> },
  { label: '创单位', icon: <SendOutlined /> },
  { label: '邀成员', icon: <SendOutlined /> },
  { label: '建应用', icon: <SendOutlined /> },
  { label: '逛商场', icon: <SendOutlined /> },
  { label: '添数据', icon: <SendOutlined /> },
];

const BannerCom: React.FC<ShortcutsComType> = () => {
  const [showFormModal, setShowFormModal] = useState<boolean>(false); // 创建单位开关
  const [isModalOpen, setIsModalOpen] = useState(false); // 添加好友的开关
  const [friend, setFriend] = useState<schema.XTarget>(); // 搜索出的好友列表

  const history = useHistory();

  /**
   * @description: 搜索回调
   * @param {schema} person
   * @return {*}
   */
  const searchCallback = (person: schema.XTarget) => {
    setFriend(person);
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
              console.log('1111', item);
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
    console.log('123456', item);
    switch (item) {
      case '加好友':
        setIsModalOpen(true);
        break;
      case '创单位':
        setShowFormModal(true);
        break;
      case '建应用':
        history.push('/store/app/create');
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
    console.log(friend);
    await userCtrl.user.applyFriend(friend!);
  };

  return (
    <CardWidthTitle className="shortcuts-wrap" title={'快捷入口'}>
      {Btns}
      {/* 加好友 */}
      <Modal
        title="添加好友"
        okButtonProps={{ disabled: !friend }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={onCancel}
        width={500}>
        <div>{<SearchPerson searchCallback={searchCallback}></SearchPerson>}</div>
      </Modal>
      {/* 创建单位 */}
      <CreateTeamModal
        title={'新建'}
        open={showFormModal}
        handleCancel={onCancel}
        handleOk={(item) => {
          if (item) {
            userCtrl.setCurSpace(item.id);
            setShowFormModal(false);
          }
        }}
        current={userCtrl.user}
        typeNames={companyTypes}
      />
    </CardWidthTitle>
  );
};

export default BannerCom;
