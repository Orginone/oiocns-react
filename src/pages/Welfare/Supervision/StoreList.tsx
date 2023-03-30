import CardOrTableComp from '@/components/CardOrTableComp';
import { Button, Card, Modal, Space } from 'antd';
import React, { useState } from 'react';
import { supervisionCreateStoreColumns } from '../config/columns';
import { kernel } from '@/ts/base';
import StoreView from './StoreView';
import StoreCreate from './StoreCreate';
import { generateUuid } from '@/ts/base/common';

export type StoreModel = {
  id: string;
  name: string;
  mainBusiness: string;
  minorBusiness: string;
  welfareOrg: string;
  storageAgency: string;
  contactPerson: string;
  phone: string;
  registerTime: string;
  remark: string;
  dataStatus: number;
};

/**
 * 平台：公益组织商店列表
 */
const StoreList: React.FC = () => {
  const [store, setStore] = useState<StoreModel>();
  const [newStore, setNewStore] = useState<StoreModel>();
  const [selectedRows, setSelectedRows] = useState<any[]>();

  /**
   * 创建商店
   */
  const create = () => {
    setIsCreateModalOpen(true);
  };

  /**
   * 加入商店
   */
  const join = (item: StoreModel) => {
    // TODO
  };

  /**
   * 进入商店
   */
  const enter = (item: StoreModel) => {
    // TODO
  };

  /**
   * 去上架商品
   */
  const upper = (item: StoreModel) => {
    // TODO
  };

  const tableOperation = (item: StoreModel) => {
    return [
      {
        key: 'view',
        label: '查看商店',
        onClick: () => {
          setIsViewModalOpen(true);
          setStore(item);
        },
      },
      {
        key: 'join',
        label: '加入商店',
        onClick: () => {
          join(item);
        },
      },
      {
        key: 'enter',
        label: '进入商店',
        onClick: () => {
          enter(item);
        },
      },
    ];
  };
  // 查看
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleViewOk = () => {
    setIsViewModalOpen(false);
  };
  // 创建
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateOk = () => {
    const body = { ...newStore, ...{ id: generateUuid(), dataStatus: 1 } };
    kernel.anystore.insert('we_welfarestore', body, 'company').then((res) => {
      console.log(res);
      setIsCreateModalOpen(false);
    });
  };

  return (
    <div>
      <Card
        bordered={false}
        title={
          <div
            style={{
              fontSize: '16px',
              justifyContent: 'space-between',
              display: 'flex',
            }}>
            <div>
              <b>公益商店列表</b>
            </div>
            <div>
              <Button type="primary" onClick={create}>
                创建商店
              </Button>
            </div>
          </div>
        }>
        <CardOrTableComp
          rowKey={'id'}
          bordered={false}
          columns={supervisionCreateStoreColumns}
          pagination={{
            defaultCurrent: 0,
            defaultPageSize: 10,
          }}
          dataSource={[]}
          request={async (params: any) => {
            const res = await kernel.anystore.aggregate(
              'we_welfarestore',
              { match: {}, skip: params.offset, limit: params.limit },
              'company',
            );
            return {
              total: 0,
              success: true,
              result: res.data,
              offset: params.offset,
              limit: params.limit,
            };
          }}
          operation={(item) => tableOperation(item)}
          rowSelection={{
            onChange: (selectedRowKeys: React.Key[], selectedRows: StoreModel[]) => {
              console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                'selectedRows: ',
                selectedRows,
              );
              setSelectedRows(selectedRows);
            },
          }}
          tableAlertOptionRender={() => {
            return (
              <Space size={16}>
                <a>暂存勾选</a>
              </Space>
            );
          }}
        />
      </Card>
      <Modal
        title="公益商店信息"
        open={isViewModalOpen}
        width={900}
        onOk={handleViewOk}
        onCancel={() => setIsViewModalOpen(false)}
        okText="下载"
        cancelText="关闭">
        <StoreView store={store as StoreModel} />
      </Modal>

      <Modal
        title="创建商店"
        open={isCreateModalOpen}
        width={900}
        onOk={handleCreateOk}
        onCancel={() => setIsCreateModalOpen(false)}
        okText="保存"
        cancelText="关闭">
        <StoreCreate updateNewStore={setNewStore} />
      </Modal>
    </div>
  );
};

export default StoreList;
