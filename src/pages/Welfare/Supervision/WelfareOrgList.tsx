import CardOrTableComp from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import { Modal, Space } from 'antd';
import React, { useState } from 'react';
import { supervisionWelfareOrgColumns } from '../config/columns';
import WelfareOrgView from './WelfareOrgView';
import { kernel } from '@/ts/base';

export type WelfareOrgModel = {
  id: string;
  name: string;
  businessAreas: string;
  registerType: string;
  code: string;
  registerManageOrgan: string;
  businessManageOrgan: string;
  registerTime: Date;
  establishTime: Date;
  contactPerson: string;
  phone: string;
  dataStatus: number;
};

/**
 * 平台：加入集团的公益组织列表
 */
const WelfareOrgList: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('1');
  const [welfareOrg, setWelfareOrg] = useState<WelfareOrgModel>();
  const [selectedRows, setSelectedRows] = useState<any[]>();

  const statusList = [
    { tab: '全部', key: '1' },
    { tab: '待办', key: '2' },
    { tab: '已办', key: '3' },
  ];

  /**
   * 通过
   */
  const approve = (item: WelfareOrgModel) => {
    kernel.anystore
      .update(
        'we_welfareorg',
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
  const refuse = (item: WelfareOrgModel) => {
    kernel.anystore
      .update(
        'we_welfareorg',
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

  const tableOperation = (item: WelfareOrgModel) => {
    if (item.dataStatus >= 100) {
      return [
        {
          key: 'view',
          label: '查看',
          onClick: () => {
            setIsModalOpen(true);
            setWelfareOrg(item);
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
          setWelfareOrg(item);
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
            <b>公益组织申请列表</b>
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
          columns={supervisionWelfareOrgColumns}
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
              'we_welfareorg',
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
            onChange: (selectedRowKeys: React.Key[], selectedRows: WelfareOrgModel[]) => {
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
        title="公益组织信息"
        open={isModalOpen}
        width={900}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="下载"
        cancelText="关闭">
        <WelfareOrgView welfareOrg={welfareOrg as WelfareOrgModel} />
      </Modal>
    </div>
  );
};

export default WelfareOrgList;
