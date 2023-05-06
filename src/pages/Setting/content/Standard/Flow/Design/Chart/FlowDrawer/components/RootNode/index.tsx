import React, { useEffect, useState } from 'react';
import { Button, Divider, Modal, Row } from 'antd';
import cls from './index.module.less';
import { NodeType } from '../../processType';
import { XForm } from '@/ts/base/schema';
import { ISpeciesItem } from '@/ts/core';
import ShareShowComp from '@/bizcomponents/IndentityManage/ShareShowComp';
import SelectOperation from '@/pages/Setting/content/Standard/Flow/Comp/SelectOperation';
import { AiOutlineSetting } from 'react-icons/ai';
import SelectAuth from '../../../../../Comp/selectAuth';
import { IAppModule } from '@/ts/core/thing/app/appmodule';
import ViewFormModal from '@/pages/Setting/content/Standard/WorkForm/Form/Design/viewFormModal';
interface IProps {
  current: NodeType;
  orgId?: string;
  species?: ISpeciesItem;
}
/**
 * @description: 角色
 * @return {*}
 */

const RootNode: React.FC<IProps> = (props) => {
  const [operations, setOperations] = useState<XForm[]>([]);
  const [operationModal, setOperationModal] = useState<any>();
  const [viewFormOpen, setViewFormOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<XForm>();
  const [showData, setShowData] = useState<any[]>([]);
  const [selectAuthValue, setSelectAuthValue] = useState<any>(
    props.current.props.assignedUser[0]?.id,
  );
  // 操作内容渲染函数
  useEffect(() => {
    setOperations(props.current.props.operations || []);
  }, []);
  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <Row style={{ marginBottom: '10px' }}>
          <AiOutlineSetting style={{ marginTop: '3px' }} />
          <span className={cls[`roval-node-title`]}>选择角色</span>
        </Row>
        <SelectAuth
          space={props.species!.current.space}
          onChange={(newValue: string, label: string) => {
            if (props.current.props.assignedUser[0]) {
              props.current.props.assignedUser[0].id = newValue;
              props.current.props.assignedUser[0].name = label[0];
              setSelectAuthValue(newValue);
            }
          }}
          value={selectAuthValue}></SelectAuth>
        <Divider />
        <Row style={{ marginBottom: '10px' }}>
          <AiOutlineSetting style={{ marginTop: '3px' }} />
          <span className={cls[`roval-node-title`]}>绑定表单</span>
        </Row>
        {/* <div style={{ marginBottom: '10px' }}> */}
        <Button
          type="primary"
          shape="round"
          size="small"
          onClick={() => {
            setOperationModal('');
          }}>
          绑定表单
        </Button>
        {/* </div> */}
        <div>
          {operations && operations.length > 0 && (
            <span>
              <ShareShowComp
                departData={operations}
                onClick={(item: any) => {
                  setEditData(item);
                  setViewFormOpen(true);
                }}
                deleteFuc={(id: string) => {
                  props.current.props.operations = props.current.props.operations.filter(
                    (op) => op.id != id,
                  );
                  setOperations(props.current.props.operations);
                }}></ShareShowComp>
            </span>
          )}
          <Modal
            title={`选择表单`}
            width={800}
            destroyOnClose={true}
            open={operationModal != undefined}
            okText="确定"
            onOk={() => {
              props.current.props.operations = showData;
              setOperations(showData);
              setOperationModal(undefined);
            }}
            onCancel={() => setOperationModal(undefined)}>
            <SelectOperation
              current={props.species?.parent as IAppModule}
              showData={showData}
              setShowData={setShowData}></SelectOperation>
          </Modal>
          {props.species && (
            <ViewFormModal
              belong={props.species!.current.space}
              data={editData}
              open={viewFormOpen}
              handleCancel={() => {
                setViewFormOpen(false);
              }}
              handleOk={() => {
                setViewFormOpen(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default RootNode;
