import React, { useEffect, useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Row, Button, Space, Modal } from 'antd';
import cls from './index.module.less';
import { NodeType } from '../../processType';
import userCtrl from '@/ts/controller/setting';
import { ISpeciesItem } from '@/ts/core';
import WorkSelectTable from './WorkSelectTable';
import ShareShowComp from '@/bizcomponents/IndentityManage/ShareShowComp';
import { schema } from '@/ts/base';

interface IProps {
  current: NodeType;
  orgId?: string;
  species?: ISpeciesItem;
  disableIds: string[];
}

/**
 * @description: 子流程对象
 * @return {*}
 */

const WorkFlowNode: React.FC<IProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false); // 打开弹窗

  const [nodeOperateOrgId, setNodeOperateOrgId] = useState<string>(
    props.current.belongId || props.orgId || userCtrl.space.id,
  );

  const [currentData, setCurrentData] = useState({
    title: props.current.props.assignedUser[0]?.name,
    key: props.current.props.assignedUser[0]?.id,
    data: {
      id: props.current.props.assignedUser[0]?.id,
      name: props.current.props.assignedUser[0]?.name,
    },
  });
  useEffect(() => {
    if (!props.current.belongId) {
      setNodeOperateOrgId(props.orgId || userCtrl.space.id);
      props.current.belongId = props.orgId;
    }
  }, []);

  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <Row style={{ marginBottom: '10px' }}>
          <SettingOutlined style={{ marginTop: '3px' }} />
          <span className={cls[`roval-node-title`]}>选择其他办事</span>
        </Row>
        <Space>
          <Button
            type="primary"
            shape="round"
            size="small"
            onClick={() => {
              props.current.props.assignedType = 'JOB';
              setIsOpen(true);
            }}>
            选择其他办事
          </Button>
        </Space>
        <div>
          {currentData?.title ? (
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
        width="900px"
        title="选择其他办事"
        open={isOpen}
        destroyOnClose={true}
        onOk={() => {
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}>
        <WorkSelectTable
          disableIds={props.disableIds}
          searchFn={(params: schema.XFlowDefine) => {
            props.current.props.assignedUser = [{ name: params.name, id: params.id }];
            setCurrentData({
              title: params.name,
              key: params.id,
              data: {
                id: params.id,
                name: params.name,
              },
            });
          }}
        />
      </Modal>
    </div>
  );
};
export default WorkFlowNode;
