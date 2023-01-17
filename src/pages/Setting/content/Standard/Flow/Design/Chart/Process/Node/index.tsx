import { Tooltip } from 'antd';
import {
  TagOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  UsergroupAddOutlined,
  MailOutlined,
} from '@ant-design/icons';
import InsertButton from '../InsertButton';
import React from 'react';
import cls from './index.module.less';
import userCtrl from '@/ts/controller/setting';

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
  //创建组织
  belongId?: string;
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
}

export const AddNodeTypeAndNameMaps: Record<AddNodeType, string> = {
  [AddNodeType.APPROVAL]: '审批节点',
  [AddNodeType.CC]: '抄送节点',
  [AddNodeType.CONDITIONS]: '条件节点',
  [AddNodeType.CONCURRENTS]: '同时审核节点',
  [AddNodeType.EMPTY]: '空节点',
  [AddNodeType.START]: '开始节点',
};

/**
 * 流程节点
 * @returns
 */
const Node: React.FC<NodeProps> = (props: NodeProps) => {
  const delNode = (e: React.MouseEvent) => {
    e.preventDefault();
    props.onDelNode();
  };
  const select = () => {
    props.onSelected();
  };
  const footer = (
    <div className={cls['node-footer']}>
      <div className={cls['btn']}>
        <InsertButton onInsertNode={props.onInsertNode}></InsertButton>
      </div>
    </div>
  );

  const nodeHeader = (
    <div
      className={
        props.type === AddNodeType.APPROVAL
          ? cls['node-body-people']
          : cls['node-body-left']
      }>
      {props.type === AddNodeType.APPROVAL && (
        <UsergroupAddOutlined
          style={{ fontSize: '24px', paddingRight: '5px', color: '#FFFFFF' }}
        />
      )}
      {props.type === AddNodeType.CC && (
        <MailOutlined
          style={{ fontSize: '24px', paddingRight: '5px', color: '#ff9e3a' }}
        />
      )}
      {props.type === AddNodeType.START && (
        <span className={cls['process-content']}>START</span>
        // <TagOutlined
        //   style={{ fontSize: '24px', paddingRight: '5px', color: '#ff9e3a' }}
        // />
      )}
    </div>
  );

  const nodeContent = (
    <>
      {props.isRoot && <div className={cls['node-root-body-right']}>开始</div>}
      {!props.isRoot && (
        <div className={cls['node-body-right']}>
          <div onClick={select}>
            <span className={cls['name-title']}>{props.title}</span>
          </div>
          <div>
            {!props.content && (
              <span onClick={select} className={cls['placeholder']}>
                {props.placeholder}
              </span>
            )}
            {props.content && (
              <span onClick={select} className={cls['name-select-title']}>
                {props.content}
              </span>
            )}
            {/* {props.belongId && (
              <span style={{ color: 'red' }}>创建人: {props.belongId}</span>
            )} */}
            {/* <RightOutlined className={cls['node-body-rightOutlined']} /> */}
            {(!props.belongId || props.belongId == userCtrl.space.id) && (
              <CloseOutlined
                className={cls['iconPosition']}
                style={{ fontSize: '12px', display: 'block' }}
                onClick={delNode}
              />
            )}
          </div>
        </div>
      )}
    </>
  );

  const nodeError = (
    <div className={cls['node-error']}>
      {props.showError && (
        <Tooltip placement="topLeft" title={props.errorInfo}>
          <ExclamationCircleOutlined style={{ fontSize: '20px' }} />
        </Tooltip>
      )}
    </div>
  );
  if (props.show) {
    return (
      <div
        className={`${
          !props.belongId || props.belongId == userCtrl.space.id
            ? cls['node']
            : cls['node-unEdit']
        } ${props.isRoot || !props.show ? cls['root'] : ''}  ${
          props.showError || (props._passed === 0 && !props._executable)
            ? cls['node-error-state']
            : ''
        }  ${
          props._passed === 0 && props._executable ? cls['node-unCompleted-state'] : ''
        }
        ${props._passed === 1 && !props._executable ? cls['node-ongoing-state'] : ''}  ${
          props._passed === 2 ? cls['node-completed-state'] : ''
        }`}>
        <Tooltip title={<span>创建人: {props.belongId}</span>} placement="right">
          <div className={`${cls['node-body']} ${props.showError ? cls['error'] : ''}`}>
            <div
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
        </Tooltip>
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
