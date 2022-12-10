/* eslint-disable no-unused-vars */
import { SearchOutlined } from '@ant-design/icons';
import { Input, Radio, RadioChangeEvent, Tree, TreeProps } from 'antd';
import React, { useState, useEffect, Key } from 'react';
import ShareShowComp from '../ShareShowComp';
import cls from './index.module.less';
import userCtrl from '@/ts/controller/setting/userCtrl';
import appCtrl from '@/ts/controller/store/appCtrl';
import { ICompany, ITarget } from '@/ts/core';
import CustomTree from '@/components/CustomTreeComp';
interface Iprops {
  shareType: '分配' | '共享';
  onCheckeds?: (teamId: string, type: string, checkedValus: any) => void;
}
const DestTypes = [
  {
    value: 1,
    label: '组织',
  },
  {
    value: 2,
    label: '职权',
  },
  {
    value: 3,
    label: '身份',
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
const ShareRecent = (props: Iprops) => {
  const { onCheckeds, shareType } = props;
  const [leftTreeSelectedKeys, setLeftTreeSelectedKeys] = useState<Key[]>([]); //集团列表
  const [leftCheckedKeys, setLeftCheckedKeys] = useState<Key[]>([]);

  const [resourceList, setResourceList] = useState<any[]>([]); //所选应用的资源列表
  const [radio, setRadio] = useState<number>(1); //分配类型
  const [leftTreeData, setLeftTreeData] = useState<any>([]);
  const [centerTreeData, setCenterTreeData] = useState<any>([]);
  const [showData, setShowData] = useState<any[]>([]);
  const [centerCheckedKeys, setCenterCheckedKeys] = useState<Key[]>([]);
  let originalSelected: any[] = []; //存储当前选择 以获分配数据
  // const [departData, setDepartData] = useState<any[]>([]); // raido=1 数据
  // const [departHisData, setDepartHisData] = useState<any[]>([]); // radio=1 历史数据
  // const [authorData, setAuthorData] = useState<any[]>([]); // raido=2 数据
  // const [authorHisData, setAuthorHisData] = useState<any[]>([]); //raido=2 历史数据
  // const [personsData, setPersonsData] = useState<any[]>([]); //raido=3 数据
  // const [personsHisData, setPersonsHisData] = useState<any[]>([]); //raido=3 历史数据
  // const [identitysData, setIdentitysData] = useState<any[]>([]); //raido=4 数据
  // const [identitysHisData, setIdentitysHisData] = useState<any[]>([]); //raido=4 历史数据
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [hasSelectRecord, setHasSelectRecord] = useState<{ list: any; type: string }>(
    {} as any,
  );
  let recordShareInfo = new Map();

  useEffect(() => {
    setTimeout(async () => {
      if (appCtrl.curProduct) {
        if (shareType === '共享') {
          setLeftTreeData(userCtrl.buildTargetTree(await userCtrl.getTeamTree()));
        } else {
          if (userCtrl.isCompanySpace) {
            const resource = appCtrl.curProduct.resource || [];
            setResourceList(resource);
          }
          setLeftTreeData(userCtrl.buildTargetTree(await userCtrl.getTeamTree(false)));
        }
        await appCtrl.curProduct.queryExtend('组织');
      }
    }, 10);
  }, []);
  useEffect(() => {
    // setDepartData([]);
    // setAuthorData([]);
    // setPersonsData([]);
    // setIdentitysData([]);
    setShowData([]);
    setCenterTreeData([]);
    setSelectedTeamId('0');
    setLeftTreeSelectedKeys([]);
    queryExtend();
  }, [radio]);

  // 修改选中 提交修改selectAuthorityTree
  const handelCheckedChange = (list: any) => {
    onCheckeds && onCheckeds(selectedTeamId, DestTypes[radio - 1].label, list);
  };
  const queryExtend = async (type?: string, teamId?: string) => {
    const _type = type || DestTypes[radio - 1].label;
    const _teamId = teamId || selectedTeamId || '0';
    let curData = recordShareInfo.has(_type) ? recordShareInfo.get(_type) : {};
    const { result = [] } = (await appCtrl.curProduct?.queryExtend(_type, _teamId)) || {
      result: [],
    };
    curData[_teamId] = result;

    recordShareInfo.set(_type, curData);
    setShowData(result);
    originalSelected = result.map((v) => v.id) || [];
    console.log('初始化', originalSelected);

    if (radio === 1) {
      setLeftCheckedKeys([...originalSelected]);
    } else {
      setCenterCheckedKeys([...originalSelected]);
    }

    console.log('请求分配列表', result, curData[_teamId]);
  };
  const onSelect: TreeProps['onSelect'] = async (selectedKeys, info: any) => {
    const item: ITarget = info.node.item;
    console.log('selected', selectedKeys, info);
    setLeftTreeSelectedKeys(selectedKeys);

    hasSelectRecord?.list?.lenght &&
      appCtrl.curProduct?.createExtend(
        selectedTeamId,
        hasSelectRecord!.list,
        hasSelectRecord!.type,
      );
    setSelectedTeamId(item.id);
    setCenterTreeData([]);

    switch (radio) {
      case 2: {
        /** 职权 */
        const res = await item.selectAuthorityTree();
        let data = handleTreeData(res, info.node.id);
        setCenterTreeData([data]);
        break;
      }
      case 3: {
        /** 身份 */
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
    console.log('点击左侧', checkedKeys, info, info.checked);
    Array.isArray(checkedKeys) && setLeftCheckedKeys(checkedKeys);
    // 是否原始 分配数据
    const isOriginal = originalSelected.includes(info.node.id);

    let newArr = showData.filter((v) => v.id !== info.node.id);
    let obj = {
      id: info.node.id,
      name: info.node.name,
      type: 'has',
    };
    if (info.checked) {
      obj.type = isOriginal ? 'has' : 'add';
      setShowData([...newArr, obj]);
    } else {
      if (isOriginal) {
        obj.type = 'del';
        setShowData([...newArr, obj]);
      } else {
        setShowData([...newArr]);
      }
    }

    handelCheckedChange(checkedKeys);

    // setDepartData([...departData]);
  };
  // 中间树形点击事件
  const onCheck: TreeProps['onCheck'] = (checkedKeys, info: any) => {
    console.log('onCheck', checkedKeys, info);
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
    if (info.checked) {
      obj.type = isOriginal ? 'has' : 'add';
      setShowData([...newArr, obj]);
    } else {
      if (isOriginal) {
        obj.type = 'del';
        setShowData([...newArr, obj]);
      } else {
        setShowData([...newArr]);
      }
    }
    setHasSelectRecord({ type: DestTypes[radio - 1].label, list: checkedKeys });
    // handelCheckedChange(checkedKeys);
  };
  // 点击删除
  const handelDel = (id: string) => {
    console.log('ss', showData, id);

    const arr = showData.filter((v) => {
      return v.id !== id;
    });
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
  };
  // const delContent = (item: any) => {
  //   if (item.type == 'del') {
  //     return;
  //   } else if (item.type == 'add') {
  //     departData.forEach((el: any, index: number) => {
  //       if (el.id == item.id) {
  //         departData.splice(index, 1);
  //         leftTree.value.setChecked(item.id, false);
  //       }
  //     });
  //   } else {
  //     departData.forEach((el: any, index: number) => {
  //       if (el.id == item.id) {
  //         el.type = 'del';
  //         leftTree.value.setChecked(el.id, false);
  //       }
  //     });
  //   }
  // };

  const handleBoxCancelClick = (hisData: any, dataList: any, data: any) => {
    let result = hisData.some((item: any) => {
      return item.id == data.id;
    });
    dataList.forEach((el: any, index: number) => {
      if (el.id == data.id) {
        if (result) {
          data.type = 'del';
          el.type = 'del';
        } else {
          dataList.splice(index, 1);
        }
      }
    });
  };
  const handleBoxClick = (hisData: any, dataList: any, data: any) => {
    let result = hisData.some((item: any) => {
      return item.id == data.id;
    });
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].id == data.id) {
        if (data.type == 'add') {
          return;
        } else if (data.type == 'has') {
          return;
        }
      }
    }

    if (result) {
      data.type = 'has';
      dataList.forEach((el: any) => {
        if (el.id == data.id) {
          el.type = 'has';
        }
      });
    } else {
      data.type = 'add';
      dataList.push(data);
    }
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

  return (
    <div className={cls.layout}>
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
