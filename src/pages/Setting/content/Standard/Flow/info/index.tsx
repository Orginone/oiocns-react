import { Card, Modal, message } from 'antd';
import React, { useRef, useEffect } from 'react';
import cls from './index.module.less';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import userCtrl from '@/ts/controller/setting';
import CardOrTable from '@/components/CardOrTableComp';
import { XFlowDefine } from '@/ts/base/schema';
import FlowCard from './FlowCard';
import useWindowSize from '@/utils/windowsize';
import { FlowColumn } from '@/pages/Setting/config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { ISpeciesItem } from '@/ts/core/thing/ispecies';

interface IProps {
  modalType: string;
  species?: ISpeciesItem;
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
  setModalType,
  onDesign,
  onCurrentChaned,
}: IProps) => {
  const parentRef = useRef<any>(null);
  const [tkey, tforceUpdate] = useObjectUpdate(species);

  useEffect(() => {
    if (modalType.includes('新增业务流程')) {
      // alert('新增业务流程');
      onCurrentChaned(undefined);
      onDesign();
    }
  }, [modalType]);

  const renderOperation = (record: XFlowDefine): any[] => {
    return [
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
              setModalType('编辑业务流程');
              onCurrentChaned(record);
              onDesign();
            },
          });
        },
      },
      {
        key: 'delete',
        label: '删除',
        style: { color: 'red' },
        onClick: async () => {
          if (await userCtrl.space.deleteDefine(record.id)) {
            message.success('删除成功');
            tforceUpdate();
          }
        },
      },
    ];
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
                return await species?.loadFlowDefines(userCtrl.space.id, page);
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
      </div>
    </div>
  );
};

export default FlowList;
