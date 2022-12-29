// 应用待办
import React, { useRef, useState } from 'react';
import CardOrTableComp from '@/components/CardOrTableComp';
import { IApplyItem, IApprovalItem, ITodoGroup } from '@/ts/core/todo/itodo';
import { ApplicationApplyColumns, ApplicationColumns } from '../../config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { CommonStatus } from '@/ts/core';
import PageCard from '@/components/PageCard';
import { Button, Space } from 'antd';
import cls from './index.module.less';

// 卡片渲染
interface IProps {
  typeName: string;
  todoGroup: ITodoGroup;
}
const AppTodo: React.FC<IProps> = (props) => {
  const parentRef = useRef<any>(null);
  const [tabKey, setTabKey] = useState('');
  const [selectedRows, setSelectRows] = useState<IApplyItem[] | IApprovalItem[]>([]);
  const [key, forceUpdate] = useObjectUpdate(props);
  const tabList = () => [
    { key: 'todo', tab: '我的待办' },
    { key: 'notice', tab: '我的抄送' },
    { key: 'complete', tab: '我的已办' },
    { key: 'apply', tab: '我的申请' },
  ];
  const operation = () => {
    switch (tabKey) {
      case 'notice':
        return (
          <Space>
            <Button
              type="link"
              onClick={async () => {
                let rows = selectedRows as IApprovalItem[];
                rows.forEach(async (a) => {
                  await (a as IApprovalItem).pass(CommonStatus.ApproveStartStatus, '');
                });
                forceUpdate();
              }}>
              阅读
            </Button>
          </Space>
        );
      case 'todo':
        return (
          <Space>
            <Button
              type="link"
              onClick={async () => {
                let rows = selectedRows as IApprovalItem[];
                rows.forEach(async (a) => {
                  await (a as IApprovalItem).pass(CommonStatus.ApproveStartStatus, '');
                });
                forceUpdate();
              }}>
              同意
            </Button>
            <Button
              type="link"
              onClick={async () => {
                selectedRows.forEach(async (a) => {
                  await (a as IApprovalItem).reject(CommonStatus.RejectStartStatus, '');
                  forceUpdate();
                });
              }}
              style={{ color: 'red' }}>
              拒绝
            </Button>
          </Space>
        );
      case 'apply':
        return (
          <Button
            type="link"
            onClick={async () => {
              selectedRows.forEach(async (a) => {
                await (a as IApplyItem).cancel(CommonStatus.ApproveStartStatus, '');
                forceUpdate();
              });
            }}
            style={{ color: 'red' }}>
            取消
          </Button>
        );
      default:
        return <></>;
    }
  };

  return (
    <PageCard
      bordered={false}
      tabList={tabList()}
      onTabChange={(key) => setTabKey(key)}
      tabBarExtraContent={operation()}>
      <div className={cls['page-content-table']} ref={parentRef}>
        <CardOrTableComp<IApprovalItem | IApplyItem>
          key={key}
          dataSource={[]}
          params={tabKey}
          parentRef={parentRef}
          rowKey={(record) => record?.Data?.id || Math.random() * 10000}
          columns={tabKey == 'apply' ? ApplicationApplyColumns : ApplicationColumns}
          request={async (page) => {
            switch (tabKey) {
              case 'todo': {
                const data = await props.todoGroup.getTodoList(false);
                return {
                  total: data.length,
                  result: data.splice(page.offset, page.limit),
                  offset: page.offset,
                  limit: page.limit,
                };
              }
              case 'notice': {
                const noticeData = await props.todoGroup.getNoticeList(false);
                return {
                  total: noticeData.length,
                  result: noticeData.splice(page.offset, page.limit),
                  offset: page.offset,
                  limit: page.limit,
                };
              }
              case 'complete':
                return await props.todoGroup.getDoList(page);
              case 'apply':
                return await props.todoGroup.getApplyList(page);
              default:
                return { total: 0, result: [], offset: page.offset, limit: page.limit };
            }
          }}
          operation={(item: IApplyItem | IApprovalItem) => {
            let menus = [
              {
                key: 'detail',
                label: '详情',
                onClick: async () => {},
              },
            ];
            switch (tabKey) {
              case 'todo':
                menus.push(
                  {
                    key: 'approve',
                    label: '同意',
                    onClick: async () => {
                      await (item as IApprovalItem).pass(
                        CommonStatus.ApproveStartStatus,
                        '',
                      );
                      forceUpdate();
                    },
                  },
                  {
                    key: 'refuse',
                    label: '拒绝',
                    onClick: async () => {
                      await (item as IApprovalItem).reject(
                        CommonStatus.RejectStartStatus,
                        '',
                      );
                      forceUpdate();
                    },
                  },
                );
                break;
              case 'notice':
                menus.push({
                  key: 'approve',
                  label: '阅读',
                  onClick: async () => {
                    await (item as IApprovalItem).pass(
                      CommonStatus.ApproveStartStatus,
                      '',
                    );
                    forceUpdate();
                  },
                });
                break;
              case 'apply':
                menus.push({
                  key: 'cancel',
                  label: '取消',
                  onClick: async () => {
                    await (item as IApplyItem).cancel(
                      CommonStatus.ApproveStartStatus,
                      '',
                    );
                    forceUpdate();
                  },
                });
                break;
              default:
                break;
            }
            return menus;
          }}
          rowSelection={{
            type: 'checkbox',
            onChange: (_: React.Key[], selectedRows: IApplyItem[] | IApprovalItem[]) => {
              setSelectRows(selectedRows);
            },
          }}
        />{' '}
      </div>
    </PageCard>
  );
};

export default AppTodo;
