import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import SelectAuth from '@/pages/Setting/content/Standard/Flow/Comp/selectAuth';
import cls from './index.module.less';
import { NodeType } from '../../processType';
import userCtrl from '@/ts/controller/setting';
interface IProps {
  current: NodeType;
  orgId?: string;
}
/**
 * @description: 角色
 * @return {*}
 */

const RootNode: React.FC<IProps> = (props) => {
  const [isApprovalOpen, setIsApprovalOpen] = useState<boolean>(false); // 打开弹窗
  const [currentData, setCurrentData] = useState<{
    data: { id: string; name: string };
    title: string;
    key: string;
  }>({ title: '', key: '', data: { id: '', name: '' } });

  const onChange = (newValue: string) => {
    // props.config.conditions[0].val = newValue;
    // setKey(key + 1);
  };
  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <div style={{ marginBottom: '10px' }}>
          <Button
            type="primary"
            shape="round"
            size="small"
            onClick={() => {
              setIsApprovalOpen(true);
            }}>
            选择角色
          </Button>
        </div>
        <div>
          {currentData?.title ? (
            <span>
              当前选择：<a>{currentData?.title}</a>
            </span>
          ) : null}
        </div>
      </div>
      <Modal
        title="添加身份"
        key="addApproval"
        open={isApprovalOpen}
        destroyOnClose={true}
        onOk={() => {
          props.current.props.assignedUser = [
            { name: currentData.title, id: currentData.data.id },
          ];
          setIsApprovalOpen(false);
        }}
        onCancel={() => setIsApprovalOpen(false)}
        width="650px">
        {/* <IndentityManage
          multiple={false}
          orgId={nodeOperateOrgId}
          onChecked={(params: any) => {
            props.current.props.assignedUser = [
              { name: params.title, id: params.data.id },
            ];
            setCurrentData(params);
          }}
        /> */}
        <SelectAuth onChange={onChange}></SelectAuth>
      </Modal>
    </div>
  );
};
export default RootNode;
