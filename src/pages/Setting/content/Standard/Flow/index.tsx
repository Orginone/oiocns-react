import { Card, Modal, message } from 'antd';
import React, { useRef, useEffect, useState } from 'react';
import cls from './index.module.less';
import { AiOutlineExclamation } from 'react-icons/ai';
import CardOrTable from '@/components/CardOrTableComp';
import { XFlowDefine } from '@/ts/base/schema';
import FlowCard from './Comp/FlowCard';
import { FlowColumn } from '@/pages/Setting/config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import DefineInfo from './info';
import { ISpeciesItem } from '@/ts/core';
import { IsThingAdmin } from '@/utils/authority';
import { CreateDefineReq } from '@/ts/base/model';
import Design from './Design';

interface IProps {
  current: ISpeciesItem;
}

/**
 * 流程设置
 * @returns
 */
const FlowList: React.FC<IProps> = ({ current }: IProps) => {
  const parentRef = useRef<any>(null);
  const [key, setForceUpdate] = useObjectUpdate(current);
  const [define, setDefine] = useState<XFlowDefine>();
  const [modalType, setModalType] = useState('');
  const [isThingAdmin, setIsThingAdmin] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(async () => {
      setIsThingAdmin(await IsThingAdmin(current.team));
    }, 100);
  }, []);

  const renderOperation = (record: XFlowDefine): any[] => {
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
    if (isThingAdmin) {
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
              if (await current.deleteWork(record.id)) {
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

  const content = () => {
    switch (modalType) {
      case 'design':
        if (define) {
          return (
            <Design
              IsEdit={true}
              current={define}
              species={current}
              onBack={() => setModalType('')}
            />
          );
        }
        return <></>;
      default:
        return (
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
                  request={async (page) => await current.loadWork(page)}
                  operation={renderOperation}
                  rowKey={(record: XFlowDefine) => record.id}
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
  };

  return (
    <div className={cls['company-top-content']} key={key}>
      {content()}
      {define && (
        <DefineInfo
          target={current.team}
          current={define}
          title={'编辑办事'}
          open={modalType == 'edit'}
          handleCancel={function (): void {
            setModalType('');
          }}
          handleOk={async (req: CreateDefineReq) => {
            if (await current.publishWork(req)) {
              message.success('保存成功');
              setForceUpdate();
              setModalType('');
            }
          }}
        />
      )}
    </div>
  );
};

export default FlowList;
