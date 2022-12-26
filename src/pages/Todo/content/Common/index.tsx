import React, { useState } from 'react';
import CardOrTableComp from '@/components/CardOrTableComp';
import { IApplyItem, IApprovalItem, ITodoGroup } from '@/ts/core/todo/itodo';
import { CommonStatus } from '@/ts/core';
import { PageRequest } from '@/ts/base/model';
import { ProColumns } from '@ant-design/pro-components';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { Button, Space } from 'antd';

// 卡片渲染
interface IProps {
  title?: string;
  typeName: string;
  todoGroup: ITodoGroup;
  columns: ProColumns<IApplyItem | IApprovalItem>[];
}
/**
 * 办事-好友申请
 * @returns
 */
const CommonTodo: React.FC<IProps> = (props) => {
  const [key, forceUpdate] = useObjectUpdate(props);
  const [selectedRows, setSelectRows] = useState<IApplyItem[] | IApprovalItem[]>([]);
  return (
    <CardOrTableComp<IApplyItem | IApprovalItem>
      key={key}
      headerTitle={props.title}
      dataSource={[]}
      rowKey={(record: IApplyItem | IApprovalItem) => record.Data?.id}
      columns={props.columns}
      request={async (page: PageRequest) => {
        switch (props.typeName) {
          case '待办': {
            let data = await props.todoGroup.getTodoList(false);
            return {
              total: data.length,
              result: data.splice(page.offset, page.limit),
              offset: page.offset,
              limit: page.limit,
            };
          }
          case '已办':
            return await props.todoGroup.getDoList(page);
          case '申请':
            return await props.todoGroup.getApplyList(page);
          default:
            return { total: 0, result: [], offset: page.offset, limit: page.limit };
        }
      }}
      operation={(item: IApplyItem | IApprovalItem) => {
        switch (props.typeName) {
          case '待办':
          case '已办':
            return [
              {
                key: 'approve',
                label: '同意',
                onClick: async () => {
                  await (item as IApprovalItem).pass(CommonStatus.ApproveStartStatus, '');
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
            ];
          case '申请':
            return [
              {
                key: 'cancel',
                label: '取消',
                onClick: async () => {
                  await (item as IApplyItem).cancel(CommonStatus.ApproveStartStatus, '');
                  forceUpdate();
                },
              },
            ];
          default:
            return [];
        }
      }}
      rowSelection={{ selectedRows }}
      tableAlertRender={({
        selectedRows,
        onCleanSelected,
      }: {
        selectedRows: IApplyItem[] | IApprovalItem[];
        onCleanSelected: any;
      }) => {
        setSelectRows(selectedRows);
        return (
          <span>
            已选 {selectedRows.length} 项
            <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
              取消选择
            </a>
          </span>
        );
      }}
      tableAlertOptionRender={() => {
        switch (props.typeName) {
          case '待办':
          case '已办':
            return (
              <Space>
                <Button
                  type="link"
                  onClick={async () => {
                    let rows = selectedRows as IApprovalItem[];
                    rows.forEach(async (a) => {
                      await (a as IApprovalItem).pass(
                        CommonStatus.ApproveStartStatus,
                        '',
                      );
                    });
                    forceUpdate();
                  }}>
                  同意
                </Button>
                <Button
                  type="link"
                  onClick={async () => {
                    selectedRows.forEach(async (a) => {
                      await (a as IApprovalItem).reject(
                        CommonStatus.RejectStartStatus,
                        '',
                      );
                      forceUpdate();
                    });
                  }}
                  style={{ color: 'red' }}>
                  拒绝
                </Button>
              </Space>
            );
          case '申请':
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
      }}
    />
  );
};

export default CommonTodo;
