import SchemaForm from '@/components/SchemaForm';
import orgCtrl from '@/ts/controller';
import { IDirectory } from '@/ts/core';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { MenuItem, defaultGenLabel, loadDirs } from '../..';

interface IProps {
  // formType: string;
  // current: IDirectory | IStore;
  // finished: (mapping?: IStore) => void;
}

// const getTrees = (current: IDirectory | IStore): MenuItem[] => {
//   const tree = [
//     loadDirs(
//       current.typeName == '存储'
//         ? (current as IStore).directory.target.directory
//         : (current as IDirectory).target.directory,
//       (item) => (item.selectable = true),
//       (entity) => {
//         return defaultGenLabel(entity, []);
//       },
//     ),
//   ];
//   return tree;
// };

export const StoreForm: React.FC<IProps> = ({}) => {
  // let initialValue = {};
  // switch (formType) {
  //   case 'updateStore':
  //     initialValue = current.metadata;
  //     break;
  // }
  // const formRef = useRef<ProFormInstance>();
  // const [treeData, setTreeData] = useState<MenuItem[]>(getTrees(current));
  // const columns: ProFormColumnsType<XStore>[] = [
  //   {
  //     title: '名称',
  //     dataIndex: 'name',
  //     colProps: { span: 12 },
  //     formItemProps: {
  //       rules: [{ required: true, message: '名称为必填项' }],
  //     },
  //   },
  //   {
  //     title: '编码',
  //     dataIndex: 'code',
  //     colProps: { span: 12 },
  //     formItemProps: {
  //       rules: [{ required: true, message: '编码为必填项' }],
  //     },
  //   },
  //   {
  //     title: '数据目录',
  //     dataIndex: 'uploadDir',
  //     valueType: 'treeSelect',
  //     colProps: { span: 24 },
  //     fieldProps: {
  //       fieldNames: {
  //         label: 'node',
  //         value: 'key',
  //         children: 'children',
  //       },
  //       showSearch: true,
  //       loadData: async (node: MenuItem): Promise<void> => {
  //         if (!node.isLeaf) {
  //           let forms = await (node.item as IDirectory).loadForms();
  //           if (forms.length > 0) {
  //             setTreeData(getTrees(current));
  //           }
  //         }
  //       },
  //       treeNodeFilterProp: 'label',
  //       treeData: treeData,
  //     },
  //   },
  //   {
  //     title: '备注',
  //     dataIndex: 'remark',
  //     valueType: 'textarea',
  //     colProps: { span: 24 },
  //   },
  // ];
  // return (
  //   <SchemaForm<XStore>
  //     ref={formRef}
  //     open
  //     title="存储配置"
  //     width={640}
  //     columns={columns}
  //     initialValues={initialValue}
  //     rowProps={{
  //       gutter: [24, 0],
  //     }}
  //     layoutType="ModalForm"
  //     onOpenChange={(open: boolean) => {
  //       if (!open) {
  //         finished();
  //       }
  //     }}
  //     onFinish={async (values) => {
  //       switch (formType) {
  //         case 'newStore': {
  //           values.typeName = '存储';
  //           let store = await (current as IDirectory).createLink(
  //             ConfigColl.Stores,
  //             values,
  //           );
  //           finished(store as IStore);
  //           orgCtrl.changCallback();
  //           break;
  //         }
  //         case 'updateStore': {
  //           let store = current as IStore;
  //           store.refresh({ ...initialValue, ...values });
  //           finished(store);
  //           break;
  //         }
  //       }
  //     }}
  //   />
  // );
  return <></>;
};
