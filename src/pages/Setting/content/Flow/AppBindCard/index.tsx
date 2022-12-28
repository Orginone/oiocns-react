import React from 'react';
import { Card, Avatar, Space, Modal } from 'antd';
import AppLogo from '/img/appLogo.png';
import cls from './index.module.less';
import { XFlowRelation } from '@/ts/base/schema';

interface IProps {
  current: XFlowRelation;
  onClick: (item: XFlowRelation) => void;
}

const AppBindCard: React.FC<IProps> = ({ current, onClick }) => {
  return (
    <Card bordered={false} bodyStyle={{ padding: 0 }}>
      <Space className={cls.appwrap} size={20}>
        <Card
          style={{ width: 300 }}
          actions={[
            <a
              key="text"
              onClick={() => {
                Modal.confirm({
                  title: '提示',
                  okText: '确认',
                  cancelText: '取消',
                  content: '确定删除此绑定?',
                  onOk: () => {
                    onClick(current);
                  },
                });
              }}>
              解绑
            </a>,
          ]}>
          <Card.Meta
            avatar={<Avatar src={AppLogo} shape="square" />}
            title={current.product?.name || current.productId}
            description={current.functionCode}
          />
        </Card>
      </Space>
    </Card>
  );
};

export default AppBindCard;
