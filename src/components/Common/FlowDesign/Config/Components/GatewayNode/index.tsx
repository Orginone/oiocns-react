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

const GatewayNode: React.FC<IProps> = (props) => {
  const [loaded, nodeInfo] = useAsyncLoad(async () => {
    await props.define.loadGatewayInfo();
    return props.define.gatwayInfo.filter((a) => a.nodeId == props.current.id);
  });
  /** 人员信息列 */
  const MemberInfoColumns: ProColumns<schema.XWorkGateway>[] = [
    { title: '序号', valueType: 'index', width: 50 },
    {
      title: '组织',
      dataIndex: 'target',
      render: (_: any, record: schema.XWorkGateway) => {
        return <EntityIcon entityId={record.targetId} showName />;
      },
    },
    {
      title: '办事名称',
      dataIndex: 'name',
      render: (_: any, record: schema.XWorkGateway) => {
        return record.define?.name;
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
          <CardOrTableComp<schema.XWorkGateway>
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
export default GatewayNode;
