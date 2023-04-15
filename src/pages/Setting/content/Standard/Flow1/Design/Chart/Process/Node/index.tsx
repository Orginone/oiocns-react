import { Tooltip } from 'antd';
import {
  ForkOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  UsergroupAddOutlined,
  MailOutlined,
} from '@ant-design/icons';
import InsertButton from '../InsertButton';
import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import SelectAuth from '@/pages/Setting/content/Standard/Flow/Comp/selectAuth';
import { NodeType } from '../../../enum';

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
  //默认操作组织id
  operateOrgId?: string;
  node: any;
};

/**
 * 流程节点
 * @returns
 */
const Node: React.FC<NodeProps> = (props: NodeProps) => {
  const [key, setKey] = useState<number>(0);

  const onChange = (newValue: string) => {
    setKey(key + 1);
    props.node.props.assignedUser.id = newValue;
  };
  useEffect(() => {
    setKey(key + 1);
  }, [props.node]);

  const footer = (
    <>
      <div className={cls['node-footer']}>
        <div className={cls['btn']}>
          <InsertButton onInsertNode={props.onInsertNode}></InsertButton>
        </div>
      </div>
    </>
  );

  const nodeHeader = (
    <div
      className={
        props.node.NodeType === NodeType.APPROVAL
          ? cls['node-body-people']
          : cls['node-body-left']
      }>
      {props.node.NodeType === NodeType.APPROVAL && (
        <UsergroupAddOutlined
          style={{ fontSize: '24px', paddingRight: '5px', color: '#FFFFFF' }}
        />
      )}
      {props.node.NodeType === NodeType.CHILDWORK && (
        <ForkOutlined
          style={{ fontSize: '24px', paddingRight: '5px', color: 'rgb(21, 188, 131)' }}
        />
      )}
      {props.node.NodeType === NodeType.CC && (
        <MailOutlined
          style={{ fontSize: '24px', paddingRight: '5px', color: '#ff9e3a' }}
        />
      )}
      {props.node.NodeType === NodeType.START && (
        <span className={cls['process-content']}>START</span>
        // <TagOutlined
        //   style={{ fontSize: '24px', paddingRight: '5px', color: '#ff9e3a' }}
        // />
      )}
    </div>
  );

  const nodeContent = (
    <>
      {props.isRoot && (
        <div className={cls['node-root-body-right']} onClick={props.onSelected()}>
          <div style={{ width: '86%', height: '100%', paddingLeft: '7%' }}>
            <SelectAuth onChange={onChange} value={props.node.props.assignedUser?.id} />
          </div>
        </div>
      )}
      {!props.isRoot && (
        <div className={cls['node-body-right']}>
          <div onClick={props.onSelected()}>
            <span className={cls['name-title']}>{props.title}</span>
          </div>
          <div>
            {!props.content && (
              <span onClick={props.onSelected()} className={cls['placeholder']}>
                {props.placeholder}
              </span>
            )}
            {props.content && (
              <span onClick={props.onSelected()} className={cls['name-select-title']}>
                {props.content}
              </span>
            )}
            {/* <RightOutlined className={cls['node-body-rightOutlined']} /> */}
            <CloseOutlined
              className={cls['iconPosition']}
              style={{ fontSize: '12px', display: 'block' }}
              onClick={props.onDelNode()}
            />
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

  return props.show ? (
    <div
      className={`${cls['node']} ${props.isRoot || !props.show ? cls['root'] : ''}  ${
        props.showError || props.node?._passed === 0 ? cls['node-error-state'] : ''
      }
        ${props.node?._passed === 1 ? cls['node-ongoing-state'] : ''}
        ${props.node?._passed === 2 ? cls['node-completed-state'] : ''}`}>
      <div className={`${cls['node-body']} ${props.showError ? cls['error'] : ''}`}>
        <div
          key={key}
          className={
            props.node.NodeType === NodeType.APPROVAL
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
  ) : (
    <div
      className={`${cls['node']} ${props.isRoot || !props.show ? cls['root'] : ''}  ${
        props.showError || (props._passed === 0 && !props._executable)
          ? cls['node-error-state']
          : ''
      }  ${props._passed === 0 && props._executable ? cls['node-unCompleted-state'] : ''}
      ${props._passed === 1 && !props._executable ? cls['node-ongoing-state'] : ''}  ${
        props._passed === 2 ? cls['node-completed-state'] : ''
      }`}>
      {footer}
    </div>
  );
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
