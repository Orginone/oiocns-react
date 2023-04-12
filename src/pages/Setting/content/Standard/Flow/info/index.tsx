import { Card, Modal, message } from 'antd';
import React, { useRef, useEffect, useState } from 'react';
import cls from './index.module.less';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import userCtrl from '@/ts/controller/setting';
import CardOrTable from '@/components/CardOrTableComp';
import { XFlowDefine } from '@/ts/base/schema';
import FlowCard from './FlowCard';
import { FlowColumn } from '@/pages/Setting/config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { ISpeciesItem } from '@/ts/core/thing/ispecies';
import DefineInfo from '@/pages/Setting/content/Standard/Flow/info/DefineInfo';

interface IProps {
  modalType: string;
  species: ISpeciesItem;
  operateOrgId?: string;
  setOperateOrgId: Function;
  isAdmin: boolean;
  setModalType: (modalType: string) => void;
  onDesign: () => void;
  onCurrentChaned: (item?: XFlowDefine) => void;
  setInstance: Function;
  setTestModel?: Function;
}

/**
 * 流程设置
 * @returns
 */
const FlowList: React.FC<IProps> = ({
  modalType,
  species,
  setOperateOrgId,
  isAdmin,
  setModalType,
  onDesign,
  onCurrentChaned,
}: IProps) => {
  const parentRef = useRef<any>(null);
  const [tkey, tforceUpdate] = useObjectUpdate(species);
  const [defineInfo, setDefineInfo] = useState<XFlowDefine>();
  useEffect(() => {
    if (modalType.includes('新增办事')) {
      onCurrentChaned(undefined);
      setDefineInfo(undefined);
    }
  }, [modalType]);

  const renderOperation = (record: XFlowDefine): any[] => {
    let operations: any[] = [
      {
        key: 'editor',
        label: '编辑',
        onClick: () => {
          onCurrentChaned(undefined);
          setModalType('编辑办事');
          setDefineInfo(record);
        },
      },
      {
        key: 'design',
        label: '设计',
        onClick: () => {
          onCurrentChaned(record);
          setOperateOrgId(userCtrl.space.id);
          setModalType('设计流程');
          onDesign();
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
              if (await species.deleteFlowDefine(record.id)) {
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
    <div className={cls['company-top-content']} key={tkey}>
      <div style={{ background: '#EFF4F8' }}>
        <Card
          bordered={false}
          // style={{ paddingBottom: '10px' }}
          bodyStyle={{ paddingTop: 0 }}>
          <div className={cls['app-wrap']} ref={parentRef}>
            <CardOrTable<XFlowDefine>
              columns={FlowColumn}
              parentRef={parentRef}
              dataSource={[]}
              request={async (page) => {
                let data = await species.loadFlowDefines();
                return {
                  offset: page.offset,
                  limit: page.limit,
                  total: data.length,
                  result: data
                    .slice(page.offset, page.offset + page.limit)
                    .map((a) => a.target),
                };
              }}
              operation={renderOperation}
              rowKey={(record: XFlowDefine) => record.id}
              onRow={(_: any) => {
                return {
                  onClick: async () => {},
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
      </div>
      <DefineInfo
        data={defineInfo}
        title={modalType}
        open={modalType.includes('新增办事') || modalType.includes('编辑办事')}
        handleCancel={function (): void {
          setDefineInfo(undefined);
          setModalType('');
        }}
        handleOk={async (res: any) => {
          if (res) {
            setDefineInfo(undefined);
            message.success('保存成功');
            setModalType('');
            tforceUpdate();
          } else {
            message.error('保存失败');
          }
        }}
        current={species}
      />
    </div>
  );
};

export default FlowList;
