import CardOrTable from '@/components/CardOrTableComp';
import { IconFont } from '@/components/IconFont';
import { Card, message, Modal, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
// import { AppPublishColumns } from '../Config';
import { ExclamationCircleOutlined } from '@ant-design/icons';
interface indexType {}
const columns: any = [
  {
    title: '商品名称',
    ellipsis: true,
    dataIndex: ['merchandise', 'caption'],
  },
  { title: '购买权属', dataIndex: ['merchandise', 'sellAuth'] },
  {
    title: '使用期限',
    dataIndex: ['merchandise', 'days'],
    render: (_: any, record: { days: any }) => (record.days ? _ : '永久'),
  },
  {
    title: '价格',
    dataIndex: ['merchandise', 'price'],
    valueType: 'money',
    render: (_: any, record: { price: any }) => (record.price ? _ : '免费'),
  },
  {
    title: '市场名称',
    dataIndex: ['merchandise', 'market', 'name'],
    render: (_: any, record: any) => {
      return _ ? _ : record.merchandise.marketId;
    },
  },
  {
    title: '更新时间',
    dataIndex: ['merchandise', 'updateTime'],
    width: 180,
    valueType: 'dateTime',
  },
  {
    title: '商品状态',
    dataIndex: ['merchandise', 'status'],
    render: (_: any, record: { merchandise: any }) => {
      return record.merchandise ? (
        <Tag color="processing">在售</Tag>
      ) : (
        <Tag color="danger">已下架</Tag>
      );
    },
  },
];
const PublishComp: React.FC<indexType> = () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const history = useHistory();

  useEffect(() => {
    if (!appCtrl.curProduct) {
      history.push('/store/app');
      return;
    }
    getPublishData();
  }, []);
  const getPublishData = async (reload = false) => {
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
                getPublishData(true);
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
          stripe
          operation={renderOperation}
          columns={columns}
        />
      </Card>
    </>
  );
};

export default PublishComp;
