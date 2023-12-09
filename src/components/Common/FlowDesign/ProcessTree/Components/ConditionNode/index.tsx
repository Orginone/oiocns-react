import React from 'react';
import InsertButton from '../InsertButton';
import cls from './index.module.less';
import { AiOutlineClose } from 'react-icons/ai';
import { NodeModel } from '@/components/Common/FlowDesign/processType';

type IProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onSelected: Function;
  config: NodeModel;
  level: number;
  isEdit: boolean;
};

/**
 * 条件节点
 * @returns
 */
const ConditionNode: React.FC<IProps> = (props) => {
  return (
    <div className={cls['node']} onClick={() => props.onSelected()}>
      <div className={`${cls['node-body']}`}>
        <div className={cls['node-body-main']}>
          <div className={cls['node-body-main-header']}>
            <span className={cls['title']}>
              {props.config.name ? props.config.name : '条件' + props.level}
            </span>
            {props.isEdit && (
              <span className={cls['option']}>
                <AiOutlineClose
                  style={{ fontSize: '15px', marginRight: '10px' }}
                  onClick={() => props.onDelNode()}
                />
              </span>
            )}
          </div>
          <div className={cls['node-body-main-content']}>
            <span className={cls['name']}>
              {props.config.conditions?.map((a) => a.display).join('且') || '请设置条件'}
            </span>
          </div>
        </div>
      </div>

      <div className={cls['node-footer']}>
        <div className={cls['btn']}>
          {props.isEdit && <InsertButton onInsertNode={props.onInsertNode} />}
        </div>
      </div>
    </div>
  );
};

ConditionNode.defaultProps = {
  config: {} as NodeModel,
  level: 1,
};

export default ConditionNode;
