import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import IndentityManage from '@/bizcomponents/IndentityManage';
import cls from './index.module.less';
import { NodeData } from '../../processType';
import userCtrl from '@/ts/controller/setting';
import ShareShowComp from '@/bizcomponents/IndentityManage/ShareShowComp';

interface IProps {
  current: NodeData;
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
  }>({
    title: props.current.props.assignedUser[0]?.name,
    key: props.current.props.assignedUser[0]?.id,
    data: {
      id: props.current.props.assignedUser[0]?.id,
      name: props.current.props.assignedUser[0]?.name,
    },
  });
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
            // <span>
            //   当前选择：<a>{currentData?.title}</a>
            // </span>
            <ShareShowComp
              departData={[currentData.data]}
              deleteFuc={(id: string) => {
                props.current.props.assignedUser = { id: '', name: '' };
                setCurrentData({
                  title: '',
                  key: '',
                  data: { id: '', name: '' },
                });
              }}></ShareShowComp>
          ) : null}
        </div>
      </div>
      <Modal
        title="添加角色"
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
