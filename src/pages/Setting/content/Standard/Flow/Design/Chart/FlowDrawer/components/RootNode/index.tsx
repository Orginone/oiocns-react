import React, { useState } from 'react';
import { Button, Divider, Modal, Row } from 'antd';
import cls from './index.module.less';
import { NodeType } from '../../processType';
import ShareShowComp from '@/bizcomponents/IndentityManage/ShareShowComp';
import { AiOutlineSetting } from 'react-icons/ai';
import SelectAuth from '../../../../../Comp/selectAuth';
import SelectOperation from '../../../../../Comp/SelectOperation';
import { IWork } from '@/ts/core';
import { XForm } from '@/ts/base/schema';
interface IProps {
  current: NodeType;
  work: IWork;
}
/**
 * @description: 角色
 * @return {*}
 */

const RootNode: React.FC<IProps> = (props) => {
  const [forms, setForms] = useState<XForm[]>(props.current.props.operations);
  const [operationModal, setOperationModal] = useState<any>();
  const [selectAuthValue, setSelectAuthValue] = useState<any>(
    props.current.props.assignedUser[0]?.id,
  );
  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <Row style={{ marginBottom: '10px' }}>
          <AiOutlineSetting style={{ marginTop: '3px' }} />
          <span className={cls[`roval-node-title`]}>选择角色</span>
        </Row>
        <SelectAuth
          space={props.work.current.space}
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
          {forms && forms.length > 0 && (
            <span>
              <ShareShowComp
                departData={forms}
                // onClick={(item: XForm) => {
                //   const form = forms.find((i) => i.id === item.id);
                //   setEditData(form);
                //   setViewFormOpen(true);
                // }}
                deleteFuc={(id: string) => {
                  setForms([...forms.filter((i) => i.id != id)]);
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
              props.current.props.operations = forms;
              setOperationModal(undefined);
            }}
            onCancel={() => setOperationModal(undefined)}>
            <SelectOperation
              current={props.work}
              selected={forms}
              setSelected={setForms}></SelectOperation>
          </Modal>
          {/* {viewFormOpen && editData && (
            <ViewFormModal
              form={editData}
              open={viewFormOpen}
              handleCancel={() => {
                setViewFormOpen(false);
              }}
              handleOk={() => {
                setViewFormOpen(false);
              }}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};
export default RootNode;
