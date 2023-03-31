import React from 'react';
import { Card, Avatar, Modal } from 'antd';
import AppLogo from '/img/appLogo.png';
import { XFlowRelation } from '@/ts/base/schema';
import appCtrl from '@/ts/controller/store/appCtrl';

interface IProps {
  current: XFlowRelation;
  onClick: (item: XFlowRelation) => void;
}

const AppBindCard: React.FC<IProps> = ({ current, onClick }) => {
  return (
    <Card
      style={{ width: 300 }}
      actions={[
        <a
          key="label"
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
        title={
          current.product?.name ||
          appCtrl.products.find((a) => a.id == current.productId)?.prod.name ||
          current.productId
        }
        description={
          <>
            <div>{'业务名称:' + current.functionCode}</div>
            <div>{current.createTime}</div>
          </>
        }
      />
    </Card>
  );
};

export default AppBindCard;
