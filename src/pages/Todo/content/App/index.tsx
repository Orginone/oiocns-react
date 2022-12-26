// 应用待办
import React from 'react';
import CardOrTableComp from '@/components/CardOrTableComp';
import { IApplyItem, IApprovalItem, ITodoGroup } from '@/ts/core/todo/itodo';
import { ApplicationApplyColumns, ApplicationColumns } from '../../config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { CommonStatus } from '@/ts/core';

// 卡片渲染
interface IProps {
  title?: string;
  typeName: string;
  todoGroup: ITodoGroup;
}
const AppTodo: React.FC<IProps> = (props) => {
  const [key, forceUpdate] = useObjectUpdate(props);
  return (
    <CardOrTableComp<IApprovalItem | IApplyItem>
      dataSource={[]}
      key={key}
      rowKey={(record) => record?.Data?.id || Math.random() * 10000}
      columns={props.typeName == '申请' ? ApplicationApplyColumns : ApplicationColumns}
      request={async (page) => {
        switch (props.typeName) {
          case '待办': {
            const data = await props.todoGroup.getTodoList(false);
            return {
              total: data.length,
              result: data.splice(page.offset, page.limit),
              offset: page.offset,
              limit: page.limit,
            };
          }
          case '抄送': {
            const noticeData = await props.todoGroup.getNoticeList(false);
            return {
              total: noticeData.length,
              result: noticeData.splice(page.offset, page.limit),
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
        let menus = [
          {
            key: 'detail',
            label: '详情',
            onClick: async () => {},
          },
        ];
        switch (props.typeName) {
          case '待办':
          case '已办':
            menus.push(
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
            );
            break;
          case '抄送':
            menus.push({
              key: 'approve',
              label: '阅读',
              onClick: async () => {
                await (item as IApprovalItem).pass(CommonStatus.ApproveStartStatus, '');
                forceUpdate();
              },
            });
            break;
          case '申请':
            menus.push({
              key: 'cancel',
              label: '取消',
              onClick: async () => {
                await (item as IApplyItem).cancel(CommonStatus.ApproveStartStatus, '');
                forceUpdate();
              },
            });
            break;
          default:
            break;
        }
        return menus;
      }}
    />
  );
};

export default AppTodo;
