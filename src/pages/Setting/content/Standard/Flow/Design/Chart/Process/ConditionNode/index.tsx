import React, { useMemo } from 'react';
import InsertButton from '../InsertButton';
import cls from './index.module.less';
import { AiOutlineCopy, AiOutlineClose } from 'react-icons/ai';
import { NodeType } from '../../FlowDrawer/processType';

type IProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onCopy: Function;
  onSelected: Function;
  config: NodeType;
  level: any;
  defaultEditable: boolean;
  [key: string]: any;
};

/**
 * 条件节点
 * @returns
 */
const ConditionNode: React.FC<IProps> = (props) => {
  const delNode = () => {
    props.onDelNode();
  };
  const copy = () => {
    props.onCopy();
  };
  const select = () => {
    props.onSelected();
  };
  const content = useMemo(() => {
    if (props.config.conditions.length > 0) {
      return props.config.conditions.map((a) => a.display).join('且');
    }
    return '请设置条件';
  }, [props.config]);
  const footer = (
    <>
      <div className={cls['btn']}>
        {props.defaultEditable && (
          <InsertButton onInsertNode={props.onInsertNode}></InsertButton>
        )}
      </div>
    </>
  );
  const nodeHeader = (
    <div className={cls['node-body-main-header']}>
      <span className={cls['title']}>
        {props.config.name ? props.config.name : '条件' + props.level}
      </span>
      {props.defaultEditable && (
        <span className={cls['option']}>
          <AiOutlineCopy
            style={{ fontSize: '12px', paddingRight: '5px' }}
            onClick={copy}
          />
          <AiOutlineClose style={{ fontSize: '12px' }} onClick={delNode} />
        </span>
      )}
    </div>
  );
  const nodeContent = (
    <div className={cls['node-body-main-content']} onClick={select}>
      <span className={cls['name']}>{content}</span>
    </div>
  );
  return (
    <div className={`${props.defaultEditable ? cls['node'] : cls['node-unEdit']} `}>
      <div className={`${cls['node-body']}`}>
        <div className={cls['node-body-main']}>
          {nodeHeader}
          {nodeContent}
        </div>
      </div>

      <div className={cls['node-footer']}>{footer}</div>
    </div>
  );
};

ConditionNode.defaultProps = {
  config: {} as NodeType,
  level: 1,
  size: 0,
};

export default ConditionNode;
