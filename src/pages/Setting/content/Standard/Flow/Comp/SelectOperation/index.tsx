import { SearchOutlined } from '@ant-design/icons';
import { Input, TreeProps } from 'antd';
import React, { useState, useEffect, Key } from 'react';
import ShareShowComp from '@/bizcomponents/IndentityManage/ShareShowComp';
import cls from './index.module.less';
import CustomTree from '@/components/CustomTreeComp';
import thingCtrl from '@/ts/controller/thing';
import userCtrl from '@/ts/controller/setting';
let originalSelected: any[] = []; //存储当前选择 以获分配数据
interface IProps {
  showData: any[];
  setShowData: Function;
}

const SelectOperation: React.FC<IProps> = ({ showData, setShowData }) => {
  const [leftTreeSelectedKeys, setLeftTreeSelectedKeys] = useState<Key[]>([]); //集团列表
  const [leftCheckedKeys, setLeftCheckedKeys] = useState<Key[]>([]);
  const [leftTreeData, setLeftTreeData] = useState<any>([]);
  const [centerTreeData, setCenterTreeData] = useState<any>([]);
  const [centerCheckedKeys, setCenterCheckedKeys] = useState<Key[]>([]);

  const onSelect: TreeProps['onSelect'] = async (selectedKeys, info: any) => {
    setLeftTreeSelectedKeys(selectedKeys);
    const species: any = info.node.item;
    let res = await species.loadOperations(userCtrl.space.id, false, true, true, {
      offset: 0,
      limit: 1000,
      filter: '',
    });
    setCenterTreeData(buildSpeciesChildrenTree(res.result || []));
  };
  // 左侧树选中事件
  const handleCheckChange: TreeProps['onCheck'] = (checkedKeys, info: any) => {
    // console.log('点击左侧', checkedKeys, info, info.checked);
    Array.isArray(checkedKeys) && setLeftCheckedKeys(checkedKeys);
  };
  // 中间树形点击事件
  const onCheck: TreeProps['onCheck'] = (checkedKeys, info: any) => {
    // console.log('onCheck', checkedKeys, info);
    if (Array.isArray(checkedKeys)) {
      setCenterCheckedKeys(checkedKeys);
    }
    const isOriginal = originalSelected.includes(info.node.id);
    let newArr = showData.filter((v: any) => {
      return v.id !== info.node.item.id;
    });
    let obj = {
      id: info.node.item.id,
      name: info.node.item.name,
      type: 'has',
      item: info.node.item,
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
    // setShowData(info.checkedNodes.map((node: any) => node.item));
  };

  const buildSpeciesChildrenTree = (parent: any[]): any[] => {
    if (parent.length > 0) {
      return parent.map((species) => {
        return {
          key: species.id,
          title: species.name,
          value: species.id,
          item: species,
          children: species.children ? buildSpeciesChildrenTree(species.children) : [],
        };
      });
    }
    return [];
  };

  useEffect(() => {
    const load = async () => {
      const species = await thingCtrl.loadSpeciesTree();
      setLeftTreeData(buildSpeciesChildrenTree([species]));
    };
    load();
  }, []);

  const handelDel = (id: string) => {
    setCenterCheckedKeys(centerCheckedKeys.filter((data) => data != id));
    setShowData(showData.filter((data) => data.id != id));
  };

  return (
    <div className={cls.layout}>
      <div className={cls.content}>
        <div style={{ width: '33%' }} className={cls.left}>
          <Input
            className={cls.leftInput}
            prefix={<SearchOutlined />}
            placeholder="请设置关键字"
          />
          <div className={cls.leftContent}>
            <CustomTree
              checkable={false}
              checkedKeys={leftCheckedKeys}
              autoExpandParent={true}
              selectedKeys={leftTreeSelectedKeys}
              onSelect={onSelect}
              onCheck={handleCheckChange}
              treeData={leftTreeData}
            />
          </div>
        </div>
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
              // fieldNames={{
              //   title: 'name',
              //   key: 'id',
              //   children: 'nodes',
              // }}
              onCheck={onCheck}
              treeData={centerTreeData}
            />
          </div>
        </div>

        <div style={{ width: '33%' }} className={cls.right}>
          <ShareShowComp departData={showData} deleteFuc={handelDel}></ShareShowComp>
        </div>
      </div>
    </div>
  );
};

export default SelectOperation;
