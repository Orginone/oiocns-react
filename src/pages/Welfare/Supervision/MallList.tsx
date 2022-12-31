import CardOrTableComp from '@/components/CardOrTableComp';
import { Button, Card, Modal, Space } from 'antd';
import React, { useState } from 'react';
import { supervisionCreateMallColumns } from '../config/columns';
import { kernel } from '@/ts/base';
import MallView from './MallView';
import MallCreate from './MallCreate';
import { generateUuid } from '@/ts/base/common';

export type MallModel = {
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
 * 平台：公益商城列表
 */
const MallList: React.FC = () => {
  const [mall, setMall] = useState<MallModel>();
  const [newMall, setNewMall] = useState<MallModel>();
  const [selectedRows, setSelectedRows] = useState<any[]>();

  /**
   * 创建商城
   */
  const create = () => {
    setIsCreateModalOpen(true);
  };

  /**
   * 加入商城
   */
  const join = (item: MallModel) => {
    // TODO
  };

  /**
   * 进入商城
   */
  const enter = (item: MallModel) => {
    // TODO
  };

  /**
   * 上架商品
   */
  const upper = (item: MallModel) => {
    // TODO
  };

  const tableOperation = (item: MallModel) => {
    return [
      {
        key: 'view',
        label: '查看商城',
        onClick: () => {
          setIsViewModalOpen(true);
          setMall(item);
        },
      },
      {
        key: 'join',
        label: '加入商城',
        onClick: () => {
          join(item);
        },
      },
      {
        key: 'enter',
        label: '进入商城',
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
    const body = { ...newMall, ...{ id: generateUuid(), dataStatus: 1 } };
    kernel.anystore.insert('we_welfaremall', body, 'company').then((res) => {
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
              <b>公益商城列表</b>
            </div>
            <div>
              <Button type="primary" onClick={create}>
                创建商城
              </Button>
            </div>
          </div>
        }>
        <CardOrTableComp
          rowKey={'id'}
          bordered={false}
          columns={supervisionCreateMallColumns}
          pagination={{
            defaultCurrent: 0,
            defaultPageSize: 10,
          }}
          dataSource={[]}
          request={async (params: any) => {
            const res = await kernel.anystore.aggregate(
              'we_welfaremall',
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
            onChange: (selectedRowKeys: React.Key[], selectedRows: MallModel[]) => {
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
        title="公益商城信息"
        open={isViewModalOpen}
        width={900}
        onOk={handleViewOk}
        onCancel={() => setIsViewModalOpen(false)}
        okText="下载"
        cancelText="关闭">
        <MallView mall={mall as MallModel} />
      </Modal>

      <Modal
        title="创建商城"
        open={isCreateModalOpen}
        width={900}
        onOk={handleCreateOk}
        onCancel={() => setIsCreateModalOpen(false)}
        okText="保存"
        cancelText="关闭">
        <MallCreate updateNewMall={setNewMall} />
      </Modal>
    </div>
  );
};

export default MallList;
