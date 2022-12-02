import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import HeadImg from '@/components/headImg/headImg';
import QrCodeCustom from '@/components/qrCode';
import headerStyle from './index.module.less';
import chatCtrl from '@/ts/controller/chat';
import { deepClone } from '@/ts/base/common';

/**
 * @description: 头部展示
 * @return {*}
 */

interface Iprops {
  handleViewDetail: Function;
}

const Groupheader = (props: Iprops) => {
  const { handleViewDetail } = props;
  const [chat, setChat] = useState(chatCtrl.chat);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 邀请好友

  const refreshUI = () => {
    setChat(deepClone(chatCtrl.chat));
  };

  useEffect(() => {
    const id = chatCtrl.subscribe(refreshUI);
    return () => {
      chatCtrl.unsubscribe(id);
    };
  }, []);

  /**
   * @description: 打开邀请好友弹窗
   * @return {*}
   */
  const handleAddFun = () => {
    setIsModalOpen(true);
  };

  /**
   * @description: 展开更多
   * @return {*}
   */
  const handleMoreFun = () => {
    handleViewDetail();
  };

  /**
   * @description: 确认按钮回调
   * @return {*}
   */
  const handleOk = () => {
    setIsModalOpen(false);
  };

  /**
   * @description: 取消按钮回调
   * @return {*}
   */
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={headerStyle.group_header_wrap}>
        <div className={`${headerStyle.user} ${headerStyle.flex}`}>
          <HeadImg name={chat?.target.name} label={''} />
          <div>
            <div className={`${headerStyle.flex} ${headerStyle.user_info_top}`}>
              <div className={`${headerStyle.user_info_top_name}`}>
                {chat?.target.name}
                {chat?.target.typeName !== '人员' ? (
                  <span>({chat?.personCount ?? 0 > 0})</span>
                ) : (
                  ''
                )}
                <Breadcrumb>
                  <Breadcrumb.Item>{chat?.spaceName}</Breadcrumb.Item>
                  <Breadcrumb.Item>{chat?.target.label}</Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
          </div>
        </div>
        <span className={headerStyle.btn_box}>
          {chat?.target.typeName !== '人员' ? (
            <PlusOutlined
              style={{ fontSize: '20px', marginRight: '8px' }}
              onClick={handleAddFun}
            />
          ) : (
            ''
          )}
          <EllipsisOutlined style={{ fontSize: '20px' }} onClick={handleMoreFun} />
        </span>
      </div>
      <Modal
        title="邀请好友"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        getContainer={false}>
        <div>方式一：共享二维码，邀请好友</div>
        <div className="QrDiv" key={chat?.target.id}>
          <QrCodeCustom qrText={chat?.target.name} />
        </div>
        <div>方式二：共享链接，邀请好友</div>
        <div className="share-link">展示链接...</div>
      </Modal>
    </>
  );
};
export default Groupheader;
