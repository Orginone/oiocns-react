import { Button, Card, Modal, message } from 'antd';
import React, { useRef, useState } from 'react';
import cls from './index.module.less';
import { AiOutlineExclamation } from 'react-icons/ai';
import CardOrTable from '@/components/CardOrTableComp';
import FlowCard from './Comp/FlowCard';
import { FlowColumn } from '@/pages/Setting/config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import WorkDefineModal from '@/bizcomponents/GlobalComps/createFlow';
import Design from './Design';
import { orgAuth } from '@/ts/core/public/consts';
import PageCard from '@/components/PageCard';
import { IWorkDefine, IFlowClass } from '@/ts/core';

interface IProps {
  current: IFlowClass;
}

/**
 * 流程设置
 * @returns
 */
const FlowList: React.FC<IProps> = ({ current }: IProps) => {
  const parentRef = useRef<any>(null);
  const [activeTab, setActiveTab] = useState<string>('work');
  const [key, setForceUpdate] = useObjectUpdate(current);
  const [define, setDefine] = useState<IWorkDefine>();
  const [modalType, setModalType] = useState('');
  const items = [
    {
      label: `办事定义`,
      tab: '办事定义',
      key: 'work',
    },
  ];
  const renderOperation = (record: IWorkDefine): any[] => {
    if (record.workItem.isInherited) return [];
    let operations: any[] = [
      {
        key: 'editor',
        label: '编辑',
        onClick: () => {
          setDefine(record);
          setModalType('edit');
        },
      },
      {
        key: 'design',
        label: '设计',
        onClick: () => {
          setDefine(record);
          setModalType('design');
        },
      },
    ];
    if (current.current.hasAuthoritys([orgAuth.ThingAuthId])) {
      operations.push({
        key: 'delete',
        label: '删除',
        style: { color: 'red' },
        onClick: async () => {
          Modal.confirm({
            title: '确定删除流程?',
            icon: <AiOutlineExclamation />,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
              if (await record.deleteDefine()) {
                message.success('删除成功');
                setForceUpdate();
              }
            },
          });
        },
      });
    }
    return operations;
  };
  /** 操作按钮 */
  const renderButton = () => {
    switch (activeTab) {
      case 'work':
        return (
          <Button
            key="edit"
            type="link"
            onClick={() => {
              setModalType('create');
            }}>
            新增办事
          </Button>
        );
      default:
        return <></>;
    }
  };

  const content = () => {
    switch (activeTab) {
      case 'work':
        switch (modalType) {
          case 'design':
            if (define) {
              return (
                <Design
                  IsEdit={true}
                  Title={'办事设计'}
                  current={define}
                  onBack={() => setModalType('')}
                />
              );
            }
            return <></>;
          default:
            return (
              <div style={{ background: '#EFF4F8' }}>
                <Card bordered={false} bodyStyle={{ paddingTop: 0 }}>
                  <div className={cls['app-wrap']} ref={parentRef}>
                    <CardOrTable<IWorkDefine>
                      extra={[
                        <Button
                          key="edit"
                          type="link"
                          onClick={() => {
                            setModalType('create');
                          }}>
                          新增办事
                        </Button>,
                      ]}
                      columns={FlowColumn}
                      parentRef={parentRef}
                      dataSource={current.defines}
                      operation={renderOperation}
                      rowKey={(record: IWorkDefine) => record.id}
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
            );
        }
      default:
        return <></>;
    }
  };

  return (
    <div className={cls['company-top-content']} key={key}>
      <PageCard
        key={key}
        tabList={items}
        bordered={false}
        activeTabKey={activeTab}
        bodyStyle={{ paddingTop: 16 }}
        tabBarExtraContent={renderButton()}
        onTabChange={(key) => {
          setActiveTab(key);
        }}>
        {content()}
      </PageCard>
      {
        <WorkDefineModal
          workItem={current}
          current={define}
          open={['edit', 'create'].includes(modalType)}
          handleCancel={function (): void {
            setModalType('');
          }}
          handleOk={(success: boolean) => {
            if (success) {
              message.info('操作成功');
              setDefine(undefined);
              setForceUpdate();
              setModalType('');
            }
          }}
        />
      }
    </div>
  );
};

export default FlowList;
