import React, { useState, useMemo } from 'react';
import InsertButton from '@/bizcomponents/Flow/Process/InsertButton';
import cls from './index.module.less';
import { CopyOutlined, CloseOutlined } from '@ant-design/icons';
import { useAppwfConfig } from '@/bizcomponents/Flow/flow';

type ConditionNodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onCopy: Function;
  onSelected: Function;
  config: any;
  level: any;
  [key: string]: any;
};

/**
 * 条件节点
 * @returns
 */
const ConditionNode: React.FC<ConditionNodeProps> = (props: ConditionNodeProps) => {
  const [showError, setShowError] = useState<boolean>(false);
  const [placeholder, setPlaceholder] = useState<string>('请设置条件');
  const design = useAppwfConfig((state: any) => state.design);
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
    const conditions = props.config.conditions;
    const currentCondition = JSON.parse(design.remark);

    // console.log('瞅瞅这这里的条件', currentCondition);
    // console.log('渲染是不是也走这里______', conditions);

    // 这里写渲染逻辑
    // conditions[0]

    var text = '请设置条件';
    if (conditions && conditions.length > 0) {
      text = '';
      for (let condition of conditions) {
        text +=
          condition.paramLabel +
          condition.label +
          (condition.valLabel || condition.val) +
          ' 且 ';
      }
      text = text.substring(0, text.lastIndexOf(' 且 '));
      /** 如果没有找到字段就报错 */
      const getFindValue = currentCondition.find((item: any) => {
        return (
          item.label === conditions[0].paramLabel && item.value === conditions[0].paramKey
        );
      });
      if (!getFindValue) {
        setShowError(true);
      }
    }
    return text;
  }, [props.config]);
  const footer = (
    <div className={cls['btn']}>
      <InsertButton onInsertNode={props.onInsertNode}></InsertButton>
    </div>
  );
  const nodeHeader = (
    <div className={cls['node-body-main-header']}>
      <span className={cls['title']}>
        {props.config.name ? props.config.name : '条件' + props.level}
      </span>
      <span className={cls['option']}>
        <CopyOutlined style={{ fontSize: '12px', paddingRight: '5px' }} onClick={copy} />
        <CloseOutlined style={{ fontSize: '12px' }} onClick={delNode} />
      </span>
    </div>
  );
  const nodeContent = (
    <div className={cls['node-body-main-content']} onClick={select}>
      {!content && <span className={cls['placeholder']}>{placeholder}</span>}
      {content && <span className={cls['name']}>{content}</span>}
      {showError ? (
        <p style={{ color: 'red', paddingBottom: '10px' }}>
          该条件已修改或则删除，请重新设置
        </p>
      ) : null}
    </div>
  );
  return (
    <div className={`${cls['node']} ${showError ? cls['node-error-state'] : ''}`}>
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
