/* eslint-disable no-unused-vars */
import { SearchOutlined } from '@ant-design/icons';
import { Input, Radio, RadioChangeEvent, Tree, TreeProps } from 'antd';
import React, { useState, useEffect, Key } from 'react';
import ShareShowComp from './ShareShowComp';
import cls from './index.module.less';
// import { productCtrl } from '@/ts/controller/store/productCtrl';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { kernel } from '@/ts/base';
import selfAppCtrl from '@/ts/controller/store/selfAppCtrl';
interface Iprops {
  onCheckeds?: (teamId: string, type: string, checkedValus: any) => void;
  shareType: string;
}
const DestTypes = [
  {
    value: 3,
    label: '岗位',
  },
];
const ShareRecent = (props: Iprops) => {
  const { onCheckeds, shareType } = props;
  const [leftTreeSelectedKeys, setLeftTreeSelectedKeys] = useState<Key[]>([]); //集团列表

  const [radio, setRadio] = useState<number>(3); //分配类型
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
    getLeftTree();
  }, []);
  useEffect(() => {
    setDepartData([]);
    setAuthorData([]);
    setPersonsData([]);
    setIdentitysData([]);
    setCenterTreeData([]);
    setSelectedTeamId('0');
    setLeftTreeSelectedKeys([]);
  }, [radio]);

  // 修改选中 提交修改selectAuthorityTree
  const handelCheckedChange = (list: any) => {
    onCheckeds && onCheckeds(selectedTeamId, '岗位', list);
  };
  const getLeftTree = async () => {
    let FunName: Function = userCtrl.User!.getJoinedCohorts;
    if (userCtrl.IsCompanySpace) {
      FunName =
        shareType === '共享'
          ? userCtrl.Company!.getJoinedGroups
          : userCtrl.Company!.getDepartments;
    }
    const res = await FunName();
    console.log('共享获取组织', res);
    const ShowList = res?.map((item: { target: any }) => {
      return {
        ...item.target,
        node: item,
      };
    });

    setLeftTreeData([...ShowList]);
  };
  const onSelect: TreeProps['onSelect'] = async (selectedKeys, info: any) => {
    console.log('selected', selectedKeys, info);
    setLeftTreeSelectedKeys(selectedKeys);

    hasSelectRecord?.list?.lenght &&
      selfAppCtrl.ShareProduct(
        selectedTeamId,
        hasSelectRecord!.list,
        hasSelectRecord!.type,
      );
    setSelectedTeamId(info.node.id);
    setDepartData([]);
    setAuthorData([]);
    setPersonsData([]);
    setIdentitysData([]);
    setCenterTreeData([]);

    switch (radio) {
      case 3: {
        // 岗位 --职权树

        const res2 = await kernel.queryTargetIdentitys({
          id: info.node.id,
          page: {
            limit: pageCurrent.limit,
            offset: pageCurrent.offset,
            filter: '',
          },
        });

        const { result = [] } = res2.data;
        console.log('输出,岗位', res2);
        setCenterTreeData(result ? result : []);
        break;
      }
      default:
        break;
    }
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
    if (info.checked) {
      if (radio == 3) {
        handleBoxClick(personsHisData, personsData, info.node);
        setIdentitysData(personsData);
      }
    } else {
      if (radio == 3) {
        handleBoxCancelClick(personsHisData, personsData, info.node);
        setIdentitysData(personsData);
      }
    }
    setHasSelectRecord({ type: '岗位', list: checkedKeys });
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
        <p className={cls['top-label']}>形式：</p>
        <Radio.Group
          onChange={(e: RadioChangeEvent) => {
            setRadio(e.target.value);
          }}
          value={radio}>
          {DestTypes.map((item) => {
            return (
              <Radio value={item.value} key={item.value}>
                按
                {userCtrl.IsCompanySpace && shareType === '共享' && item.label === '人员'
                  ? '单位'
                  : userCtrl.IsCompanySpace &&
                    shareType === '共享' &&
                    item.label === '组织'
                  ? '集团'
                  : item.label}
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
            placeholder="请输入部门"
          />
          <div className={cls.leftContent}>
            <Tree
              checkable={radio !== 1 ? false : true}
              fieldNames={{
                title: 'name',
                key: 'id',
                children: 'children',
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
