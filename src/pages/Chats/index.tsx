import React, { useState, useEffect } from 'react';
import Content from './content';
import * as config from './config/menuOperate';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { Input, Modal, Dropdown, MenuProps } from 'antd';
import { ImSearch } from 'react-icons/im';
import { IMsgChat, msgChatNotify, TargetType } from '@/ts/core';
import { schema } from '@/ts/base';
import SearchCompany from '@/components/Common/SearchTarget';
import TargetForm from '@/executor/config/entityForm/targetForm';
import orgCtrl from '@/ts/controller';
import * as ai from 'react-icons/ai';
import * as im from 'react-icons/im';

const Setting: React.FC<any> = () => {
  const [filter, setFilter] = useState('');
  const [openDetail, setOpenDetail] = useState<boolean>(true);
  const [isSupervise, setIsSupervise] = useState<boolean>(false); // 查看所有会话
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(config.loadChatMenu);

  const [showFormModal, setShowFormModal] = useState<boolean>(false); // 创建开关
  const [isModalOpen, setIsModalOpen] = useState(false); // 添加的开关
  const [modalTitle, setModalTitle] = useState<string>(''); // 创建的标题
  const [selectTargetType, setSelectTargetType] = useState<TargetType>(); // 选中的用户类型
  const [selectTarget, setSelectTarget] = useState<schema.XTarget[]>([]); // 选中的用户
  const [createTargetType, setCreateTargetType] = useState<string>(''); // 选中的用户类型
  /**
   * @description: 是否展示超级管理权处理
   * @return {*}
   */
  const items: MenuProps['items'] = [
    {
      label: '加好友',
      key: '加好友',
      icon: <ai.AiOutlineUserAdd style={{ marginRight: 10 }} />,
    },
    {
      label: '建群组',
      key: '建群组',
      icon: <ai.AiOutlineTeam style={{ marginRight: 10 }} />,
    },
    {
      label: '加群组',
      key: '加群组',
      icon: <ai.AiOutlineUsergroupAdd style={{ marginRight: 10 }} />,
    },
    {
      label: '建单位',
      key: '建单位',
      icon: <im.ImOffice style={{ marginRight: 10 }} />,
    },
    {
      label: '加单位',
      key: '加单位',
      icon: <im.ImTree style={{ marginRight: 10 }} />,
    },
  ];
  useEffect(() => {
    if (selectMenu?.company === undefined && isSupervise) {
      setIsSupervise(false);
    }
  }, [selectMenu?.company]);

  const reloadFinish = () => {
    setShowFormModal(false);
    orgCtrl.changCallback();
  };

  if (!selectMenu || !rootMenu) return <></>;
  const handleItemClick: MenuProps['onClick'] = (item) => {
    switch (item.key) {
      case '加好友':
        setModalTitle('添加好友');
        setSelectTargetType(TargetType.Person);
        setIsModalOpen(true);
        break;
      case '建群组':
        setModalTitle('创建群组');
        setCreateTargetType('newCohort');
        setShowFormModal(true);
        break;
      case '加群组':
        setModalTitle('添加群组');
        setSelectTargetType(TargetType.Cohort);
        setIsModalOpen(true);
        break;
      case '建单位':
        setModalTitle('创建单位');
        setCreateTargetType('newCompany');
        setShowFormModal(true);
        break;
      case '加单位':
        setModalTitle('添加单位');
        setSelectTargetType(TargetType.Company);
        setIsModalOpen(true);
        break;
      default:
        break;
    }
  };
  const menuProps = {
    items,
    onClick: handleItemClick,
  };
  return (
    <MainLayout
      menusHeight={'calc(100vh - 168px)'}
      selectMenu={selectMenu}
      onSelect={async (data) => {
        setSelectMenu(data);
      }}
      rightBar={
        <>
          <Input
            style={{ height: 30, fontSize: 15 }}
            placeholder="搜索"
            allowClear
            prefix={<ImSearch />}
            onChange={(e) => {
              setFilter(e.target.value);
            }}></Input>
          <Dropdown menu={menuProps} trigger={['click']}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ai.AiOutlinePlus style={{ marginRight: 10, fontSize: '24px' }} />
            </div>
          </Dropdown>
        </>
      }
      onMenuClick={async (data, key) => {
        const chat = data.item as IMsgChat;
        switch (key) {
          case '查看会话':
            setIsSupervise(!isSupervise);
            break;
          case '清空消息':
            await chat.clearMessage();
            break;
          case '会话详情':
            setOpenDetail(!openDetail);
            break;
          case '标记为未读':
            setSelectMenu(rootMenu);
            chat.chatdata.noReadCount += 1;
            chat.cache();
            msgChatNotify.changCallback();
            break;
        }
      }}
      siderMenuData={rootMenu}>
      <Content
        key={key}
        belong={selectMenu.company!}
        selectMenu={selectMenu}
        openDetail={openDetail}
        filter={filter}
      />
      {/* 添加用户 */}
      {selectTargetType && (
        <Modal
          destroyOnClose
          title={modalTitle}
          okButtonProps={{ disabled: !selectTarget }}
          open={isModalOpen}
          onOk={async () => {
            if (await orgCtrl.user.applyJoin(selectTarget)) {
              setIsModalOpen(false);
            }
          }}
          onCancel={() => {
            setIsModalOpen(false);
          }}
          width={670}>
          <SearchCompany
            searchCallback={(persons: schema.XTarget[]) => {
              setSelectTarget(persons);
            }}
            searchType={selectTargetType}
          />
        </Modal>
      )}
      {/* 创建单位或群组 */}
      {showFormModal && (
        <TargetForm
          formType={createTargetType}
          target={orgCtrl.user}
          finished={reloadFinish}
        />
      )}
    </MainLayout>
  );
};

export default Setting;
