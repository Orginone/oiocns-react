import { Card, Modal, message } from 'antd';
import React, { useRef, useState } from 'react';
import cls from './index.module.less';
import { AiOutlineExclamation } from 'react-icons/ai';
import CardOrTable from '@/components/CardOrTableComp';
import { XWorkDefine } from '@/ts/base/schema';
import FlowCard from './Comp/FlowCard';
import { FlowColumn } from '@/pages/Setting/config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import DefineModal from './modal';
import { WorkDefineModel } from '@/ts/base/model';
import Design from './Design';
import { IWorkItem } from '@/ts/core/thing/app/work/workitem';
import { orgAuth } from '@/ts/core/public/consts';

interface IProps {
  current: IWorkItem;
}

/**
 * 流程设置
 * @returns
 */
const FlowList: React.FC<IProps> = ({ current }: IProps) => {
  const parentRef = useRef<any>(null);
  const [key, setForceUpdate] = useObjectUpdate(current);
  const [define, setDefine] = useState<XWorkDefine>();
  const [modalType, setModalType] = useState('');

  const renderOperation = (record: XWorkDefine): any[] => {
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
              if (await current.deleteWorkDefine(record)) {
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
            <Card bordered={false} bodyStyle={{ paddingTop: 0 }}>
              <div className={cls['app-wrap']} ref={parentRef}>
                <CardOrTable<XWorkDefine>
                  columns={FlowColumn}
                  parentRef={parentRef}
                  dataSource={current.defines}
                  operation={renderOperation}
                  rowKey={(record: XWorkDefine) => record.id}
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
        <DefineModal
          target={current.current}
          current={define}
          title={'编辑办事'}
          open={modalType == 'edit'}
          handleCancel={function (): void {
            setModalType('');
          }}
          handleOk={async (req: WorkDefineModel) => {
            if (await current.createWorkDefine(req)) {
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
