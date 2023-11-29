import React from 'react';
import cls from './index.module.less';
import { NodeModel } from '@/components/Common/FlowDesign/processType';
import { IWork } from '@/ts/core';
import CardOrTableComp from '@/components/CardOrTableComp';
import { schema } from '@/ts/base';
import { ProColumns } from '@ant-design/pro-components';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import message from '@/utils/message';
import useObjectUpdate from '@/hooks/useObjectUpdate';
interface IProps {
  current: NodeModel;
  define: IWork;
}

/**
 * @description: 成员节点配置信息
 * @return {*}
 */

const GatewayNode: React.FC<IProps> = (props) => {
  const [tkey, tforceUpdate] = useObjectUpdate(props.current);
  const [loaded, nodeInfo] = useAsyncLoad(async () => {
    await props.define.loadGatewayInfo();
    return props.define.gatewayInfo.filter((a) => a.nodeId == props.current.id);
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
  // 操作内容渲染函数
  const renderOperate = (item: schema.XWorkGateway) => {
    return [
      {
        key: item.id,
        label: `解绑`,
        onClick: async () => {
          const success = await props.define.deleteGateway(item.id);
          if (success) {
            message.info('解绑成功!');
            tforceUpdate();
          }
        },
      },
    ];
  };
  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        {loaded && (
          <CardOrTableComp<schema.XWorkGateway>
            key={tkey}
            rowKey={'id'}
            dataSource={nodeInfo ?? []}
            scroll={{ y: 'calc(60vh - 150px)' }}
            operation={renderOperate}
            columns={MemberInfoColumns}
          />
        )}
      </div>
    </div>
  );
};
export default GatewayNode;
