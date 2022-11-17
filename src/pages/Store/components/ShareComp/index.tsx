import { SearchOutlined } from '@ant-design/icons';
import { Input, Radio, RadioChangeEvent, Tree, TreeProps } from 'antd';
import React, { useState, useEffect, createContext } from 'react';
import ShareShowComp from '../ShareShowComp';
import API from '@/services';
import cls from './index.module.less';
const ShareRecent: React.FC = () => {
  const [radio, setRadio] = useState(1);
  const [pageCurrent, setPageCurrent] = useState({ filter: '', limit: 1000, offset: 0 });
  const [leftTreeData, setLeftTreeData] = useState([]);
  const [centerTreeData, setCenterTreeData] = useState<any>([]);
  const [departData, setDepartData] = useState<any[]>([]); // raido=1 数据
  const [departHisData, setDepartHisData] = useState<any[]>([]); // radio=1 历史数据
  const [authorData, setAuthorData] = useState<any[]>([]); // raido=2 数据
  const [authorHisData, setAuthorHisData] = useState<any[]>([]); //raido=2 历史数据
  const [personsData, setPersonsData] = useState<any[]>([]); //raido=3 数据
  const [personsHisData, setPersonsHisData] = useState<any[]>([]); //raido=3 历史数据
  const [identitysData, setIdentitysData] = useState<any[]>([]); //raido=4 数据
  const [identitysHisData, setIdentitysHisData] = useState<any[]>([]); //raido=4 历史数据
  useEffect(() => {
    getLeftTree();
  }, []);
  useEffect(() => {
    setDepartData([]);
    setAuthorData([]);
    setPersonsData([]);
    setIdentitysData([]);
    setCenterTreeData([]);
  }, [radio]);

  const getLeftTree = async () => {
    const res = await API.cohort.getJoinedCohorts({ data: pageCurrent });
    setLeftTreeData(res.data.result);
    console.log(res);
  };
  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setRadio(e.target.value);
  };
  const onSelect: TreeProps['onSelect'] = async (selectedKeys, info: any) => {
    console.log('selected', selectedKeys, info);
    switch (radio) {
      case 2: {
        const res = await API.company.getAuthorityTree({
          data: {
            id: info.node.id,
            filter: '',
          },
        });
        res.data = handleTreeData(res.data, info.node.id);
        setCenterTreeData([res.data]);
        break;
      }
      case 3: {
        const res2 = await API.company.getIdentities({
          data: {
            id: info.node.id,
            limit: pageCurrent.limit,
            offset: pageCurrent.offset,
            filter: '',
          },
        });
        const { result = [] } = res2.data;
        setCenterTreeData(result ? result : []);
        break;
      }
      case 4:
        {
          let action = 'getPersons';
          if (info.node.TypeName === '子集团') {
            action = 'getSubgroupCompanies';
          }
          const res3 = await API.cohort[action]({
            data: {
              id: info.node.id,
              limit: pageCurrent.limit,
              offset: pageCurrent.offset,
              filter: '',
            },
          });
          setCenterTreeData(res3.data.result ? res3.data.result : []);
        }
        break;
      default:
        break;
    }
  };
  const handleTreeData = (node: any, belongId: string) => {
    node.disabled = !(node.belongId && node.belongId == belongId);
    if (node.nodes) {
      node.nodes = node.nodes.map((children: any) => {
        return handleTreeData(children, belongId);
      });
    }
    //判断是否有操作权限
    return node;
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
    setDepartData([...departData]);
  };
  // 中间树形点击事件
  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
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
      <div className={cls.top}>
        <p>分享形式：</p>
        <Radio.Group onChange={onChange} value={radio}>
          <Radio value={1}>按群组共享</Radio>
          <Radio value={2}>按角色共享</Radio>
          <Radio value={3}>按身份共享</Radio>
          <Radio value={4}>按人员共享</Radio>
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
