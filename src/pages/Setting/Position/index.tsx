/* eslint-disable no-unused-vars */
import ReactDOM from 'react-dom';
import { Card, Modal, Button } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import { MarketTypes } from 'typings/marketType';
import { columns, indentitycolumns } from './config';
import TreeLeftDeptPage from './components/TreeLeftPosPage/CreatePos';
import { RouteComponentProps } from 'react-router-dom';
import { XTarget } from '@/ts/base/schema';
import AssignPosts from './components/AssignPosts';
import { schema } from '@/ts/base';
import { PlusOutlined } from '@ant-design/icons';
import IndentityManage from '@/bizcomponents/AddIndentity';
import positionCtrl, {
  PostitonCallBackTypes,
} from '@/ts/controller/position/positionCtrl';
import userCtrl from '@/ts/controller/setting/userCtrl';
type RouterParams = {
  id: string;
};
/**
 * 岗位设置
 * @returns
 */
const SettingDept: React.FC<RouteComponentProps<RouterParams>> = () => {
  const parentRef = useRef<any>(null); //父级容器Dom
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false); // 添加成员
  const [positions, setPositions] = useState<any[]>([]);
  const [_currentPostion, setPosition] = useState<any>({});
  const [isOpenAssign, setIsOpenAssign] = useState<boolean>(false);
  const [memberData, setMemberData] = useState<schema.XTarget[]>([]);
  const [person, setPerson] = useState<schema.XTarget[]>();
  const [personData, setPersonData] = useState<XTarget[]>();
  const [organization, setOrganization] = useState<any>();
  const [indentitys, setIndentitys] = useState<any[]>();
  const [addIndentitys, setAddIndentitys] = useState<any[]>();
  const treeContainer = document.getElementById('templateMenu');
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
  useEffect(() => {
    getMemberData();
  }, []);
  const getMemberData = async () => {
    setMemberData(await userCtrl.Company.getPersons(false));
    console.log('人员列表', person);
  };
  // 操作内容渲染函数
  const renderOperation = (
    item: MarketTypes.ProductType,
  ): MarketTypes.OperationType[] => {
    return [
      {
        key: 'remove',
        label: '调整岗位',
        onClick: async () => {
          console.log('按钮事件', 'remove', item);
        },
      },
      {
        key: 'remove',
        label: '移出岗位',
        onClick: async () => {
          console.log('按钮事件', 'remove', item);
        },
      },
    ];
  };
  // 操作内容渲染函数
  const reRenderOperation = (item: any): any[] => {
    return [
      {
        key: 'update',
        label: '修改',
        onClick: async () => {
          console.log('按钮事件', 'remove', item);
        },
      },
      {
        key: 'remove',
        label: '删除',
        onClick: async () => {
          const list = indentitys?.filter((obj) => obj.id != item.id);
          positionCtrl.updatePosttion({
            name: _currentPostion.name,
            code: _currentPostion.code,
            indentitys: list,
          });
          setIndentitys(list);
          console.log('按钮事件', 'remove', item);
        },
      },
    ];
  };

  /**点击操作内容触发的事件 */
  const handleMenuClick = (key: string, item: any) => {};
  // 选中树的时候操作
  const setTreeCurrent = async (current: any) => {
    /**保存当前选中的岗位 */
    setPosition(current);
    /**保存当前选中的身份 */
    setIndentitys(current.indentitys);
    /**保存当前选中岗位下的人员 */
    setPerson(current.persons);
  };
  /**添加框内选中组织后的数据转换 */
  const onCheckeds = (team: any, type: string, checkedValus: any[]) => {
    setOrganization(team);
    const result = [];
    for (const a of checkedValus) {
      const data = {
        organization: team.name,
        id: a.id,
        name: a.name,
        remark: a.remark,
      };
      result.push(data);
    }
    setAddIndentitys(result);
  };
  /**头部 */
  const header = (
    <div className={`${cls['dept-wrap-pages']}`}>
      <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        <Card className={cls['app-tabs']} bordered={false}>
          <div className={cls.topMes} style={{ marginRight: '25px' }}>
            <strong style={{ marginLeft: '20px', fontSize: 15 }}>
              {_currentPostion.name}
            </strong>
            <Button
              className={cls.creatgroup}
              type="text"
              icon={<PlusOutlined className={cls.addIcon} />}
              style={{ float: 'right' }}
              onClick={() => {
                setIsAddOpen(true);
              }}
            />
          </div>
          <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
            <div className={cls['page-content-table']} ref={parentRef}>
              <CardOrTable
                dataSource={indentitys as any}
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
    <div className={`${cls['dept-wrap-pages']}`}>
      <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        <Card className={cls['app-tabs']} bordered={false}>
          <div className={cls.topMes} style={{ marginRight: '25px' }}>
            <strong style={{ marginLeft: '20px', fontSize: 15 }}>岗位人员</strong>
            <Button
              className={cls.creatgroup}
              type="text"
              icon={<PlusOutlined className={cls.addIcon} />}
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
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className={cls[`dept-content-box`]}>
      {header}
      {personCount}
      <Modal
        title="添加身份"
        open={isAddOpen}
        onOk={() => {
          const data = {
            name: _currentPostion.name,
            code: _currentPostion.code,
            indentitys: addIndentitys,
            persons: _currentPostion.perons,
          };
          positionCtrl.updatePosttion(data);
          setIndentitys(addIndentitys);
          setIsAddOpen(false);
        }}
        onCancel={() => setIsAddOpen(false)}
        width="1050px">
        <IndentityManage shareType="" onCheckeds={onCheckeds} />
      </Modal>
      {/**@todo 待确定使用 */}
      <Modal
        title="指派岗位"
        open={isOpenAssign}
        destroyOnClose={true}
        width={1300}
        onOk={async () => {
          setIsOpenAssign(false);
        }}
        onCancel={() => {
          setIsOpenAssign(false);
        }}>
        <AssignPosts searchCallback={setPerson} memberData={memberData} />
      </Modal>

      {/* 左侧树 */}
      {treeContainer
        ? ReactDOM.createPortal(
            <TreeLeftDeptPage
              createTitle="新增岗位"
              setCurrent={setTreeCurrent}
              handleMenuClick={handleMenuClick}
              currentKey={''}
              positions={positions}
            />,
            treeContainer,
          )
        : ''}
    </div>
  );
};

export default SettingDept;
