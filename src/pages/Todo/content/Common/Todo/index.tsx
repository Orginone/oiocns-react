import React, { useRef, useState } from 'react';
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
  tabList: CardTabListType[];
  columns: ProColumns<IApprovalItem>[];
}
/**
 * 办事-通用待办
 * @returns
 */
const CommonTodo: React.FC<IProps> = (props) => {
  const parentRef = useRef<any>(null);
  const [tabKey, setTabKey] = useState(props.tabList[0].key);
  const [key, forceUpdate] = useObjectUpdate(props);
  const [selectedRows, setSelectRows] = useState<IApplyItem[] | IApprovalItem[]>([]);

  const operation = () => (
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

  return (
    <PageCard
      bordered={false}
      tabList={props.tabList}
      onTabChange={(key) => setTabKey(key)}
      tabBarExtraContent={operation()}>
      <div className={cls['page-content-table']} ref={parentRef}>
        <CardOrTableComp<IApprovalItem>
          key={key}
          dataSource={[]}
          params={tabKey}
          parentRef={parentRef}
          rowKey={(record: IApprovalItem) => record.Data?.id}
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
            }
          }}
          operation={(item: IApprovalItem) => {
            return [
              {
                key: 'approve',
                label: '同意',
                onClick: async () => {
                  await (item as IApprovalItem).pass(CommonStatus.ApproveStartStatus, '');
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
          }}
          rowSelection={{
            type: 'checkbox',
            onChange: (_: React.Key[], selectedRows: IApprovalItem[]) => {
              setSelectRows(selectedRows);
            },
          }}
        />
      </div>
    </PageCard>
  );
};

export default CommonTodo;
