/* eslint-disable no-unused-vars */
import ReactDOM from 'react-dom';
import { Card, Modal, Button } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import { common } from 'typings/common';
import { columns, indentitycolumns } from './config';
import TreeLeftDeptPage, { PositionType } from './components/TreeLeftPosPage/CreatePos';
import { RouteComponentProps } from 'react-router-dom';
import AssignPosts from './components/AssignPosts';
import { schema } from '@/ts/base';
import { PlusOutlined } from '@ant-design/icons';
import Indentity from '@/ts/core/target/authority/identity';
import IndentityManage, { ResultType } from '@/bizcomponents/IndentityManage';
import positionCtrl, {
  PostitonCallBackTypes,
} from '@/ts/controller/position/positionCtrl';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { XIdentity } from '@/ts/base/schema';
type RouterParams = {
  id: string;
};
/**
 * 岗位设置
 * @returns
 */
const SettingDept: React.FC<RouteComponentProps<RouterParams>> = () => {
  const parentRef = useRef<any>(null); //父级容器Dom
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [positions, setPositions] = useState<any[]>([]); //岗位列表
  const [_currentPostion, setPosition] = useState<PositionType>(); //当前选中岗位
  const [isOpenAssign, setIsOpenAssign] = useState<boolean>(false);
  const [memberData, setMemberData] = useState<schema.XTarget[]>([]); //可分配人员列表
  const [persons, setPersons] = useState<schema.XTarget[]>(); //选中的待指派人员列表
  const [personData, setPersonData] = useState<schema.XTarget[]>([]); //岗位人员列表
  const [addIndentitys, setAddIndentitys] = useState<XIdentity[]>(); //待添加的身份数据集
  const treeContainer = document.getElementById('templateMenu');
  //监听
  useEffect(() => {
    const id = positionCtrl.subscribePart(PostitonCallBackTypes.ApplyData, () => {
      console.log('监听 岗位变化', positionCtrl.positionListData || []);
      const arr = positionCtrl.positionListData || [];
      setPositions([...arr]);
    });
    return () => {
      return positionCtrl.unsubscribe(id);
    };
  }, []);
  //当前岗位成员变更，可指派人员进行变更
  useEffect(() => {
    getMemberData();
  }, [personData]);

  // 操作内容渲染函数
  const renderOperation = (item: schema.XTarget): common.OperationType[] => {
    return [
      {
        key: 'remove',
        label: '移出岗位',
        onClick: () => {
          // for (const a of indentitys!) {
          //   new Indentity(a.obj).removeMembers([item.id]);
          // }
          // const data = personData?.filter((obj) => obj.id != item.id)!;
          // setPersonData(data);
          // positionCtrl.updatePosttion({
          //   name: _currentPostion.name,
          //   code: _currentPostion.code,
          //   indentitys: indentitys,
          //   persons: data,
          // });
        },
      },
    ];
  };
  // 操作内容渲染函数
  const reRenderOperation = (item: XIdentity): any[] => {
    return [
      {
        key: 'remove',
        label: '删除',
        onClick: async () => {
          const list = _currentPostion?.indentitys?.filter((obj) => obj.id != item.id);
          const data = {
            name: _currentPostion!.name,
            code: _currentPostion!.code,
            indentitys: list!,
          };
          positionCtrl.updatePosttion(data);
          setTreeCurrent(data!);
          console.log('对象数据', new Indentity(item));
          //移除岗位人员列表该身份
          for (const a of personData!) {
            new Indentity(item).removeMembers([a.id]);
          }
          console.log('按钮事件', 'remove', item);
        },
      },
    ];
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
  };

  const getCheckboxProps = (record: any) => {
    record;
  };
  /**点击操作内容触发的事件 */
  const handleMenuClick = (key: string, item: any) => {};
  // 选中树的时候操作
  const setTreeCurrent = async (current: PositionType) => {
    console.log('选中', current);
    setPosition(current);
    /**获取指派人员列表 */
    getMemberData();
    /**保存当前选中的岗位 */
    setPosition(current);
  };
  const getMemberData = async () => {
    setMemberData(
      await (
        await userCtrl.space.loadMembers({ offset: 0, filter: '', limit: 65535 })
      ).result!,
    );
  };
  /**添加框内选中组织后的数据转换 */
  const onCheckeds = (result: ResultType[]) => {
    const identityData: XIdentity[] = [];
    result.map((item) => {
      item.identitys.map((obj) => {
        obj.belong = item.target;
        identityData.push(obj);
      });
    });
    console.log('输出结果', identityData);
    setAddIndentitys(identityData);
  };

  /**头部 */
  const header = (
    <div className={`${cls['dept-wrap-pages']}`}>
      <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        <Card className={cls['app-tabs']} bordered={false}>
          <div className={cls.topMes} style={{ marginRight: '25px' }}>
            <strong style={{ marginLeft: '20px', fontSize: 15 }}>
              {_currentPostion ? _currentPostion.name : ''}
            </strong>
            <Button
              className={cls.creatgroup}
              type="text"
              icon={<PlusOutlined />}
              style={{ float: 'right' }}
              onClick={() => {
                setIsAddOpen(true);
              }}
            />
          </div>
          <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
            <div className={cls['page-content-table']} ref={parentRef}>
              <CardOrTable
                dataSource={_currentPostion?.indentitys as any}
                rowKey={'id'}
                operation={reRenderOperation}
                columns={indentitycolumns as any}
                parentRef={parentRef}
                showChangeBtn={false}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
  /**人员列表 */
  const personCount = (
    <div className={`${cls['dept-wrap-pages']}`} style={{ paddingTop: '10px' }}>
      <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        <Card className={cls['app-tabs']} bordered={false}>
          <div className={cls.topMes} style={{ marginRight: '25px' }}>
            <strong style={{ marginLeft: '20px', fontSize: 15 }}>岗位人员</strong>
            <Button
              className={cls.creatgroup}
              type="text"
              icon={<PlusOutlined />}
              style={{ float: 'right' }}
              onClick={() => {
                setIsOpenAssign(true);
              }}
            />
          </div>
          <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
            <div className={cls['page-content-table']} ref={parentRef}>
              <CardOrTable
                dataSource={personData as any}
                rowKey={'id'}
                operation={renderOperation}
                columns={columns as any}
                parentRef={parentRef}
                showChangeBtn={false}
                rowSelection={{
                  onChange: onSelectChange,
                  getCheckboxProps: getCheckboxProps,
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
  //获取最终待添加身份
  const getResultIndentity = () => {
    console.log(addIndentitys, _currentPostion);
    let ids = addIndentitys!.map((item) => item.id);
    return _currentPostion
      ?.indentitys!.filter((el) => {
        return !ids.includes(el.id);
      })
      .concat(addIndentitys!);
  };
  return (
    <div className={cls[`dept-content-box`]}>
      {_currentPostion && header}
      {_currentPostion && personCount}
      <Modal
        title="添加身份"
        open={isAddOpen}
        destroyOnClose={true}
        onOk={() => {
          const data: PositionType = {
            name: _currentPostion?.name!,
            code: _currentPostion?.code!,
            indentitys: getResultIndentity()!,
          };
          positionCtrl.updatePosttion(data);
          setTreeCurrent(data);
          setIsAddOpen(false);
        }}
        onCancel={() => setIsAddOpen(false)}
        width="1050px">
        <IndentityManage multiple={true} onCheckeds={onCheckeds} />
      </Modal>
      <Modal
        title="指派岗位"
        open={isOpenAssign}
        destroyOnClose={true}
        width={1300}
        onOk={async () => {
          setIsOpenAssign(false);
          // const ids = [];
          // for (const b of persons!) {
          //   ids.push(b.id);
          // }
          // for (const a of indentitys!) {
          //   new Indentity(a.obj).pullMembers(ids);
          // }
          // const data = {
          //   name: _currentPostion.name,
          //   code: _currentPostion.code,
          //   indentitys: _currentPostion.indentitys,
          //   persons: persons?.concat(personData!),
          // };
          // positionCtrl.updatePosttion('');
          // //更新页面人员
          // setPersonData(persons!.concat(personData!));
          // console.log('当前岗位成员', personData);
        }}
        onCancel={() => {
          setIsOpenAssign(false);
        }}>
        <AssignPosts searchCallback={setPersons} memberData={memberData} />
      </Modal>

      {/* 左侧树 */}
      {treeContainer
        ? ReactDOM.createPortal(
            <TreeLeftDeptPage
              createTitle="新增岗位"
              setCurrent={setTreeCurrent}
              handleMenuClick={handleMenuClick}
              currentKey={'code'}
              positions={positions}
            />,
            treeContainer,
          )
        : ''}
    </div>
  );
};

export default SettingDept;
