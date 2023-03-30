/* eslint-disable no-unused-vars */
import { SearchOutlined } from '@ant-design/icons';
import { Input, Radio, RadioChangeEvent, Tree, TreeProps } from 'antd';
import React, { useState, useEffect, Key } from 'react';
import ShareShowComp from '../ShareShowComp';
import cls from './index.module.less';
import userCtrl from '@/ts/controller/setting';
import appCtrl from '@/ts/controller/store/appCtrl';
import { ICompany, IResource, ITarget } from '@/ts/core';
import CustomTree from '@/components/CustomTreeComp';
interface Iprops {
  shareType: '分配' | '共享';
  onCheckeds?: (
    teamId: string,
    type: string,
    createList: string[],
    delList: string[],
    selectedResourceId: string | null,
  ) => void;
}
const DestTypes = [
  {
    value: 1,
    label: '组织',
  },
  {
    value: 2,
    label: '权限',
  },
  {
    value: 3,
    label: '角色',
  },
  {
    value: 4,
    label: '人员',
  },
];
const updateTreeData = (list: any[], key: React.Key, children: any[]): any[] =>
  list.map((node) => {
    if (node.id === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
//个人空间-只有共享 展示我的群组/好友  ; 单位空间 - 共享/分配 集团单位 部门
let originalSelected: any[] = []; //存储当前选择 以获分配数据

const ShareRecent = (props: Iprops) => {
  const { onCheckeds, shareType } = props;
  const [leftTreeSelectedKeys, setLeftTreeSelectedKeys] = useState<Key[]>([]); //集团列表
  const [leftCheckedKeys, setLeftCheckedKeys] = useState<Key[]>([]);

  const [resourceList, setResourceList] = useState<any[]>([]); //所选应用的资源列表
  const [curResourceId, setCurResourceId] = useState<string | null>(null);
  const [radio, setRadio] = useState<number>(1); //分配类型
  const [leftTreeData, setLeftTreeData] = useState<any>([]);
  const [centerTreeData, setCenterTreeData] = useState<any>([]);
  const [showData, setShowData] = useState<any[]>([]);
  const [centerCheckedKeys, setCenterCheckedKeys] = useState<Key[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [hasSelectRecord, setHasSelectRecord] = useState<{
    createList: string[];
    delList: string[];
    type: string;
  }>({} as any);
  // 记录当前选择分享信息
  let recordShareInfo = new Map();

  useEffect(() => {
    setTimeout(async () => {
      if (appCtrl.curProduct) {
        if (shareType === '共享') {
          setLeftTreeData(userCtrl.buildTargetTree(await userCtrl.getTeamTree()));
          await appCtrl.curProduct.queryExtend('组织');
        } else {
          if (userCtrl.isCompanySpace) {
            const resource = appCtrl.curProduct.resource || [];
            setResourceList(resource);
            if (resource?.length > 0) {
              let res = await resource[0].queryExtend('组织');
              setShowData([...(res.result || [])]);
              setCurResourceId(resource[0].resource.id);
            }
          }
          setLeftTreeData(userCtrl.buildTargetTree(await userCtrl.getTeamTree(false)));
        }
      }
    }, 10);
  }, []);
  useEffect(() => {
    // 展示区置空
    setShowData([]);
    // 左侧树置空
    setCenterTreeData([]);
    // 左侧树 选中置空
    setLeftTreeSelectedKeys([]);
    // 当前所选组织置空
    setSelectedTeamId('0');
    //中间树 选中置空
    setCenterCheckedKeys([]);
    // 重新请求 已分享/分配数据
    queryExtend();
  }, [radio]);

  const getCurResource = () => {
    return resourceList.find((v) => v.resource.id === curResourceId);
  };
  // 修改选中 提交修改selectAuthorityTree
  const handelCheckedChange = (createList: string[], delList: string[]) => {
    onCheckeds &&
      onCheckeds(
        selectedTeamId,
        DestTypes[radio - 1].label,
        createList,
        delList,
        curResourceId,
      );
  };
  // 获取已分享数据
  const queryExtend = async (type?: string, teamId?: string) => {
    const _type = type || DestTypes[radio - 1].label;
    const _teamId = teamId || selectedTeamId || '0';
    let curData = recordShareInfo.has(_type) ? recordShareInfo.get(_type) : {};
    // 判断是资源分配 还是 应用共享
    let Target = curResourceId ? getCurResource() : appCtrl.curProduct;
    if (!Target) {
      return;
    }
    const { result = [] } = (await Target.queryExtend(_type, _teamId)) || {
      result: [],
    };
    curData[_teamId] = result;

    recordShareInfo.set(_type, curData);
    setShowData(result);
    // 设置最初 选中记录
    originalSelected = result.map((v: any) => v.id) || [];

    if (radio === 1) {
      setLeftCheckedKeys([...originalSelected]);
    } else {
      setCenterCheckedKeys([...originalSelected]);
    }
  };
  const onSelect: TreeProps['onSelect'] = async (selectedKeys, info: any) => {
    const item: ITarget = info.node.item;
    setLeftTreeSelectedKeys(selectedKeys);
    if (hasSelectRecord?.type) {
      let Target = curResourceId ? getCurResource() : appCtrl.curProduct;
      if (hasSelectRecord?.createList.length > 0) {
        let res = await Target.createExtend(
          selectedTeamId,
          hasSelectRecord.createList,
          hasSelectRecord.type,
        );
        console.log('新增', res);
      }
      if (hasSelectRecord?.delList.length > 0) {
        let res = await Target.deleteExtend(
          selectedTeamId,
          hasSelectRecord.delList,
          hasSelectRecord.type,
        );
        console.log('减少', res);
      }
    }

    setSelectedTeamId(item.id);
    setCenterTreeData([]);

    switch (radio) {
      case 2: {
        /** 权限 */
        const res = await item.loadAuthorityTree();
        let data = handleTreeData(res, info.node.id);
        setCenterTreeData([data]);
        break;
      }
      case 3: {
        /** 角色 */
        setCenterTreeData(await item.getIdentitys());
        break;
      }
      case 4:
        {
          setCenterTreeData(
            (
              await item.loadMembers({
                limit: 10000,
                offset: 0,
                filter: '',
              })
            ).result,
          );
        }
        break;
      default:
        break;
    }
  };
  const handleTreeData = (node: any, belongId: string) => {
    node.disabled = !(node.belongId && node.belongId == belongId);
    if (node.children) {
      node.nodes = node.children.map((child: any) => {
        return handleTreeData(child, belongId);
      });
    }
    //判断是否有操作权限
    return { ...node._authority, node };
  };
  // 左侧树选中事件
  const handleCheckChange: TreeProps['onCheck'] = (checkedKeys, info: any) => {
    // console.log('点击左侧', checkedKeys, info, info.checked);
    Array.isArray(checkedKeys) && setLeftCheckedKeys(checkedKeys);
    // 是否原始 分配数据
    const isOriginal = originalSelected.includes(info.node.id);

    let newArr = showData.filter((v) => v.id !== info.node.id);
    let obj = {
      id: info.node.id,
      name: info.node.name,
      type: 'has',
    };
    let newShowData = [...newArr];
    if (info.checked) {
      obj.type = isOriginal ? 'has' : 'add';
      newShowData = [...newArr, obj];
    } else {
      if (isOriginal) {
        obj.type = 'del';
        newShowData = [...newArr, obj];
      }
    }
    setShowData(newShowData);
    let createList = newShowData.filter((v) => v.type === 'add').map((i) => i.id); //需要创建
    let delList = newShowData.filter((v) => v.type === 'del').map((i) => i.id); //需要删除
    setHasSelectRecord({
      type: DestTypes[radio - 1].label,
      createList,
      delList,
    });
    handelCheckedChange(createList, delList);
  };
  // 中间树形点击事件
  const onCheck: TreeProps['onCheck'] = (checkedKeys, info: any) => {
    // console.log('onCheck', checkedKeys, info);
    if (Array.isArray(checkedKeys)) {
      setCenterCheckedKeys(checkedKeys);
    }
    const isOriginal = originalSelected.includes(info.node.id);

    let newArr = showData.filter((v: any) => {
      return v.id !== info.node.id;
    });
    let obj = {
      id: info.node.id,
      name: info.node.name,
      type: 'has',
    };

    let newShowData = [...newArr];
    if (info.checked) {
      obj.type = isOriginal ? 'has' : 'add';
      newShowData = [...newArr, obj];
    } else {
      if (isOriginal) {
        obj.type = 'del';
        newShowData = [...newArr, obj];
      }
    }
    setShowData(newShowData);
    let createList = newShowData.filter((v) => v.type === 'add').map((i) => i.id); //需要创建
    let delList = newShowData.filter((v) => v.type === 'del').map((i) => i.id); //需要删除
    setHasSelectRecord({
      type: DestTypes[radio - 1].label,
      createList,
      delList,
    });
    handelCheckedChange(createList, delList);
  };
  // 点击删除
  const handelDel = (id: string) => {
    const isOriginal = originalSelected.includes(id);
    let arr = [];
    if (isOriginal) {
      arr = showData.map((v) => {
        if (v.id === id) {
          v.type = 'del';
        }
        return v;
      });
    } else {
      arr = showData.filter((v) => {
        return v.id !== id;
      });
    }

    setShowData(arr);

    if (radio == 1) {
      setLeftCheckedKeys(
        leftCheckedKeys.filter((v) => {
          return v !== id;
        }),
      );
    } else {
      setCenterCheckedKeys(
        centerCheckedKeys.filter((v) => {
          return v !== id;
        }),
      );
    }
    let createList = showData.filter((v) => v.type === 'add').map((i) => i.id); //需要创建
    let delList = showData.filter((v) => v.type === 'del').map((i) => i.id); //需要删除

    handelCheckedChange(createList, delList);
  };

  const onLoadData = ({ id, children, item }: any) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (resolve) => {
      if (children?.length > 0) {
        resolve();
        return;
      }
      const company: ICompany = item;
      const dept = await company.getDepartments(false);
      const arr =
        dept?.map((v) => {
          return {
            ...v.target,
            item: v,
          };
        }) || [];
      setLeftTreeData((origin: any) => updateTreeData(origin, id, arr));
      resolve();
    });
  };
  //resourceList
  return (
    <div className={cls.layout}>
      <div className={cls.top}>
        <p className={cls['top-label']}>应用资源：</p>
        <Radio.Group
          value={curResourceId}
          onChange={(e: RadioChangeEvent) => {
            setCurResourceId(e.target.value);
          }}>
          {resourceList.map((item) => {
            return (
              <Radio value={item.resource.id} key={item.resource.id}>
                {item.resource.name}
              </Radio>
            );
          })}
        </Radio.Group>
      </div>
      <div className={cls.top}>
        <p className={cls['top-label']}>{props.shareType}形式：</p>
        <Radio.Group
          onChange={(e: RadioChangeEvent) => {
            setRadio(e.target.value);
          }}
          value={radio}>
          {DestTypes.map((item) => {
            return (
              <Radio value={item.value} key={item.value}>
                按{item.label}
                {props.shareType}
              </Radio>
            );
          })}
        </Radio.Group>
      </div>
      <div className={cls.content}>
        <div style={{ width: radio !== 1 ? '33%' : '50%' }} className={cls.left}>
          <Input
            className={cls.leftInput}
            prefix={<SearchOutlined />}
            placeholder="请设置关键字"
          />
          <div className={cls.leftContent}>
            <CustomTree
              checkable={radio !== 1 ? false : true}
              loadData={onLoadData}
              fieldNames={{
                title: 'name',
                key: 'id',
                children: 'children',
              }}
              checkedKeys={leftCheckedKeys}
              autoExpandParent={true}
              selectedKeys={leftTreeSelectedKeys}
              onSelect={onSelect}
              onCheck={handleCheckChange}
              treeData={leftTreeData}
            />
          </div>
        </div>
        {radio !== 1 ? (
          <div className={cls.center}>
            <Input
              className={cls.centerInput}
              prefix={<SearchOutlined />}
              placeholder="搜索"
            />
            <div className={cls.centerContent}>
              <CustomTree
                checkable
                checkedKeys={centerCheckedKeys}
                autoExpandParent={true}
                fieldNames={{
                  title: 'name',
                  key: 'id',
                  children: 'nodes',
                }}
                onCheck={onCheck}
                treeData={centerTreeData}
              />
            </div>
          </div>
        ) : (
          ''
        )}
        <div style={{ width: radio !== 1 ? '33%' : '50%' }} className={cls.right}>
          <ShareShowComp departData={showData} deleteFuc={handelDel}></ShareShowComp>
        </div>
      </div>
    </div>
  );
};

export default ShareRecent;
