import React, { useEffect, useRef, useState } from 'react';
import { Button, Divider, message, RadioChangeEvent, Space } from 'antd';
import { common } from 'typings/common';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import cls from './index.module.less';
import { ProColumns } from '@ant-design/pro-components';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { supportformListColumns } from '@/pages/Welfare/config/columns';
import { kernel, model, schema } from '@/ts/base';
import { supportFormCollName } from '../../config/collNames';
import { AddNodeTypeAndNameMaps } from '@/pages/Setting/content/Flow/Controller/processType';
import SupportForm from '@/pages/Welfare/WelfareOrg/SupportForm';
import { Status } from '@/pages/Welfare/config/status';
import userCtrl from '@/ts/controller/setting';
import { getUuid } from '@/utils/tools';
/**
 * 公益捐赠审批单列表(捐赠方申请)
 * @returns
 */
const SupportFormList: React.FC<any> = () => {
  const parentRef = useRef<any>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [activeKey, setActiveKey] = useState<string>('1');
  const [key, forceUpdate] = useObjectUpdate(activeKey);
  const [openForm, setOpenForm] = useState<boolean>(false);
  // 标题tabs页
  const TitleItems = [
    {
      tab: `草稿`,
      key: '1',
    },
    {
      tab: `已送审`,
      key: '2',
    },
    {
      tab: `已审核`,
      key: '3',
    },
  ];

  // 按钮
  const renderBtns = () => {
    return <></>;
  };

  // 操作内容渲染函数
  const renderOperation = (item: any): common.OperationType[] => {
    let operations: common.OperationType[] = [];
    operations = [
      {
        key: 'remove',
        label: '移除',
        onClick: async () => {
          message.warn('此功能暂未开放');
        },
      },
    ];
    return operations;
  };

  return (
    <div className={cls[`content-box`]}>
      <div className={cls['pages-wrap']}>
        {!openForm && (
          <PageCard
            title={
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>公益资助审批单</div>
            }
            bordered={false}
            tabList={TitleItems}
            activeTabKey={activeKey}
            onTabChange={(key: string) => {
              setActiveKey(key as string);
            }}
            tabBarExtraContent={renderBtns()}>
            <div className={cls['page-content-table']} ref={parentRef}>
              <CardOrTable<any>
                key={key}
                dataSource={[]}
                rowKey={'id'}
                parentRef={parentRef}
                operation={renderOperation}
                tableAlertOptionRender={({
                  selectedRowKeys,
                  selectedRows,
                  onCleanSelected,
                }: any) => {
                  return (
                    <Space size={16}>
                      <a
                        onClick={() => {
                          message.warn('此功能暂未开放');
                        }}>
                        暂存勾选
                      </a>
                      <a onClick={onCleanSelected}>清空</a>
                    </Space>
                  );
                }}
                params={{ activeKey }}
                request={async (params: any) => {
                  let match: any = {};
                  if (params.activeKey === '1') {
                    match = { status: { _eq_: Status.Draft } };
                  } else if (params.activeKey === '2') {
                    match = { status: { _eq_: Status.Processing } };
                  } else if (params.activeKey === '3') {
                    match = { status: { _eq_: Status.Processed } };
                  }
                  const res = await kernel.anystore.aggregate(
                    supportFormCollName,
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
                columns={supportformListColumns}
                showChangeBtn={true}
                rowSelection={{
                  onSelect: (_record: any, _selected: any, selectedRows: any) => {
                    setSelectedRows(selectedRows);
                  },
                }}
              />
            </div>
          </PageCard>
        )}
        {openForm && (
          <SupportForm
            formdata={selectedRows[0].formdata}
            backtolist={() => {
              setOpenForm(false);
            }}></SupportForm>
        )}
      </div>
    </div>
  );
};

export default SupportFormList;
