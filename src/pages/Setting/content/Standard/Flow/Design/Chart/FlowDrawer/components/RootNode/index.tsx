import React, { useState } from 'react';
import { Button, Divider, Modal, Row } from 'antd';
import cls from './index.module.less';
import { NodeType } from '../../processType';
import ShareShowComp from '@/bizcomponents/IndentityManage/ShareShowComp';
import { AiOutlineSetting } from 'react-icons/ai';
import SelectAuth from '../../../../../Comp/selectAuth';
import SelectForms from '../../../../../Comp/SelectForms';
import { IThingClass, IWorkDefine, SpeciesType } from '@/ts/core';
import ViewFormModal from '@/bizcomponents/FormDesign/viewFormModal';
import { XForm } from '@/ts/base/schema';
interface IProps {
  current: NodeType;
  define: IWorkDefine;
}
/**
 * @description: 角色
 * @return {*}
 */

const RootNode: React.FC<IProps> = (props) => {
  const [viewForm, setViewForm] = useState<XForm>();
  const [forms, setForms] = useState<XForm[]>(props.current.props.operations || []);
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
          space={props.define.workItem.current.space}
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
          <span className={cls[`roval-node-title`]}>实体表单</span>
        </Row>
        <Button
          type="primary"
          shape="round"
          size="small"
          onClick={() => {
            setOperationModal('');
          }}>
          选择实体表单
        </Button>
        {/* </div> */}
        <div>
          {forms && forms.length > 0 && (
            <span>
              <ShareShowComp
                departData={forms}
                onClick={(item: XForm) => {
                  setViewForm(item);
                }}
                deleteFuc={(id: string) => {
                  setForms([...forms.filter((i) => i.id != id)]);
                }}></ShareShowComp>
            </span>
          )}
          <Modal
            title={`选择实体表单`}
            width={800}
            destroyOnClose={true}
            open={operationModal != undefined}
            okText="确定"
            onOk={() => {
              props.current.props.operations = forms;
              setOperationModal(undefined);
            }}
            onCancel={() => setOperationModal(undefined)}>
            <SelectForms
              species={props.define.workItem.current.space.species
                .filter((i) => i.typeName === SpeciesType.Thing)
                .map((i) => i as IThingClass)}
              selected={forms}
              setSelected={setForms}></SelectForms>
          </Modal>
          {viewForm && (
            <ViewFormModal
              form={viewForm}
              open={true}
              define={props.define}
              handleCancel={() => {
                setViewForm(undefined);
              }}
              handleOk={() => {
                setViewForm(undefined);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default RootNode;
