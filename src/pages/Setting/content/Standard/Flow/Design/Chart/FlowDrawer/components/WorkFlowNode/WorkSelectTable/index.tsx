import React from 'react';
import cls from './index.module.less';
import { schema } from '@/ts/base';
import thingCtrl from '@/ts/controller/thing';
import { FlowColumn } from '@/pages/Setting/config/columns';
import CardOrTableComp from '@/components/CardOrTableComp';
interface indexType {
  searchFn: Function;
}

const WorkSelectTable: React.FC<indexType> = (props) => {
  const { searchFn } = props;

  return (
    <div className={cls.tableBox}>
      <div className={cls.tableContent}>
        <CardOrTableComp<schema.XFlowDefine>
          rowSelection={{
            type: 'radio',
            onSelect: (record: any, _: any) => {
              searchFn(record);
            },
          }}
          dataSource={[]}
          request={async () => {
            return (await thingCtrl.loadFlowDefine()).data;
          }}
          hideOperation={true}
          scroll={{ y: 300 }}
          columns={FlowColumn}
          rowKey={'id'}
        />
      </div>
    </div>
  );
};

export default WorkSelectTable;
