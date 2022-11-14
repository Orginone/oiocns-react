// import CardOrTableComp from '@/components/CardOrTableComp';
// import { PageType } from '@/components/CardOrTableComp';
// import { ApprovalType } from '@/module/todo/typings';
// import { Avatar, Button, Card, Space, Tag } from 'antd';
// import type { CardTabListType } from 'antd/lib/card';
// import todoService from '@/module/todo';
// import React, { useState, useEffect } from 'react';

// import styles from './index.module.less';

// const { Meta } = Card;
// const tabs: CardTabListType[] = [
//   { tab: '待办', key: '1' },
//   // { tab: '已办', key: '2' },
//   // { tab: '已完成', key: '3' },
//   // { tab: '已过期', key: '5' },
//   { tab: '我的发起', key: '2' },
// ];
// // 卡片渲染
// const renderCard = (data: ApprovalType[]) => {
//   data.map((item) => {
//     return (
//       <Card key={item.id}>
//         <Meta
//           avatar={<Avatar>{item.target.name.substring(0, 1)}</Avatar>}
//           title={item.target.name}
//           description={<Tag>{item.createTime}</Tag>}></Meta>
//       </Card>
//     );
//   });
// };
// // 默认的右上角按钮操作
// const tabBarExtra: React.ReactNode = (
//   <Space>
//     <Button key="1" type="primary" onClick={}>
//       审核
//     </Button>
//     <Button key="2">回退</Button>
//     <Button key="3">打印</Button>
//   </Space>
// );
// const tableOperation = (activeKey: string, item: ApprovalType): Array<T> => {
//   return activeKey == '1'
//     ? [
//         {
//           key: 'approve',
//           label: '同意',
//           onClick: () => {
//             friendService.approve(item.id);
//             console.log('同意', 'approve', item);
//           },
//         },
//         {
//           key: 'back',
//           label: '拒绝',
//           onClick: () => {
//             friendService.refuse(item.id);
//             console.log('拒绝', 'back', item);
//           },
//         },
//       ]
//     : [
//         {
//           key: 'approve',
//           label: '取消申请',
//           onClick: () => {
//             friendService.retractApply(item.id);
//             console.log('同意', 'approve', item);
//           },
//         },
//       ];
// };
// interface TodoCommonTableProps extends PageType {
//   tabs: CardTabListType[];
//   tabBarExtraContent?: React.ReactNode; // 卡片右上角自定义
// }
// /**
//  * 办事-好友申请
//  * @returns
//  */
// const TodoTablePage: <T extends object>(
//   props: TodoCommonTableProps<T>,
// ) => React.ReactElement = ({
//   columns,
//   tabBarExtraContent = tabBarExtra,
//   operation = tableOperation,
// }) => {
//   const [activeKey, setActiveKey] = useState<string>();

//   // 获取申请列表
//   const getList = async (params) => {
//     await todoService.getFriendApprove(params);
//   };
//   useEffect(() => {
//     getList({ status: activeKey, page: 1, pageSize: 12 });
//   }, []);

//   return (
//     <Card
//       className={styles.wrap}
//       tabList={tabs}
//       bordered={false}
//       headStyle={{ borderBottom: 0, fontSize: 12 }}
//       activeTabKey={activeKey}
//       onTabChange={(key: string) => {
//         setActiveKey(key as string);
//       }}
//       tabBarExtraContent={
//         tabBarExtraContent || (
//           <Space>
//             <Button key="1" type="primary">
//               审核
//             </Button>
//             <Button key="2">回退</Button>
//             <Button key="3">打印</Button>
//           </Space>
//         )
//       }>
//       <CardOrTableComp<T>
//         rowKey={'id'}
//         bordered={false}
//         columns={columns}
//         dataSource={list}
//         operation={operation}
//         renderCardContent={renderCard}
//       />
//     </Card>
//   );
// };

// export default TodoTablePage;
