import CardOrTableComp from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import { Modal, Space } from 'antd';
import React, { useState } from 'react';
import { supervisionStorageAgencyColumns } from '../config/columns';
import StorageAgencyView from './StorageAgencyView';
import { kernel } from '@/ts/base';

export type StorageAgencyModel = {
  id: string;
  name: string;
  code: string;
  provincialCity: string;
  area: string;
  storeType: string;
  registerTime: Date;
  establishTime: Date;
  contactPerson: string;
  phone: string;
  address: string;
  dataStatus: number;
};

/**
 * 平台：加入集团的仓储机构列表
 */
const StorageAgencyList: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('1');
  const [storageAgency, setStorageAgency] = useState<StorageAgencyModel>();
  const [selectedRows, setSelectedRows] = useState<any[]>();

  const statusList = [
    { tab: '全部', key: '1' },
    { tab: '待办', key: '2' },
    { tab: '已办', key: '3' },
  ];

  /**
   * 通过
   */
  const approve = (item: StorageAgencyModel) => {
    kernel.anystore
      .update(
        'we_storageagency',
        { match: { id: item.id }, update: { _set_: { dataStatus: 100 } } },
        'company',
      )
      .then((res) => {
        // TODO 调用集团待办通过接口
        console.log(res);
      });
  };

  /**
   * 驳回
   */
  const refuse = (item: StorageAgencyModel) => {
    kernel.anystore
      .update(
        'we_storageagency',
        {
          match: { id: item.id },
          update: { _set_: { dataStatus: 200 } },
        },
        'company',
      )
      .then((res) => {
        // TODO 调用集团待办拒绝接口
        console.log(res);
      });
  };

  // 批量通过
  const batchApprove = () => {
    console.log(selectedRows);
  };

  // 批量驳回
  const batchRefuse = () => {
    console.log(selectedRows);
  };

  const tableOperation = (item: StorageAgencyModel) => {
    if (item.dataStatus >= 100) {
      return [
        {
          key: 'view',
          label: '查看',
          onClick: () => {
            setIsModalOpen(true);
            setStorageAgency(item);
          },
        },
      ];
    }
    return [
      {
        key: 'view',
        label: '查看',
        onClick: () => {
          setIsModalOpen(true);
          setStorageAgency(item);
        },
      },
      {
        key: 'approve',
        label: '通过',
        onClick: () => {
          approve(item);
        },
      },
      {
        key: 'refuse',
        label: '驳回',
        onClick: () => {
          refuse(item);
        },
      },
    ];
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <PageCard
        title={
          <div style={{ fontSize: '16px' }}>
            <b>仓储机构申请列表</b>
          </div>
        }
        tabList={statusList}
        activeTabKey={activeKey}
        onTabChange={(key: string) => {
          setActiveKey(key as string);
        }}>
        <CardOrTableComp
          rowKey={'id'}
          bordered={false}
          columns={supervisionStorageAgencyColumns}
          pagination={{
            defaultCurrent: 0,
            defaultPageSize: 10,
          }}
          dataSource={[]}
          params={{ activeKey }}
          request={async (params: any) => {
            let match: any = {};
            if (params.activeKey === '2') {
              match = { dataStatus: { _gte_: 1, _lt_: 100 } };
            } else if (params.activeKey === '3') {
              match = { dataStatus: { _gte_: 100 } };
            }
            const res = await kernel.anystore.aggregate(
              'we_storageagency',
              { match, skip: params.offset, limit: params.limit },
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
            onChange: (
              selectedRowKeys: React.Key[],
              selectedRows: StorageAgencyModel[],
            ) => {
              console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                'selectedRows: ',
                selectedRows,
              );
              setSelectedRows(selectedRows);
            },
          }}
          tableAlertOptionRender={() => {
            if (activeKey === '3') {
              return (
                <Space size={16}>
                  <a>暂存勾选</a>
                </Space>
              );
            }
            return (
              <Space size={16}>
                <a onClick={() => batchApprove()}>批量通过</a>
                <a onClick={() => batchRefuse()}>批量驳回</a>
                <a>暂存勾选</a>
              </Space>
            );
          }}
        />
      </PageCard>
      <Modal
        title="公益仓储信息"
        open={isModalOpen}
        width={900}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="下载"
        cancelText="关闭">
        <StorageAgencyView storageAgency={storageAgency as StorageAgencyModel} />
      </Modal>
    </div>
  );
};

export default StorageAgencyList;
