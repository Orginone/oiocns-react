/* eslint-disable no-unused-vars */
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Modal } from 'antd';
import React, { useState } from 'react';
import HeadImg from '@/components/headImg/headImg';
import QrCodeCustom from '@/components/qrCode';
import useChatStore from '@/store/chat';
import headerStyle from './index.module.less';

/* 
  头部展示
*/

interface Iprops {
  handleViewDetail: Function;
}

const Groupheader = (props: Iprops) => {
  const { handleViewDetail } = props;
  const ChatStore: any = useChatStore();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 邀请好友
  const handleAddFun = () => {
    setIsModalOpen(true);
  };
  const handleMoreFun = () => {
    handleViewDetail();
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={headerStyle.group_header_wrap}>
        <div className={`${headerStyle.user} ${headerStyle.flex}`}>
          <HeadImg name={ChatStore.curChat?.name} label={''} />
          <div>
            <div className={`${headerStyle.flex} ${headerStyle.user_info_top}`}>
              <div className={`${headerStyle.user_info_top_name}`}>
                {ChatStore.curChat?.name}
                {ChatStore?.curChat?.typeName === '群组' ? (
                  <span>({ChatStore?.curChat?.personNum})</span>
                ) : (
                  <Breadcrumb>
                    <Breadcrumb.Item>{ChatStore.curChat?.name}</Breadcrumb.Item>
                    <Breadcrumb.Item>{ChatStore.curChat?.label}</Breadcrumb.Item>
                  </Breadcrumb>
                )}
              </div>
            </div>
          </div>
        </div>
        <span className={headerStyle.btn_box}>
          {ChatStore.curChat?.typeName !== '人员' ? (
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
        <div className="QrDiv" key={ChatStore.curChat?.id}>
          <QrCodeCustom qrText={ChatStore.curChat?.name} />
        </div>
        <div>方式二：共享链接，邀请好友</div>
        <div className="share-link">展示链接...</div>
      </Modal>
    </>
  );
};
export default Groupheader;
