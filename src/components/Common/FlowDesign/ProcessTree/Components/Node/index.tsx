import * as ai from '@/icons/ai';
import InsertButton from '../InsertButton';
import React from 'react';
import cls from './index.module.less';
import { AddNodeType } from '@/components/Common/FlowDesign/processType';

type NodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onSelected: Function;
  config: any;
  isEdit: boolean;
};

/**
 * 流程节点
 * @returns
 */
const Node: React.FC<NodeProps> = (props: NodeProps) => {
  let isRoot = false;
  let placeholder = '';
  switch (props.config.type) {
    case AddNodeType.ROOT:
      isRoot = true;
      placeholder = '全员';
      break;
    case AddNodeType.APPROVAL:
      placeholder = '请设置审批对象';
      break;
    case AddNodeType.CC:
      placeholder = '请设置抄送对象';
      break;
    case AddNodeType.CHILDWORK:
      placeholder = '请选择其他办事';
      break;
    case AddNodeType.EMPTY:
      placeholder = '空节点';
      break;
    default:
      break;
  }
  if (props.config.type == AddNodeType.EMPTY) {
    return (
      <div className={`${cls['node']} ${cls['root']}`}>
        <div className={cls['node-footer']}>
          <div className={cls['btn']}>
            {props.isEdit && (
              <InsertButton allowBranche onInsertNode={props.onInsertNode} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${cls['node']} ${isRoot ? cls['root'] : ''}`}>
      <div className={cls['node-body']}>
        <div
          className={
            props.config.type === AddNodeType.APPROVAL
              ? cls.nodeAproStyle
              : cls.nodeNewStyle
          }>
          <div
            style={{ display: 'flex' }}
            onClick={() => props.onSelected()}
            title="点击配置">
            <div className={cls['node-body-header']}>{props.config.type}</div>
            <div className={cls['node-body-right']}>
              <div className={cls['name-title']}>{props.config.name}</div>
              <span className={cls['name-select-title']}>
                {props.config.destName || (
                  <span style={{ color: '#999' }}>{placeholder}</span>
                )}
              </span>
            </div>
          </div>
          {props.isEdit && !isRoot && (
            <div className={cls.closeBtn}>
              <ai.AiOutlineClose onClick={() => props.onDelNode()} title="点击删除" />
            </div>
          )}
        </div>
      </div>
      <div className={cls['node-footer']}>
        <div className={cls['btn']}>
          {props.isEdit && (
            <InsertButton allowBranche onInsertNode={props.onInsertNode} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Node;
