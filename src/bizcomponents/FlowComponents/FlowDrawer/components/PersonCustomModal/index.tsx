/* eslint-disable no-unused-vars */
import { SearchOutlined } from '@ant-design/icons';
import { Input, Radio, RadioChangeEvent, Tree, TreeProps, Modal } from 'antd';
import React, { useState, useEffect, Key } from 'react';
import cls from './index.module.less';
import { Product } from '@/ts/core/market';
// import { productCtrl } from '@/ts/controller/store/productCtrl';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { kernel } from '@/ts/base';
import selfAppCtrl from '@/ts/controller/store/selfAppCtrl';
interface Iprops {
  curProduct?: Product;
  onCheckeds?: (teamId: string, type: string, checkedValus: any) => void;
  open: boolean;
  title: string;
  onOk: (params: any) => void;
  onCancel: () => void;
}

const DestTypes = [
  {
    value: 3,
    label: '内部岗位',
  },
  {
    value: 4,
    label: '集团岗位',
  },
];
const PersonCustomModal = (props: Iprops) => {
  const pageCurrent = { filter: '', limit: 1000, offset: 0 };
  const { open, title, onOk, onCancel } = props;
  const [leftTreeSelectedKeys, setLeftTreeSelectedKeys] = useState<Key[]>([]); //集团列表
  const [radio, setRadio] = useState<number>(3); //分配类型
  const [leftTreeData, setLeftTreeData] = useState<any>([]);
  const [centerTreeData, setCenterTreeData] = useState<any>([]);
  const [shareType, setShareType] = useState('分配');
  const [personsData, setPersonsData] = useState<any[]>([]); //raido=3 数据
  const [personsHisData, setPersonsHisData] = useState<any[]>([]); //raido=3 历史数据
  const [identitysData, setIdentitysData] = useState<any[]>([]); //raido=4 数据
  const [identitysHisData, setIdentitysHisData] = useState<any[]>([]); //raido=4 历史数据
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [hasSelectRecord, setHasSelectRecord] = useState<{ list: any; type: string }>(
    {} as any,
  );

  useEffect(() => {
    console.log(1111);
    getLeftTree();
  }, [shareType]);

  useEffect(() => {
    setPersonsData([]);
    setIdentitysData([]);
    setCenterTreeData([]);
    setSelectedTeamId('0');
    setLeftTreeSelectedKeys([]);
  }, [radio]);

  const getLeftTree = async () => {
    let FunName: Function = userCtrl.user!.getJoinedCohorts;

    FunName =
      shareType === '共享'
        ? userCtrl.company!.getJoinedGroups
        : userCtrl.company!.getDepartments;

    const res = await FunName();

    const ShowList = res?.map((item: { target: any }) => {
      return {
        ...item.target,
        node: item,
      };
    });
    setLeftTreeData([...ShowList]);
  };

  const onSelect: TreeProps['onSelect'] = async (selectedKeys, info: any) => {
    console.log('_______selected', selectedKeys, info);
    setLeftTreeSelectedKeys(selectedKeys);

    hasSelectRecord?.list?.lenght &&
      selfAppCtrl.ShareProduct(
        selectedTeamId,
        hasSelectRecord!.list,
        hasSelectRecord!.type,
      );
    setSelectedTeamId(info.node.id);
    setPersonsData([]);
    setIdentitysData([]);
    setCenterTreeData([]);

    switch (radio) {
      case 3: {
        const res2 = await kernel.queryTargetIdentitys({
          id: info.node.id,
          page: {
            limit: pageCurrent.limit,
            offset: pageCurrent.offset,
            filter: '',
          },
        });
        console.log('res2', res2);
        const { result = [] } = res2.data;
        setCenterTreeData(result ? result : []);
        break;
      }
      case 4: {
        // let action = 'getMember';
        // if (info.node.typeName === '集团') {
        //   //集团下 查单位
        //   action = 'getCompanys';
        // } else if (info.node.typeName === '部门') {
        //   action = 'getPerson';
        // }
        // const res3 = await info?.node?.node[action]();
        // setCenterTreeData(res3 || []);
        const res2 = await kernel.queryTargetIdentitys({
          id: info.node.id,
          page: {
            limit: pageCurrent.limit,
            offset: pageCurrent.offset,
            filter: '',
          },
        });
        console.log('res2', res2);
        const { result = [] } = res2.data;
        setCenterTreeData(result ? result : []);
        break;
      }
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

    setDepartData([...departData]);
  };
  // 中间树形点击事件
  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    if (radio == 3) {
      handleBoxClick(personsHisData, personsData, info.node);
      setIdentitysData(personsData);
    } else {
      handleBoxClick(identitysHisData, identitysData, info.node);
      setPersonsData(identitysData);
    }
    setHasSelectRecord({ type: DestTypes[radio - 1]?.label, list: checkedKeys });
    onOk(info);
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
    <Modal
      title={title}
      centered
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      width={800}
      getContainer={false}>
      <div className={cls.layout}>
        <div className={cls.top}>
          <Radio.Group
            onChange={(e: RadioChangeEvent) => {
              setRadio(e.target.value);
              setShareType(e.target.value === 3 ? '分配' : '共享');
            }}
            value={radio}>
            {DestTypes.map((item) => {
              return (
                <Radio value={item.value} key={item.value}>
                  按{item.label}
                </Radio>
              );
            })}
          </Radio.Group>
        </div>
        <div className={cls.content}>
          <div style={{ width: '50%' }} className={cls.left}>
            <Input
              className={cls.leftInput}
              prefix={<SearchOutlined />}
              placeholder="请输入部门"
            />
            <div className={cls.leftContent}>
              <Tree
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
          <div style={{ width: '50%' }} className={cls.center}>
            <Input
              className={cls.centerInput}
              prefix={<SearchOutlined />}
              placeholder="搜索"
            />
            <div className={cls.centerContent}>
              <Tree
                autoExpandParent={true}
                fieldNames={{
                  title: 'name',
                  key: 'id',
                  children: 'nodes',
                }}
                onSelect={onCheck}
                // onCheck={onCheck}
                treeData={centerTreeData}
              />
            </div>
          </div>

          {/* <div style={{ width: radio !== 1 ? '33%' : '50%' }} className={cls.right}>
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
          </div> */}
        </div>
      </div>
    </Modal>
  );
};

export default PersonCustomModal;
