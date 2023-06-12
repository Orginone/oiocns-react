import { Tooltip } from 'antd';
import {
  AiOutlineFork,
  AiOutlineClose,
  AiOutlineExclamation,
  AiOutlineUsergroupAdd,
  AiOutlineMail,
} from 'react-icons/ai';
import InsertButton from '../InsertButton';
import React, { useEffect, useState } from 'react';
import cls from './index.module.less';

type NodeProps = {
  //是否为根节点
  isRoot?: boolean;
  //是否显示节点体
  show?: boolean;
  _disabled?: boolean;
  _executable?: boolean;
  _passed?: number;
  _flowRecords?: any[];
  //节点内容区域文字
  content?: string;
  title?: string;
  placeholder?: string;
  //节点体左侧图标
  leftIcon?: string;
  //头部图标
  headerIcon?: string;
  //头部背景色
  headerBgc?: string;
  //是否显示错误状态
  showError?: boolean;
  errorInfo?: string;
  onInsertNode: Function;
  onDelNode: Function;
  onSelected: Function;
  type?: AddNodeType;
  //默认操作组织id
  config?: any;
  defaultEditable: boolean;
};

/**
 * 添加的节点枚举
 * */
export enum AddNodeType {
  'APPROVAL' = 'APPROVAL',
  'CC' = 'CC',
  'CONDITIONS' = 'CONDITIONS',
  'CONCURRENTS' = 'CONCURRENTS',
  'EMPTY' = 'EMPTY',
  'START' = 'START',
  'ORGANIZATIONAL' = 'ORGANIZATIONAL',
  'CHILDWORK' = 'CHILDWORK',
}

export const AddNodeTypeAndNameMaps: Record<AddNodeType, string> = {
  [AddNodeType.APPROVAL]: '审批节点',
  [AddNodeType.CC]: '抄送节点',
  [AddNodeType.CONDITIONS]: '条件节点',
  [AddNodeType.CONCURRENTS]: '同时审核节点',
  [AddNodeType.EMPTY]: '空节点',
  [AddNodeType.START]: '开始节点',
  [AddNodeType.ORGANIZATIONAL]: '组织网关',
  [AddNodeType.CHILDWORK]: '子流程',
};

/**
 * 流程节点
 * @returns
 */
const Node: React.FC<NodeProps> = (props: NodeProps) => {
  const [editable, setEditable] = useState<boolean>(true);
  const [key, setKey] = useState<number>(0);
  const isEditable = (): boolean => {
    let editable = props.defaultEditable;
    return editable;
  };
  useEffect(() => {
    setEditable(isEditable());
  }, []);
  const delNode = (e: React.MouseEvent) => {
    props.onDelNode();
  };
  const select = () => {
    props.onSelected();
  };
  const onChange = (newValue: string) => {
    setKey(key + 1);
    props.config.props.assignedUser[0].id = newValue;
  };
  useEffect(() => {
    setKey(key + 1);
  }, [props.config]);
  const footer = (
    <>
      <div className={cls['node-footer']}>
        <div className={cls['btn']}>
          {editable && <InsertButton onInsertNode={props.onInsertNode}></InsertButton>}
        </div>
      </div>
    </>
  );

  const nodeHeader = (
    <div
      className={
        props.type === AddNodeType.APPROVAL
          ? cls['node-body-people']
          : cls['node-body-left']
      }>
      {props.type === AddNodeType.APPROVAL && (
        <AiOutlineUsergroupAdd
          style={{ fontSize: '24px', paddingRight: '5px', color: '#FFFFFF' }}
        />
      )}
      {props.type === AddNodeType.CHILDWORK && (
        <AiOutlineFork
          style={{ fontSize: '24px', paddingRight: '5px', color: 'rgb(21, 188, 131)' }}
        />
      )}
      {props.type === AddNodeType.CC && (
        <AiOutlineMail
          style={{ fontSize: '24px', paddingRight: '5px', color: '#ff9e3a' }}
        />
      )}
      {props.type === AddNodeType.START && (
        <span className={cls['process-content']}>START</span>
      )}
    </div>
  );

  const nodeContent = (
    <>
      {/* {props.isRoot && (
        <div
          className={cls['node-root-body-right']}
          onClick={(e) => {
            select();
          }}>
          <div style={{ width: '86%', height: '100%', paddingLeft: '7%' }}>
            <SelectAuth
              onChange={onChange}
              readonly={!editable}
              value={props.config.props.assignedUser[0]?.id}></SelectAuth>
          </div>
        </div>
      )} */}
      {/* {!props.isRoot && ( */}
      <div className={cls['node-body-right']}>
        <div
          onClick={(e) => {
            select();
          }}>
          <span className={cls['name-title']}>{props.title}</span>
        </div>
        <div>
          {!props.content && (
            <span
              onClick={(e) => {
                select();
              }}
              className={cls['placeholder']}>
              {props.placeholder}
            </span>
          )}
          {props.content && (
            <span
              onClick={(e) => {
                select();
              }}
              className={cls['name-select-title']}>
              {props.content}
            </span>
          )}
          {/* <RightOutlined className={cls['node-body-rightOutlined']} /> */}
          {editable && !props.isRoot && (
            <AiOutlineClose
              className={cls['iconPosition']}
              style={{ fontSize: '12px', display: 'block' }}
              onClick={delNode}
            />
          )}
        </div>
      </div>
    </>
  );

  const nodeError = (
    <div className={cls['node-error']}>
      {props.showError && (
        <Tooltip placement="topLeft" title={props.errorInfo}>
          <AiOutlineExclamation style={{ fontSize: '20px' }} />
        </Tooltip>
      )}
    </div>
  );
  if (props.show) {
    return (
      <div
        className={`${editable ? cls['node'] : cls['node-unEdit']} ${
          props.isRoot || !props.show ? cls['root'] : ''
        }  ${
          props.showError || props.config?._passed === 0 ? cls['node-error-state'] : ''
        }
        ${props.config?._passed === 1 ? cls['node-ongoing-state'] : ''}
        ${props.config?._passed === 2 ? cls['node-completed-state'] : ''}`}>
        <div className={`${cls['node-body']} ${props.showError ? cls['error'] : ''}`}>
          <div
            key={key}
            className={
              props.type === AddNodeType.APPROVAL
                ? cls['nodeAproStyle']
                : cls['nodeNewStyle']
            }>
            {nodeHeader}
            {nodeContent}
            {nodeError}
          </div>
        </div>
        {footer}
      </div>
    );
  } else {
    return (
      <div
        className={`${cls['node']} ${props.isRoot || !props.show ? cls['root'] : ''}  ${
          props.showError || (props._passed === 0 && !props._executable)
            ? cls['node-error-state']
            : ''
        }  ${
          props._passed === 0 && props._executable ? cls['node-unCompleted-state'] : ''
        }
      ${props._passed === 1 && !props._executable ? cls['node-ongoing-state'] : ''}  ${
          props._passed === 2 ? cls['node-completed-state'] : ''
        }`}>
        {footer}
      </div>
    );
  }
};

Node.defaultProps = {
  isRoot: false,
  show: true,
  content: '',
  title: '标题',
  placeholder: '请设置',
  leftIcon: undefined,
  headerIcon: '',
  headerBgc: '#576a95',
  showError: false,
  errorInfo: '无信息',
};

export default Node;
