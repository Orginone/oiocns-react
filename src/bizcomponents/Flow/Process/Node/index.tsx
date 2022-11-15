import { Tooltip } from 'antd';
import {
  UserOutlined,
  CloseOutlined,
  RightOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import InsertButton from '@/bizcomponents/Flow/Process/InsertButton';
import React, { useContext } from 'react';
import cls from './index.module.less';
import { EventContext } from '@/bizcomponents/Flow/ProcessDesign/index';
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
  const footer = (
    <div className={cls['node-footer']}>
      <div className={cls['btn']}>
        <InsertButton onInsertNode={props.onInsertNode}></InsertButton>
      </div>
    </div>
  );
  const nodeHeader = (
    <div className={cls['node-body-header']} style={{ backgroundColor: props.headerBgc }}>
      <UserOutlined style={{ fontSize: '12px', paddingRight: '5px' }} />
      <span className={cls['name']}>{props.title}</span>
      {!props.isRoot && <CloseOutlined style={{ fontSize: '12px' }} onClick={delNode} />}
    </div>
  );
  const nodeContent = (
    <div className={cls['node-body-content']} onClick={select}>
      {!props.content && <span className={cls['placeholder']}>{props.placeholder}</span>}
      {props.content && <span className={cls['name']}>{props.content}</span>}
      <RightOutlined className={cls['node-body-rightOutlined']} />
    </div>
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
        <div className={`${cls['node-body']} ${props.showError ? cls['error'] : ''}`}>
          <div>
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
