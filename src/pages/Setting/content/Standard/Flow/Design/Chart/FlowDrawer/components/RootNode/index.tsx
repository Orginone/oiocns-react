import React, { useEffect, useState } from 'react';
import { Button, message, Modal } from 'antd';
import cls from './index.module.less';
import { NodeType } from '../../processType';
import { XOperation } from '@/ts/base/schema';
import { ISpeciesItem } from '@/ts/core';
import ViewFormModal from '@/pages/Setting/components/viewFormModal';
import ShareShowComp from '@/bizcomponents/IndentityManage/ShareShowComp';
import SelectOperation from '@/pages/Setting/content/Standard/Flow/Comp/SelectOperation';
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
  const [operations, setOperations] = useState<XOperation[]>([]);
  const [operationModal, setOperationModal] = useState<any>();
  const [viewFormOpen, setViewFormOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<XOperation>();
  const [showData, setShowData] = useState<any[]>([]);
  // 操作内容渲染函数
  useEffect(() => {
    setOperations(props.current.props.operations || []);
  }, []);
  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <div style={{ marginBottom: '10px' }}>
          <Button
            type="primary"
            shape="round"
            size="small"
            onClick={() => {
              setOperationModal('');
            }}>
            绑定表单
          </Button>
        </div>
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
          {/* <ChooseOperation
            open={operationModal != undefined}
            onOk={(item: any) => {
              props.current.props.operations = [item.operation];
              setOperations([item.operation]);
              setOperationModal(undefined);
            }}
            onCancel={() => setOperationModal(undefined)}></ChooseOperation> */}
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
              showData={showData}
              setShowData={setShowData}></SelectOperation>
          </Modal>
          <ViewFormModal
            data={editData}
            open={viewFormOpen}
            handleCancel={() => {
              setViewFormOpen(false);
            }}
            handleOk={() => {
              setViewFormOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default RootNode;
