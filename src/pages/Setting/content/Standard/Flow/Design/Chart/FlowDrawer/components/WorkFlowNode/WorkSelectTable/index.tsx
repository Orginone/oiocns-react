import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import { FlowColumn } from '@/pages/Setting/config/columns';
import CardOrTableComp from '@/components/CardOrTableComp';
import { IWork } from '@/ts/core';
import { schema } from '@/ts/base';
import { XWorkDefine } from '@/ts/base/schema';
interface indexType {
  work: IWork;
  searchFn: Function;
}

const WorkSelectTable: React.FC<indexType> = (props) => {
  const [defines, setDefines] = useState<XWorkDefine[]>([]);
  useEffect(() => {
    props.work.app.loadWorkDefines().then((values) => {
      setDefines([...values.map((i) => i.metadata)]);
    });
  }, []);
  return (
    <div className={cls.tableBox}>
      <div className={cls.tableContent}>
        <CardOrTableComp<schema.XWorkDefine>
          dataSource={defines}
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
        />
      </div>
    </div>
  );
};

export default WorkSelectTable;
