import CardOrTableComp from '@/components/CardOrTableComp';
import { FlowColumn } from '@/pages/Setting/config/columns';
import { XFlowDefine } from '@/ts/base/schema';
import { Card } from 'antd';
import React, { useState } from 'react';
import WorkStartDo from './WorkStartDo';
import { FlowDefine } from '@/ts/core/target/thing/flowDefine';
import orgCtrl from '@/ts/controller';

/**
 * 办事-业务流程--发起
 * @returns
 */
const WorkStartEntry: React.FC = () => {
  const [currentDefine, setCurrentDefine] = useState<XFlowDefine>();

  const getRenderOperations = (data: XFlowDefine) => {
    const menus: any[] = [];
    menus.push({
      key: 'retractApply',
      label: '发起',
      onClick: async () => {
        setCurrentDefine(data);
      },
    });
    return menus;
  };

  return (
    <Card>
      {!currentDefine && (
        <CardOrTableComp<XFlowDefine>
          rowKey={(record) => record?.id}
          columns={FlowColumn}
          dataSource={[]}
          request={async (page) => {
            let res = await new FlowDefine(orgCtrl.space.id).loadFlowDefine();
            return {
              result: res.result?.slice(page.offset, page.offset + page.limit) || [],
              offset: page.offset,
              limit: page.limit,
              total: res.total,
            };
          }}
          operation={(item) => getRenderOperations(item)}
        />
      )}
      {currentDefine && (
        <WorkStartDo
          current={currentDefine}
          goBack={() => {
            setCurrentDefine(undefined);
          }}></WorkStartDo>
      )}
    </Card>
  );
};

export default WorkStartEntry;
