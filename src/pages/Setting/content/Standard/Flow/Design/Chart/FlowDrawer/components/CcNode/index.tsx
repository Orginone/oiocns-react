import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import IndentityManage from '@/bizcomponents/IndentityManage';
import cls from './index.module.less';
import { NodeType } from '../../processType';
import userCtrl from '@/ts/controller/setting';
interface IProps {
  current: NodeType;
  orgId?: string;
}
/**
 * @description: 抄送对象
 * @return {*}
 */

const CcNode: React.FC<IProps> = (props) => {
  const [isApprovalOpen, setIsApprovalOpen] = useState<boolean>(false); // 打开弹窗
  const [currentData, setCurrentData] = useState<{
    data: { id: string; name: string };
    title: string;
    key: string;
  }>({ title: '', key: '', data: { id: '', name: '' } });
  const [nodeOperateOrgId, setNodeOperateOrgId] = useState<string>(
    props.current.belongId || props.orgId || userCtrl.space.id,
  );
  useEffect(() => {
    if (!props.current.belongId) {
      setNodeOperateOrgId(props.orgId || userCtrl.space.id);
      props.current.belongId = props.orgId;
    }
  });
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
            选择抄送对象
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
        <IndentityManage
          multiple={false}
          orgId={nodeOperateOrgId}
          onChecked={(params: any) => {
            props.current.props.assignedUser = [
              { name: params.title, id: params.data.id },
            ];
            setCurrentData(params);
          }}
        />
      </Modal>
    </div>
  );
};
export default CcNode;
