// import ShareShowComp from '@/components/Common/ShareShowComp';
// import CustomTree from '@/components/CustomTree';
// import { linkCmd } from '@/ts/base/common/command';
// import { XEntity } from '@/ts/base/schema';
// import { IBelong, IDirectory, IEntity } from '@/ts/core';
// import { Input, Tree, TreeProps } from 'antd';
// import React, { Key, ReactNode, useEffect, useState } from 'react';
// import { AiOutlineSearch } from '@/icons/ai';
// import cls from './index.module.css';
// interface IExtends<X extends XEntity> {
//   current: IBelong;
//   multiple?: boolean;
//   onChange: (files: IEntity<X>[]) => void;
//   onOk?: () => void;
//   loadItems: (current: IDirectory) => Promise<IEntity<XEntity>[]>;
//   treeNode?: (node: IDirectory, cur?: IDirectory) => ReactNode;
//   add?: (directory: IDirectory) => ReactNode;
//   update?: (entity: IEntity<XEntity>) => ReactNode;
// }

// export const Selector = ({
//   multiple = true,
//   current,
//   onChange,
//   loadItems,
//   treeNode,
//   add,
//   update,
// }: IExtends<XEntity>) => {
//   const mapping = (item: any, children: any[] = []) => {
//     return {
//       key: item.id,
//       title: item.name,
//       value: item.id,
//       item: item,
//       children: children,
//     };
//   };

//   const buildWorkThingTree = (directory: IDirectory[]): any[] => {
//     const result: any[] = [];
//     for (const item of directory) {
//       result.push(mapping(item, buildWorkThingTree(item.children)));
//     }
//     return result;
//   };

//   const [filter, setFilter] = useState<string>('');
//   const [curDir, setCurDir] = useState<IDirectory>();
//   const [leftTree, setLeftTree] = useState<any[]>(
//     buildWorkThingTree([current.directory]),
//   );
//   const [centerTreeData, setCenterTreeData] = useState<any>([]);
//   const [centerCheckedKeys, setCenterCheckedKeys] = useState<Key[]>([]);
//   const [selected, setSelected] = useState<IEntity<XEntity>[]>([]);

//   useEffect(() => {
//     const id = linkCmd.subscribe(async (type, cmd) => {
//       switch (type) {
//         case 'selector':
//           switch (cmd) {
//             case 'refresh':
//               setLeftTree(buildWorkThingTree([current.directory]));
//               if (curDir) {
//                 const items = await loadItems(curDir);
//                 setCenterTreeData(items.map((item) => mapping(item)));
//               }
//               break;
//           }
//           break;
//       }
//     });
//     return () => {
//       linkCmd.unsubscribe(id);
//     };
//   });

//   const onSelect: TreeProps['onSelect'] = async (_, info: any) => {
//     const directory: IDirectory = info.node.item;
//     let configs = await loadItems(directory);
//     setCurDir(directory);
//     setCenterTreeData(configs.map((config) => mapping(config)));
//   };

//   // 中间树形点击事件
//   const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
//     if (Array.isArray(checkedKeys)) {
//       setCenterCheckedKeys(checkedKeys);
//     }
//     const entity: IEntity<XEntity> = (info.node as any).item;
//     if (info.checked) {
//       selected.push(entity);
//       setSelected(selected);
//       onChange(selected);
//     } else {
//       let ans = [...selected.filter((i) => i.id != entity.id)];
//       setSelected(ans);
//       onChange(ans);
//     }
//   };

//   const handelDel = (id: string) => {
//     setCenterCheckedKeys(centerCheckedKeys.filter((data) => data != id));
//     let ans = selected.filter((i) => i.id != id);
//     setSelected(ans);
//     onChange(ans);
//   };

//   return (
//     <>
//       <div className={cls.layout}>
//         <div className={cls.content}>
//           <div style={{ width: '25%' }} className={cls.left}>
//             <Input
//               className={cls.leftInput}
//               prefix={<AiOutlineSearch />}
//               placeholder="请设置关键字"
//             />
//             <div className={cls.leftContent}>
//               <Tree
//                 autoExpandParent={true}
//                 onSelect={onSelect}
//                 treeData={leftTree}
//                 defaultExpandAll={true}
//                 titleRender={(node) => {
//                   if (treeNode) {
//                     return treeNode((node as any).item, curDir);
//                   }
//                   return <>{node.title}</>;
//                 }}
//               />
//             </div>
//           </div>

//           <div style={{ width: '50%' }} className={cls.center}>
//             <Input
//               className={cls.centerInput}
//               prefix={<AiOutlineSearch />}
//               placeholder="搜索"
//               onChange={(e) => {
//                 setFilter(e.target.value);
//               }}
//             />
//             {curDir && add?.(curDir)}
//             <div className={cls.centerContent}>
//               <CustomTree
//                 multiple={multiple}
//                 checkable
//                 checkedKeys={centerCheckedKeys}
//                 autoExpandParent={true}
//                 onCheck={onCheck}
//                 treeData={centerTreeData.filter((i: any) => i.title.includes(filter))}
//                 titleRender={(entity) => {
//                   if (update) {
//                     return update((entity as any).item);
//                   }
//                   return <>{entity.title}</>;
//                 }}
//               />
//             </div>
//           </div>
//           {multiple && (
//             <div style={{ width: '25%' }} className={cls.right}>
//               <ShareShowComp departData={selected} deleteFuc={handelDel}></ShareShowComp>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Selector;
