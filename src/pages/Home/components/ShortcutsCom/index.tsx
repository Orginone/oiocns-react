import './index.less';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import CreateTeamModal from '@/bizcomponents/GlobalComps/createTeam';
import { schema } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import CardWidthTitle from '@/components/CardWidthTitle';
import { useHistory } from 'react-router-dom';
import SearchCompany from '@/bizcomponents/SearchCompany';
import { TargetType, companyTypes } from '@/ts/core';
import * as ai from 'react-icons/ai';
import * as im from 'react-icons/im';

interface ShortcutsComType {
  props: []; //入口列表
}
const btns = [
  { label: '定标准', icon: <ai.AiOutlineSetting style={{ marginRight: 10 }} /> },
  { label: '加好友', icon: <ai.AiOutlineUserAdd style={{ marginRight: 10 }} /> },
  { label: '建群组', icon: <ai.AiOutlineTeam style={{ marginRight: 10 }} /> },
  { label: '加群组', icon: <ai.AiOutlineUsergroupAdd style={{ marginRight: 10 }} /> },
  { label: '建单位', icon: <im.ImOffice style={{ marginRight: 10 }} /> },
  { label: '加单位', icon: <im.ImTree style={{ marginRight: 10 }} /> },
];

const BannerCom: React.FC<ShortcutsComType> = () => {
  const history = useHistory();
  const [showFormModal, setShowFormModal] = useState<boolean>(false); // 创建单位开关
  const [isModalOpen, setIsModalOpen] = useState(false); // 添加好友的开关
  const [modalTitle, setModalTitle] = useState<string>(''); // 创建单位开关
  const [selectTargetType, setSelectTargetType] = useState<TargetType>(); // 选中的用户类型
  const [selectTarget, setSelectTarget] = useState<schema.XTarget[]>([]); // 选中的用户
  const [createTargetType, setCreateTargetType] = useState<TargetType[]>([]); // 选中的用户类型

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
              switch (item.label) {
                case '加好友':
                  setModalTitle('添加好友');
                  setSelectTargetType(TargetType.Person);
                  setIsModalOpen(true);
                  break;
                case '定标准':
                  orgCtrl.currentKey = '';
                  orgCtrl.changCallback();
                  history.push('/setting');
                  break;
                case '建群组':
                  setModalTitle('创建群组');
                  setCreateTargetType([TargetType.Cohort]);
                  setShowFormModal(true);
                  break;
                case '加群组':
                  setModalTitle('添加群组');
                  setSelectTargetType(TargetType.Cohort);
                  setIsModalOpen(true);
                  break;
                case '建单位':
                  setModalTitle('创建单位');
                  setCreateTargetType(companyTypes);
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
            }}>
            {item.label}
          </Button>
        );
      })}
    </>
  );

  return (
    <CardWidthTitle className="shortcuts-wrap" title={'常用'}>
      <div className="groupbuttons">{Btns}</div>
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
      {/* 创建用户 */}
      <CreateTeamModal
        title={modalTitle}
        isEdit={false}
        open={showFormModal}
        current={orgCtrl.user}
        typeNames={createTargetType}
        handleCancel={() => {
          setShowFormModal(false);
        }}
        handleOk={(item) => {
          if (item) {
            setShowFormModal(false);
          }
        }}
      />
    </CardWidthTitle>
  );
};

export default BannerCom;
