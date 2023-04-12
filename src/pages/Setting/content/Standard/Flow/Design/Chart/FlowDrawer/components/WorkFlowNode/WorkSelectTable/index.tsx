import React from 'react';
import cls from './index.module.less';
import { schema } from '@/ts/base';
import thingCtrl from '@/ts/controller/thing';
import { FlowColumn } from '@/pages/Setting/config/columns';
import CardOrTableComp from '@/components/CardOrTableComp';
interface indexType {
  searchFn: Function;
  disableIds: string[];
}

const WorkSelectTable: React.FC<indexType> = (props) => {
  return (
    <div className={cls.tableBox}>
      <div className={cls.tableContent}>
        <CardOrTableComp<schema.XFlowDefine>
          dataSource={[]}
          hideOperation={true}
          scroll={{ y: 300 }}
          columns={FlowColumn}
          rowKey={(record: any) => record?.id}
          rowSelection={{
            type: 'radio',
            onSelect: (record: any, _: any) => {
              props.searchFn(record);
            },
          }}
          request={async (page) => {
            let result = (await thingCtrl.loadFlowDefine()).data;
            let data = result.result?.filter((a) => props.disableIds.indexOf(a.id) < 0);
            return {
              total: data?.length || 0,
              result: data,
              offset: page.offset,
              limit: page.limit,
            };
          }}
        />
      </div>
    </div>
  );
};

export default WorkSelectTable;
