import React, { useState, useMemo, useEffect } from 'react';
import InsertButton from '../InsertButton';
import cls from './index.module.less';
import { AiOutlineCopy, AiOutlineClose } from 'react-icons/ai';
import { FieldCondition } from '../../FlowDrawer/processType';

type IProps = {
  //默认操作组织id
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
  const [editable, setEditable] = useState<boolean>(true);

  const delNode = () => {
    props.onDelNode();
  };
  const copy = () => {
    props.onCopy();
  };
  const select = () => {
    props.onSelected();
  };

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
  useEffect(() => {
    setEditable(props.defaultEditable);
  }, []);
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
  const footer = (
    <>
      <div className={cls['btn']}>
        {editable && <InsertButton onInsertNode={props.onInsertNode}></InsertButton>}
      </div>
    </>
  );
  const nodeHeader = (
    <div className={cls['node-body-main-header']}>
      <span className={cls['title']}>
        {props.config.name ? props.config.name : '条件' + props.level}
      </span>
      {editable && (
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
      {showError && editable ? (
        <p style={{ color: 'red', paddingBottom: '10px' }}>
          该条件已修改或者删除，请重新设置
        </p>
      ) : null}
    </div>
  );
  return (
    <div
      className={`${editable ? cls['node'] : cls['node-unEdit']} ${
        showError && editable ? cls['node-error-state'] : ''
      }`}>
      <div className={`${cls['node-body']} ${showError ? cls['error'] : ''}`}>
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
