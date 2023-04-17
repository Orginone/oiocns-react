import React, { useEffect, useState } from 'react';
import InsertButton from '../InsertButton';
import { CopyOutlined, CloseOutlined } from '@ant-design/icons';
import cls from './index.module.less';
import { Tooltip } from 'antd';
import userCtrl from '@/ts/controller/setting';
import SelectOrg from '@/pages/Setting/content/Standard/Flow/Comp/selectOrg';
import { dataType } from '../../FlowDrawer/processType';

type DeptWayNodeProps = {
  //默认操作组织id
  operateOrgId?: string;
  onInsertNode: Function;
  onDelNode: Function;
  onCopy: Function;
  onSelected: Function;
  config: any;
  level: any;
  [key: string]: any;
};

/**
 * 部门网关
 * @returns
 */
const DeptWayNode: React.FC<DeptWayNodeProps> = (props: DeptWayNodeProps) => {
  const [key, setKey] = useState<number>(0);
  const [orgId, setOrgId] = useState<string>();

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
          val: userCtrl.space.id,
        },
      ];
      setKey(key + 1);
    }
    setOrgId(userCtrl.space.id);
  }, []);

  return (
    <div className={cls['node']}>
      <div className={cls['node-body']}>
        <div className={cls['node-body-main']}>
          <div className={cls['node-body-main-header']}>
            <span className={cls['title']}>
              <i className={cls['el-icon-s-operation']}></i>
              <span className={cls['name']}>
                {props.config.name ? props.config.name : '组织分支' + props.level}
              </span>
            </span>
            {props.config.readonly && (
              <span className={cls['option']}>
                <CopyOutlined
                  style={{ fontSize: '12px', paddingRight: '5px' }}
                  onClick={props.onCopy()}
                />
                <CloseOutlined style={{ fontSize: '12px' }} onClick={props.onDelNode()} />
              </span>
            )}
          </div>
          <div className={cls['node-body-main-content']} onClick={props.onSelected()}>
            {/* <span>组织分支</span> */}
            <span>
              <SelectOrg
                key={key}
                onChange={(newValue: string) => {
                  props.config.conditions[0].val = newValue;
                  setKey(key + 1);
                }}
                orgId={orgId}
                value={props.config.conditions[0]?.val}
                readonly={props.config.readonly}
                rootDisable={false}></SelectOrg>
            </span>
          </div>
        </div>
      </div>
      <div className={cls['node-footer']}>
        {' '}
        <div className={cls['btn']}>
          <InsertButton onInsertNode={props.onInsertNode} />
        </div>
      </div>
    </div>
  );
};

DeptWayNode.defaultProps = {
  config: {},
  level: 1,
  size: 0,
};

export default DeptWayNode;
