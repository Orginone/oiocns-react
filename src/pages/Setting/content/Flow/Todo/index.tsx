import React, { useState, useEffect } from 'react';
import marketCtrl from '@/ts/controller/store/marketCtrl';
import AppCard from '@/pages/Store/Market/components/AppCardShopCar';
import { MarketTypes } from 'typings/marketType';
import {
  Input,
  Button,
  Col,
  Drawer,
  Layout,
  message,
  Modal,
  List,
  Row,
  Space,
  Tabs,
  Steps,
  Card,
} from 'antd';
import {
  CheckCircleOutlined,
  ClearOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { CheckCard } from '@ant-design/pro-components';
import cls from './index.module.less';
import { XMerchandise } from '@/ts/base/schema';
import { JOIN_SHOPING_CAR } from '@/constants/const';
import VirtualList from 'rc-virtual-list';

const { TextArea } = Input;
interface Iprops {
  open: boolean;
  onClose: Function;
}
/**
 * @description: 流程审核
 * @return {*}
 */

const FlowTodo: React.FC<Iprops> = (props: Iprops) => {
  const [selectedRowKey, setSelectedRowKey] = useState<any>([]); // 被选中的项
  const [shopList, setShopList] = useState<any>([]); // 流程审核列表
  // const [open, setOpen] = useState<boolean>(props.open);
  const [usedComments, setUsedComments] = useState<string[]>([
    '这是一个很长很长很长很长超级无敌长的用于测试长字符串的文本，右侧是删除，复制添加常用等功能...',
    '同意。',
    '拒绝。',
    '缺少材料。',
    '亟待解决处理...',
    '驳回',
  ]);
  let formdata = {
    comment: '',
  };
  /**
   * @description: 订阅流程审核数据变化
   * @return {*}
   */
  useEffect(() => {
    const id = marketCtrl.subscribePart(JOIN_SHOPING_CAR, () => {
      console.log('监听 流程审核变化', marketCtrl.shopinglist || []);
      const arr = marketCtrl.shopinglist || [];
      setShopList([...arr]);
    });

    return () => {
      return marketCtrl.unsubscribe(id);
    };
  }, []);

  /**
   * @description: 从流程审核中删除商品
   * @return {*}
   */
  const OnDeleApply = async (ids?: string[]) => {
    if (!ids && selectedRowKey.length === 0) {
      message.warning('没有需要删除的商品');
      return;
    }
    await marketCtrl.deleteStaging(ids ? ids : selectedRowKey);
    setSelectedRowKey([]);
  };

  /**
   * @description: 确认下单弹窗
   * @return {*}
   */
  const OnCustomBuy = () => {
    if (selectedRowKey.length === 0) {
      message.warning('请选择商品');
      return;
    }
    Modal.confirm({
      title: '确认订单',
      content: '此操作将生成交易订单。是否确认',
      icon: <CheckCircleOutlined className={cls['buy-icon']} />,
      onOk: async () => await marketCtrl.createOrder(selectedRowKey),
    });
  };

  /**
   * @description: 卡片内容渲染函数
   * @param {MarketTypes} dataArr
   * @return {*}
   */
  const renderCardFun = (dataArr: MarketTypes.ProductType[]) => {
    if (dataArr) {
      return dataArr.map((item: MarketTypes.ProductType) => {
        return (
          <AppCard
            className={cls.card}
            data={item}
            key={item.id}
            defaultKey={{
              name: 'caption',
              size: 'price',
              type: 'sellAuth',
              desc: 'remark',
              creatTime: 'createTime',
            }}
            // operation={renderOperation}
          />
        );
      });
    }
    return <></>;
  };

  const changeTab = () => {};
  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === 120) {
      // appendData();
    }
  };

  return (
    <Drawer
      title={'审批'}
      closable={true}
      bodyStyle={{ padding: 0 }}
      width={320}
      onClose={() => props.onClose()}
      open={props.open}>
      <Layout style={{ height: '100%' }} className={cls.drawerContainer}>
        <Tabs
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: '#FFF',
          }}
          defaultActiveKey="1"
          onChange={changeTab}
          items={[
            {
              label: `我的意见`,
              key: 'flowtodo-1',
              children: (
                <>
                  <TextArea
                    showCount
                    allowClear
                    maxLength={100}
                    placeholder="请输入意见"
                    style={{
                      height: '100%',
                      marginBottom: 20,
                      resize: 'none',
                    }}
                    autoSize={{ minRows: 4, maxRows: 4 }}
                    onChange={(event) => {
                      formdata.comment = event.target.value;
                      console.log('formdata', formdata);
                    }}
                  />
                  <Button
                    type="link"
                    style={{
                      fontSize: '14px',
                      position: 'absolute',
                      top: '94px',
                      border: 'none',
                    }}
                    onClick={() => {
                      if (formdata.comment) {
                        Modal.confirm({
                          content: '确定将“' + formdata.comment + '”设为常用意见吗?',
                          onOk: async () => {
                            setUsedComments([...usedComments, formdata.comment]);
                            message.success('设置常用意见成功！');
                          },
                        });
                      } else {
                        message.info('请先输入处理意见');
                      }
                    }}>
                    设为常用
                  </Button>
                </>
              ),
            },
            {
              label: `常用意见`,
              key: 'flowtodo-2',
              children: (
                <List size="small">
                  <VirtualList
                    data={usedComments}
                    height={120}
                    itemHeight={47}
                    itemKey="email"
                    onScroll={onScroll}>
                    {(item: string) => (
                      <List.Item>
                        <List.Item.Meta title={item} />
                        <DeleteOutlined
                          onClick={() => {
                            var usedCommentsSet = new Set(usedComments);
                            usedCommentsSet.delete(item);
                            setUsedComments(Array.from(usedCommentsSet));
                          }}
                        />
                      </List.Item>
                    )}
                  </VirtualList>
                </List>
              ),
            },
          ]}
        />

        {/* <PageHeader
          className={cls.header}
          subTitle="流程审核"
          extra={
            <Button
              type="text"
              className={cls.clearShop}
              onClick={() => {
                OnDeleApply(shopList.map((n: XMerchandise) => n.id));
              }}
              icon={<ClearOutlined />}>
              清除流程审核
            </Button>
          }
        /> */}
        <CheckCard.Group
          multiple
          className={cls['shoping-car']}
          onChange={(value) => {
            setSelectedRowKey(value);
          }}
          value={selectedRowKey}>
          流程跟踪
          <Steps
            direction="vertical"
            size="small"
            current={1}
            items={[
              {
                title: 'Finished',
                description: 'This is a description.',
                subTitle: 'subTitle',
                icon: <UserOutlined />,
              },
              {
                title: 'In Progress',
                description: 'This is a description.',
                icon: <UserOutlined />,
              },
              {
                title: 'Waiting',
                description: 'This is a description.',
                icon: <UserOutlined />,
              },
            ]}
          />
        </CheckCard.Group>
        <Row className={cls.footer} justify="space-between">
          <Col span={12}>
            <Button danger size="small" onClick={() => {}}>
              终止流程
            </Button>
          </Col>
          <Col span={12}>
            <Space>
              <Button
                type="text"
                style={{ border: 'solid 1px' }}
                size="small"
                onClick={() => {}}>
                暂存
              </Button>
              <Button type="primary" size="small" ghost onClick={() => {}}>
                驳回
              </Button>
              <Button type="primary" size="small" onClick={() => {}}>
                同意
              </Button>
            </Space>
          </Col>
        </Row>
      </Layout>
    </Drawer>
  );
};

export default FlowTodo;
