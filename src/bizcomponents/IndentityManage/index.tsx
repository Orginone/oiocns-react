/* eslint-disable no-unused-vars */
import { TreeProps } from 'antd';
import StoreClassifyTree from '@/components/CustomTreeComp';
import React, { useState, useEffect } from 'react';
import ShareShowComp from './ShareShowComp';
import cls from './index.module.less';
import orgCtrl from '@/ts/controller';
import { ISpace, ITarget } from '@/ts/core';
import { XIdentity, XTarget } from '@/ts/base/schema';
import { generateUuid } from '@/ts/base/common';
import TeamIcon from '../GlobalComps/teamIcon';
export type ResultType = {
  id: string;
  target: XTarget;
  identitys: XIdentity[];
};
interface Iprops {
  multiple: boolean;
  orgId?: string;
  space: ISpace;
  onChecked?: (select: ResultType) => void;
  onCheckeds?: (selects: ResultType[]) => void;
}
const ShareRecent = (props: Iprops) => {
  const [key, setKey] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [identitys, setIdentitys] = useState<any[]>([]);
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

  const onSelect: TreeProps['onSelect'] = async (_, info: any) => {
    const item: ITarget = info.node.item;
    if (item) {
      const index = resultData.findIndex((i) => {
        return i.id === item.id;
      });
      if (index > -1) {
        setCurrent(resultData[index]);
      } else {
        const newItem: ResultType = {
          id: item.id,
          target: item.target,
          identitys: [],
        };
        resultData.push(newItem);
        setResultData(resultData);
        setCurrent(newItem);
      }
      await item.loadSubTeam();
      loadTeamTree();
      const result = (await item.getIdentitys()).map((i) => {
        // i.target.name = `[${item.name}]` + i.target.name;
        return {
          title: `[${item.name}]` + i.name,
          key: i.id,
          data: i.target,
        };
      });
      setIdentitys(result);
    }
    setKey(generateUuid());
  };
  // 中间树形点击事件
  const onCheck: TreeProps['onCheck'] = (_, info) => {
    const item = getIdentityItem(info.node.key);
    if (current && item) {
      if (info.checked) {
        current.identitys.push(item.data);
      } else {
        current.identitys = current.identitys.filter((i: any) => {
          return i.id != item.key;
        });
      }
      setKey(generateUuid());
      props.onCheckeds?.apply(this, [resultData]);
    }
  };

  const getIdentityItem = (key: string | number) => {
    for (const item of identitys) {
      if (item.key === key) {
        return item;
      }
    }
    return undefined;
  };

  const getSelectData = () => {
    const result = [];
    for (const item of resultData) {
      for (const id of item.identitys) {
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
      return current.identitys.map((item) => item.id);
    }
    return [];
  };

  const deleteItem = (id: string) => {
    for (const item of resultData) {
      item.identitys = item.identitys.filter((i) => {
        return i.id != id;
      });
    }
    setKey(generateUuid());
  };

  return (
    <div id={key} className={cls.layout}>
      <div className={cls.content}>
        <div className={`${props.multiple ? cls.leftContent : cls.newLeftContent}`}>
          <StoreClassifyTree
            className={cls.docTree}
            isDirectoryTree
            searchable
            showIcon
            treeData={data}
            onSelect={onSelect}
          />
        </div>
        <div className={`${props.multiple ? cls.center : cls.newCenter}`}>
          <StoreClassifyTree
            className={cls.docTree}
            searchable
            showIcon
            checkable={props.multiple}
            multiple={props.multiple}
            autoExpandParent={true}
            onCheck={onCheck}
            onSelect={(_: any, info: any) => {
              props.onChecked?.apply(this, [getIdentityItem(info.node.key)]);
            }}
            treeData={identitys}
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

export default ShareRecent;
