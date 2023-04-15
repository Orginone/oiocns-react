import React, { useEffect, useRef, useState } from 'react';
import PageCard from '@/components/PageCard';
import CardOrTableComp from '@/components/CardOrTableComp';
import cls from './index.module.less';
import { Button } from 'antd';
import { FlowInstanceColumns } from '../../config/columns';
import { MenuItemType } from 'typings/globelType';
import Work from '../Work';

interface IProps {
  selectMenu: MenuItemType;
}
/**
 * 办事-流程实例
 * @returns
 */
const FlowInstance: React.FC<IProps> = (props: IProps) => {
  const [selectedRows, setSelectRows] = useState<any[]>([]);
  const [workModal, setWorkModal] = useState<boolean>(false);
  const parentRef = useRef<any>(null);
  useEffect(() => {
    setWorkModal(false);
  }, [props.selectMenu]);
  const operation = () => {
    return (
      <>
        <Button
          type="link"
          onClick={() => {
            setWorkModal(true);
          }}>
          办事
        </Button>
      </>
    );
  };
  return (
    <>
      {!workModal && (
        <PageCard
          bordered={false}
          tabBarExtraContent={operation()}
          tabList={[{ key: 'apply', tab: '操作记录' }]}>
          <div className={cls['page-content-table']} ref={parentRef}>
            <CardOrTableComp<any>
              dataSource={[]}
              parentRef={parentRef}
              rowKey={(record: any) => record.Data?.id}
              columns={FlowInstanceColumns}
              // request={async (page: PageRequest) => {
              //   return await apply.getApplyList(page);
              // }}
              operation={(item: any) => {
                return [
                  {
                    key: 'cancel',
                    label: '取消',
                    onClick: async () => {},
                  },
                ];
              }}
              rowSelection={{
                type: 'checkbox',
                onChange: (_: React.Key[], selectedRows: any[]) => {
                  setSelectRows(selectedRows);
                },
              }}
            />
          </div>
        </PageCard>
      )}
      {workModal && <Work selectMenu={props.selectMenu}></Work>};
    </>
  );
};

export default FlowInstance;
