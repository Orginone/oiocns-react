import React, { useState } from 'react';
import { AiOutlineSetting } from 'react-icons/ai';
import { Row, Button, Space, Modal, message } from 'antd';
import cls from './index.module.less';
import { NodeType } from '../../processType';
import { IWorkDefine } from '@/ts/core';
import SelectDefine from '../../../../../Comp/SelectDefine';
import ShareShowComp from '@/bizcomponents/IndentityManage/ShareShowComp';
import { schema } from '@/ts/base';

interface IProps {
  current: NodeType;
  define: IWorkDefine;
}

/**
 * @description: 子流程对象
 * @return {*}
 */

const WorkFlowNode: React.FC<IProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false); // 打开弹窗
  const [selectChildWork, setSelectChildWork] = useState<schema.XWorkDefine>();
  const [currentData, setCurrentData] = useState({
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
        <Row style={{ marginBottom: '10px' }}>
          <AiOutlineSetting style={{ marginTop: '3px' }} />
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
        width="80%"
        title="选择其他办事"
        open={isOpen}
        destroyOnClose={true}
        onOk={() => {
          if (!selectChildWork) {
            message.warn('请选择办事');
            return;
          }
          const b = props.define.workItem.current.space.user.findShareById(
            selectChildWork.belongId,
          );
          let name = `${selectChildWork.name} [${b.name}]`;
          props.current.props.assignedUser = [
            {
              name: name,
              id: selectChildWork.id,
            },
          ];
          setCurrentData({
            title: name,
            key: selectChildWork.id,
            data: {
              id: selectChildWork.id,
              name: name,
            },
          });
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}>
        <SelectDefine
          exclude={props.define.metadata}
          belong={props.define.workItem.current.space}
          onChecked={setSelectChildWork}
        />
      </Modal>
    </div>
  );
};
export default WorkFlowNode;
