import React, { useEffect, useState } from 'react';
import InsertButton from '../InsertButton';
import { AiOutlineCopy, AiOutlineClose } from 'react-icons/ai';
import cls from './index.module.less';
import SelectOrg from '../selectOrg';
import orgCtrl from '@/ts/controller';
import { ITarget, IWork } from '@/ts/core';
import { dataType } from '@/bizcomponents/FlowDesign/processType';

type DeptWayNodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onCopy: Function;
  onSelected: Function;
  config: any;
  level: any;
  define?: IWork;
  isEdit: boolean;
};

/**
 * 部门网关节点
 * @returns
 */
const DeptWayNode: React.FC<DeptWayNodeProps> = (props: DeptWayNodeProps) => {
  const [key, setKey] = useState<number>(0);
  const [orgId, setOrgId] = useState<string>();
  const [target, settarget] = useState<ITarget>();
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
    if (props.isEdit && props.define) {
      settarget(orgCtrl.user.targets.find((a) => a.id == props.define!.metadata.shareId));
      if (props.config.conditions.length == 0) {
        props.config.conditions = [
          {
            pos: 1,
            paramKey: '0',
            paramLabel: '组织',
            key: 'EQ',
            label: '=',
            type: dataType.BELONG,
            val: props.define.metadata.shareId,
          },
        ];
        setKey(key + 1);
      }
      setOrgId(props.define.metadata.shareId);
    }
  }, []);

  const nodeHeader = (
    <div className={cls['node-body-main-header']}>
      <span className={cls['title']}>
        <i className={cls['el-icon-s-operation']}></i>
        <span className={cls['name']}>
          {props.config.name ? props.config.name : '组织分支' + props.level}
        </span>
      </span>
      {props.isEdit && !props.config.readonly && (
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

  const onChange = (newValue: string, labels: string[]) => {
    props.config.conditions[0].display = labels[0];
    props.config.conditions[0].val = newValue;
    setKey(key + 1);
  };

  const nodeContent = (
    <div className={cls['node-body-main-content']} onClick={select}>
      {/* <span>组织分支</span> */}
      <span>
        {props.isEdit && target && props.define ? (
          <SelectOrg
            key={key}
            onChange={onChange}
            orgId={orgId}
            target={target}
            value={props.config.conditions[0]?.val}
            rootDisable={false}
          />
        ) : (
          props.config.conditions[0].display
        )}
      </span>
    </div>
  );

  return (
    <div className={props.isEdit ? cls['node'] : cls['node-unEdit']}>
      <div className={cls['node-body']}>
        <div className={cls['node-body-main']}>
          {nodeHeader}
          {nodeContent}
        </div>
      </div>
      <div className={cls['node-footer']}>
        {props.isEdit && (
          <div className={cls['btn']}>
            <InsertButton onInsertNode={props.onInsertNode} />
          </div>
        )}
      </div>
    </div>
  );
};

DeptWayNode.defaultProps = {
  config: {},
  level: 1,
};

export default DeptWayNode;
