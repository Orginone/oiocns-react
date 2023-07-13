import React, { useEffect, useState } from 'react';
import InsertButton from '../InsertButton';
import { AiOutlineClose } from 'react-icons/ai';
import cls from './index.module.less';
import SelectOrg from '../selectOrg';
import { ITarget } from '@/ts/core';
import { dataType } from '@/components/Common/FlowDesign/processType';

type DeptWayNodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onSelected: Function;
  config: any;
  level: any;
  target?: ITarget;
  isEdit: boolean;
};

/**
 * 部门网关节点
 * @returns
 */
const DeptWayNode: React.FC<DeptWayNodeProps> = (props: DeptWayNodeProps) => {
  const [key, setKey] = useState<number>(0);
  const [orgId, setOrgId] = useState<string>(props.target?.id || '');
  const isOther = props.config.conditions[0]?.val == '0';

  useEffect(() => {
    if (props.isEdit && props.target) {
      if (props.config.conditions.length == 0) {
        props.config.conditions = [
          {
            pos: 1,
            paramKey: '0',
            paramLabel: '组织',
            key: 'EQ',
            label: '=',
            type: dataType.BELONG,
            val: props.target.id,
            display: props.target.name,
          },
        ];
        setKey(key + 1);
      }
      setOrgId(props.target.id);
    }
  }, []);

  const onChange = (newValue: string, labels: string[]) => {
    props.config.conditions[0].display = labels[0];
    props.config.conditions[0].val = newValue;
    setKey(key + 1);
  };

  return (
    <div className={cls['node']}>
      <div className={cls['node-body']}>
        <div className={cls['node-body-main']}>
          <div className={cls['node-body-main-header']}>
            <span className={cls['title']}>
              <i className={cls['el-icon-s-operation']}></i>
              <span className={cls['name']}>
                {isOther ? '其他分支' : '组织分支' + props.level}
              </span>
            </span>
            {props.isEdit && !isOther && (
              <span className={cls['option']}>
                <AiOutlineClose
                  style={{ fontSize: '15px', marginRight: '10px' }}
                  onClick={() => props.onDelNode()}
                />
              </span>
            )}
          </div>
          <div
            className={cls['node-body-main-content']}
            onClick={() => props.onSelected()}>
            {props.isEdit && props.target ? (
              <SelectOrg
                key={key}
                onChange={onChange}
                orgId={orgId}
                target={props.target}
                value={props.config.conditions[0]?.val}
                rootDisable={false}
              />
            ) : (
              <span>{props.config.conditions[0].display}</span>
            )}
          </div>
        </div>
      </div>
      <div className={cls['node-footer']}>
        <div className={cls['btn']}>
          {props.isEdit && (
            <InsertButton allowBranche onInsertNode={props.onInsertNode} />
          )}
        </div>
      </div>
    </div>
  );
};

DeptWayNode.defaultProps = {
  config: {},
  level: 1,
};

export default DeptWayNode;
