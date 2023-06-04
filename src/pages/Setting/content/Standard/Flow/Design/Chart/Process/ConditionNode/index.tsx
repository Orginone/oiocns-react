import React, { useMemo } from 'react';
import InsertButton from '../InsertButton';
import cls from './index.module.less';
import { AiOutlineCopy, AiOutlineClose } from 'react-icons/ai';
import { conditiondType } from '../../FlowDrawer/processType';

type IProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onCopy: Function;
  onSelected: Function;
  config: any;
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
    const conditions = props.config.conditions as conditiondType[];
    var text = '请设置条件';
    if (conditions && conditions.length > 0) {
      text = conditions.map((a) => `${a.paramLabel} ${a.label} ${a.val} `).join('且');
    }
    return text;
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
      {!content && <span className={cls['placeholder']}>请设置条件</span>}
      {content && <span className={cls['name']}>{content}</span>}
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
  config: {},
  level: 1,
  size: 0,
};

export default ConditionNode;
