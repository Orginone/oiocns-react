import React from 'react';
import cls from './index.module.less';
import { NodeModel } from '@/components/Common/FlowDesign/processType';
import { IWork } from '@/ts/core';
import CardOrTableComp from '@/components/CardOrTableComp';
import { schema } from '@/ts/base';
import { ProColumns } from '@ant-design/pro-components';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import useAsyncLoad from '@/hooks/useAsyncLoad';
interface IProps {
  current: NodeModel;
  define: IWork;
}

/**
 * @description: 成员节点配置信息
 * @return {*}
 */

const MemberWorkNode: React.FC<IProps> = (props) => {
  const [loaded, nodeInfo] = useAsyncLoad(async () => {
    await props.define.loadMemberNodeInfo();
    return props.define.memberNodeInfo.filter((a) => a.memberNodeId == props.current.id);
  });
  /** 人员信息列 */
  const MemberInfoColumns: ProColumns<schema.XMemberNodeInfo>[] = [
    { title: '序号', valueType: 'index', width: 50 },
    {
      title: '办事名称',
      dataIndex: 'name',
      render: (_: any, record: schema.XMemberNodeInfo) => {
        return <EntityIcon entityId={record.targetId} showName />;
      },
    },
    {
      title: '绑定时间',
      dataIndex: 'createTime',
    },
  ];
  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        {loaded && (
          <CardOrTableComp<schema.XMemberNodeInfo>
            dataSource={nodeInfo ?? []}
            hideOperation={true}
            scroll={{ y: 'calc(60vh - 150px)' }}
            columns={MemberInfoColumns}
            rowKey={'id'}
          />
        )}
      </div>
    </div>
  );
};
export default MemberWorkNode;
