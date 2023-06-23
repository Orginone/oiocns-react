import * as ai from 'react-icons/ai';
import InsertButton from '../InsertButton';
import React from 'react';
import cls from './index.module.less';
import { AddNodeType } from '@/components/Common/FlowDesign/processType';

type NodeProps = {
  _executable?: boolean;
  _passed?: number;
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
  const delNode = () => {
    props.onDelNode();
  };
  const select = () => {
    props.onSelected();
  };

  let isRoot = false;
  let placeholder = '';
  let header = <></>;
  let headerCls = cls['node-body-left'];
  switch (props.config.type) {
    case AddNodeType.ROOT:
      isRoot = true;
      placeholder = '全员';
      header = <span className={cls['process-content']}>START</span>;
      break;
    case AddNodeType.APPROVAL:
      placeholder = '请设置审批对象';
      headerCls = cls['node-body-people'];
      header = (
        <ai.AiOutlineTeam
          style={{ fontSize: '24px', paddingRight: '5px', color: '#FFFFFF' }}
        />
      );
      break;
    case AddNodeType.CC:
      placeholder = '请设置抄送对象';
      header = (
        <ai.AiOutlineMail
          style={{ fontSize: '24px', paddingRight: '5px', color: '#ff9e3a' }}
        />
      );
      break;
    case AddNodeType.CHILDWORK:
      placeholder = '请选择其他办事';
      header = (
        <ai.AiOutlineFork
          style={{ fontSize: '24px', paddingRight: '5px', color: 'rgb(21, 188, 131)' }}
        />
      );
      break;
    case AddNodeType.EMPTY:
      placeholder = '空节点';
      break;
    default:
      break;
  }
  const nodeContent = (
    <>
      <div className={cls['node-body-right']}>
        <div>
          <span className={cls['name-title']}>{props.config.name}</span>
        </div>
        <div>
          {props.config.destName == undefined || props.config.destName == '' ? (
            <span className={cls['placeholder']}>{placeholder}</span>
          ) : (
            <span className={cls['name-select-title']}>{props.config.destName}</span>
          )}
        </div>
      </div>
    </>
  );
  if (props.config.type == AddNodeType.EMPTY) {
    return (
      <div
        className={`${cls['node']} ${cls['root']}  ${
          props._passed === 0 && !props._executable ? cls['node-error-state'] : ''
        }  ${
          props._passed === 0 && props._executable ? cls['node-unCompleted-state'] : ''
        }
         ${props._passed === 1 && !props._executable ? cls['node-ongoing-state'] : ''}  ${
          props._passed === 2 ? cls['node-completed-state'] : ''
        }`}>
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
    <div
      className={`${props.isEdit ? cls['node'] : cls['node-unEdit']} ${
        isRoot ? cls['root'] : ''
      }  ${props.config?._passed === 0 ? cls['node-error-state'] : ''}
        ${props.config?._passed === 1 ? cls['node-ongoing-state'] : ''}
        ${props.config?._passed === 2 ? cls['node-completed-state'] : ''}`}>
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
            <div onClick={select} className={headerCls}>
              {header}
            </div>
            {nodeContent}
          </div>
          {props.isEdit && !isRoot && (
            <div className={cls.closeBtn}>
              <ai.AiOutlineClose onClick={delNode} title="点击删除" />
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
