import React, { useEffect, useRef, useState } from 'react';
import { Button, Divider, message, RadioChangeEvent, Space } from 'antd';
import { common } from 'typings/common';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import cls from './index.module.less';
import { ProColumns } from '@ant-design/pro-components';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { todoListColumns } from '@/pages/Welfare/config/columns';
import { kernel, model, schema } from '@/ts/base';
import { donationFormCollName, donationFormTodoCollName } from '../../config/collNames';
import { AddNodeTypeAndNameMaps } from '@/pages/Setting/content/Flow/Controller/processType';
import DonationForm from '@/pages/Welfare/WelfareOrg/DonationForm';
import { Status } from '@/pages/Welfare/config/status';
import userCtrl from '@/ts/controller/setting';
import { getUuid } from '@/utils/tools';
/**
 * 公益捐赠审批单待办列表(捐赠方申请)
 * @returns
 */
const DonationTodoList: React.FC<any> = () => {
  const parentRef = useRef<any>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [activeKey, setActiveKey] = useState<string>('1');
  const [key, forceUpdate] = useObjectUpdate(activeKey);
  const [openForm, setOpenForm] = useState<boolean>(false);
  // 标题tabs页
  const TitleItems = [
    {
      tab: `全部`,
      key: '1',
    },
    {
      tab: `待办`,
      key: '2',
    },
    {
      tab: `已办`,
      key: '3',
    },
  ];

  const addData = async () => {
    let donationFormData = {
      id: getUuid(),
      no: 'GYCSQ20220926000048',
      sponsor: '张三',
      needStore: '1',
      store: '395663272721911808',
      linkman: '张三',
      phone: '13800000082',
      totalValue: 10103920,
      amount: 20,
      reason: '这是原因',
      remark: '请输入备注信息',
      status: Status.Draft,
      welfareOrg: userCtrl.company.id,
      donorCode: '91440604345342989D',
      assets: [
        {
          id: getUuid(),
          code: '1234567890',
          name: '资产名称',
          spec: 'II50',
          amount: 100,
          remark: '这是备注这是备注这是备注',
        },
        {
          id: getUuid(),
          code: '1234567890',
          name: '资产名称',
          spec: 'II50',
          amount: 100,
          remark: '这是备注这是备注这是备注这是备注这是备注这是备注',
        },
        {
          id: getUuid(),
          code: '1234567890',
          name: '资产名称',
          spec: 'II50',
          amount: 100,
          remark: '这是备注',
        },
      ],
    };
    let res = await kernel.anystore.insert(
      donationFormCollName,
      donationFormData,
      'company',
    );
    let res2 = await kernel.anystore.insert(
      donationFormTodoCollName,
      {
        id: getUuid(),
        event: '捐赠发起申请',
        describe: '这是',
        sponsor: '张三',
        creatTime: '2017-10-31 23:12:00',
        expireTime: '2017-10-31 23:12:00',
        dataStatus: 98,
        handle: null,
        formdata: donationFormData,
        url: '',
      },
      'company',
    );
    console.log(res2);
  };

  const approve = async () => {
    if (selectedRows.length > 0) {
      let success = true;
      for (let selectedRow of selectedRows) {
        // if (selectedRow['dataStatus'] <= 100) {
        //设置为接受捐赠状态
        selectedRow['dataStatus'] = 101;
        selectedRow['handle'] = '接受';
        let res = await kernel.anystore.update(
          donationFormTodoCollName,
          { match: { id: selectedRow.id }, update: { _set_: selectedRow } },
          'company',
        );
        success = success && res.success;
        setOpenForm(true);
        // }
      }
      if (success) {
        forceUpdate();
        message.success('操作成功');
      } else {
        message.error('操作失败');
      }
    } else {
      message.warn('至少选择一条未处理的数据');
    }
  };

  const refuse = async () => {
    if (selectedRows.length > 0) {
      let success = true;
      for (let selectedRow of selectedRows) {
        if (selectedRow['dataStatus'] <= 100) {
          //设置为接受捐赠状态
          selectedRow['dataStatus'] = 201;
          selectedRow['handle'] = '拒绝';
          let res = await kernel.anystore.update(
            donationFormTodoCollName,
            { match: { id: selectedRow.id }, update: { _set_: selectedRow } },
            'company',
          );
          success = success && res.success;
        }
      }
      if (success) {
        forceUpdate();
        message.success('操作成功');
      } else {
        message.error('操作失败');
      }
    } else {
      message.warn('至少选择一条未处理的数据');
    }
  };

  // 按钮
  const renderBtns = () => {
    return (
      <>
        <Button
          key="recieve"
          style={{ marginRight: '10px' }}
          type="primary"
          onClick={approve}>
          接受捐赠
        </Button>
        <Button key="refuse" style={{ marginRight: '10px' }} onClick={refuse}>
          拒绝捐赠
        </Button>
        <Button
          key="print"
          onClick={() => {
            addData();
            message.error('该功能暂未开放');
          }}>
          打印
        </Button>
      </>
    );
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
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                公益物资捐赠审批单
              </div>
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
                  if (params.activeKey === '2') {
                    match = { dataStatus: { _gte_: 1, _lt_: 100 } };
                  } else if (params.activeKey === '3') {
                    match = { dataStatus: { _gte_: 100 } };
                  }
                  const res = await kernel.anystore.aggregate(
                    donationFormTodoCollName,
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
                columns={todoListColumns}
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
          <DonationForm
            formdata={selectedRows[0].formdata}
            backtolist={() => {
              setOpenForm(false);
            }}></DonationForm>
        )}
      </div>
    </div>
  );
};

export default DonationTodoList;
