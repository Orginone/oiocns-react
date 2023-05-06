import React from 'react';
import cls from './index.module.less';
import { FlowColumn } from '@/pages/Setting/config/columns';
import CardOrTableComp from '@/components/CardOrTableComp';
import { IBelong, SpeciesType } from '@/ts/core';
import { schema } from '@/ts/base';
import { IAppModule } from '@/ts/core/thing/app/appmodule';
import { XWorkDefine } from '@/ts/base/schema';
import { IWorkItem } from '@/ts/core/thing/app/work/workitem';
interface indexType {
  space: IBelong;
  species: IAppModule;
  searchFn: Function;
  disableIds: string[];
}

const WorkSelectTable: React.FC<indexType> = (props) => {
  return (
    <div className={cls.tableBox}>
      <div className={cls.tableContent}>
        <CardOrTableComp<schema.XWorkDefine>
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
            let works = props.species.children.filter(
              (a) => a.metadata.typeName == SpeciesType.WorkItem,
            );
            let defines: XWorkDefine[] = [];
            for (let work of works) {
              defines.push(...(work as IWorkItem).defines);
            }
            let data = defines?.filter((a) => props.disableIds.indexOf(a.id) < 0);
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
