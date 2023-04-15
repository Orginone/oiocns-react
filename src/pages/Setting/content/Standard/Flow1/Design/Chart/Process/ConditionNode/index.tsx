import React, { useState, useMemo } from 'react';
import InsertButton from '../InsertButton';
import cls from './index.module.less';
import { CopyOutlined, CloseOutlined } from '@ant-design/icons';
import { FieldCondition } from '../../FlowDrawer/processType';

type IProps = {
  //默认操作组织id
  operateOrgId?: string;
  conditions?: FieldCondition[];
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
  const [showError, setShowError] = useState<boolean>(false);

  const findNameBykey = (condition: any, type: string) => {
    let name: string;
    let options = [
      { value: 'EQ', label: '=' },
      { value: 'GT', label: '>' },
      { value: 'GTE', label: '≥' },
      { value: 'LT', label: '<' },
      { value: 'LTE', label: '≤' },
      { value: 'NEQ', label: '≠' },
    ];
    let allConditions = props.conditions || [];
    switch (type) {
      case 'attr':
        name = condition.paramKey;
        for (let cd of allConditions) {
          if (cd.value == condition.paramKey) {
            name = cd.label;
            break;
          }
        }
        break;
      case 'key':
        name = condition.key;
        for (let option of options) {
          if (option.value == condition.key) {
            name = option.label;
            break;
          }
        }
        break;
      case 'dict':
        name = condition.val;
        for (let cd of allConditions) {
          if (cd.value == condition.paramKey) {
            if (cd.dict) {
              for (let entry of cd.dict) {
                if (entry.value == condition.val) {
                  name = entry.label;
                  break;
                }
              }
            }
            break;
          }
        }
        break;
      default:
        name = condition.paramKey;
    }
    return name;
  };
  const content = useMemo(() => {
    const conditions = props.config.conditions;
    var text = '请设置条件';
    if (conditions && conditions.length > 0) {
      text = '';
      for (let condition of conditions) {
        text +=
          findNameBykey(condition, 'attr') +
          findNameBykey(condition, 'key') +
          findNameBykey(condition, 'dict') +
          ' 且 ';
      }
      text = text.substring(0, text.lastIndexOf(' 且 '));
      const getFindValue = conditions.find(
        (item: { paramLabel: string; paramKey: string }) => {
          const findData = props.conditions?.find(
            (innItem: { label: string; value: string }) => {
              return innItem.value === item.paramKey;
            },
          );
          /**能找到说明是可以的 */
          return typeof findData === 'undefined';
        },
      );
      if (getFindValue) {
        setShowError(true);
      }
    }
    return text;
  }, [props.config]);

  return (
    <div className={`${cls['node']} ${showError && cls['node-error-state']}`}>
      <div className={`${cls['node-body']} ${showError ? cls['error'] : ''}`}>
        <div className={cls['node-body-main']}>
          <div className={cls['node-body-main-header']}>
            <span className={cls['title']}>
              {props.config.name ? props.config.name : '条件' + props.level}
            </span>
            <span className={cls['option']}>
              <CopyOutlined
                style={{ fontSize: '12px', paddingRight: '5px' }}
                onClick={props.onCopy()}
              />
              <CloseOutlined style={{ fontSize: '12px' }} onClick={props.onDelNode()} />
            </span>
          </div>
          <div className={cls['node-body-main-content']} onClick={props.onSelected()}>
            {!content && <span className={cls['placeholder']}>请设置条件</span>}
            {content && <span className={cls['name']}>{content}</span>}
            {showError && (
              <p style={{ color: 'red', paddingBottom: '10px' }}>
                该条件已修改或者删除，请重新设置
              </p>
            )}
          </div>
        </div>
      </div>
      <div className={cls['node-footer']}>
        <div className={cls['btn']}>
          <InsertButton onInsertNode={props.onInsertNode} />
        </div>
      </div>
    </div>
  );
};

ConditionNode.defaultProps = {
  config: {},
  level: 1,
  size: 0,
};

export default ConditionNode;
