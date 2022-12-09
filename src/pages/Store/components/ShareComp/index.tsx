/* eslint-disable no-unused-vars */
import { SearchOutlined } from '@ant-design/icons';
import { Input, Radio, RadioChangeEvent, Tree, TreeProps } from 'antd';
import React, { useState, useEffect, Key } from 'react';
import ShareShowComp from '../ShareShowComp';
import cls from './index.module.less';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { kernel } from '@/ts/base';
import appCtrl from '@/ts/controller/store/appCtrl';
import { ITarget } from '@/ts/core';
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
    label: '角色',
  },
  {
    value: 3,
    label: '岗位',
  },
  {
    value: 4,
    label: '人员',
  },
];
//个人空间-展示我的群组  ; 单位空间 - 分配
const ShareRecent = (props: Iprops) => {
  const { onCheckeds, shareType } = props;
  const [isCompanySpace] = useState<boolean>(userCtrl.isCompanySpace); //是否工作空间
  const [leftTreeSelectedKeys, setLeftTreeSelectedKeys] = useState<Key[]>([]); //集团列表

  const [resourceList, setResourceList] = useState<any[]>([]); //所选应用的资源列表
  const [radio, setRadio] = useState<number>(1); //分配类型
  const [pageCurrent, setPageCurrent] = useState({ filter: '', limit: 1000, offset: 0 });
  const [leftTreeData, setLeftTreeData] = useState<any>([]);
  const [centerTreeData, setCenterTreeData] = useState<any>([]);
  const [departData, setDepartData] = useState<any[]>([]); // raido=1 数据
  const [departHisData, setDepartHisData] = useState<any[]>([]); // radio=1 历史数据
  const [authorData, setAuthorData] = useState<any[]>([]); // raido=2 数据
  const [authorHisData, setAuthorHisData] = useState<any[]>([]); //raido=2 历史数据
  const [personsData, setPersonsData] = useState<any[]>([]); //raido=3 数据
  const [personsHisData, setPersonsHisData] = useState<any[]>([]); //raido=3 历史数据
  const [identitysData, setIdentitysData] = useState<any[]>([]); //raido=4 数据
  const [identitysHisData, setIdentitysHisData] = useState<any[]>([]); //raido=4 历史数据
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [hasSelectRecord, setHasSelectRecord] = useState<{ list: any; type: string }>(
    {} as any,
  );
  let recordShareInfo = new Map();

  useEffect(() => {
    setTimeout(async () => {
      if (appCtrl.curProduct) {
        if (shareType === '共享') {
          setLeftTreeData(await userCtrl.getTeamTree());
        } else {
          if (userCtrl.isCompanySpace) {
            const resource = appCtrl.curProduct.resource || [];
            setResourceList(resource);
          }
          setLeftTreeData(await userCtrl.getTeamTree(false));
        }
        await appCtrl.curProduct.queryExtend('组织', '');
      }
    }, 10);
  }, []);
  useEffect(() => {
    setDepartData([]);
    setAuthorData([]);
    setPersonsData([]);
    setIdentitysData([]);
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
    curData[_teamId] = await appCtrl.curProduct?.queryExtend(_type, _teamId);
    recordShareInfo.set(_type, curData);
    console.log('请求分配列表', teamId, curData[_teamId]);
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
    setDepartData([]);
    setAuthorData([]);
    setPersonsData([]);
    setIdentitysData([]);
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
          /** TODO 分页查询成员 */
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
  // 左侧树点击事件
  const handleCheckChange: TreeProps['onCheck'] = (checkedKeys, info: any) => {
    console.log('点击左侧', checkedKeys, info);
    if (info.checked) {
      let result = departHisData.some((item: any) => {
        return item.id == info.node.id;
      });
      for (let i = 0; i < departData.length; i++) {
        if (departData[i].id == info.node.id) {
          if (info.node.type == 'add') {
            return;
          } else if (info.node.type == 'has') {
            return;
          }
        }
      }
      if (result) {
        if (info.node.type == 'del') {
          info.node.type = 'has';
          departData.forEach((el: any) => {
            if (el.id == info.node.id) {
              el.type = 'has';
            }
          });
          return;
        } else {
          info.node.type = 'has';
          departData.push(info.node);
        }
      } else {
        info.node.type = 'add';
        departData.push(info.node);
      }
    } else {
      let result = departHisData.some((item: any) => {
        return item.id == info.node.id;
      });
      departData.forEach((el: any, index: number) => {
        if (el.id == info.node.id) {
          if (result) {
            el.type = 'del';
            info.node.type = 'del';
          } else {
            departData.splice(index, 1);
          }
        }
      });
    }
    handelCheckedChange(checkedKeys);

    setDepartData([...departData]);
  };
  // 中间树形点击事件
  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
    console.log('内容1111111111', info);
    if (info.checked) {
      if (radio == 2) {
        handleBoxClick(authorHisData, authorData, info.node);
        setAuthorData(authorData);
      } else if (radio == 3) {
        handleBoxClick(personsHisData, personsData, info.node);
        setIdentitysData(personsData);
      } else {
        handleBoxClick(identitysHisData, identitysData, info.node);
        setPersonsData(identitysData);
      }
    } else {
      if (radio == 2) {
        handleBoxCancelClick(authorHisData, authorData, info.node);
        setAuthorData(authorData);
      } else if (radio == 3) {
        handleBoxCancelClick(personsHisData, personsData, info.node);
        setIdentitysData(personsData);
      } else {
        handleBoxCancelClick(identitysHisData, identitysData, info.node);
        setPersonsData(identitysData);
      }
    }
    setHasSelectRecord({ type: DestTypes[radio - 1].label, list: checkedKeys });
    handelCheckedChange(checkedKeys);
  };
  // 点击删除
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

  return (
    <div className={cls.layout}>
      {/* {shareType === '分配' ? (
        <div className={cls.top}>
          <p className={cls['top-label']}>分配集团:</p>
          <Select
            style={{ minWidth: 160 }}
            onChange={handleCompanyChange}
            options={CompanyList.map((comp) => {
              return {
                value: comp.target.id,
                label: comp.target.name,
              };
            })}
          />
        </div>
      ) : (
        ''
      )} */}
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
                按
                {isCompanySpace && shareType === '共享' && item.label === '人员'
                  ? '单位'
                  : isCompanySpace && shareType === '共享' && item.label === '组织'
                  ? '集团'
                  : item.label}
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
            <Tree
              checkable={radio !== 1 ? false : true}
              fieldNames={{
                title: 'name',
                key: 'id',
                children: 'subTeam',
              }}
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
              <Tree
                checkable
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
          <ShareShowComp
            departData={
              radio == 1
                ? departData
                : radio == 2
                ? authorData
                : radio == 3
                ? personsData
                : identitysData
            }
            deleteFuc={() => {}}></ShareShowComp>
        </div>
      </div>
    </div>
  );
};

export default ShareRecent;
