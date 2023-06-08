/* eslint-disable no-unused-vars */
import { TreeProps } from 'antd';
import CustomTree from '@/components/CustomTree';
import React, { useState } from 'react';
import ShareShowComp from './ShareShowComp';
import cls from './index.module.less';
import { IBelong, IIdentity, ITarget } from '@/ts/core';
import { XTarget } from '@/ts/base/schema';
import { generateUuid } from '@/ts/base/common';
import EntityIcon from '../GlobalComps/entityIcon';
export type ResultType = {
  id: string;
  target: XTarget;
  identitys: IIdentity[];
};
interface Iprops {
  multiple: boolean;
  space: IBelong;
  onChecked?: (select: ResultType) => void;
  onCheckeds?: (selects: ResultType[]) => void;
}
const ShareRecent = (props: Iprops) => {
  const [key, setKey] = useState<string>('');
  const [identitys, setIdentitys] = useState<any[]>([]);
  const [current, setCurrent] = useState<ResultType>();
  const [resultData, setResultData] = useState<ResultType[]>([]);
  /** 加载组织树 */
  const buildTargetTree = (targets: ITarget[]) => {
    const result: any[] = [];
    if (targets) {
      for (const item of targets) {
        result.push({
          key: item.id,
          title: item.name,
          item: item,
          isLeaf: item.subTarget.length === 0,
          icon: <EntityIcon typeName={item.typeName} entityId={item.id} size={18} />,
          children: buildTargetTree(item.subTarget),
        });
      }
    }
    return result;
  };
  const agency = buildTargetTree(props.space.shareTarget);

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
          target: item.metadata,
          identitys: [],
        };
        resultData.push(newItem);
        setResultData(resultData);
        setCurrent(newItem);
      }
      const result = (await item.loadIdentitys()).map((i) => {
        return {
          title: `[${item.name}]` + i.name,
          key: i.id,
          data: i,
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
    for (const data of resultData) {
      for (const item of data.identitys) {
        result.push({
          id: item.id,
          name: `[${item.current.name}]` + item.name,
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
          <CustomTree
            className={cls.docTree}
            isDirectoryTree
            searchable
            showIcon
            treeData={agency}
            onSelect={onSelect}
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
