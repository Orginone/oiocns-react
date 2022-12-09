/* eslint-disable no-unused-vars */
import { SearchOutlined } from '@ant-design/icons';
import * as im from 'react-icons/im';
import { Input, Tree, TreeProps } from 'antd';
import StoreClassifyTree from '@/components/CustomTreeComp';
import React, { useState, useEffect } from 'react';
import ShareShowComp from './ShareShowComp';
import cls from './index.module.less';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ITarget, TargetType } from '@/ts/core';
import { XIdentity, XTarget } from '@/ts/base/schema';
import { generateUuid } from '@/ts/base/common';
export type ResultType = {
  id: string;
  target: XTarget;
  identitys: XIdentity[];
};
interface Iprops {
  onCheckeds?: (selects: ResultType[]) => void;
}
const ShareRecent = (props: Iprops) => {
  const [key, setKey] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [identitys, setIdentitys] = useState<any[]>([]);
  const [current, setCurrent] = useState<ResultType>();
  const [resultData, setResultData] = useState<ResultType[]>([]);

  const loadTeamTree = async () => {
    const targets = await userCtrl.space.loadSubTeam(false);
    setData(buildTargetTree(targets));
  };

  /** 加载组织树 */
  const buildTargetTree = (targets: ITarget[]) => {
    const result: any[] = [];
    if (targets) {
      for (const item of targets) {
        result.push({
          key: item.id,
          title: item.name,
          item: item,
          isLeaf: false,
          icon: getIcon(item.teamName as TargetType),
          children: buildTargetTree(item.subTeam),
        });
      }
    }
    return result;
  };

  const getIcon = (type: TargetType) => {
    switch (type) {
      case TargetType.Working:
        return <im.ImUsers />;
      default:
        return <im.ImTree />;
    }
  };

  useEffect(() => {
    loadTeamTree();
  }, []);

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
        return {
          title: i.name,
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
    changedChecked(info.node.key as string, info.checked);
  };

  const changedChecked = (key: string, add: boolean) => {
    if (current) {
      for (const item of identitys) {
        if (item.key === key) {
          if (add) {
            current.identitys.push(item.data);
          } else {
            current.identitys = current.identitys.filter((i: any) => {
              return i.id != item.key;
            });
          }
          setKey(generateUuid());
          props.onCheckeds?.apply(this, [resultData]);
        }
      }
    }
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

  return (
    <div className={cls.layout}>
      <div className={cls.content}>
        <div className={cls.leftContent}>
          <StoreClassifyTree
            className={cls.docTree}
            title={'内设机构'}
            isDirectoryTree
            menu={'menus'}
            searchable
            showIcon
            treeData={data}
            onSelect={onSelect}
          />
        </div>
        <div className={cls.center}>
          <Input
            className={cls.centerInput}
            prefix={<SearchOutlined />}
            placeholder="搜索"
          />
          <div id={key} className={cls.centerContent}>
            <Tree
              checkable
              autoExpandParent={true}
              onCheck={onCheck}
              treeData={identitys}
              checkedKeys={getSelectKeys()}
            />
          </div>
        </div>
        <div id={key} style={{ width: '33%' }} className={cls.right}>
          <ShareShowComp
            departData={getSelectData()}
            deleteFuc={() => {}}></ShareShowComp>
        </div>
      </div>
    </div>
  );
};

export default ShareRecent;
