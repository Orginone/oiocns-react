import React, { useEffect, useState } from 'react';
import InsertButton from '../InsertButton';
import { AiOutlineCopy, AiOutlineClose } from 'react-icons/ai';
import cls from './index.module.less';
import orgCtrl from '@/ts/controller';
import SelectOrg from '@/pages/Setting/content/Standard/Flow/Comp/selectOrg';
import { dataType } from '../../FlowDrawer/processType';
type DeptWayNodeProps = {
  onInsertNode: Function;
  onDelNode: Function;
  onCopy: Function;
  onSelected: Function;
  config: any;
  level: any;
  defaultEditable: boolean;
  [key: string]: any;
  // config?: any,
  //  _disabled?: boolean,
  // level?: number,
  // //条件数
  // size?:number
};

/**
 * 并行节点
 * @returns
 */
const DeptWayNode: React.FC<DeptWayNodeProps> = (props: DeptWayNodeProps) => {
  const [editable, setEditable] = useState<boolean>(true);
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
  // TODO 这里有问题
  const isEditable = (): boolean => {
    let editable = props.defaultEditable;
    if (
      props.config.belongId &&
      props.config.belongId != '' &&
      props.config.belongId != orgCtrl.user.id
    ) {
      editable = false;
    }
    return editable;
  };
  useEffect(() => {
    setEditable(isEditable());
    if (props.config.conditions.length == 0) {
      props.config.conditions = [
        {
          pos: 1,
          paramKey: 'belongId',
          paramLabel: '组织',
          key: 'EQ',
          label: '=',
          type: dataType.BELONG,
          val: orgCtrl.user.id,
        },
      ];
      setKey(key + 1);
    }
    if (!isEditable()) {
      setOrgId(props.config.conditions[0]?.val);
    } else {
      setOrgId(orgCtrl.user.id);
    }
  }, []);

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
        <i className={cls['el-icon-s-operation']}></i>
        <span className={cls['name']}>
          {props.config.name ? props.config.name : '组织分支' + props.level}
        </span>
      </span>
      {editable && props.config.readonly && (
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
    props.config.conditions[0].val = newValue;
    setKey(key + 1);
  };

  const nodeContent = (
    <div className={cls['node-body-main-content']} onClick={select}>
      {/* <span>组织分支</span> */}
      <span>
        {' '}
        {editable && (
          <SelectOrg
            key={key}
            onChange={onChange}
            orgId={orgId}
            value={props.config.conditions[0]?.val}
            readonly={props.config.readonly}
            rootDisable={false}></SelectOrg>
        )}
        {!editable &&
          orgCtrl.provider.user?.findShareById(props.config.conditions[0]?.val).name}
      </span>
    </div>
  );

  return (
    <div className={editable ? cls['node'] : cls['node-unEdit']}>
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
