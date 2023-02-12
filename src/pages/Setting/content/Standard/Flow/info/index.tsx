import { Card, Modal, message, TreeSelect } from 'antd';
import React, { useRef, useEffect, useState } from 'react';
import cls from './index.module.less';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import userCtrl from '@/ts/controller/setting';
import CardOrTable from '@/components/CardOrTableComp';
import { XFlowDefine, XFlowDefineArray } from '@/ts/base/schema';
import FlowCard from './FlowCard';
import useWindowSize from '@/utils/windowsize';
import { FlowColumn } from '@/pages/Setting/config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { ISpeciesItem } from '@/ts/core/thing/ispecies';
// import { IsThingAdmin } from '@/utils/authority';
import { ITarget } from '@/ts/core';
import { DefaultOptionType } from 'rc-select/lib/Select';

interface IProps {
  modalType: string;
  species?: ISpeciesItem;
  operateOrgId?: string;
  setOperateOrgId: Function;
  isAdmin: boolean;
  setModalType: (modalType: string) => void;
  onDesign: () => void;
  onCurrentChaned: (item?: XFlowDefine) => void;
}

/**
 * 流程设置
 * @returns
 */
const FlowList: React.FC<IProps> = ({
  modalType,
  species,
  operateOrgId,
  setOperateOrgId,
  isAdmin,
  setModalType,
  onDesign,
  onCurrentChaned,
}: IProps) => {
  const parentRef = useRef<any>(null);
  const [tkey, tforceUpdate] = useObjectUpdate(species);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // const [operateOrgId, setOperateOrgId] = useState<string>();
  const [treeData, setTreeData] = useState<any[]>([]);
  useEffect(() => {
    if (modalType.includes('新增业务流程')) {
      onCurrentChaned(undefined);
      onDesign();
    }
  }, [modalType]);

  const getTreeData = (targets: ITarget[]): DefaultOptionType[] => {
    return targets.map((item: ITarget) => {
      return {
        label: item.teamName,
        value: item.id,
        children:
          item.subTeam && item.subTeam.length > 0 ? getTreeData(item.subTeam) : [],
      };
    });
  };

  const loadTreeData = async () => {
    let tree = await userCtrl.getTeamTree();
    setTreeData(getTreeData(tree));
  };

  useEffect(() => {
    loadTreeData();
  }, [userCtrl.space]);

  const onChange = (newValue: string) => {
    setOperateOrgId(newValue);
  };

  const renderOperation = (record: XFlowDefine): any[] => {
    let operations: any[] = [
      {
        key: 'editor',
        label: '编辑',
        onClick: () => {
          Modal.confirm({
            title: '与该流程相关的未完成待办将会重置，是否确定编辑?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            okType: 'danger',
            onOk: () => {
              onCurrentChaned(record);
              setIsModalOpen(true);
            },
          });
        },
      },
    ];
    if (isAdmin) {
      operations.push({
        key: 'delete',
        label: '删除',
        style: { color: 'red' },
        onClick: async () => {
          Modal.confirm({
            title: '确定删除流程?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
              if (await userCtrl.space.deleteDefine(record.id)) {
                message.success('删除成功');
                tforceUpdate();
              }
            },
            onCancel() {},
          });
        },
      });
    }
    return operations;
  };

  return (
    <div className={cls['company-top-content']}>
      <div style={{ background: '#EFF4F8' }}>
        <Card
          key={tkey}
          bordered={false}
          style={{ paddingBottom: '10px' }}
          bodyStyle={{ paddingTop: 0 }}>
          <div className={cls['app-wrap']} ref={parentRef}>
            <CardOrTable<XFlowDefine>
              columns={FlowColumn}
              parentRef={parentRef}
              dataSource={[]}
              operation={renderOperation}
              height={0.38 * useWindowSize().height}
              rowKey={(record: XFlowDefine) => record.id}
              request={async (page) => {
                let res: XFlowDefineArray | undefined = await species?.loadFlowDefines(
                  userCtrl.space.id,
                  page,
                );
                return res;
              }}
              onRow={(record: any) => {
                return {
                  onClick: () => {},
                };
              }}
              renderCardContent={(items) => {
                return items.map((item) => (
                  <FlowCard
                    className="card"
                    data={item}
                    key={item.id}
                    operation={renderOperation}
                  />
                ));
              }}
            />
          </div>
        </Card>
        <Modal
          title="请选择操作组织"
          open={isModalOpen}
          onOk={() => {
            if (operateOrgId) {
              setIsModalOpen(false);
              setModalType('编辑业务流程');
              onDesign();
            } else {
              message.warn('请选择操作组织');
            }
          }}
          onCancel={() => {
            setIsModalOpen(false);
          }}>
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            value={operateOrgId}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择操作组织"
            allowClear
            treeDefaultExpandAll
            onChange={onChange}
            treeData={treeData}
          />
        </Modal>
      </div>
    </div>
  );
};

export default FlowList;
