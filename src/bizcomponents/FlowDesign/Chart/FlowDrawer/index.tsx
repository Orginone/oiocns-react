import React, { useEffect, useState } from 'react';
import { Drawer, Typography } from 'antd';
import ApprovalNode from './Components/ApprovalNode';
import WorkFlowNode from './Components/WorkFlowNode';
import CcNode from './Components/CcNode';
import RootNode from './Components/RootNode';
import ConcurrentNode from './Components/ConcurrentNode';
import DeptWayNode from './Components/DeptWayNode';
import ConditionNode from './Components/ConditionNode';
import { AddNodeType, FieldCondition, NodeModel, dataType } from '../../processType';
import orgCtrl from '@/ts/controller';
import { getUuid } from '@/utils/tools';
import { IWorkDefine, SpeciesType } from '@/ts/core';
import { schema } from '@/ts/base';
import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';
/**
 * @description: 流程设置抽屉
 * @return {*}
 */

interface IProps {
  instance?: schema.XWorkInstance;
  isOpen: boolean;
  current: NodeModel;
  onClose: () => void;
  define?: IWorkDefine;
  defaultEditable: boolean;
  forms: schema.XForm[];
}

const FlowDrawer: React.FC<IProps> = (props) => {
  const [key, setKey] = useState<string>();
  const [conditions, setConditions] = useState<FieldCondition[]>([]);

  useEffect(() => {
    if (props.define && props.current.type == AddNodeType.CONDITION) {
      setTimeout(async () => {
        let fields: FieldCondition[] = [];
        for (const form of props.forms.filter((a) => a.typeName == SpeciesType.Work)) {
          const attrs = await orgCtrl.work.loadAttributes(
            form.id,
            props.define!.workItem.belongId,
          );
          for (let attr of attrs) {
            switch (attr!.valueType) {
              case '数值型':
                fields.push({
                  label: attr.name,
                  value: attr.id,
                  type: dataType.NUMERIC,
                });
                break;
              case '选择型':
                {
                  if (attr.dictId) {
                    fields.push({
                      label: attr.name,
                      value: attr.id,
                      type: dataType.DICT,
                      dict: (await orgCtrl.work.loadItems(attr.dictId)).map((a) => {
                        return { label: a.name, value: a.id };
                      }),
                    });
                  }
                }
                break;
              default:
                fields.push({
                  label: attr.name,
                  value: attr.id,
                  type: dataType.STRING,
                });
                break;
            }
          }
        }
        setConditions(fields);
      }, 10);
    }
  });

  const Component = () => {
    if (props.defaultEditable && props.define) {
      switch (props.current.type) {
        case AddNodeType.ROOT:
          return <RootNode current={props.current} define={props.define} />;
        case AddNodeType.APPROVAL:
          return <ApprovalNode current={props.current} define={props.define} />;
        case AddNodeType.CHILDWORK:
          return <WorkFlowNode current={props.current} define={props.define} />;
        case AddNodeType.CC:
          return <CcNode current={props.current} work={props.define.workItem} />;
        case AddNodeType.CONDITION:
          return <ConditionNode current={props.current} conditions={conditions} />;
        case AddNodeType.CONCURRENTS:
          return <ConcurrentNode current={props.current} />;
        case AddNodeType.ORGANIZATIONA:
          return <DeptWayNode current={props.current} />;
        default:
          return <div>暂无需要处理的数据</div>;
      }
    } else if (props.instance) {
      return props.instance.tasks
        ?.find((a) => a.nodeId == props.current.id)
        ?.records?.map((record: any) => {
          let handleResult = '通过';
          if (record.status >= 200) {
            handleResult = '不通过';
          }
          return (
            <>
              <div>
                审核人：
                <EntityIcon entityId={record.createUser} showName />
              </div>
              <div>审核结果：{handleResult}</div>
              <div>审核意见：{record.comment}</div>
              <div>审核时间：{record.createTime}</div>
            </>
          );
        });
    }
  };

  return (
    <Drawer
      title={
        <div key={key}>
          <Typography.Title
            editable={
              props.defaultEditable
                ? {
                    onChange: (e: any) => {
                      props.current.name = e;
                      setKey(getUuid());
                    },
                  }
                : false
            }
            level={5}
            style={{ margin: 0 }}>
            {props.current.name}
          </Typography.Title>
        </div>
      }
      open={props.isOpen}
      destroyOnClose
      placement="right"
      onClose={() => props.onClose()}
      width={500}>
      {Component()}
    </Drawer>
  );
};

export default FlowDrawer;
