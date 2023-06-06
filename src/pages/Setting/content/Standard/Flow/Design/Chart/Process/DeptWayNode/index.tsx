import React, { useEffect, useState } from 'react';
import InsertButton from '../InsertButton';
import { AiOutlineCopy, AiOutlineClose } from 'react-icons/ai';
import cls from './index.module.less';
import SelectOrg from '@/pages/Setting/content/Standard/Flow/Comp/selectOrg';
import { dataType } from '../../FlowDrawer/processType';
import { IBelong } from '@/ts/core';
type DeptWayNodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onCopy: Function;
  onSelected: Function;
  config: any;
  level: any;
  belong: IBelong;
  defaultEditable: boolean;
  [key: string]: any;
};

/**
 * 并行节点
 * @returns
 */
const DeptWayNode: React.FC<DeptWayNodeProps> = (props: DeptWayNodeProps) => {
  const [key, setKey] = useState<number>(0);
  const [orgId, setOrgId] = useState<string>();
  const delNode = () => {
    props.onDelNode();
  };
  const copy = () => {
    props.onCopy();
  };
  const select = () => {
    props.onSelected();
  };

  useEffect(() => {
    if (props.config.conditions.length == 0) {
      props.config.conditions = [
        {
          pos: 1,
          paramKey: 'belongId',
          paramLabel: '组织',
          key: 'EQ',
          label: '=',
          type: dataType.BELONG,
          val: props.belong.id,
        },
      ];
      setKey(key + 1);
    }
    if (!props.defaultEditable) {
      setOrgId(props.config.conditions[0]?.val);
    } else {
      setOrgId(props.belong.id);
    }
  }, []);

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
        <i className={cls['el-icon-s-operation']}></i>
        <span className={cls['name']}>
          {props.config.name ? props.config.name : '组织分支' + props.level}
        </span>
      </span>
      {props.defaultEditable && !props.config.readonly && (
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

  const onChange = (newValue: string) => {
    props.config.conditions[0].display = newValue;
    props.config.conditions[0].val = newValue;
    setKey(key + 1);
  };

  const nodeContent = (
    <div className={cls['node-body-main-content']} onClick={select}>
      {/* <span>组织分支</span> */}
      <span>
        {props.defaultEditable ? (
          <SelectOrg
            key={key}
            onChange={onChange}
            orgId={orgId}
            belong={props.belong}
            value={props.config.conditions[0]?.val}
            readonly={props.config.readonly}
            rootDisable={false}
          />
        ) : (
          props.config.conditions[0].display
        )}
      </span>
    </div>
  );

  return (
    <div className={props.defaultEditable ? cls['node'] : cls['node-unEdit']}>
      <div className={cls['node-body']}>
        <div className={cls['node-body-main']}>
          {nodeHeader}
          {nodeContent}
        </div>
      </div>
      <div className={cls['node-footer']}>{footer}</div>
    </div>
  );
};

DeptWayNode.defaultProps = {
  config: {},
  level: 1,
  size: 0,
};

export default DeptWayNode;
