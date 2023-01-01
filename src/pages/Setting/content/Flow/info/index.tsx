import { Card, Button, Modal, message, Typography, Space } from 'antd';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import cls from './index.module.less';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import userCtrl from '@/ts/controller/setting';
import CardOrTable from '@/components/CardOrTableComp';
import { XFlowDefine, XFlowRelation } from '@/ts/base/schema';
import FlowCard from './FlowCard';
import useWindowSize from '@/utils/windowsize';
import BindModal from './bind/modal';
import { FlowColumn } from '../../../config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import AppBindCard from './bind/card';

interface IProps {
  onDesign: () => void;
  onCurrentChaned: (item?: XFlowDefine) => void;
}

/**
 * 流程设置
 * @returns
 */
const FlowList: React.FC<IProps> = (props) => {
  const parentRef = useRef<any>(null);
  const [key, forceUpdate] = useObjectUpdate('');
  const [freshBinds, setFreshBinds] = useState<boolean>(false);
  const [current, setCurrent] = useState<XFlowDefine>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [binds, setBinds] = useState<XFlowRelation[]>([]);

  useEffect(() => {
    loadBangdingCard;
  });

  const renderOperation = (record: XFlowDefine): any[] => {
    return [
      {
        key: 'editor',
        label: '编辑',
        onClick: () => {
          setCurrent(record);
          Modal.confirm({
            title: '与该流程相关的未完成待办将会重置，是否确定编辑?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            okType: 'danger',
            onOk: () => {
              props.onCurrentChaned(record);
              props.onDesign();
            },
          });
        },
      },
      {
        key: 'delete',
        label: '删除',
        style: { color: 'red' },
        onClick: async () => {
          if (await userCtrl.space.deleteDefine(record.id)) {
            message.success('删除成功');
            forceUpdate();
          }
        },
      },
    ];
  };

  const loadBangdingCard = useMemo(async () => {
    let data = await userCtrl.space.queryFlowRelation(false);
    setBinds(data.filter((a) => a.defineId == current?.id));
    setFreshBinds(false);
  }, [current, freshBinds == true]);

  return (
    <div className={cls['company-top-content']}>
      <div style={{ background: '#EFF4F8' }}>
        <Card
          key={key}
          bordered={false}
          style={{ paddingBottom: '10px' }}
          bodyStyle={{ paddingTop: 0 }}>
          <div className={cls['app-wrap']} ref={parentRef}>
            <CardOrTable<XFlowDefine>
              columns={FlowColumn}
              parentRef={parentRef}
              dataSource={[]}
              operation={renderOperation}
              height={0.38 * useWindowSize().height}
              rowKey={(record: XFlowDefine) => record.id}
              headerTitle={<Typography.Title level={5}>流程设置</Typography.Title>}
              request={async (page) => {
                let data = await userCtrl.space.getDefines(false);
                return {
                  limit: page.limit,
                  total: data.length,
                  offset: page.offset,
                  result: data.splice(page.offset, page.limit),
                };
              }}
              onRow={(record: any) => {
                return {
                  onClick: () => {
                    setCurrent(record);
                  },
                };
              }}
              renderCardContent={(items) => {
                return items.map((item) => (
                  <FlowCard
                    className="card"
                    data={item}
                    key={item.id}
                    operation={renderOperation}
                  />
                ));
              }}
              toolBarRender={() => [
                <Button
                  key="button"
                  type="link"
                  onClick={() => {
                    props.onCurrentChaned(undefined);
                    props.onDesign();
                  }}>
                  新建流程
                </Button>,
              ]}
            />
          </div>
        </Card>
        {current && (
          <Card
            style={{ marginTop: '10px' }}
            bordered={false}
            extra={
              <Button
                key="button"
                type="link"
                onClick={() => {
                  setIsOpenModal(true);
                }}>
                新建业务绑定
              </Button>
            }
            title={<Typography.Title level={5}>{current.name}</Typography.Title>}>
            <Card bordered={false} bodyStyle={{ padding: 0 }}>
              <Space className={cls.appwrap} size={20}>
                {binds.length > 0 ? (
                  binds.map((a) => {
                    return (
                      <AppBindCard
                        key={a.id}
                        current={a}
                        onClick={async (item) => {
                          if (
                            await userCtrl.space.unbindingFlowRelation({
                              defineId: item.defineId,
                              productId: item.productId,
                              functionCode: item.functionCode,
                              spaceId: userCtrl.space.id,
                            })
                          ) {
                            setFreshBinds(true);
                          }
                        }}
                      />
                    );
                  })
                ) : (
                  <></>
                )}
              </Space>
            </Card>
          </Card>
        )}
      </div>{' '}
      {current && (
        <BindModal
          isOpen={isOpenModal}
          current={current}
          onOk={async (relations) => {
            let successCount = 0;
            for (const relation of relations) {
              if (
                await userCtrl.space.bindingFlowRelation({
                  defineId: current.id,
                  productId: relation.productId,
                  functionCode: relation.functionCode,
                  spaceId: userCtrl.space.id,
                })
              ) {
                successCount += 1;
              }
            }
            if (successCount > 0) {
              message.success('绑定' + successCount + '项业务成功');
              setFreshBinds(true);
            }
            setIsOpenModal(false);
          }}
          onCancel={() => {
            setIsOpenModal(false);
          }}
        />
      )}
    </div>
  );
};

export default FlowList;
