import React, { useEffect, useRef, useState } from 'react';
import CardOrTableComp from '@/components/CardOrTableComp';
import { IApplyItem, IApprovalItem, ITodoGroup } from '@/ts/core/todo/itodo';
import { CommonStatus } from '@/ts/core';
import { PageRequest } from '@/ts/base/model';
import { ProColumns } from '@ant-design/pro-components';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { Button, Space } from 'antd';
import PageCard from '@/components/PageCard';
import { CardTabListType } from 'antd/lib/card';
import cls from './index.module.less';

// 卡片渲染
interface IProps {
  todoGroup: ITodoGroup;
  reflashMenu: () => void;
  tabList?: CardTabListType[];
  columns: ProColumns<IApplyItem | IApprovalItem>[];
}
/**
 * 办事-好友申请
 * @returns
 */
const CommonTodo: React.FC<IProps> = (props) => {
  const parentRef = useRef<any>(null);
  const [tabKey, setTabKey] = useState('');
  const [key, forceUpdate] = useObjectUpdate(props);
  const [selectedRows, setSelectRows] = useState<IApplyItem[] | IApprovalItem[]>([]);

  useEffect(() => {
    if (props.tabList && props.tabList.length > 0) {
      setTabKey(props.tabList[0].key);
    }
  }, [props]);
  const operation = () => {
    switch (tabKey) {
      case 'todo':
      case 'complete':
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
                props.reflashMenu();
              }}>
              同意
            </Button>
            <Button
              type="link"
              onClick={async () => {
                selectedRows.forEach(async (a) => {
                  await (a as IApprovalItem).reject(CommonStatus.RejectStartStatus, '');
                });
                forceUpdate();
                props.reflashMenu();
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
      tabList={props.tabList}
      onTabChange={(key) => setTabKey(key)}
      tabBarExtraContent={operation()}>
      <div className={cls['page-content-table']} ref={parentRef}>
        <CardOrTableComp<IApplyItem | IApprovalItem>
          key={key}
          dataSource={[]}
          params={tabKey}
          parentRef={parentRef}
          rowKey={(record: IApplyItem | IApprovalItem) => record.Data?.id}
          columns={props.columns}
          request={async (page: PageRequest) => {
            switch (tabKey) {
              case 'todo': {
                let data = await props.todoGroup.getTodoList(false);
                return {
                  total: data.length,
                  result: data.splice(page.offset, page.limit),
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
            switch (tabKey) {
              case 'todo':
              case 'complete':
                return [
                  {
                    key: 'approve',
                    label: '同意',
                    onClick: async () => {
                      await (item as IApprovalItem).pass(
                        CommonStatus.ApproveStartStatus,
                        '',
                      );
                      forceUpdate();
                      props.reflashMenu();
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
                      props.reflashMenu();
                    },
                  },
                ];
              case 'apply':
                return [
                  {
                    key: 'cancel',
                    label: '取消',
                    onClick: async () => {
                      await (item as IApplyItem).cancel(
                        CommonStatus.ApproveStartStatus,
                        '',
                      );
                      forceUpdate();
                    },
                  },
                ];
              default:
                return [];
            }
          }}
          rowSelection={{
            type: 'checkbox',
            onChange: (_: React.Key[], selectedRows: IApplyItem[] | IApprovalItem[]) => {
              setSelectRows(selectedRows);
            },
          }}
        />
      </div>
    </PageCard>
  );
};

export default CommonTodo;
