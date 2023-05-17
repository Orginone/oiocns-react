/* eslint-disable no-unused-vars */
import { TreeProps } from 'antd';
import CustomTree from '@/components/CustomTree';
import React, { useState, useEffect } from 'react';
import ShareShowComp from './ShareShowComp';
import cls from './index.module.less';
import orgCtrl from '@/ts/controller';
import { ISpace, ITarget } from '@/ts/core';
import { XFlowDefine } from '@/ts/base/schema';
import { generateUuid } from '@/ts/base/common';
import TeamIcon from '../GlobalComps/teamIcon';
import { INullSpeciesItem, ISpeciesItem } from '@/ts/core/target/thing/ispecies';
import { loadSpeciesTree } from '@/ts/core/target/thing';
export type ResultType = {
  id: string;
  target: ISpeciesItem;
  flows: XFlowDefine[];
};
interface Iprops {
  multiple: boolean;
  orgId?: string;
  space: ISpace;
  onCheckeds?: (selects: ResultType[]) => void;
}
const FlowSelect = (props: Iprops) => {
  const [key, setKey] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [species, setSpecies] = useState<any[]>([]);
  const [flows, setFlows] = useState<any[]>([]);
  const [current, setCurrent] = useState<ResultType>();
  const [resultData, setResultData] = useState<ResultType[]>([]);

  const loadTeamTree = async () => {
    const targets = await orgCtrl.getTeamTree(props.space);
    setData(buildTargetTree(targets, false));
  };

  /** 加载组织树 */
  const buildTargetTree = (targets: ITarget[], isChild: boolean) => {
    const result: any[] = [];
    if (targets) {
      for (const item of targets) {
        if (props.orgId && !isChild) {
          if (item.id == props.orgId) {
            result.push({
              key: item.id,
              title: item.name,
              item: item,
              isLeaf: item.subTeam.length === 0,
              icon: <TeamIcon share={item.shareInfo} size={18} />,
              children: buildTargetTree(item.subTeam, true),
            });
          } else {
            let children = buildTargetTree(item.subTeam, false);
            for (let child of children) {
              result.push(child);
            }
          }
        } else {
          result.push({
            key: item.id,
            title: item.name,
            item: item,
            isLeaf: item.subTeam.length === 0,
            icon: <TeamIcon share={item.shareInfo} size={18} />,
            children: buildTargetTree(item.subTeam, isChild),
          });
        }
      }
    }
    return result;
  };

  useEffect(() => {
    loadTeamTree();
  }, [props.orgId]);

  const loadThingSpecies = async (root: ISpeciesItem[]) => {
    for (const item of root) {
      if (item.target.code === 'matters') {
        let res = await buildSpeciesTree(item.children);
        return res;
      }
    }
    return [];
  };

  const buildSpeciesTree = async (species: ISpeciesItem[]): Promise<any[]> => {
    var result: any[] = [];
    for (let item of species) {
      result.push({
        key: item.id,
        item: item,
        title: item.name,
        icon: undefined,
        children: await buildSpeciesTree(item.children),
      });
    }
    return result;
  };
  // 中间树形选中
  const onCenterSelect: TreeProps['onSelect'] = async (_, info: any) => {
    const item: INullSpeciesItem = info.node.data;
    if (item) {
      const index = resultData.findIndex((i) => {
        return i.id === item.id;
      });
      if (index > -1) {
        setCurrent(resultData[index]);
      } else {
        const newItem: ResultType = {
          id: item.id,
          target: item,
          flows: [],
        };
        resultData.push(newItem);
        setResultData(resultData);
        setCurrent(newItem);
      }
      let data = await item.loadFlowDefine();
      const result = data.map((i) => {
        return {
          title: i.name,
          key: i.id,
          data: i.target,
        };
      });
      setFlows(result);
    }
    setKey(generateUuid());
  };

  const onSelect: TreeProps['onSelect'] = async (_, info: any) => {
    const item: ITarget = info.node.item;
    if (item) {
      // const index = resultData.findIndex((i) => {
      //   return i.id === item.id;
      // });
      // if (index > -1) {
      //   setCurrent(resultData[index]);
      // } else {
      //   const newItem: ResultType = {
      //     id: item.id,
      //     target: item.target,
      //     flows: [],
      //   };
      //   resultData.push(newItem);
      //   setResultData(resultData);
      //   setCurrent(newItem);
      // }
      await item.loadSubTeam();
      loadTeamTree();
      let thingSpeciesTree = await loadThingSpecies(
        await loadSpeciesTree(item.id, item.target.belongId),
      );
      const result = thingSpeciesTree.map((i) => {
        return {
          title: i.item.name,
          key: i.item.id,
          data: i.item,
        };
      });
      setSpecies(result);
    }
    setKey(generateUuid());
  };
  // 右侧树形点击事件
  const onCheck: TreeProps['onCheck'] = (_, info) => {
    const item = getItemByKey(info.node.key);
    if (current && item) {
      if (info.checked) {
        current.flows.push(item.data);
      } else {
        current.flows = current.flows.filter((i: any) => {
          return i.id != item.key;
        });
      }
      setKey(generateUuid());
      props.onCheckeds?.apply(this, [resultData]);
    }
  };

  const getItemByKey = (key: string | number) => {
    for (const item of flows) {
      if (item.key === key) {
        return item;
      }
    }
    return undefined;
  };

  const getSelectData = () => {
    const result: any[] = [];
    for (const item of resultData) {
      for (const id of item.flows) {
        result.push({
          id: id.id,
          name: id.name,
          type: 'add',
        });
      }
    }
    return result;
  };

  const getSelectKeys = () => {
    if (current) {
      return current.flows.map((item) => item.id);
    }
    return [];
  };

  const deleteItem = (id: string) => {
    for (const item of resultData) {
      item.flows = item.flows.filter((i) => {
        return i.id != id;
      });
    }
    setKey(generateUuid());
  };

  return (
    <div id={key} className={cls.layout}>
      <div className={cls.content}>
        <div className={`${props.multiple ? cls.leftContent : cls.newLeftContent}`}>
          <CustomTree
            className={cls.docTree}
            isDirectoryTree
            searchable
            showIcon
            treeData={data}
            onSelect={onSelect}
          />
        </div>
        <div className={`${props.multiple ? cls.center : cls.newCenter}`}>
          <CustomTree
            className={cls.docTree}
            searchable
            showIcon
            autoExpandParent={true}
            onSelect={(_: any, info: any) => onCenterSelect(_, info)}
            treeData={species}
          />
        </div>
        <div className={`${props.multiple ? cls.center : cls.newCenter}`}>
          <CustomTree
            className={cls.docTree}
            searchable
            showIcon
            checkable={props.multiple}
            multiple={props.multiple}
            autoExpandParent={true}
            onCheck={onCheck}
            onSelect={(_: any, info: any) => {
              props.onCheckeds?.call(this, [getItemByKey(info.node.key)]);
            }}
            treeData={flows}
            checkedKeys={getSelectKeys()}
          />
        </div>
        {props.multiple ? (
          <div
            id={key}
            style={{ width: `${props.multiple ? '33%' : '50%'}` }}
            className={cls.right}>
            <ShareShowComp
              departData={getSelectData()}
              deleteFuc={(id: string) => {
                deleteItem(id);
              }}></ShareShowComp>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default FlowSelect;
