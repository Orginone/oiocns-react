import CardOrTable from '@/components/CardOrTableComp';
import { IconFont } from '@/components/IconFont';
import { Card, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppPublishColumns } from '../Config';
import appCtrl from '@/ts/controller/store/appCtrl';
import { ExclamationCircleOutlined } from '@ant-design/icons';
interface indexType {}
const PublishComp: React.FC<indexType> = () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const history = useHistory();

  useEffect(() => {
    if (!appCtrl.curProduct) {
      history.push('/store/app');
      return;
    }
    getData();
  }, []);
  const getData = async (reload = false) => {
    let res = await appCtrl.curProduct?.getMerchandises(reload);
    setDataSource([...(res || [])]);
  };
  const renderOperation = (item: any): any => {
    return [
      {
        key: 'open',
        label: '下架',
        onClick: () => {
          Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: `确认下架商品 ${item?.merchandise?.caption} ?`,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
              const success = await appCtrl.curProduct!.unPublish(item.merchandise.id);
              if (success) {
                message.success('商品下架成功');
                getData(true);
              } else {
                message.warn('商品下架失败,请稍后重试');
              }
            },
          });
        },
      },
    ];
  };
  return (
    <>
      <Card
        className="PublishWrap"
        bordered={false}
        title={
          <div className="flex">
            <IconFont
              style={{ marginRight: '10px' }}
              type="icon-jiantou-left"
              onClick={() => {
                history.goBack();
              }}
            />
            应用上架信息
          </div>
        }>
        <CardOrTable
          dataSource={dataSource}
          rowKey={(record, index) => (record && record?.merchandise?.id) || index}
          total={10}
          stripe
          operation={renderOperation}
          columns={AppPublishColumns}
        />
      </Card>
    </>
  );
};

export default PublishComp;
