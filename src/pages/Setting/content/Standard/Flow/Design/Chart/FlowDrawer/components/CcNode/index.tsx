import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import IndentityManage from '@/bizcomponents/IndentityManage';
import cls from './index.module.less';
import { NodeType } from '../../processType';
import ShareShowComp from '@/bizcomponents/IndentityManage/ShareShowComp';
import { IFlow } from '@/ts/core';

interface IProps {
  current: NodeType;
  work: IFlow;
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
              deleteFuc={(_id: string) => {
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
        width="650px"
        key="addApproval"
        open={isApprovalOpen}
        destroyOnClose={true}
        onOk={() => {
          props.current.props.assignedUser = [
            { name: currentData.title, id: currentData.key },
          ];
          setIsApprovalOpen(false);
        }}
        onCancel={() => setIsApprovalOpen(false)}>
        <IndentityManage
          space={props.work.current.space}
          multiple={false}
          onChecked={(params: any) => {
            props.current.props.assignedUser = [{ name: params.title, id: params.key }];
            setCurrentData(params);
          }}
        />
      </Modal>
    </div>
  );
};
export default CcNode;
