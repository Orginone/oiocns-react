import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import IndentityManage from '@/bizcomponents/IndentityManage';
import cls from './index.module.less';
import { NodeModel } from '../../../../processType';
import ShareShowComp from '@/bizcomponents/IndentityManage/ShareShowComp';
import { IFlow } from '@/ts/core';

interface IProps {
  current: NodeModel;
  work: IFlow;
}
/**
 * @description: 抄送对象
 * @return {*}
 */

const CcNode: React.FC<IProps> = (props) => {
  const [isApprovalOpen, setIsApprovalOpen] = useState<boolean>(false); // 打开弹窗
  const [currentData, setCurrentData] = useState<{ id: string; name: string }>({
    id: props.current.destId,
    name: props.current.destName,
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
          {currentData.id != '' ? (
            <ShareShowComp
              departData={[currentData]}
              deleteFuc={(_id: string) => {
                props.current.destId = '';
                props.current.destName = '';
                setCurrentData({ id: '', name: '' });
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
          props.current.destType = '身份';
          props.current.destId = currentData.id;
          props.current.destName = currentData.name;
          setIsApprovalOpen(false);
        }}
        onCancel={() => setIsApprovalOpen(false)}>
        <IndentityManage
          space={props.work.current.space}
          multiple={false}
          onChecked={(params: any) => {
            setCurrentData({
              id: params.key,
              name: params.title,
            });
          }}
        />
      </Modal>
    </div>
  );
};
export default CcNode;
