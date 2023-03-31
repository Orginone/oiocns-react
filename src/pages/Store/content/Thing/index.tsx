import React, { useEffect, useState } from 'react';
import Thing from './Thing';
import ThingView from './View';
import { ISpeciesItem } from '@/ts/core';
import thingCtrl from '@/ts/controller/thing';
import { Item } from 'devextreme-react/data-grid';
import { TreeSelect } from 'antd';
import { getUuid } from '@/utils/tools';

interface IProps {
  species: ISpeciesItem;
  selectable: boolean;
  checkedList?: any[];
}
/**
 * 仓库-物
 */
const ThingIndex: React.FC<IProps> = ({ species, selectable, checkedList }) => {
  const [tabKey, setTabKey] = useState(0);
  const [thingId, setThingId] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [treeData, setTreeData] = useState<any>();
  const [checkRecords, setCheckRecords] = useState<any[]>(checkedList || []);
  // const lookForAll = (data: any[], arr: any[]): any[] => {
  //   for (let item of data) {
  //     arr.push(item);
  //     if (item.children && item.children.length) {
  //       lookForAll(item.children, arr);
  //     }
  //   }
  //   return arr;
  // };
  const init = async () => {
    const species = await thingCtrl.loadSpeciesTree();
    let tree = toTreeData([species]);
    setTreeData(tree);
  };
  useEffect(() => {
    setTabKey(0);
    init();
  }, [species]);

  const toTreeData = (species: any[]): any[] => {
    return species.map((t) => {
      return {
        label: t.name,
        value: t.id,
        children: toTreeData(t.children),
      };
    });
  };
  switch (tabKey) {
    case 0:
      return (
        <Thing
          current={species}
          checkedList={checkRecords}
          selectable={selectable}
          setTabKey={setTabKey}
          setThingId={setThingId}
          menuItems={[
            {
              key: 'listStore',
              label: '上架商店',
              click(data) {
                console.log(data);
              },
            },
            {
              key: 'nft',
              label: '生成NFT',
              click(data) {
                console.log(data);
              },
            },
            {
              key: 'assign',
              label: '分配',
              click(data) {
                console.log(data);
              },
            },
            {
              key: 'share',
              label: '共享',
              click(data) {
                console.log(data);
              },
            },
            {
              key: 'handle',
              label: '处置',
              click(data) {
                console.log(data);
              },
            },
          ]}
          toolBarItems={
            [
              // <Item key={getUuid()}>
              //   <span>标签筛选： </span>
              //   <span>
              //     <TreeSelect
              //       showSearch
              //       style={{ width: '500px' }}
              //       value={tags}
              //       dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              //       placeholder="请选择标签"
              //       allowClear
              //       multiple
              //       onChange={(val) => {
              //         setTags(val);
              //         let array = [
              //           { item: species },
              //           ...thingCtrl.speciesList
              //             .filter((sp) => val.includes(sp.id))
              //             .map((sp) => {
              //               return { item: sp };
              //             }),
              //         ];
              //         setCheckRecords(array);
              //       }}
              //       treeData={treeData}
              //     />
              //   </span>
              // </Item>,
            ]
          }
        />
      );
    case 1:
      return <ThingView thingId={thingId} setTabKey={setTabKey} />;
    default:
      return <></>;
  }
};
export default ThingIndex;
