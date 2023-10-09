// import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
// import MappingForm from '@/executor/config/entityForm/mappingForm';
// import orgCtrl from '@/ts/controller';
// import { IDirectory } from '@/ts/core';
// import { ConfigColl, IMapping } from '@/ts/core/thing/transfer/config';
// import { ProTable } from '@ant-design/pro-components';
// import { Button, Modal, Space } from 'antd';
// import React, { useEffect, useState } from 'react';
// import Mapper from './mapper';

// interface IProps {
//   current: IDirectory;
// }

// const getMappings = (current: IDirectory) => {
//   return current.configs.get(ConfigColl.Mappings)?.map((item) => item as IMapping) ?? [];
// };

// const MappingTable: React.FC<IProps> = ({ current }) => {
//   const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
//   const [cmd, setCmd] = useState<string>('');
//   const [data, setData] = useState<readonly IMapping[]>(getMappings(current));
//   const [param, setParam] = useState<IDirectory | IMapping>(current.target.directory);
//   useEffect(() => {
//     const id = current.subscribe(() => {
//       setSelectedKeys([]);
//       setData(getMappings(current));
//     });
//     return () => {
//       current.unsubscribe(id);
//     };
//   }, [current]);
//   return (
//     <>
//       <ProTable<IMapping>
//         dataSource={data}
//         search={false}
//         cardProps={{ bodyStyle: { padding: 0 } }}
//         scroll={{ y: 300 }}
//         rowKey={'id'}
//         columns={[
//           {
//             title: '序号',
//             valueType: 'index',
//           },
//           {
//             title: '映射类型',
//             dataIndex: 'type',
//             render: (_: any, record: IMapping) => {
//               switch (record.metadata.type) {
//                 case 'fields':
//                   return <>字段映射</>;
//                 case 'specieItems':
//                   return <>字典/分类映射</>;
//               }
//             },
//           },
//           {
//             title: '源表单',
//             dataIndex: 'sourceName',
//             render: (_: any, record: IMapping) => (
//               <EntityIcon entity={current.findMetadata(record.metadata.source)} showName />
//             ),
//           },
//           {
//             title: '目标表单',
//             dataIndex: 'targetName',
//             render: (_, record: IMapping) => (
//               <EntityIcon entity={current.findMetadata(record.metadata.target)} showName />
//             ),
//           },
//           {
//             title: '映射字段',
//             render: (_, entity) => {
//               return <span>已映射 {entity.metadata.mappings.length} 个字段</span>;
//             },
//           },
//           {
//             title: '备注',
//             dataIndex: 'remark',
//           },
//           {
//             title: '操作',
//             dataIndex: 'action',
//             render: (_, record: IMapping) => {
//               return (
//                 <Space>
//                   <Button
//                     size="small"
//                     onClick={() => {
//                       setCmd('updateMapping');
//                       setParam(record);
//                     }}>
//                     修改
//                   </Button>
//                   <Button
//                     size="small"
//                     onClick={() => {
//                       Modal.info({
//                         icon: <></>,
//                         title: '字段映射',
//                         okText: '关闭',
//                         width: 1200,
//                         onCancel: () => current.changCallback(),
//                         onOk: () => current.changCallback(),
//                         maskClosable: true,
//                         content: <Mapper current={record} link={undefined} />,
//                       });
//                     }}>
//                     配置字段
//                   </Button>
//                 </Space>
//               );
//             },
//           },
//         ]}
//         rowSelection={{
//           selectedRowKeys: selectedKeys,
//           onChange: setSelectedKeys,
//         }}
//         toolBarRender={() => {
//           return [
//             <Space>
//               <Button onClick={() => setCmd('newMapping')}>新增</Button>
//               <Button
//                 onClick={() => {
//                   Modal.confirm({
//                     title: '确认删除？',
//                     onOk: async () => {
//                       const mappings = getMappings(current);
//                       for (const mapping of mappings) {
//                         for (const selectedKey of selectedKeys) {
//                           if (selectedKey == mapping.id) {
//                             await mapping.delete();
//                           }
//                         }
//                       }
//                       current.changCallback();
//                       orgCtrl.changCallback();
//                     },
//                   });
//                 }}>
//                 删除
//               </Button>
//             </Space>,
//           ];
//         }}
//       />
//       {cmd && (
//         <MappingForm
//           current={param}
//           finished={(mapping) => {
//             if (mapping) {
//               setData(getMappings(current));
//             }
//             setCmd('');
//           }}
//           formType={cmd}
//         />
//       )}
//     </>
//   );
// };

// export default MappingTable;
export {};
